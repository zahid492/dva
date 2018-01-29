import * as ActionTypes from '../actions/vindex'
import _ from 'lodash'
import {combineReducers} from 'redux'

// Updates an entity cache in response to any action with response.entities.
function posts(state = {posts: []}, action) {
    if (action.response && action.response.posts) {
        return _.merge({}, state, action.response.posts)
    }

    return state
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
    const {type, error} = action;

    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
        return null
    } else if (error) {
        return action.error
    }

    return state
}

// 默认初始化的 state
function router(state = {
    pathname: '/',
    // tag:"", page:1, pageSize: 5
}, action) {
    switch (action.type) {
        default:
            return state
    }
}

const rootReducer = combineReducers({
    posts,
    errorMessage,
    router
});

export default rootReducer
