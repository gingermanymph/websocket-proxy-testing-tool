import React, { Component } from 'react';
import { reloadInspectedWindow, storeManager } from '../../utils/chromeAPI';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('Error caught in ErrorBoundary:', error, info);
    }

    devpanel() {
        return <div className='fixed bottom-2 left-2 bg-black opacity-70 text-white !p-1 rounded z-[9999]'>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => reloadInspectedWindow()}>Page reload</button>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => window.location.reload()}>Frame reload</button>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => storeManager.clear()}>Clear storage</button>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => console.clear()}>Clear logs</button>
        </div>
    }

    panel() {
        return <div className='fixed bottom-2 left-2 bg-gray-100 opacity-90 text-white !p-1 rounded z-[9999]'>
            <button className='!m-0 !mx-2 hover:bg-gray-400 !rounded-md !p-1 text-black' onClick={() => window.location.reload()}>Frame reload</button>
            <button className='!m-0 !mx-2 hover:bg-gray-400 !rounded-md !p-1 text-black' onClick={() => reloadInspectedWindow()}>Page reload</button>
            <button className='!m-0 !mx-2 hover:bg-gray-400 !rounded-md !p-1 text-black' onClick={() => storeManager.clear()}>Clear storage</button>
        </div>
    }

    render() {
        if (this.state.hasError) {
            return <>
                {this.panel()}
                <div className="mx-auto !p-4 shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong. 🙊</h1>
                    <p className="text-lg !mb-4">It looks like the app encountered an unexpected error. Please keep in mind that this app is still under development, and we’re working hard to improve it! Here’s what you can do:</p>
                    <div className="mb-10">
                        <p className="text-base !mb-2">1. Try refreshing the extension by clicking "Frame reload" button in the panel below</p>
                        <p className="text-base !mb-2">2. Try to Reload page and reopen devtools</p>
                        <p className="text-base !mb-4">3. If none of the above works, please report the issue with the steps below:</p>
                    </div>
                    <div className="pl-6 !mb-10">
                        <p className="text-xl !mb-4">
                            Visit our support page:{' '}
                            <a href="https://github.com/gingermanymph/websocket-proxy-testing-tool/issues" target="_blank" className="text-blue-500 hover:text-blue-700">Github issues</a>
                        </p>
                        <p className="text-base">Provide details about what you were doing when the issue occurred.</p>
                        <p className="text-base !mb-4">If possible, include error code below or screenshot(s)</p>
                        <pre className="bg-input text-white !p-4 !rounded-md text-sm overflow-y-auto">{this.state.error?.message + '\n' + this.state.error?.stack}</pre>
                    </div>
                </div>
            </>
        }
        return <>{this.props.children}</>
    }
}

export default ErrorBoundary;
