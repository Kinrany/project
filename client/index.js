const socket = io().connect();

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

// moving brick
let point = {x: 50, y: 50};
const brick_size = {
  width: 30,
  height: 30,
};

function draw() {
  // background
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // brick
  ctx.fillStyle = 'red';
  ctx.fillRect(
    point.x - brick_size.width/2,
    point.y - brick_size.height/2,
    brick_size.width,
    brick_size.height,
  );
}

draw();

socket.on('message', (event) => {
  switch (event.tag) {
    case 'brick_moved':
      point = event.value;
      break;
  }
  draw();
});
