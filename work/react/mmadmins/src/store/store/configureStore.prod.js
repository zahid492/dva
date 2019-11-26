import {createBrowserHistory} from "history";
import {createStore, applyMiddleware} from 'redux'
// import createSagaMiddleware, {END} from 'redux-saga'
import {loadUser} from "redux-oidc";
import {routerMiddleware} from "connected-react-router";
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers'
import userManager from "../../services/userManager";
export const history = createBrowserHistory();

const persistConfig = {
    key:'root',
    whitelist:['forms'],
    storage
};

export default function configureStore(initialState) {
    // const sagaMiddleware = createSagaMiddleware();

    const persistdReducer = persistReducer(persistConfig,rootReducer(history));

    const store = createStore(
        // rootReducer(history),
        persistdReducer,
        initialState,
        applyMiddleware(routerMiddleware(history),
            // sagaMiddleware
        )
    );

    const persistor = persistStore(store);

    loadUser(store, userManager);
    // store.runSaga = sagaMiddleware.run;
    // store.close = () => store.dispatch(END);

    return {store, persistor}
}

