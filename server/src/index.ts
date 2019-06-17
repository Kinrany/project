import http from 'http';
import express from 'express';
import socketIo from 'socket.io';
import {Player} from './player';

const app = express();
app.use(express.static('client'));
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;
server.listen(port, () => {
  console.log(`listening on localhost:${port}`);
});

let last_player_id = 0;
const players = new Map<Player['id'], Player>();

function registerPlayer(socket: SocketIO.Socket) {
  const id = ++last_player_id;
  const player = new Player(id, socket);
  players.set(id, player);
  return player;
}

const move_distance_per_keypress = 10;

const game_event_handlers: Record<string, (p: Player) => void> = {
  move_up(player) {
    player.game_state = Player.move(player, {x: 0, y: -move_distance_per_keypress});
  },
  move_left(player) {
    player.game_state = Player.move(player, {x: -move_distance_per_keypress, y: 0});
  },
  move_down(player) {
    player.game_state = Player.move(player, {x: 0, y: move_distance_per_keypress});
  },
  move_right(player) {
    player.game_state = Player.move(player, {x: move_distance_per_keypress, y: 0});
  },
};

function emit_players_moved() {
  players.forEach(player => {
    Player.emit_players_moved(player, Array.from(players.values()))
  });
}

const onDisconnect = (disconnected_player: Player) => () => {
  console.log(`Player ${disconnected_player.id} disconnected`);
  players.forEach(player => void Player.emit_player_left(player, disconnected_player));
  players.delete(disconnected_player.id);
}

function onConnection(socket: SocketIO.Socket) {
  const connected_player = registerPlayer(socket);
  console.log(`Player ${connected_player.id} connected`);

  socket.on('disconnect', onDisconnect(connected_player));
  Object.entries(game_event_handlers).forEach(([event, handler]) => {
    socket.on(event, () => handler(connected_player));
    emit_players_moved();
  });

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
    player.game_state = Player.move_randomly(player)
  });
  emit_players_moved();

}, 50);
