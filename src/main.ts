import App from './app/App.svelte';
import { Application } from './app/application';

const app = new App({
  target: document.body,
  props: {},
});

new Application();

export default app;

import yaml from 'js-yaml';
// @ts-ignore
import fileFormat from './format.yaml';

const format = yaml.load(fileFormat);
console.log(format);
