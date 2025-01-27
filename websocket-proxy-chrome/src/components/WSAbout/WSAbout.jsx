import React from 'react';
import GitHubButton from 'react-github-btn'

const WSAbout = () => {
    return (
        <div className="flex justify-center text-gray-200 font-sans min-h-screen py-8 h-full overflow-y-scroll">
            <div className="!m-2">
                <a href="https://www.patreon.com/gingermanymph" target="_blank" className='h-7 flex items-center bg-[#3c3c3c] rounded !pl-2 !pr-4 font-bold hover:bg-[#4f4f4f]'>
                    <svg data-tag="IconBrandPatreon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-7 h-7 '>
                        <path fill="#ff6467" d="M20.25 8.416c0-.943-.366-2.297-1.498-3.415C17.62 3.883 15.722 3 12.656 3c-3.732 0-5.96 1.19-7.252 2.91C4.11 7.627 3.75 9.875 3.75 11.991c0 3.113.42 5.365 1.141 6.84C5.612 20.304 6.634 21 7.836 21c1.4 0 2.205-.903 2.824-2.024.619-1.12 1.051-2.46 1.704-3.332.467-.623 1-1.023 1.602-1.312.602-.29 1.273-.469 2.012-.651 1.27-.313 2.338-.969 3.089-1.876.75-.908 1.183-2.067 1.183-3.389"></path>
                    </svg>
                    PATREON
                </a>
            </div>

            <div className="!mx-auto max-w-4xl bg-input !p-8 shadow-lg overflow-y-auto">
                <h1 className="text-2xl font-bold text-[#a8c7fa] text-center !mb-8">FAQ: WebSocket Proxy</h1>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q1: What is the primary feature of the WebSocket Proxy extension?</h2>
                    <p className="text-light text-base">A1: The extension's key feature is <strong>live data modification</strong>, which allows users to modify WebSocket messages in real-time before they are sent.</p>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q2: How do I modify WebSocket messages?</h2>
                    <p className="text-light text-base">A2: Use the <strong>CodeEditor</strong> component to write custom JavaScript code that manipulates the message data. Once your code is written, click the <strong>Run Code</strong> button in the toolbar to apply your modifications.</p>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q3: What tools are available in the toolbar?</h2>
                    <p className="text-light text-base">A3: The toolbar includes the following controls:</p>
                    <ul className="list-disc list-inside ">
                        <li><strong>Run Code</strong>: Executes your custom code for live data modification.</li>
                        <li><strong>Stop Code</strong>: Halts the execution of custom code.</li>
                        <li><strong>Reload Page</strong>: Refreshes the current page.</li>
                        <li><strong>Error Label</strong>: Displays any errors in your custom code after clicking "Run Code" (hidden by default).</li>
                    </ul>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q4: Can I view and log WebSocket messages?</h2>
                    <p className="text-light text-base">A4: Yes, the extension provides tools to view and log both sent and received WebSocket messages.</p>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q5: How can I filter the WebSocket messages in the log?</h2>
                    <p className="text-light text-base">A5: The toolbar includes the following filtering options:</p>
                    <ul className="list-disc list-inside ">
                        <li><strong>Message Type Filter Dropdown</strong>: Allows you to filter messages by:
                            <ul className="list-disc list-inside ml-6">
                                <li><strong>All</strong>: View all WebSocket messages.</li>
                                <li><strong>Send</strong>: Show only sent messages.</li>
                                <li><strong>Receive</strong>: Show only received messages.</li>
                            </ul>
                        </li>
                        <li><strong>Message Data Filter Input</strong>: A <strong>RegEx-based filter</strong> to search for specific patterns in message data.</li>
                    </ul>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q6: How do I clear the message logs?</h2>
                    <p className="text-light text-base">A6: Use the <strong>Clear Logs</strong> button in the toolbar to delete all logged messages.</p>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q7: What is the MessagesLog component?</h2>
                    <p className="text-light text-base">A7: The <strong>MessagesLog</strong> displays all logged WebSocket messages along with their data and timestamps. Each message is clickable for more detailed analysis.</p>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q8: What does the MessagesLog detail view show?</h2>
                    <p className="text-light text-base">A8: When a message is selected in the <strong>MessagesLog</strong>, its detailed data is shown in a text editor. For instance, JSON messages are automatically beautified for easier reading.</p>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q9: Can I modify the selected message in the detail view?</h2>
                    <p className="text-light text-base">A9: Currently, the detail view is designed for analysis, not for live editing. Use the <strong>CodeEditor</strong> for modifications before messages are sent.</p>
                </div>

                <div className="!mb-6">
                    <h2 className="text-lg font-semibold !mb-2">Q10: What happens if there’s an error in my custom code?</h2>
                    <p className="text-light text-base">A10: If your code has an error and you click the <strong>Run Code</strong> button, an <strong>Error Label</strong> will appear in the toolbar with details about the issue.</p>
                </div>
            </div>

            <div className='!m-2'>
                <GitHubButton href="https://github.com/gingermanymph/websocket-proxy-testing-tool/issues" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-icon="octicon-issue-opened" data-size="large" aria-label="Issue buttons/github-buttons on GitHub">Issue</GitHubButton>
            </div>
        </div>
    )
}

export default WSAbout