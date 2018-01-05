import {createStore, applyMiddleware, compose } from 'redux'
import {createLogger} from 'redux-logger'
import createSagaMiddleware, {END} from 'redux-saga'
import sagaMonitor from '../sagaMonitor'
import rootReducer from '../reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware({sagaMonitor});

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(
            sagaMiddleware,
            createLogger()
        ))

    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer)
        })
    }
    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);
    return store
}
