
require('dotenv').config({ path: 'w3s-dynamic-storage/.env' });
const express = require("express");
const path = require('path');
const { initializeSocketHooks } = require('./socketHooks');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // http://localhost:3000
  },
  pingTimeout: 130000, // 2 min 10 sec - Increased the default value to delay the handshake request, this will reduce no of request made to spaces 
  pingInterval: 60000, // 1 min
})
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

initializeSocketHooks(io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/ping', (req, res) => {
  res.send({ ping: true });
})

server.listen(SERVER_PORT, () => {
  console.log(`Server is running at port: ${SERVER_PORT}`);
})


if (process.env.NODE_ENV !== 'development') {
  const clientApp = express();
  clientApp.use(express.static('dist'));
  clientApp.use(express.json());

  clientApp.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
  clientApp.listen(CLIENT_PORT, () => console.log(`Client is listening at port: ${CLIENT_PORT}`));
}
