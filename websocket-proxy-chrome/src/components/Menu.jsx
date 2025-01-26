import React, { useState } from 'react';
import { VscMenu, VscPlug, VscDebugDisconnect, VscQuestion } from 'react-icons/vsc';


const Menu = ({ onSelect, active }) => {
    const menuItems = [
        {
            type: 'WSProxy',
            icon: <VscDebugDisconnect className='h-[21px] w-[21px]'/>
        },
        {
            type: 'WSClient',
            icon: <VscPlug className='h-[21px] w-[21px]'/>
        },
        {
            type: 'WSAbout',
            icon: <VscQuestion className='h-[21px] w-[21px]'/>
        },
    ]
    const [isSelected, setActiveComponent] = useState(active);
    return (
        <div className='flex flex-col w-[30px] border-r border-light'>
            <div className='flex justify-center items-center min-h-[26px] border-b border-light '>
                <VscMenu className='h-[18px] w-[18px] text-light'/>
            </div>
            {menuItems.map((item, id) => (
                <button
                    className={`min-w-[30px] min-h-[30px] flex justify-center items-center text-light ${isSelected === item.type && 'selected' }`}
                    key={id}
                    onClick={() => {
                        onSelect(item.type);
                        setActiveComponent(item.type);
                    }}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    )
}

export default Menu