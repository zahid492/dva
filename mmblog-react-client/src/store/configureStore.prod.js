import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware, {END} from 'redux-saga'
import rootReducer from '../reducers'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

store.runSaga = sagaMiddleware.run(rootSaga);
export default store;
