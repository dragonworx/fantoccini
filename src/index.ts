import { Container } from './arena/components/container';
import { Text } from './arena/components/text';
import Color from 'color';

const container1 = new Container({
  width: 100,
  height: 50,
});

const container2 = new Container({
  width: 200,
  height: 50,
  backgroundColor: 'red',
});

const text = new Text({ text: 'Foobar' });

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

const main = document.getElementById('main');
container1.mount(main);
container2.mount(main);
text.mount(main);
