import { Container } from './arena/container';
import { Text } from './arena/text';

const container = new Container({ width: 100, height: 20 });
const text = new Text({ text: 'abc' });
container.append(text);

container
  .on('mount', (element) => console.log('mount', element))
  .on('mousedown', (e) =>
    container.set('width', Math.round(Math.random() * 500))
  );

container.install(document.getElementById('main')!);
