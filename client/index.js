const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const margin = 10;

ctx.fillStyle = 'red';
ctx.fillRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);
