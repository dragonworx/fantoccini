export const foo = 123;

const container = document.createElement('div');
container.style.cssText = `
position: absolute;
left: 0;
top: 0;
right: 0;
bottom: 0;
transform: translateZ(0);
`;
document.body.appendChild(container);

const totalItems = 2000;
const viewSize = 600;

const itemsPerRow = Math.round(Math.sqrt(totalItems));
const itemSize = viewSize / itemsPerRow;

const items = [];

let c = 0;
let x = 0;
let y = 0;

while (c < totalItems) {
  x = 0;
  for (let i = 0; i < itemsPerRow; i++) {
    const item = document.createElement('div');
    item.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${itemSize}px;
    height: ${itemSize}px;
    outline: 1px solid white;
    transform: translateZ(0);
    `;
    items.push(item);
    container.appendChild(item);
    x += itemSize;
    c++;
  }
  y += itemSize;
}

document.onmousemove = e => {
  const { clientX, clientY } = e;
  container.style.left = `${clientX}px`;
  container.style.top = `${clientY}px`;
};
