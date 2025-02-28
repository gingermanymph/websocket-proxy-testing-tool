/*global chrome*/
(function () {
    const appName = 'background-app';
    console.log(`[${appName}] loaded`);

    let appInspectorChromePorts = {};
    let activeConnections = new Set();

    function generateConnectionsTooltip() {
        return activeConnections.size > 0 ? `Websocket Proxy\n\nActive connections:\n${[...activeConnections].join("\n")}\n`
            : "Websocket Proxy\n\nNo active connections";
    }

    function setActionTitle(tabId) {
        void chrome.action.setTitle({
            tabId: tabId,
            title: generateConnectionsTooltip()
        });
    }

    function updateTabAction(tabId) {
        void chrome.action.enable(tabId);
        void chrome.action.setIcon({
            tabId,
            path: {
                "16": "icons/a-16.png",
                "32": "icons/a-32.png",
                "64": "icons/a-64.png",
                "128": "icons/a-128.png"
            }
        });
        setActionTitle(tabId);
    };

    function resetAction(tabId) {
        void chrome.action.disable(tabId);
        void chrome.action.setIcon({
            tabId,
            path: {
                "16": "icons/i-16.png",
                "32": "icons/i-32.png",
                "64": "icons/i-64.png",
                "128": "icons/i-128.png"
            }
        });
        setActionTitle(tabId);
    }

    // Waiting for appInspector connection
    chrome.runtime.onConnect.addListener(function (appInspectorChromePort) {
        let appId;

        // Listen for messages from the appInspector.
        // The first message is used to save the port, all others are forwarded
        // to the content-script.
        appInspectorChromePort.onMessage.addListener(function (message) {
            if (message.appId) {
                appId = message.appId;
                appInspectorChromePorts[appId] = appInspectorChromePort;

                appInspectorChromePort.onDisconnect.addListener(function () {
                    delete appInspectorChromePorts[appId];
                });
            } else if (message.from === 'devtools') {
                // all other messages from appInspector are 
                // forwarded to the content-script
                // https://developer.chrome.com/extensions/tabs#method-sendMessage
                chrome.tabs.sendMessage(
                    message.tabId || appId, message,
                    { frameId: message.frameId }
                );
            }
        });
    });

    // Listen for messages from the content-script.
    chrome.runtime.onMessage.addListener(function (request, sender) {
        if (!sender.tab) {
            // nope
        } else {
            // forward the message to appInspector
            let appInspectorChromePort = appInspectorChromePorts[sender.tab.id];
            if (appInspectorChromePort) {
                appInspectorChromePort.postMessage(request)
            }

            try {
                if (request.type) {
                    let url = new URL(request.value.wspData.currentTarget);
                    if (request.type === 'wsp-connect') {
                        activeConnections.add(url.host);
                        updateTabAction(sender.tab.id, url.host);
                    }

                    if (request.type === 'wsp-disconnect') {
                        activeConnections.delete(url.host);
                        if (activeConnections.size > 0) {
                            updateTabAction(sender.tab.id, url.host);
                        } else {
                            resetAction(sender.tab.id);
                        }
                    }
                }
            } catch (error) {
                // nope
            }
        }
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            activeConnections.clear();
            resetAction(tabId);
        }
    });
})();