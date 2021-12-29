import { Container } from './ocd-kit/components/container';
import { Text } from './ocd-kit/components/text';
import { TestContainer } from './ocd-kit/components/testcontainer';
import { TestContainer2 } from './ocd-kit/components/testcontainer2';
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

const container4 = new TestContainer2({});

container4
  .on('mousedown', () => container4.css().push('backgroundColor', 'red'))
  .on('mouseout', () => container4.css().pop());

container1
  .on('mousedown', () => {
    console.log('mousedown');
    container1.width = Math.round(Math.random() * 500);
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

text.on('mouseover', () => (text.value = text.value + 'change!'));

container2.on('mousedown', () => container2.unmount()).add(text);

const main = document.getElementById('main');
container1.mount(main);
container2.mount(main);
container1.add(container3);
container4.mount(main);
