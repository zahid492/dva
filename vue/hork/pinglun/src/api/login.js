import service from "@/utils/request";

// 登录
export function loginBy(data) {
    let ac = {
        account: data.account,
        passwordmd5: data.password
    };
    return service({
        url: '/users/login',
        method: 'post',
        data: ac
    });
}

// 登出
export function loginOut() {
    return service({
        url: '/users/logout',
        method: 'get',
    });
}
// 刷新登录信息
export function refreshLogin() {
    return service({
        url: '/users/refreshlogininfo',
        method: 'get',
    });
}
// 刷新信息
export function refreshUser() {
    return service({
        url: '/users/refresh',
        method: 'get',
    });
}

// 修改密码
export function resetPass(id) {
    return service({
        url: '/users/'+ id + '/resetpassword',
        method: 'post',
    });
}
// 修改密码
export function modifyPass(id, info) {
    return service({
        url: '/users/'+ id + '/updatepassword',
        method: 'post',
        data: info
    });
}