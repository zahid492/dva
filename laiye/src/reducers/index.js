import * as ActionTypes from '../actions';

export default function upNews(state = {}, action) {
    switch (action.type) {
        case ActionTypes.UP_REQUEST:
            return {...state, key: action.key};
        case ActionTypes.UP_SUCCESS:
            return {
                ...state,
                products:[...action.products]
            };

        default:
            return state
    }
}
