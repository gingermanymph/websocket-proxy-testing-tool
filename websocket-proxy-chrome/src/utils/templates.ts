export const defaultWSPTemplate = `/** This code runs before each WebSocket message is sent.
*  
*  In this code, the following variables are available:
*  - \`target\`: The current WebSocket host.
*  - \`message\`: The data to be sent.
*/

// Skip processing for a specific host
if (target === 'wss://example.com/') {
    return message; // Return the original message unchanged
}

// Modify the message to uppercase
message = message.toUpperCase();\n`;

export const defaultJSLiveTemplate = `message = {
    // Create your message
    currentTime: new Date().getTime(),
    userAgent: navigator.userAgent
}\n`;


export const defaultJSONTemplate = `{
"message":"Hello WebSockets"
}`

