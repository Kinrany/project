const http = require('http');
const express = require('express');

const app = express();

app.use(express.static('client'));

const server = http.createServer(app);
server.listen(8000, () => {
  console.log('listening on *:8000');
});
