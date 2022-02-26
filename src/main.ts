import App from './editor/App.svelte';
import { Application } from './editor/application';

const app = new App({
  target: document.body,
  props: {},
});

new Application();

export default app;
