# WebSocket Proxy Testing Tool 🚀

## Current Features
- Monitor WebSocket traffic between the page and server.
- Modify data before sending using JavaScript.

## How It Works
You can define rules using JavaScript to modify WebSocket messages before they are sent.

### Simple Replacement
```js
message = message.replace('foo', 'bar');
```

### Working with JSON
```js
let msg = JSON.parse(message);
msg.addKey = 'foobar';
msg.name = 'Changed name';
message = JSON.stringify(msg);
```

## In Progress
- Modify data before it is received using JavaScript.
- Send custom messages to the server within the current WebSocket connection.

## Planned Features
- Lightweight WebSocket client for easier testing.