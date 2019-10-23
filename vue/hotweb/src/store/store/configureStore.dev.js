import {createBrowserHistory} from 'history';
import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';
import createSagaMiddleware, {END} from 'redux-saga';
import {loadUser} from "redux-oidc";
import {routerMiddleware} from 'connected-react-router';
// rootReducer function
import rootReducer from '../reducers';
import userManager from "../../services/userManager";

// c2: user routerMiddleware(history) if you want to dispatch history actions. (push('./path'));
export const history = createBrowserHistory();

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware();
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    const composeEnhancers =
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

    const store = createStore(
        rootReducer(history),
        initialState,
        composeEnhancers(applyMiddleware(
            routerMiddleware(history),
            sagaMiddleware,
            createLogger(),
        )),
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            store.replaceReducer(rootReducer(history))
        })
    }
    // redux-oidc
    loadUser(store, userManager);

    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store
}



