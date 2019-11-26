import {createBrowserHistory} from "history";
import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware, {END} from 'redux-saga'
import {loadUser} from "redux-oidc";
import {routerMiddleware} from "connected-react-router";

import rootReducer from '../reducers'
import userManager from "../../services/userManager";
export const history = createBrowserHistory();

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer(history),
        initialState,
        applyMiddleware(routerMiddleware(history), sagaMiddleware)
    );

    loadUser(store, userManager);
    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store;
}

