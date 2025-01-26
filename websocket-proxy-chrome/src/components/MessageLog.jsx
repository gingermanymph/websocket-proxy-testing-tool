import React from 'react';
import {  VscArrowSmallDown, VscArrowSmallUp, VscCircleFilled, VscPassFilled, VscCircleLarge, VscCircleLargeFilled } from 'react-icons/vsc';
import { TiArrowUpThick, TiArrowDownThick } from "react-icons/ti";

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

const MessageLog = ({ message, onClick }) => {
    return (
        <div
            className='flex items-center cursor-pointer border-b border-light !pr-[2px]'
            onClick={onClick}
        >
            {getIcon(message.type)}
            <div className='flex flex-1 overflow-hidden'>
                <div className='font-mono truncate'>{message.data}</div>
                <div className='!ml-auto text-[10px] text-light content-center  border-l border-light !pl-[2px]'>
                    {message.time}
                    {/* {new Date(message.time).toLocaleTimeString()} */}
                </div>
            </div>
        </div>
    )
}

export default MessageLog