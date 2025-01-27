/*global chrome*/
(function () {
    const appName = 'background-app';
    console.log(`[${appName}] loaded`);

    let appInspectorChromePorts = {};

    // Waiting for appInspector connection
    chrome.runtime.onConnect.addListener(function (appInspectorChromePort) {
        console.log(`[${appName}] got connection`, appInspectorChromePort);
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
                    console.log(`[${appName}] onDisconnect`, appInspectorChromePorts)
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
        }
    });
})();