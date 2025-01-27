/* global chrome*/
/* content-script context */
(function () {
    "use strict";
    const name = 'content-script';

    const contentScriptIsReady = 'content-script-ready';
    const inPageClientInit = 'wsp-client-init';
    const inPageClientCustomAction = 'wsp-client-custom-action';

    // content-script is listening for message events
    window.addEventListener('message', function (event) {
        // Identify inPageClient by initial message to setup 
        // communication between content-script.js and inPageClient.js
        if (event.data === inPageClientInit) {
            let inPageClientPort = event.ports[0];
            listenToInPageClientPort(inPageClientPort);
        } else if (event.data && event.data.type) {
            // Other messages, pass them on to the background script
            try {
                chrome.runtime.sendMessage(event?.data);
            } catch (error) {
                // Since content script is not connected directly to bg script, sometime it can trigger issue while sending messages
                // TODO: Fix this issue
                console.error(error);
            }
        }

        function listenToInPageClientPort(inPageClientPort) {
            // listen for messages from inPageClientPort, 
            // and pass them on to the background script
            inPageClientPort.addEventListener('message', async function (event) {

                // Check if event data exists
                if (event.data) {
                    // Apply arrayBuffer to typedArray only for send/receive messages
                    if (event.data.type === 'wsp-message-send' || event.data.type === 'wsp-message-receive') {
                        const wspData = event.data.value?.wspData;
                        // Check if data is arrayBuffer

                        if (typeof wspData.data === 'string') {
                            // If the data is a string, use it as-is
                        } else if (wspData.data instanceof Blob) {
                            // If the data is a Blob, read it as text
                            wspData.data = await wspData.data.text();
                        } else if (wspData.binaryType === 'arraybuffer' && wspData.data instanceof ArrayBuffer) {
                            // convert arrayBuffer into typed arrays to pass it via chrome.runtime.sendMessage
                            // convert arrayBuffer into ONE typed array
                            wspData.data = getCompatibleTypedArray(wspData.data); // getAllCompatibleTypedArrays(wspData.data);
                            event.data.value.wspData = wspData;
                        } else {
                            // TODO: The binaryType can be arrayBuffer but wspData.data not instanceof ArrayBuffer, e.g Uint8Array
                            // 1. Fix this, unify all messages 
                            console.assert(wspData);
                        }
                    }
                }

                try {
                    chrome.runtime.sendMessage(event?.data);
                } catch (error) {
                    // Since content script is not connected directly to bg script, sometime it can trigger issue while sending messages
                    // TODO: Fix this issue [Uncaught Error: Extension context invalidated.]
                    console.error(error);
                }
            });

            chrome.runtime.onMessage.addListener(function (message) {
                // listen for messages from the appInspector, 
                // and pass them on to inPageClientPort
                // Verify if the come form appInspector by some key
                if (message.from === 'devtools') {
                    // forward message to inPageClientPort
                    inPageClientPort.postMessage(message)
                }
            });
            inPageClientPort.start();
        }

        // Do you need a specific action from appInspector? Handle it here
        let injected = false;

        chrome.runtime.onMessage.addListener((message) => {
            if (message?.type === 'inject-something') {
                if (!injected) {
                    // cannot use eval here, as the context is limited to the content script
                    const elem = document.createElement('script');
                    elem.src = message.value;
                    document.head.appendChild(elem);
                    injected = true;
                }
            }
        })
    });

    chrome.runtime.sendMessage(contentScriptIsReady);
})();

// Get all types, issue with performane
function getAllCompatibleTypedArrays(arrayBuffer) {
    const typedArrayConstructors = [
        Uint8Array,
        Int8Array,
        Uint16Array,
        Int16Array,
        Uint32Array,
        Int32Array,
        Float32Array,
        Float64Array,
    ];

    const compatibleArrays = [];
    const compatibleArraysObject = {};

    for (const Constructor of typedArrayConstructors) {
        if (arrayBuffer.byteLength % Constructor.BYTES_PER_ELEMENT === 0) {
            const typedArray = new Constructor(arrayBuffer);
            compatibleArraysObject[Constructor.name] = typedArray;
            compatibleArraysObject['byteLength'] = arrayBuffer.byteLength
            compatibleArrays.push({
                type: Constructor.name,
                array: typedArray,
                byteLength: arrayBuffer.byteLength
            });
        }
    }
    return compatibleArraysObject;
}

function isCompatibleArrayBuffer(arrayBuffer, TypedArrayConstructor) {
    const elementSize = TypedArrayConstructor.BYTES_PER_ELEMENT;
    return arrayBuffer.byteLength % elementSize === 0;
}

// Get one compatable type, then recreate other types if needed in appInstance
function getCompatibleTypedArray(arrayBuffer) {
    const typedArrayConstructors = [
        Uint8Array,
        Int8Array,
        Uint16Array,
        Int16Array,
        Uint32Array,
        Int32Array,
        Float32Array,
        Float64Array,
    ];

    const compatableArrayObject = {}
    for (const Constructor of typedArrayConstructors) {
        if (isCompatibleArrayBuffer(arrayBuffer, Constructor)) {
            const typedArray = new Constructor(arrayBuffer);
            compatableArrayObject['type'] = Constructor.name;
            compatableArrayObject[Constructor.name] = new Constructor(typedArray);
            compatableArrayObject['byteLength'] = arrayBuffer.byteLength;

            // Added 'text', 'label' prop for testing
            const array = [];//data[type];
            for (const key in typedArray) {
                if (Object.prototype.hasOwnProperty.call(typedArray, key)) {
                    array.push(typedArray[key]);
                }
            }
            compatableArrayObject['text'] = `(${arrayBuffer.byteLength})[${array.join(', ')}], byteLenght: ${arrayBuffer.byteLength}`
            compatableArrayObject['label'] = '[Binary data]'
            // end
            return compatableArrayObject
        }
    }
    throw new Error("No compatible typed array found for this ArrayBuffer");
}