import React from 'react'

const WSClient = ({ defaultJSONTemplate, setSettings, className }) => {
    return (
        <div className={className}>
            WSClient
            <pre>defaultJSONTemplate: {defaultJSONTemplate}</pre>
        </div>
    )
}

export default WSClient