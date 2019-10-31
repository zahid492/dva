import service from "./request";
import Api from "./api";

export const getData = ({url, data = {}}) => {
    return service({
        method: "get",
        url: url,
        params: data,
    }).then((res) => {
        if (res.code !== 200) {
            return ({err: res});
        }
        return ({res: res});
    }).catch((err) => {
        return ({err: err});
    });
};

export const setData = ({url, data = {}}) => {
    return service({
        method: "post",
        url: url,
        data: data,
    }).then((res) => {
        if (res.code !== 200) {
            return ({err: res});
        }
        return ({res: res});
    }).catch((err) => {
        return ({err: err});
    });
};