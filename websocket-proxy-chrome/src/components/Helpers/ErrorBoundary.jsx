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

    panel() {
        return <div className='fixed bottom-2 left-2 bg-black opacity-70 text-white !p-1 rounded z-[9999]'>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => reloadInspectedWindow()}>Page reload</button>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => window.location.reload()}>Frame reload</button>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => storeManager.clear()}>Clear storage</button>
            <button className='!m-0 !mx-2 hover:bg-gray-600' onClick={() => console.clear()}>Clear logs</button>
        </div>
    }

    render() {
        if (this.state.hasError) {
            return <>
                {this.panel()}
                <pre>OOPS: {this.state.error?.message + '\n' + this.state.error?.stack}</pre>
            </>
        }
        return <>{this.panel()} {this.props.children}</>
    }
}

export default ErrorBoundary;
