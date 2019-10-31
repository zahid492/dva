import {createBrowserHistory} from 'history';
import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';
import createSagaMiddleware, {END} from 'redux-saga';
import {loadUser} from "redux-oidc";
import {routerMiddleware} from 'connected-react-router';
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage';
// rootReducer function
import rootReducer from '../reducers';
import userManager from "../../services/userManager";

// c2: user routerMiddleware(history) if you want to dispatch history actions. (push('./path'));
export const history = createBrowserHistory();

const persistConfig = {
    key: 'root',
    whitelist: ['forms'],
    storage
};

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware();
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    const composeEnhancers =
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

    const persistdReducer = persistReducer(persistConfig, rootReducer(history));

    const store = createStore(
        // rootReducer(history),
        persistdReducer,
        initialState,
        composeEnhancers(applyMiddleware(
            routerMiddleware(history),
            sagaMiddleware,
            createLogger(),
        )),
    );

    const persistor = persistStore(store);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            store.replaceReducer(rootReducer(history))
        })
    }
    // redux-oidc
    loadUser(store, userManager);

    store.runSaga = sagaMiddleware.run;
    store.injectedReducers = {};
    store.injectedSagas = {};
    store.close = () => store.dispatch(END);

    return {store, persistor}
}



