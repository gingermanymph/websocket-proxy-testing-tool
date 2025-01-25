import React from 'react'

const WSProxy = ({ defaultWSPTemplate, setSettings, className }) => {
    return (
        <div className={className}>
            WSProxy
            <pre>defaultWSPTemplate: {defaultWSPTemplate}</pre>
        </ div>
    )
}

export default WSProxy