import { Container } from './arena/container';
import { BaseControl } from './arena/control';
import { randomRgb } from './arena/util';

const container1 = new Container({
  width: '100px',
  height: '20px',
  backgroundColor: 'blue',
});

const container2 = new Container({
  width: '200px',
  height: '20px',
  backgroundColor: 'red',
});

console.log(container1 instanceof BaseControl);

container1
  .on('mount', (element) => console.log('mount1', element))
  .on('unmount', () => console.log('unmount1'))
  .on('mousedown', (e) => {
    container1.width = `${Math.round(Math.random() * 500)}px`;
    container2.visible = !container2.visible;
    console.log(container2.visible);
  })
  .on('mouseover', () => (container1.backgroundColor = randomRgb()));

container2
  .on('mount', (element) => console.log('mount2', element))
  .on('unmount', () => console.log('unmount2'))
  .on('mousedown', (e) => container2.unmount());

container1.mount(document.getElementById('main'));
container2.mount(document.getElementById('main'));
