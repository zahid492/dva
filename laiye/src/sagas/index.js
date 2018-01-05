/* eslint-disable no-constant-condition */

import {all, put, call, fork, takeEvery} from 'redux-saga/effects'
import axios from 'axios'
import * as actions from '../actions'


export function fetchUpNewsApi(payload) {

    var objTypes = {
        "敏感": 1,
        "精选": 2,
        "最新": 3,
        "行业": 4,
    };

    var type = objTypes[payload.ctitle];

    return axios({
        method: 'get',
        url: 'api/report/dataList.ashx',
        params: {key: payload.subject, page: payload.page, pagesize: 10, type: type},
    }).then(function (result) {

        return result.data.Data;

    }).catch(function (error) {
        return error;
    });
}

function* fetchUpNews(payload) {

    const result = yield call(fetchUpNewsApi, payload);

    yield put(actions.receiveAllNews(result));

}

function* watchUpNews() {
    yield takeEvery(actions.UP_REQUEST, fetchUpNews)
}

export default function* root() {
    yield all([
        fork(fetchUpNews),
        fork(watchUpNews)
    ])
}
