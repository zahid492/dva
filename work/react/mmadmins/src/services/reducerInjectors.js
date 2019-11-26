import invariant from 'invariant';
import checkStore from "./checkStore";
import rootReducer from "../store/reducers";
import {createBrowserHistory} from "history";

const history = createBrowserHistory();
const _ = window._;

export function injectReducerFactory(store, isValid) {
    return function injectReducer(key, reducer) {
        if(!isValid) checkStore(store);

        invariant(
            _.isString(key) && !_.isEmpty(key) && _.isFunction(reducer),
            '(src/services...) injectReducer: Excepted reducer to be a reducer function'
        );

        if(Reflect.has(store.injectedReducers, key) 
            && store.injectedReducers[key] === reducer){
            return;
        }

        store.injectedReducers[key] = reducer;
        store.replaceReducer(rootReducer(history, store.injectedReducers));
    }
}

export default function getInjectors(store) {
    checkStore(store);
    return {
        injectReducer: injectReducerFactory(store, true)
    }
}
