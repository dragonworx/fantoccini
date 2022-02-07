import App from './app/App.svelte';
import { Application } from './app/application';
import './core/fileFormat';

const app = new App({
  target: document.body,
  props: {},
});

new Application();

export default app;
