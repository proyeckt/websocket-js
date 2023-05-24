const express = require('express');
const WebSocket = require('ws');

const port = process.env.PORT || 3000;

const server = express()
  .listen(port, () => console.log(`Listening on ${port}`));

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
    clients.clear();
    console.log(connections);
  }

  ws.on('message', (message) => {
    const receivedMessage = message instanceof Buffer
      ? message.toString()
      : message;
    console.log(receivedMessage);

    broadcastMessage(receivedMessage,ws);
  });

  ws.on('close', () => {
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
      const iterator = connection.values();
      sendMsg(iterator.next().value,message);
      sendMsg(iterator.next().value,message);
    }
  }
}

const sendMsg = (client, message) => {
  if(client.readyState === WebSocket.OPEN) client.send(message);
}
