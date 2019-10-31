import invariant from 'invariant';
import checkStore from "./checkStore";


const _ = window._;
const checkKey = key => invariant(
    _.isString(key) && !_.isEmpty(key),
    '(src/services...) injectSaga: Expected key to be a non empty string'
);

const checkDescriptor = descriptor => {
    const shape = {
        saga: _.isFunction,
    };
    invariant(
        _.conformsTo(descriptor, shape),
        '(src/services...) injectSage: Exccept a valid saga descriptor'
    )
};

export function injectSagaFactory(store, isValid) {
    return function injectSaga(key, descriptor = {}, args) {
        if (!isValid) checkStore(store);

        const {saga} = descriptor;
        checkKey(key);
        checkDescriptor(descriptor);

        let hasSaga = Reflect.has(store.injectedSagas, key);

        if (process.env.NODE_ENV != 'production') {
            const oldDescritptor = store.injectedSagas[key];
            if (hasSaga && oldDescritptor.saga !== saga) {
                // 取消任务开发环境
                oldDescritptor.task.cancel();
                hasSaga = false;
            }
        }

        if (!hasSaga) {
            store.injectedSagas[key] = {
                saga,
                // HOC run
                task: store.runSaga(saga, args)
            }
        }
    }
}

export function ejectSagaFactory(store, isValid) {
    return function ejectSaga(key) {
        if (!isValid) checkStore(store);

        checkKey(key);

        if (Reflect.has(store.injectedSagas, key)) {
            const descriptor = store.injectedSagas[key];
            descriptor.task.cancel();
            if (process.env.NODE_ENV === 'production') {
                store.injectedSagas[key] = 'done';
            }
        }
    }
}

export default function getInjectors(store) {
    checkStore(store);
    return {
        injectSaga: injectSagaFactory(store, true),
        ejectSaga: ejectSagaFactory(store, true)
    }
}

