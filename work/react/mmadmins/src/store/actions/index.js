import {
    ARTICLE_TYPE,
    LOG_TYPE,
    LOG_STATUS,
    LOG_SOURCE,
    LOG_LIST,
    LOG_FORMS
} from "../constains/Logs";
import {REQUEST, SUCCESS, FAILURE,} from '../constains/index';


function action(type, params = {}) {
    return {type, ...params}
}

// 文章类型
export const article_type = {
    request: (payload) => action(ARTICLE_TYPE[REQUEST], {payload}),
    success: (payload, res) => action(ARTICLE_TYPE[SUCCESS], {payload, res}),
    failure: (payload, err) => action(ARTICLE_TYPE[FAILURE], {payload, err})
};

// 日志类型
export const log_type = {
    request: (payload) => action(LOG_TYPE[REQUEST], {payload}),
    success: (payload, res) => action(LOG_TYPE[SUCCESS], {payload, res}),
    failure: (payload, err) => action(LOG_TYPE[FAILURE], {payload, err})
};

// 日志状态
export const log_status = {
    request: (payload) => action(LOG_STATUS[REQUEST], {payload}),
    success: (payload, res) => action(LOG_STATUS[SUCCESS], {payload, res}),
    failure: (payload, err) => action(LOG_STATUS[FAILURE], {payload, err})
};

// 日志来源
export const log_source = {
    request: (payload) => action(LOG_SOURCE[REQUEST], {payload}),
    success: (payload, res) => action(LOG_SOURCE[SUCCESS], {payload, res}),
    failure: (payload, err) => action(LOG_SOURCE[FAILURE], {payload, err})
};

// 日志列表
export const log_list = {
    request: (payload) => action(LOG_LIST[REQUEST], {payload}),
    success: (payload, res) => action(LOG_LIST[SUCCESS], {payload, res}),
    failure: (payload, err) => action(LOG_LIST[FAILURE], {payload, err})
};



