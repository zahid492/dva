import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware, {END} from 'redux-saga'
import rootReducer from '../reducers/vindex'
import rootSaga from '../sagas/vindex'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

store.runSaga = sagaMiddleware.run(rootSaga);
export default store;
