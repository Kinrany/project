/**
 * @typedef {{x: number, y: number}} Point
 */

class Player {
  /**
   * @constructor
   * @param {number} id
   * @param {SocketIO.Socket} socket
   */
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.game_state = {x: 300, y: 200};
    this.joinedAt = new Date();
  }

  /**
   * @param {Player} player
   * @returns {Player['game_state']}
   */
  static move_randomly(player) {
    const dx = (Math.random() - .5) * 1;
    const dy = (Math.random() - .5) * 1;
    return Player.move(player, {x: dx, y: dy});
  }

  /**
   * @param {Player} player
   * @param {Point} dxdy
   * @returns {Player['game_state']}
   */
  static move(player, dxdy) {
    const {x, y} = player.game_state;
    const {x: dx, y: dy} = dxdy;
    return {
      x: x + dx,
      y: y + dy,
    };
  }

  /**
   * @param {Player} player
   * @param {Player[]} moved_players
   */
  static emit_players_moved(player, moved_players) {
    player.socket.emit(
      'players_moved',
      moved_players.map(({id, game_state}) => ({
        id,
        game_state
      }))
    );
  }

  /**
   * @param {Player} player
   * @param {Player} connected_player
   */
  static emit_player_joined(player, connected_player) {
    player.socket.emit(
      'player_joined',
      {
        id: connected_player.id,
        game_state: connected_player.game_state
      }
    );
  }

  /**
   * @param {Player} player
   * @param {Player} disconnected_player
   */
  static emit_player_left(player, disconnected_player) {
    player.socket.emit(
      'player_left',
      disconnected_player.id
    );
  }
}

module.exports = {Player};
