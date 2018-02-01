/* eslint-disable no-constant-condition */
import {take, put, call, fork, select, all} from 'redux-saga/effects'
import article from '../api/article'
import * as actions from '../actions/vindex'
import {getPosts} from '../reducers/vselectors'

const {posts} = actions;

function* fetchEntity(entity, apiFn, opt) {
    // 发送请求 action
    yield put(entity.request());
    const response = yield call(apiFn, opt.tag, opt.page, opt.limit);

    if (response)
    // 成功 action
        yield put(entity.success({
            posts: response.articleArr,
            total: response.aCount,
            page: opt.page,
            pageSize: opt.limit
        }));
    else
    // 失败 action
        yield put(entity.failure())
}

// yeah! we can also bind Generators 绑定剩余参数传递
export const fetchPosts = fetchEntity.bind(null, posts, article.getAllArticles);

// load user unless it is cached
function* loadPosts(page, tag, limit) {
    // 选择操作参数， 调用选择器
    const post = yield select(getPosts);
    if(post.page != page || post.tag != tag || post.limit != limit){
        yield call(fetchPosts, page, tag, limit)
    }

}

/******************************* WATCHERS *************************************/
function* watchLoadPostsPage() {
    while (true) {
        const {page, tag, limit} = yield take(actions.LOAD_POST);
        yield fork(loadPosts, page, tag, limit)
    }
}

export default function* root() {
    yield all([
        fork(watchLoadPostsPage),
    ])
}
