import React from 'react';
import ReactDOM from 'react-dom';
import Apps from './start';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<Apps />, document.getElementById('root'));
serviceWorker.register();
