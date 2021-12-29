import { Container } from './ocd-kit/components/container';
import { Text } from './ocd-kit/components/text';
import { TestContainer } from './ocd-kit/components/test';
import Color from 'color';

const container1 = new Container({
  tag: 'container1',
  width: 100,
  height: 200,
});

const container2 = new Container({
  tag: 'container2',
  width: 200,
  height: 50,
  backgroundColor: 'red',
});

const text = new Text({ tag: 'text', value: 'Foobar' });

const container3 = new TestContainer({
  tag: 'container3',
  width: 50,
  height: 50,
  backgroundColor: 'pink',
});

container1
  .on('mousedown', () => {
    console.log('mousedown');
    container1.set('width', `${Math.round(Math.random() * 500)}px`);
    if (container2.isMounted) {
      container2.set('visible', !container2.get('visible'));
    } else {
      console.log('abort');
    }
  })
  .on('mouseover', () =>
    container2.set(
      'backgroundColor',
      Color(container2.get('backgroundColor')).darken(0.1).hex()
    )
  );

text.on('mouseover', () => text.set('value', text.get('value') + 'change!'));

container2.on('mousedown', () => container2.unmount()).add(text);

const main = document.getElementById('main');
container1.mount(main);
container2.mount(main);
container1.add(container3);
