import service from "@/utils/request";

// 登录
export function loginByUsername(data) {
    let ac = {
        account: data.account,
        password: data.password
    };
    return service({
        url: '/User/Login',
        method: 'post',
        data: ac
    });
}

// 当前用户信息
export function getUserInfo() {
    return service({
        url: '/User/Info',
        method: 'get',
    });
}

// 登出
export function loginOut() {
    return service({
        url: '/User/LoginOut',
        method: 'get',
    });
}