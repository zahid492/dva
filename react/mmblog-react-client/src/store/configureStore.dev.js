import {createStore, applyMiddleware, compose} from 'redux'
import {createLogger} from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers/vindex'
import rootSaga from '../sagas/vindex'


const sagaMiddleware = createSagaMiddleware();
const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

const store = createStore(
    rootReducer,
    // initState,
    composeEnhancers(applyMiddleware(
        sagaMiddleware,
        createLogger()
    )),
);
// if (module.hot) {
//     // Enable Webpack hot module replacement for reducers
//     module.hot.accept('../reducers', () => {
//         const nextRootReducer = require('../reducers').default;
//         store.replaceReducer(nextRootReducer)
//     })
// }

sagaMiddleware.run(rootSaga);

export default store;