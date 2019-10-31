import * as ActionTypes from "../actions";
import _ from "lodash";
import paginate from "./paginate";
import { combineReducers } from "redux";

// Updates an entity cache in response to any action with response.entities.
function entities(state = { users: {}, repos: {} }, action) {
    if (action.response && action.response.entities) {
        return _.merge({}, state, action.response.entities);
    }

    return state;
}


// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
    const { type, error } = action;

    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
        return null;
    } else if (error) {
        return action.error;
    }

    return state;
}

// Updates the pagination data for different actions.
const pagination = combineReducers({
    // 该用户给那些项目加了 star
    starredByUser: paginate({
        mapActionToKey: action => action.login,
        types: [
            ActionTypes.STARRED.REQUEST,
            ActionTypes.STARRED.SUCCESS,
            ActionTypes.STARRED.FAILURE
        ]
    }),
    // 仓库有谁给了 star
    stargazersByRepo: paginate({
        mapActionToKey: action => action.fullName,
        types: [
            ActionTypes.STARGAZERS.REQUEST,
            ActionTypes.STARGAZERS.SUCCESS,
            ActionTypes.STARGAZERS.FAILURE
        ]
    })
});

function router(state = { pathname: "/" }, action) {
    switch (action.type) {
        case ActionTypes.UPDATE_ROUTER_STATE:
            return action.state;

        default:
            return state;
    }
}

const rootReducer = combineReducers({
    entities,
    pagination,
    errorMessage,
    router
});

export default rootReducer;