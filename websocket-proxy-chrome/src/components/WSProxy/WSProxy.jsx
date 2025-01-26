import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { VscDebugStop, VscRefresh, VscCircleSlash, VscRunAll } from 'react-icons/vsc';
import { CodeEditor } from '../CodeEditor';
import MessageLog from '../MessageLog';
import { dummyData } from '../../utils/dumnydata';
import { reloadInspectedWindow } from '../../utils/chromeAPI'

const WSProxy = ({ settings, setSettings, className }) => {

    const [code, setCode] = useState('');
    const [messages, setMessages] = useState(dummyData);
    const [filter, setFilter] = useState('all');
    const [regexFilter, setRegexFilter] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const filteredMessages = messages.filter(message => {
        const typeMatch = filter === 'all' || message.type === filter;
        const regexMatch = !regexFilter || new RegExp(regexFilter, 'i').test(message.data);
        return typeMatch && regexMatch;
    });

    const handleOnChange = (value) => {
        setCode(value || '');
        setSettings((prev) => ({ ...prev, defaultWSPTemplate: value }))
    }

    const handleRun = () => {
        setIsRunning(true);
    }
    const handleStop = () => {
        setIsRunning(false);
    }
    const handleReload = () => { reloadInspectedWindow() }
    const handleClear = () => {
        setMessages([])
        setSelectedMessage(null)
    }

    useEffect(() => {
        setCode(settings.defaultWSPTemplate || '')
    }, [settings])

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
                                className='flex w-[25px] h-[25px] bg-ph justify-center items-center text-green-500 rounded-[13px] disabled:opacity-50'
                            >
                                <VscRunAll className='h-[18px] w-[18px]' />
                            </button>
                            <button
                                onClick={handleStop}
                                disabled={!isRunning}
                                className='flex w-[25px] h-[25px] bg-ph justify-center items-center text-red-300 rounded-[13px] disabled:opacity-50'
                            >
                                <VscDebugStop className='h-[18px] w-[18px]' />
                            </button>
                            <button
                                onClick={handleReload}
                                className='flex w-[25px] h-[25px] bg-ph text-light justify-center items-center font-inherit rounded-[13px]'
                            >
                                <VscRefresh className='h-[18px] w-[18px]' />
                            </button>
                        </div>
                        <div className='flex-1 h-full overflow-y-scroll bg-material text-xs'>
                            <CodeEditor value={code} onChange={handleOnChange} extensions={'javascript'} />
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
                                className='flex min-w-[25px] w-[25px] h-[25px] bg-ph text-light justify-center items-center rounded-[13px] '
                            >
                                <VscCircleSlash className='h-[18px] w-[18px]' />
                            </button>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className='h-[20px] rounded-[3px] text-light bg-s bg-f'
                            >
                                <option value="all">All</option>
                                <option value="send">Sent</option>
                                <option value="message">Received</option>
                            </select>
                            <div
                                className='flex-1 rounded-[13px] selected !pl-[15px] !pr-[15px]'>
                                <input
                                    type='text'
                                    placeholder='Filter using regex (example: (web)?socket)'
                                    value={regexFilter}
                                    onChange={(e) => setRegexFilter(e.target.value)}
                                    className='text-light w-full'
                                />
                            </div>
                            <h1 className='!ml-auto font-bold whitespace-nowrap'>WebSocket Proxy</h1>
                        </div>

                        <div className='flex-1'>
                            <PanelGroup direction='vertical'>
                                <Panel defaultSize={50} minSize={20}>
                                    <div className='h-full overflow-auto'>
                                        {!filteredMessages.length && <div className='h-full flex items-center justify-center text-xl text-light-h truncate'>Messages will show up here</div>}
                                        {filteredMessages.map((message) => (
                                            <MessageLog
                                                key={message.id}
                                                message={message}
                                                onClick={() => { setSelectedMessage(message) }}
                                            />
                                        ))}
                                    </div>
                                </Panel>

                                <PanelResizeHandle className='h-[1px] bg-light transition-colors' />

                                <Panel defaultSize={50} minSize={20}>
                                    {selectedMessage ? (
                                        <div className='flex-1 h-full overflow-y-scroll bg-material text-xs'>
                                            <CodeEditor value={selectedMessage.data} editable={false} extensions={'json'} />
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