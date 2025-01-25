import React, { useState } from 'react';
import { VscMenu, VscPlug, VscDebugDisconnect, VscQuestion } from 'react-icons/vsc';


const Menu = ({ onSelect, active }) => {
    const menuItems = [
        {
            type: 'WSProxy',
            icon: <VscDebugDisconnect />
        },
        {
            type: 'WSClient',
            icon: <VscPlug />
        },
        {
            type: 'WSAbout',
            icon: <VscQuestion />
        },
    ]
    const [isSelected, setActiveComponent] = useState(active);
    return (
        <div>
            <div>
                <VscMenu />
            </div>
            <hr />
            {menuItems.map((item, id) => (
                <button
                    className={`${isSelected === item.type ? 'selected' : ''}`}
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