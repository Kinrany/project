const socket = io().connect();

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

function resize_canvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize_canvas);
resize_canvas();

const ctx = canvas.getContext('2d')!;

interface Point {
  x: number,
  y: number,
}

class Player {
  constructor(
    readonly id: number,
    public game_state: Point,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
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

const players = new Map<Player['id'], Player>();

function draw() {
  // background
  ctx.beginPath();
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // players
  players.forEach(player => player.draw(ctx));
}

const game_event_handlers = {
  players_moved(moved_players: Pick<Player, 'id' | 'game_state'>[]) {
    moved_players.forEach(({id, game_state}) => {
      const player = players.get(id);
      if (player) {
        player.game_state = game_state;
      }
    });
  },

  player_joined({id, game_state}: Pick<Player, 'id' | 'game_state'>) {
    players.set(id, new Player(id, game_state));
  },

  player_left(id: Player['id']) {
    players.delete(id);
  },
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
type KeydownCode = keyof typeof keydown_code_to_game_event;

window.addEventListener('keydown', (event) => {
  if (event.code in keydown_code_to_game_event) {
    socket.emit(keydown_code_to_game_event[event.code as KeydownCode]);
  }
});
