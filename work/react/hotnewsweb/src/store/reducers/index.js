import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import {reducer as oidcReducer} from 'redux-oidc';

// c1: the key must be router.
const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    // rest of reducers
    oidc: oidcReducer,
});

export default rootReducer;
