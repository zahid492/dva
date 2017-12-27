import React from 'react';
import ReactDOM from 'react-dom';

import Rou from './routes/route-test.jsx';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Rou />, document.getElementById('root'));
registerServiceWorker();
