const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const CLEAR = 'CLEAR';
const UPDATE = 'UPDATE';
const VIEW = 'VIEW';
// 全没用
function createRequestTypes(base) {
    return [REQUEST, SUCCESS, FAILURE, CLEAR, UPDATE, VIEW].reduce((acc, type) => {
        acc[type] = `${base}_${type}`;
        return acc
    }, {})
}

function action(type, payload = {}) {
    return {type, ...payload}
}

