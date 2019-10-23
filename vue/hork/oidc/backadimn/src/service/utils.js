import validator from "validator";

export const objectAssign = (objects) => {
    return objects.reduce(function (r, o) {
        Object.keys(o || {}).forEach(function (k) {
            r[k] = o[k]
        });
        return r
    }, {});
};

export const parseJwt = (token) => {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    } catch (error) {
        return {}
    }
};

// get -> Get
export const firstLetterUppercase = (string) => {
    return string && string.length > 0 ? string.charAt(0).toUpperCase() + string.slice(1) : ''
};

// getUerInfo -> get_user_info
export const camelCaseToSnakeCase = (string) => {
    return string.split(/(?=[A-Z])/).join('_').toLowerCase();
};

export const vName = function (rule, value, callback) {

    if (value == null || value.length < 6 || !(/^[a-zA-Z_]{2}[a-zA-Z0-9_]+$/.test(value.trim()))) {
        callback(new Error("请输入字母开头字母数字下划线组成的名称，最少6个字符"))
    } else {
        callback()
    }
};
export const vQQ = function (rule, value, callback) {

    if (!/^[1-9]\d{4,11}$/.test(value.trim())) {
        callback(new Error("请输入正确QQ号"))
    } else {
        callback()
    }
};

export const vUrl = function (rule, value, callback) {

    if (value == null || value.length < 6) {
        callback(new Error("请输入正确服务器地址"))
    }

    if (!(/localhost/.test(value.trim()) || validator.isIP(value.trim()) || validator.isURL(value.trim()))) {
        callback(new Error("请输入正确服务器地址"))
    }

    callback()

};

export const trimS = (str) => {
    if (_.trim(str).length === 0) {
        return ""
    }
    return str.replace(/\s+\n*/g, " ").split(" ");
};

export const tIndex = (index, page, size) => {
    return index + (page - 1) * size + 1;
}
