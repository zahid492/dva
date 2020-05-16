// import "core-js"
import React from 'react';
import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';

import './scss/main.scss';

import App from './views/App';

loadableReady(() => {
    const root = document.getElementById('app');
    hydrate(<App />, root);
});
