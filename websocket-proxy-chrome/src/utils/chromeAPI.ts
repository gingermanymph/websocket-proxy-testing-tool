export const reloadInspectedWindow = (args: any) => {
    try {
        return chrome.devtools.inspectedWindow.reload(args);
    } catch (error) {
        console.warn(`This chrome API must be requested from devtools`)
        return window.location.reload();
    }
}

export const storeManager = {
    // Save data to Chrome storage
    set: (key, value, callback) => {
        const data = {};
        data[key] = value;
        chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
                console.error(`Error setting key "${key}":`, chrome.runtime.lastError);
            } else if (callback) {
                callback();
            }
        });
    },

    // Get data from Chrome storage
    get: (key, callback) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                console.error(`Error getting key "${key}":`, chrome.runtime.lastError);
                callback(null);
            } else {
                callback(result[key]);
            }
        });
    },

    // Remove data from Chrome storage
    remove: (key, callback) => {
        chrome.storage.local.remove(key, () => {
            if (chrome.runtime.lastError) {
                console.error(`Error removing key "${key}":`, chrome.runtime.lastError);
            } else if (callback) {
                callback();
            }
        });
    },

    // Clear all data from Chrome storage
    clear: (callback) => {
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing storage:', chrome.runtime.lastError);
            } else if (callback) {
                callback();
            }
        });
    },
};


// Communication with background.js
export class AppDevtoolsConnection {
    appInstance: any;
    retries: number;
    maxRetries: number;
    messageHandler: (message: any) => void;
    isConnected: boolean;

    constructor(messageHandler, maxRetries = 5) {
        this.appInstance = null;
        this.retries = 0;
        this.maxRetries = maxRetries;
        this.messageHandler = messageHandler;
        this.isConnected = false;
    }

    connect() {
        if (this.appInstance && this.isConnected) {
            console.log('Already connected to background.');
            return;
        }

        console.log('Connecting to background...');

        const chromePort = chrome.runtime.connect();

        chromePort.postMessage({
            appId: chrome.devtools.inspectedWindow.tabId
        });

        chromePort.onMessage.addListener((message) => {
            if (typeof this.messageHandler === 'function') {
                this.messageHandler(message);
            }
        });

        chromePort.onDisconnect.addListener(() => {
            console.warn('AppDevtools Port disconnected. Attempting to reconnect...');
            this.reconnect();
        });

        this.appInstance = chromePort;
        this.isConnected = true;
        this.retries = 0;

        console.log('Connected to background.');
    }

    disconnect() {
        if (this.appInstance) {
            this.appInstance.disconnect();
            this.isConnected = false;
            this.appInstance = null;
            console.log('Disconnected from background.');
        }
    }

    reconnect() {
        this.disconnect();
        if (this.retries < this.maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, this.retries), 10000); // Exponential backoff

            console.log(`Reconnecting in ${delay}ms (Attempt ${this.retries + 1}/${this.maxRetries})`);

            setTimeout(() => {
                this.retries++;
                this.connect();
            }, delay);
        } else {
            console.error('Max reconnection attempts reached. Connection failed.');
        }
    }

    postMessage(message) {
        if (this.appInstance && this.isConnected) {
            try {
                this.appInstance.postMessage(message);
            } catch (error) {
                console.error('Failed to send message:', error);
                this.reconnect();
            }
        } else {
            console.error('Not connected. Cannot send message.');
            // Try to connect when connection was lost and onDisconnect is not fiered
            this.reconnect();
        }
    }
}