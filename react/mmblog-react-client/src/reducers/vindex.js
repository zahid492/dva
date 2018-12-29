import * as ActionTypes from '../actions/vindex'
import {combineReducers} from 'redux'

// Updates an entity cache in response to any action with response.entities.
function posts(state = [], action) {
    if (action.response) {
        return [...action.response.posts]
    }

    return state
}

function total(state = 0, action) {
    if (action.response) {
        return action.response.total
    }

    return state
}
function page(state = 1, action) {
    if (action.response) {
        return action.response.page
    }

    return state
}
function pageSize(state = 2, action) {
    if (action.response) {
        return action.response.pageSize
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
    total,
    page,
    pageSize,
    posts,
    errorMessage,
    router
});

export default rootReducer
