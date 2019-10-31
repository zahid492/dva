import invariant from 'invariant';
const _ = window._;
export default function checkStore(store) {
    const shape = {
        dispatch: _.isFunction,
        subscribe: _.isFunction,
        getState: _.isFunction,
        replaceReducer: _.isFunction,
        runSaga: _.isFunction,
        injectedReducers: _.isObject,
        injectedSagas: _.isObject,
    };
    invariant(
        _.conformsTo(store, shape),
        '(src/services...) injectors: Expected a valid redux store',
    );
}