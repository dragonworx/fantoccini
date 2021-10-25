import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { App } from './__tests__/functional/core';
import { App } from './__tests__/functional/ui';
// import { App } from './app';
import { disableEmotionWarnings } from './util';

disableEmotionWarnings();

ReactDOM.render(<App />, document.getElementById('main'));
