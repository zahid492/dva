import * as ActionTypes from '../actions';

export default function upNews(state = {}, action) {
    switch (action.type) {
        case ActionTypes.UP_SUCCESS:
            var obj = {
                ...state,
                products:{...action.products}
            };
            console.log(obj)
            return obj;
        default:
            return state
    }
}
