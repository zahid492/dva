import {all, take, put, fork, call, select} from 'redux-saga/effects';

import {get_logs_status, get_logs_source, get_logs_type, get_logs_list} from "../api/logs/index";
import {LOG_LIST, LOG_STATUS, LOG_SOURCE, LOG_TYPE} from "../constains/Logs";
import {log_source_sel, log_status_sel, log_list_sel, log_type_sel} from "../reducers/logs/forms_slector";
import {log_list, log_source, log_type, log_status} from "../actions";

const _ = window._;

function* fetchEt(act, apiFn, payload) {
    const {res, err} = yield call(apiFn, payload);

    if (res) {
        yield put(act.success(payload, res));
    } else {
        yield put(act.failure(payload, err))
    }
}

function* getLogStatus() {
    while (true) {
        const payload = yield take(LOG_STATUS.REQUEST);
        const status = yield select(log_status_sel);

        if (status.length === 0) {
            yield call(fetchEt.bind(null, log_status, get_logs_status, payload));
        }
    }
}

function* getLogTypes() {
    while (true) {
        const payload = yield take(LOG_TYPE.REQUEST);
        const status = yield select(log_type_sel);

        if (status.length === 0) {
            yield call(fetchEt.bind(null, log_type, get_logs_type, payload));
        }
    }
}

function* getLogSource() {
    while (true) {
        const payload = yield take(LOG_SOURCE.REQUEST);
        const status = yield select(log_source_sel);

        if (status.length === 0) {
            yield call(fetchEt.bind(null, log_source, get_logs_source, payload));
        }
    }
}

function* getLogList() {
    while (true) {
        const payload = yield take(LOG_LIST.REQUEST);

        yield call(fetchEt.bind(null, log_list, get_logs_list, payload));

    }
}


export default function* root() {
    yield all([
        fork(getLogStatus),
        fork(getLogTypes),
        fork(getLogSource),
        fork(getLogList),
    ])
}
