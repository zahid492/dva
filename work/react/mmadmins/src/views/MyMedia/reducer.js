import {combineReducers} from "redux";

import {REQUEST, SUCCESS, FAILURE} from "../../store/constains/index";
import { ACCOUNT_LIST, PUBLISH_TYPE, PLATFORM} from './constant';
import produce from 'immer';


const _ = window._;

function account_list_obj(state = {data:[], count:0}, action) {

    switch (action.type) {
        case ACCOUNT_LIST[SUCCESS]:
            return {...action.res};
            break;
        default:
            return state;
    }
}

// 发布平台
function platform_list(state = [], action) {
    switch (action.type) {
        case PLATFORM[SUCCESS]:
            return _.concat([{_id: "-1", name: "全部"}], action.res.data);
            break;
        default:
            return state;
    }
}

// 发布类型
function publish_type_list(state = [], action) {
    switch (action.type) {
        case PUBLISH_TYPE[SUCCESS]:
            return _.concat([{_id: "-1", name: "全部"}], action.res.data);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    publish_type_list,
    platform_list,
    account_list_obj
})