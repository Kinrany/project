const socket = io().connect();

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));

function resize_canvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize_canvas);
resize_canvas();

const ctx = canvas.getContext('2d');

/**
 * @typedef {{x: number, y: number}} Point
 */

class Player {
  /**
   * @constructor
   * @param {number} id
   * @param {Point} game_state
   */
  constructor(id, game_state) {
    this.id = id;
    this.game_state = game_state;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    const {x, y} = this.game_state;
    const radius = 20;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillText(this.id.toString(), x, y);
  }
}

/** @type {Map<number, Player>} */
const players = new Map();

function draw() {
  // background
  ctx.beginPath();
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const player of players.values()) {
    player.draw(ctx);
  }
}

const game_event_handlers = {
  /** @param {Pick<Player, 'id' | 'game_state'>[]} moved_players */
  players_moved(moved_players) {
    moved_players
      .filter(({id}) => players.has(id))
      .forEach(({id, game_state}) => {
        players.get(id).game_state = game_state;
      });
  },

  /**
   * @param {Pick<Player, 'id' | 'game_state'>} value
   */
  player_joined(value) {
    const {id, game_state} = value;
    players.set(id, new Player(id, game_state));
  },

  /**
   * @param {Player['id']} id
   */
  player_left(id) {
    players.delete(id);
  }
}

Object.entries(game_event_handlers).forEach(([event, handler]) => {
  socket.on(event, handler);
});

function scheduleDraw() {
  requestAnimationFrame(() => {
    draw();
    scheduleDraw();
  });
}

scheduleDraw();
draw();

const keydown_code_to_game_event = {
  KeyW: 'move_up',
  ArrowUp: 'move_up',
  KeyA: 'move_left',
  ArrowLeft: 'move_left',
  KeyS: 'move_down',
  ArrowDown: 'move_down',
  KeyD: 'move_right',
  ArrowRight: 'move_right',
};

window.addEventListener('keydown', (event) => {
  if (event.code in keydown_code_to_game_event) {
    socket.emit(keydown_code_to_game_event[event.code]);
  }
});
