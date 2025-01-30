import React, { useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { VscCircleFilled } from 'react-icons/vsc';
import { TiArrowUpThick, TiArrowDownThick } from "react-icons/ti";

const getTime = (time) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false,
    }).format(time);
};

const getIcon = (type) => {
    switch (type) {
        case 'open':
            return <VscCircleFilled className='h-3 w-3 text-green-400' />;
        case 'send':
            return <TiArrowUpThick className='h-3 w-3 text-green-300' />;
        case 'message':
            return <TiArrowDownThick className='h-3 w-3 text-red-300' />;
        case 'close':
            return <VscCircleFilled className='h-3 w-3 text-red-400' />;
    }
};

const MessagesHistory = ({ messages, messageOnClick }) => {
    return (
        <>
            {
                !messages.length &&
                <div className='h-full flex items-center justify-center text-xl text-light-h truncate'>
                    Messages will show up here
                </div>
            }
            <Virtuoso
                data={messages}
                itemContent={(index, message) => (
                    <div
                        className='flex items-center cursor-pointer border-b border-light !pr-[2px]'
                        onClick={() => messageOnClick(message)}
                    >
                        {getIcon(message.type)}
                        <div className='flex flex-1 overflow-hidden'>
                            <div className='font-mono truncate'>{message.data.text || message.data}</div>
                            <div className='!ml-auto text-[10px] text-light content-center  border-l border-light !pl-[2px]'>
                                {getTime(message.time)}
                            </div>
                        </div>
                    </div>
                )}
            // TODO: Make auto scroll by request
            // followOutput
            />
        </>
    )
}

export default MessagesHistory