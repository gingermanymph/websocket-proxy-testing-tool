export const defaultWSPTemplate = `/** This code will runs each time before sending websocket message 
*  In this code context available two variables \`message\` and \`target\`
*  @target - contains current WebSocket host
*  @message - contains current data
*/

// Skipp host
if (target === 'wss://example.com/') return message;

// Modify message
message = message.toUpperCase();\n`;

export const defaultJSLiveTemplate = `message = {
    // Create your message
    currentTime: new Date().getTime(),
    userAgent: navigator.userAgent
}\n`;


export const defaultJSONTemplate = `{
"message":"Hello WebSockets"
}`

