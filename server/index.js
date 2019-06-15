const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const {Player} = require('./player');

const app = express();
app.use(express.static('client'));
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;
server.listen(port, () => {
  console.log(`listening on localhost:${port}`);
});

let last_player_id = 0;
/** @type {Map<Player['id'], Player>} */
const players = new Map();

/**
 * @param {SocketIO.Socket} socket
 */
function registerPlayer(socket) {
  const id = ++last_player_id;
  const player = new Player(id, socket);
  players.set(id, player);
  return player;
}

/**
 * @param {Player} disconnected_player
 */
const onDisconnect = (disconnected_player) => () => {
  console.log(`Player ${disconnected_player.id} disconnected`);
  players.forEach(player => void Player.emit_player_left(player, disconnected_player));
  players.delete(disconnected_player.id);
}

/**
 * @param {SocketIO.Socket} socket
 */
function onConnection(socket) {
  const connected_player = registerPlayer(socket);
  console.log(`Player ${connected_player.id} connected`);

  socket.on('disconnect', onDisconnect(connected_player));

  // send the new player info about every other player
  Array.from(players.values())
    .filter(player => player.id !== connected_player.id)
    .forEach(player => void Player.emit_player_joined(connected_player, player));

  // tell everyone (including the new player)
  // that the new player joined
  players.forEach(player => void Player.emit_player_joined(player, connected_player));
}

io.on('connection', onConnection);

setInterval(() => {
  players.forEach(player => {
    player.game_state = Player.update_game_state(player)
  });
  players.forEach(player => {
    Player.emit_players_moved(player, Array.from(players.values()))
  });

}, 50);
