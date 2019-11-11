import {put, takeLatest, call, take, select} from 'redux-saga/effects';

import {
    REQUEST, FAILURE, SUCCESS,
} from "../../store/constains/index";
import { ACCOUNT_LIST, PUBLISH_TYPE, PLATFORM} from './constant';
import {get_platform, get_publish_type, get_account_list} from "./api";
import {publish_type_act, platform_act, account_list_act} from "./actions";
import {publish_type_sel, platform_list_sel, account_list_sel} from "./selector";

function* fetchEt(act, apiFn, payload) {
    const {res, err} = yield call(apiFn, payload);

    if (res) {
        yield put(act.success(payload, res));
    } else {
        yield put(act.failure(payload, err))
    }
}

function* account(action) {
    const payload = action.payload;

    yield call(fetchEt.bind(null, account_list_act, get_account_list, payload));
}

// 账号模块如果没有路由加载，那么 platform publishType 等这个 saga就不会执行，
// 那么如果其他模块要用 platform 就会没数据，发请求也没有对应到 saga 执行。
function* platform(action) {
    const payload = action.payload;
    yield call(fetchEt.bind(null, platform_act, get_platform, payload));
}

function* publishType(action) {
    const payload = action.payload;
    yield call(fetchEt.bind(null, publish_type_act, get_publish_type, payload));
}

export default function* myMediaAccounts() {
    yield takeLatest([ACCOUNT_LIST[REQUEST]], account);
    yield takeLatest([PUBLISH_TYPE[REQUEST]], publishType);
    yield takeLatest([PLATFORM[REQUEST]], platform);
}