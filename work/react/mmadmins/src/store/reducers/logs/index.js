import {
    ARTICLE_TYPE,
    LOG_TYPE,
    LOG_STATUS,
    LOG_SOURCE,
    LOG_LIST
} from "../../constains/Logs";
import {REQUEST, SUCCESS, FAILURE,} from '../../constains/index'
import {combineReducers} from "redux";
import {log_type} from "../../actions";

const _ = window._;
const moment = window.moment;

// 文章分类
function article_type_list(state = [], action) {
    switch (action.type) {
        case ARTICLE_TYPE[SUCCESS]:
            return _.concat([{_id: "-1", name: "全部"}], action.payload);
            break;
        default:
            return state;
    }
}

// 日志类型
function log_type_list(state = [], action) {
    switch (action.type) {
        case LOG_TYPE[SUCCESS]:
            let ret = _.map(action.res.data, (v, k) => {
                return {
                    key: k,
                    value: v
                }
            });
            return _.concat([{key: "全部", value: "全部"}], ret);
            break;
        default:
            return state;
    }
}

// 日志状态
function log_status_list(state = [], action) {
    switch (action.type) {
        case LOG_STATUS[SUCCESS]:
            let ret = _.map(action.res.data, (v, k) => {
                return {
                    key: k,
                    value: v
                }
            });
            return _.concat([{key: "全部", value: "全部"}], ret);
            break;
        default:
            return state;
    }
}

// 日志来源
function log_source_list(state = [], action) {
    switch (action.type) {
        case LOG_SOURCE[SUCCESS]:
            let ret = _.map(action.res.data, (v, k) => {
                return {
                    key: k,
                    value: v
                }
            });
            return _.concat([{key: "全部", value: "全部"}], ret);
            break;
        default:
            return state;
    }
}

// 日志列表，上面所有到 kev value 变化都可以放到 selector 里面。
function log_list_obj(state = {data: [], count: 0}, action) {

    switch (action.type) {
        case LOG_LIST[SUCCESS]:
            return {...action.res};
            break;
        default:
            return state;
    }
}

export const logs = combineReducers({
    article_type_list,
    log_type_list,
    log_status_list,
    log_source_list,
    log_list_obj
});