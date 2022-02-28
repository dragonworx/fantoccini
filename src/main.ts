import Editor from './editor/Editor.svelte';
import { Application } from './editor/application';

const app = new Editor({
  target: document.body,
  props: {},
});

new Application();

export default app;
