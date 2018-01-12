/* eslint-disable no-constant-condition */

import {all, put, call, fork, take, select} from 'redux-saga/effects'
import axios from 'axios'
import * as actions from '../actions'

export function fetchUpNewsApi(payload) {
    var payloads = Object.assign({
        key: "腾讯",
        etitle: "stick",
        ctitle: "敏感",
        direction: 0,
        page: 1,
    }, payload);

    var objTypes = {
        "敏感": 1,
        "精选": 2,
        "最新": 3,
        "行业": 4,
    };
    // 默认第一次获取，参数要有默认值
    var type = objTypes[payloads.ctitle];

    return axios({
        method: 'get',
        url: 'api/report/dataList.ashx',
        params: {key: payloads.key, page: payloads.page, pagesize: 10, type: type},
    }).then(function (result) {

        return result.data.Data;

    }).catch(function (error) {
        return error;
    });
}

function* fetchUpNews(payload) {

    yield put(actions.getAllNews(payload.key));
    const result = yield call(fetchUpNewsApi, payload);
    yield put(actions.receiveAllNews(result));

}

export function* nextUpNews() {
    while (true) {
        const prePayload = yield select();
        yield take(actions.UP_REQUEST);
        const postPayload = yield select();
        if (prePayload.key !== postPayload.key) {
            yield fork(fetchUpNews, postPayload)
        }
    }
}

export function* startup() {
    yield fork(fetchUpNews, {key: "腾讯"});
}

export default function* root() {
    yield all([
        fork(startup),
        fork(nextUpNews),
    ])
}
