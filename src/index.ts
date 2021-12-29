import { Container } from './ocd-kit/components/container';
import { Text } from './ocd-kit/components/text';
import { TestContainer } from './ocd-kit/components/test';
import Color from 'color';

const container1 = new Container({
  width: 100,
});

const container2 = new Container({
  width: 200,
  height: 50,
  backgroundColor: 'red',
});

const text = new Text({ value: 'Foobar' });

const container3 = new TestContainer({
  width: 50,
  height: 50,
  backgroundColor: 'pink',
});

container1
  .on('mousedown', () => {
    console.log('mousedown');
    container1.width = `${Math.round(Math.random() * 500)}px`;
    if (container2.isMounted) {
      container2.visible = !container2.visible;
    } else {
      console.log('abort');
    }
  })
  .on(
    'mouseover',
    () =>
      (container2.backgroundColor = Color(container2.backgroundColor)
        .darken(0.1)
        .hex())
  );

text.on('mouseover', () => (text.value += 'change!'));

container2.on('mousedown', () => container2.unmount()).add(text);

const main = document.getElementById('main');
container1.mount(main);
container2.mount(main);
container1.add(container3);
