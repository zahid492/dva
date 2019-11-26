import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import {reducer as oidcReducer} from 'redux-oidc';
import {logs} from "./logs/index";


const rootReducer = (history, injectedReducers= {}) => combineReducers({
    router: connectRouter(history),
    oidc: oidcReducer,
    logs,
    ...injectedReducers
});

export default rootReducer;
