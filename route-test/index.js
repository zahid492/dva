import 'babel-polyfill'
import React from 'react'
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {renderRoutes} from 'react-router-config';
import {BrowserRouter as Router} from 'react-router-dom';
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import routes from './routes'

// import createHistory from 'history/createBrowserHistory';
// const history = createHistory();

const store = configureStore(window.__INITIAL_STATE__);
store.runSaga(rootSaga);

ReactDOM.hydrate(
    <Provider store={store}>
        <Router>
                {renderRoutes(routes)}
        </Router>
    </Provider>,
    document.getElementById('root')
);
