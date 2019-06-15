/**
 * @typedef {{x: number, y: number}} Point
 */

class Player {
  /**
   * @constructor
   * @param {number} id
   * @param {SocketIO.Socket} socket
   * @param {Point} game_state
   */
  constructor(id, socket, game_state) {
    this.id = id;
    this.socket = socket;
    this.game_state = game_state;
    this.joinedAt = new Date();
  }

  /**
   * @param {Player} player
   * @returns {Player['game_state']}
   */
  static update_game_state(player) {
    const {x, y} = player.game_state;
    const dx = (Math.random() - .5) * 10;
    const dy = (Math.random() - .5) * 10;
    return {
      x: x + dx,
      y: y + dy,
    };
  }

  /**
   * @param {Player} player
   * @param {Player[]} moved_players
   */
  static send_players_moved(player, moved_players) {
    player.socket.send({
      tag: 'players_moved',
      value: moved_players.map(({id, game_state}) => ({
        id,
        game_state
      }))
    });
  }

  /**
   * @param {Player} player
   * @param {Player} connected_player
   */
  static send_player_joined(player, connected_player) {
    player.socket.send({
      tag: 'player_joined',
      value: {
        id: connected_player.id,
        game_state: connected_player.game_state
      }
    });
  }

  /**
   * @param {Player} player
   * @param {Player} disconnected_player
   */
  static send_player_left(player, disconnected_player) {
    player.socket.send({
      tag: 'player_left',
      value: disconnected_player.id
    });
  }
}

module.exports = {Player};
