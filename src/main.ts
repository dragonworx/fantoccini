import Editor from './editor/Editor.svelte';
import { Application } from './editor/application';

const app = new Editor({
  target: document.body,
  props: {},
});

new Application();

export default app;

import Timecode from 'timecode-boss';
const tc = new Timecode({ seconds: 2 }, 24);
console.log(tc.toString());
