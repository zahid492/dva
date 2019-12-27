import store2 from 'store2';
import * as queryString from "query-string";

// 模拟登录，废弃，可在 app.vue中添加登录信息
export function getInfo() {
    var qs = queryString.parse(location.search);

    var wxinfo = store2.get('wxinfo');
    console.log("qs:", qs, wxinfo)

    // let qws = {
    //     // openId: "ogHAKj-YFpyPgB5D42C2412nViF4",
    //     openId: "o-7NRwk-vUeOWBX42TyxNsgWnRAo",
    // };
    
    // setWxinfo(qws);
    // setToken("token", '56637EFDB6E1366848A2C0228372E39A');
    // 二维码---------------------------
    if (!_.isEmpty(qs)) {
        setWxinfo(qs);
        console.log("wxinfo:", qs)
    }
    // over---------------------------

    // else {
    //     // todo
    //     let qws = {
    //         openId: "ogHAKj-YFpyPgB5D42C2412nViF4",
    //     };
    //     setWxinfo(qws);
    // }
}


export function getWxinfo() {
    return store2.get("wxinfo")
}

export function setWxinfo(wxinfo) {
    return store2.set("wxinfo", wxinfo)
}

export function getToken() {
    return store2.get("token")
}

export function setToken(token) {
    return store2.set("token", token)
}

export function getUserInfo() {
    return store2.get("userInfo")
}

export function setUserInfo(info) {
    return store2.set("userInfo", info)
}

export function getUserRole() {
    return store2.get("userRole")
}

export function setUserRole(Role) {
    return store2.set("userRole", Role)
}



