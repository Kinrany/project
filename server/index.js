const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();

app.use(express.static('client'));

const server = http.createServer(app);
const io = socketIo(server);
server.listen(8000, () => {
  console.log('listening on *:8000');
});

/** @type {Map<symbol, SocketIO.Socket>} */
const sockets = new Map();

io.on('connection', (socket) => {
  const symbol = Symbol();
  sockets.set(symbol, socket);

  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    sockets.delete(symbol);
  })
});

// moving brick
let point = {x: 50, y: 50};

setInterval(() => {
  for (const socket of sockets.values()) {
    point.x += 5;
    point.y += 5;
    socket.send({
      tag: 'brick_moved',
      value: point,
    });
  }
}, 1000);
