export const foo = 123;

const totalItems = 10000;
const viewSize = 600;
const itemsPerRow = Math.round(Math.sqrt(totalItems));
const itemSize = viewSize / itemsPerRow;
let originX = 0;
let originY = 0;

const canvas = document.createElement('canvas');
canvas.width = viewSize;
canvas.height = viewSize;
canvas.style.cssText = `
position: absolute;
left: 0;
top: 0;
right: 0;
bottom: 0;
transform: translateZ(0);
`;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const items = [];

let c = 0;
let x = 0;
let y = 0;

while (c < totalItems) {
  x = 0;
  for (let i = 0; i < itemsPerRow; i++) {
    const item = {
      x,
      y,
    };
    items.push(item);
    x += itemSize;
    c++;
  }
  y += itemSize;
}

const render = () => {
  ctx.resetTransform();
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, viewSize, viewSize);
  ctx.strokeStyle = 'white';
  ctx.translate(originX, originY);
  for (let i = 0; i < items.length; i++) {
    const { x, y } = items[i];
    ctx.strokeRect(x, y, itemSize, itemSize);
  }
  requestAnimationFrame(render);
};

document.onmousemove = e => {
  const { clientX, clientY } = e;
  (originX = clientX), (originY = clientY);
};

render();
