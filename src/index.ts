import { Container } from './arena/container';
import Color from 'color';
import { randomRgb } from './arena/util';

const container1 = new Container({
  width: 100,
  height: 20,
  backgroundColor: 'blue',
});

const container2 = new Container({
  width: 200,
  height: 20,
  backgroundColor: 'red',
});

container1
  .on('mount', () => console.log('mount1'))
  .on('unmount', () => console.log('unmount1'))
  .on('mousedown', () => {
    container1.width = `${Math.round(Math.random() * 500)}px`;
    container2.visible = !container2.visible;
  })
  .on(
    'mouseover',
    () =>
      (container2.backgroundColor = Color(container2.backgroundColor)
        .darken(0.1)
        .hex())
  );

container2
  .on('mount', () => console.log('mount2'))
  .on('unmount', () => console.log('unmount2'))
  .on('mousedown', () => container2.unmount());

container1.mount(document.getElementById('main'));
container2.mount(document.getElementById('main'));
