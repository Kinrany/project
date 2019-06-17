interface Point {
  x: number;
  y: number;
}

export class Player {
  public game_state: Point;

  constructor(
    readonly id: number,
    readonly socket: SocketIO.Socket
  ) {
    this.game_state = {x: 300, y: 200};
  }

  static move_randomly(player: Player): Player['game_state'] {
    const dx = (Math.random() - .5) * 1;
    const dy = (Math.random() - .5) * 1;
    return Player.move(player, {x: dx, y: dy});
  }

  static move(player: Player, dxdy: Point): Player['game_state'] {
    const {x, y} = player.game_state;
    const {x: dx, y: dy} = dxdy;
    return {
      x: x + dx,
      y: y + dy,
    };
  }

  static emit_players_moved(player: Player, moved_players: Player[]): void {
    player.socket.emit(
      'players_moved',
      moved_players.map(({id, game_state}) => ({
        id,
        game_state
      }))
    );
  }

  static emit_player_joined(player: Player, connected_player: Player): void {
    player.socket.emit(
      'player_joined',
      {
        id: connected_player.id,
        game_state: connected_player.game_state
      }
    );
  }

  static emit_player_left(player: Player, disconnected_player: Player): void {
    player.socket.emit(
      'player_left',
      disconnected_player.id
    );
  }
}
