import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { VscDebugStop, VscRefresh, VscCircleSlash, VscRunAll, VscSend } from 'react-icons/vsc';
import { CodeEditor } from '../CodeEditor';
import { reloadInspectedWindow, AppDevtoolsConnection } from '../../utils/chromeAPI';
import MessagesHistory from '../MessagesHistory';

const WSProxy = ({ settings, setSettings, className }) => {

    useEffect(() => {
        setCode(settings.defaultWSPTemplate || '')
    }, [settings]);

    const pageClient = 'wsp-client';
    const appDevtoolsInstanceRef = useRef(null);

    useEffect(() => {
        const instance = new AppDevtoolsConnection(handleIncomingMessages);
        instance.connect();
        appDevtoolsInstanceRef.current = instance
        return () => {
            instance.disconnect();
            appDevtoolsInstanceRef.current = null;
        }
    }, []);

    const [code, setCode] = useState('');
    const [messages, setMessages] = useState([]);
    // Removed tmp deletion, need check performance after applying virtuoso
    // useEffect(() => { messages.length >= 10000 && handleClear() }, [messages]);
    // Results: Was able to collect 40k messages before devtools crashed ...

    const [filter, setFilter] = useState('all');
    const [regexFilter, setRegexFilter] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const filteredMessages = messages.filter(message => {
        const safeRegEx = (regexFilter, data) => {
            try {
                return new RegExp(regexFilter, 'g').test(data);
            } catch (error) {
                console.assert(error);
            }
        }
        const typeMatch = filter === 'all' || message.type === filter;
        const regexMatch = !regexFilter || safeRegEx(regexFilter, message.data);
        return typeMatch && regexMatch;
    });

    const [isWSPJSerrorMessage, setWSPJSerrorMessage] = useState('');

    const handleCodeOnChange = (value) => {
        setCode(value || '');
        setSettings((prev) => ({ ...prev, defaultWSPTemplate: value }))
    }

    const handleRun = () => { setIsRunning(true); handleUpdateWSPJS(code); setWSPJSerrorMessage('') }
    const handleStop = () => { setIsRunning(false); handleUpdateWSPJS('') }
    const handleReload = () => { reloadInspectedWindow() }
    const handleClear = () => { setMessages([]); setSelectedMessage(null) }
    const handleMessageOnClick = useCallback((message) => { setSelectedMessage(message); }, []);

    const handleUpdateWSPJS = (value) => {
        const instance = appDevtoolsInstanceRef.current;
        if (instance) {
            try {
                instance.postMessage({
                    from: 'devtools',
                    value,
                    type: 'update-wsp-js'
                });
            } catch (error) {
                console.assert(error);
            }
        }
    }

    const handleIncomingMessages = (message) => {
        // TODO: if error then show popup
        if (message.from === pageClient && message.type === 'wsp-code-error') {
            setWSPJSerrorMessage(message.value.split('\n')[0]);
            handleStop();
        }

        if (message.from === pageClient && Object.hasOwn(message.value, 'wspData')) {
            // TODO: Add check for binarydata 
            // typeof message.value.wspData.data === 'object' ? JSON.stringify(message.value.wspData.data) : message.value.wspData.data 
            const formatted = {
                time: message.value.wspData.time,
                type: message.value.wspData.type,
                data: message.value.wspData.data || message.value.wspData.currentTarget,
            };
            setMessages((prev) => [...prev, formatted]);
        }
    };

    return (
        <div className={`h-screen ${className}`}>
            <PanelGroup direction='horizontal'>
                {/* Left Section */}
                <Panel defaultSize={50} minSize={20}>
                    <div className='h-full flex flex-col'>
                        <div className='h-[26px] flex items-center px-4 border-b border-light'>
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className='flex min-w-[25px] min-h-[25px] bg-ph justify-center items-center text-green-500 rounded-[13px] disabled:opacity-50'
                                title='Run code'
                            >
                                <VscRunAll className='h-[16px] w-[16px]' />
                            </button>
                            <button
                                onClick={handleStop}
                                disabled={!isRunning}
                                className='flex min-w-[25px] min-h-[25px] bg-ph justify-center items-center text-red-300 rounded-[13px] disabled:opacity-50'
                                title='Stop code'
                            >
                                <VscDebugStop className='h-[16px] w-[16px]' />
                            </button>
                            <button
                                onClick={handleReload}
                                className='flex min-w-[25px] min-h-[25px] bg-ph text-light justify-center items-center font-inherit rounded-[13px]'
                                title='Reload page'
                            >
                                <VscRefresh className='h-[16px] w-[16px]' />
                            </button>
                            <div className='flex-row w-full text-center truncate'>{isWSPJSerrorMessage}</div>
                        </div>
                        <div className='flex-1 h-full overflow-y-scroll bg-material text-xs'>
                            <CodeEditor value={code} onChange={handleCodeOnChange} extensions={'javascript'} />
                        </div>
                    </div>
                </Panel>

                <PanelResizeHandle className='w-[1px] bg-light transition-colors' />

                {/* Right Section */}
                <Panel defaultSize={50} minSize={20}>
                    <div className='h-full flex flex-col'>
                        <div className='h-[26px] border-b border-light flex items-center !pl-[2px] !pr-[4px] gap-1'>
                            <button
                                onClick={handleClear}
                                className='flex min-w-[25px] min-w-[25px] min-h-[25px] bg-ph text-light justify-center items-center rounded-[13px]'
                                title='Clear logs'
                            >
                                <VscCircleSlash className='h-[16px] w-[16px]' />
                            </button>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className='h-[20px] rounded-[3px] text-light bg-s bg-f'
                            >
                                <option value="all">All</option>
                                <option value="send">Send</option>
                                <option value="message">Receive</option>
                            </select>
                            <div
                                className='flex-1 min-h-[20px] rounded-[13px] bg-ph bg-input !pl-[15px] !pr-[15px]'>
                                <input
                                    type='text'
                                    placeholder='Filter using regex (example: (web)?socket)'
                                    value={regexFilter}
                                    onChange={(e) => setRegexFilter(e.target.value)}
                                    className='text-light w-full ph'
                                />
                            </div>
                            <h1 className='!ml-auto font-bold whitespace-nowrap'>WebSocket Proxy</h1>
                        </div>

                        <div className='flex-1'>
                            <PanelGroup direction='vertical'>
                                <Panel defaultSize={50} minSize={20}>
                                    <MessagesHistory messages={filteredMessages} messageOnClick={handleMessageOnClick} />
                                </Panel>

                                <PanelResizeHandle className='h-[1px] bg-light transition-colors' />

                                <Panel defaultSize={50} minSize={20}>
                                    {selectedMessage ? (
                                        <div className='flex-1 h-full overflow-y-scroll bg-material text-xs'>
                                            <CodeEditor value={selectedMessage.data.text || selectedMessage.data} editable={false} extensions={'json'} />
                                        </div>
                                    ) : (
                                        <div className='h-full flex items-center justify-center text-xl text-light-h truncate'>
                                            Select a message to view details
                                        </div>
                                    )}
                                </Panel>
                            </PanelGroup>
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </ div >
    )
}

export default WSProxy