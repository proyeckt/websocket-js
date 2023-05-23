const express = require('express');
const WebSocket = require('ws');

const port = process.env.PORT || 3000;

const server = express()
  .listen(port, () => console.log(`Listening on ${port}`));

// Create a WebSocket server
const wss = new WebSocket.Server({server});

const connections = new Set();
const clients = new Set();

wss.on('listening', () => {
  console.log(`WebSocket server is running and listening on port: ${port}`);
});

wss.on('connection', (ws) => {
  /* if(clients.size<2){
    clients.add(ws);
    console.log("Client added");
  } */
  clients.add(ws);
  console.log("Client added");
  if(clients.size >=2){
    connections.add(new Set(clients));
    //console.log(clients)
    clients.clear();
    console.log(connections);
    //console.log(clients);
  }

  ws.on('message', (message) => {
    const receivedMessage = message instanceof Buffer
      ? message.toString()
      : message;
    console.log(receivedMessage);

    broadcastMessage(receivedMessage,ws);
  });

  // Handle client disconnection
  ws.on('close', () => {
    // Remove the client from the set of connected clients
    clients.delete(ws);

    /* for (const connection of connections) {
      if (connection.has(ws)) {
        connection.delete(ws);
        break;
      }
    } */
    console.log("Client Removed");
  });
});

const broadcastMessage = (message,ws) => {
  for (const connection of connections) {
    if (connection.has(ws)) {
        if(connection[0].readyState === WebSocket.OPEN) {
          connection[0].send(message);
        }
         if(connection[1].readyState === WebSocket.OPEN) {
          connection[1].send(message);
        }
      }
    }
}
