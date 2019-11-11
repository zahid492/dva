import {getData} from '../../../services/ajax';
import Api from "../../../services/api";
// normalizr

export const get_logs_status = () => {
    return getData({
        url: Api.logs_status,
    });
};

export const get_logs_source = () => {
    return getData({
        url: Api.logs_source,
    });
};

export const get_logs_type = () => {
    return getData({
        url: Api.logs_type,
    });
};

export const get_logs_list = (data) => {
    return getData({
        url: Api.logs_getlist,
        data: data.payload
    });
};