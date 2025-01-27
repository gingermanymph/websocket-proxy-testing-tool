/* global window */
const appName = 'wsp-client';
const clientInit = 'wsp-client-init';

function WSProxyConnection({ appName, clientInit, devtoolsMessageHandler }) {
    const _channel = new MessageChannel();
    const _chromePort = _channel.port1;
    let isConnected = false;

    const connect = () => {
        if (isConnected) {
            console.warn("Already connected.");
            return;
        }
        isConnected = true;
        window.postMessage(clientInit, "*", [_channel.port2]);
        console.debug(`[${appName}] Connection initialized. From: ${window.location}`);
        _listen();
    };

    this.sendMessage = (options = {}) => {
        try {
            _chromePort.postMessage(options);
            console.debug(`[${appName}] Message sent:`, options);
        } catch (e) {
            console.error(`[${appName}] Failed to send message:`, e);
        }
    };

    const _listen = () => {
        _chromePort.addEventListener("message", (event) => {
            const message = event.data;
            if (typeof message !== "object" || !message.type) {
                console.warn(`[${appName}] Invalid message received:`, message);
                return;
            }
            console.debug(`[${appName}] Message received:`, message);
            devtoolsMessageHandler(message);
        });

        _chromePort.onmessageerror = () => {
            console.warn(`[${appName}] Message channel error occurred. Disconnecting...`);
            _disconnect();
        };

        _chromePort.start();
        console.debug(`[${appName}] Listening for messages.`);
    };

    const _disconnect = () => {
        if (!isConnected) {
            console.warn(`[${appName}] Already disconnected.`);
            return;
        }
        _chromePort.close();
        isConnected = false;
        console.warn(`[${appName}] Disconnected. Attempting to reconnect...`);
        setTimeout(connect, 1000); // Reconnect after 1 second
    };

    this.disconnect = _disconnect;

    connect();
    return this;
}

const WebSocketProxy = new Proxy(window.WebSocket, {
    construct: function (target, args) {
        const instance = new target(...args);

        const openHandler = (event) => {
            wspcom.sendMessage({
                type: 'wsp-connect',
                from: appName,
                value: {
                    wspData: {
                        type: 'open',
                        currentTarget: event?.currentTarget.url,
                        binaryType: event?.currentTarget?.binaryType,
                        time: Date.now()
                    }
                }
            });
        };

        const messageHandler = (event) => {
            wspcom.sendMessage({
                type: 'wsp-message-receive',
                from: appName,
                value: {
                    wspData: {
                        type: 'message',
                        currentTarget: event?.currentTarget.url,
                        data: event?.data,
                        binaryType: event?.currentTarget?.binaryType,
                        time: Date.now()
                    }
                }
            });
        };

        const closeHandler = (event) => {
            wspcom.sendMessage({
                type: 'wsp-disconnect',
                from: appName,
                value: {
                    wspData: {
                        type: 'close',
                        currentTarget: event?.currentTarget.url,
                        data: event?.data,
                        binaryType: event?.currentTarget?.binaryType,
                        time: Date.now()
                    }
                }
            });

            instance.removeEventListener('open', openHandler);
            instance.removeEventListener('message', messageHandler);
            instance.removeEventListener('close', closeHandler);
        };

        instance.addEventListener('open', openHandler);
        instance.addEventListener('message', messageHandler);
        instance.addEventListener('close', closeHandler);

        const sendProxy = new Proxy(instance.send, {
            apply: function (target, thisArg, args) {
                let edited = false;
                let parent = false;
                // Used parrent wsp_js in iframes (fix some cases when wsp_js is not updated in iframes)
                if (typeof parent.wsp_js === 'function') {
                    parent = true
                }

                if (typeof wsp_js === 'function') {
                    let wsp_results = parent
                        ? parent.wsp_js(args[0], thisArg?.url || thisArg?.origin)
                        : wsp_js(args[0], thisArg?.url || thisArg?.origin);
                    if (wsp_results !== args[0]) {
                        edited = true;
                    }
                    args[0] = wsp_results;
                }

                wspcom.sendMessage({
                    type: 'wsp-message-send',
                    from: appName,
                    value: {
                        wspData: {
                            type: 'send',
                            currentTarget: thisArg?.url,
                            data: args[0],
                            binaryType: thisArg?.binaryType,
                            edited,
                            time: Date.now()
                        }
                    }
                });
                target.apply(thisArg, args);
            }
        });

        instance.send = sendProxy;
        return instance;
    }
});

function devtoolsMessageHandler(message) {
    if (message.from === 'devtools') {
        if (message.type === 'update-wsp-js') {
            updateWSPJS(message.value);
        }
    }
}

function updateWSPJS(code) {
    try {
        window.wsp_js = new Function('message', 'target',
            `try {
                ${code}
            } catch (error) {
                if(window.wspcom){
                   window.wspcom.sendMessage({
                    from: '${appName}',
                    value: error.stack,
                    type: 'wsp-code-error'
                   }) 
                }
            }
            return message`);

        /* Trying to inject into iframes */
        // document.querySelectorAll('iframe').forEach((iframe)=> {
        //     if(iframe.id && iframe.src){
        //         try{
        //             iframe.contentWindow.wsp_js = window.wsp_js
        //         } catch (e) {
        //              //console.log(e)
        //         }
        //     }
        // });

    } catch (error) {
        if (window.wspcom) {
            window.wspcom.sendMessage({
                from: appName,
                value: error.stack,
                type: 'wsp-code-error'
            });
        }
    }
}

// replace the native WebSocket with the WebSocketProxy
if (!window.hasOwnProperty('WebSocketOriginal')) {
    window.WebSocketOriginal = WebSocket;
    window.WebSocket = WebSocketProxy;
}

window.wspcom = new WSProxyConnection({ appName, clientInit, devtoolsMessageHandler });
window.wsp_js = null;