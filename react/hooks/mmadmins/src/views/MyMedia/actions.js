import {
    REQUEST, FAILURE, SUCCESS,
} from "../../store/constains/index";
import { ACCOUNT_LIST, PUBLISH_TYPE, PLATFORM} from './constant';

function action(type, params = {}) {
    return {type, ...params}
}

// 账号列表
export const account_list_act = {
    request: (payload) => action(ACCOUNT_LIST[REQUEST], {payload}),
    success: (payload, res) => action(ACCOUNT_LIST[SUCCESS], {payload, res}),
    failure: (payload, err) => action(ACCOUNT_LIST[FAILURE], {payload, err})
};

// 发布类型
export const publish_type_act = {
    request: (payload) => action(PUBLISH_TYPE[REQUEST], {payload}),
    success: (payload, res) => action(PUBLISH_TYPE[SUCCESS], {payload, res}),
    failure: (payload, err) => action(PUBLISH_TYPE[FAILURE], {payload, err})
};

// 平台
export const platform_act = {
    request: (payload) => action(PLATFORM[REQUEST], {payload}),
    success: (payload, res) => action(PLATFORM[SUCCESS], {payload, res}),
    failure: (payload, err) => action(PLATFORM[FAILURE], {payload, err})
};