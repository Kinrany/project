const socket = io().connect();

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
   *
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

socket.on('message', (event) => {
  switch (event.tag) {
    case 'players_moved': {
      /** @type {Pick<Player, 'id' | 'game_state'>[]} */
      const moved_players = event.value;
      moved_players
        .filter(({id}) => players.has(id))
        .forEach(({id, game_state}) => {
          players.get(id).game_state = game_state;
        });
    }
    break;

    case 'player_joined': {
      const {id, game_state} = event.value;
      players.set(id, new Player(id, game_state));
    }
    break;

    case 'player_left': {
      const id = event.value;
      players.delete(id);
    }
    break;

    default: {
      console.log('Unknown event:', event);
    }
  }
});

function scheduleDraw() {
  requestAnimationFrame(() => {
    draw();
    scheduleDraw();
  });
}

draw();
scheduleDraw();
