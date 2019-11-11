import {getData} from '../../services/ajax';
import Api from "../../services/api";

export const get_platform = (params) => {
    return getData({
        url: Api.mymedia_platform_getlist,
        data: params
    });
};

export const get_publish_type = (params) => {
    return getData({
        url: Api.relation_publish_getlist,
        data: params
    });
};

export const get_account_list = (params) => {
    return getData({
        url: Api.mymedia_account_list,
        data: params
    });
};