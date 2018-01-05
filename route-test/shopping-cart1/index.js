import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import {Provider} from 'react-redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk'
import reducer from './reducers';
import {getAllProducts} from "./actions/index";
import App from "./routes/index";
import registerServiceWorker from './registerServiceWorker';

const middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(...middleware)
));

store.dispatch(getAllProducts());

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
