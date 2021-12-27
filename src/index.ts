import { Container } from './arena/container';

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

container1
  .on('mount', (element) => console.log('mount1', element))
  .on('unmount', () => console.log('unmount1'))
  .on(
    'mousedown',
    (e) => container1.unmount()
    // .set('width', `${Math.round(Math.random() * 500)}px`)
    // .set('backgroundColor', 'red')
  );

container2
  .on('mount', (element) => console.log('mount2', element))
  .on('unmount', () => console.log('unmount2'))
  .on(
    'mousedown',
    (e) => container2.unmount()
    // .set('width', `${Math.round(Math.random() * 500)}px`)
    // .set('backgroundColor', 'red')
  );

container1.mount(document.getElementById('main'));
container2.mount(document.getElementById('main'));
