/* eslint-disable no-constant-condition */
import {take, put, call, fork, select, all} from 'redux-saga/effects'
import article from '../api/article'
import * as actions from '../actions/vindex'
import {getPosts} from '../reducers/vselectors'

const {posts} = actions;

function* fetchEntity(entity, apiFn, opt) {
    // 发送请求 action
    yield put(entity.request());
    const {response, error} = yield call(apiFn, opt.tag, opt.page, opt.limit);
    console.log(response)
    if (response)
    // 成功 action
        yield put(entity.success(response));
    else
    // 失败 action
        yield put(entity.failure(error))
}

// yeah! we can also bind Generators 绑定剩余参数传递
export const fetchPosts = fetchEntity.bind(null, posts, article.getAllPublishArticles);

// load user unless it is cached
function* loadPosts() {
    // 选择操作参数， 调用选择器
    const arg = {
        tag: '',
        page: 1,
        limit: 5,
    };

    // 操作条件判断

    // 进行操作
    yield call(fetchPosts, arg)

}

/******************************* WATCHERS *************************************/
function* watchLoadPostsPage() {
    // while (true) {
    // }
    yield fork(loadPosts)
}

export default function* root() {
    yield all([
        fork(watchLoadPostsPage),
    ])
}
