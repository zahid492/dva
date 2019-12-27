import store2 from 'store2';
import * as queryString from "query-string";

export function getInfo() {
    var qs = queryString.parse(location.search);

    var wxinfo = store2.get('wxinfo');
//    指定openId
    // let qws = {
    //     // openId: "orQY2t3j_cVm9whElS1TETcfFvMc",
    //     openId: "o-7NRwk-vUeOWBX42TyxNsgWnRAo",
    // };
    // setWxinfo(qws);

    // console.log(qs)
    // 二维码--------------------------------------------------
    if (!_.isEmpty(qs)) {
        setWxinfo(qs);
        console.log("wxinfo:", qs)
        // } else {
            // let qws = {
                //     openId: "orQY2t3j_cVm9whElS1TETcfFvMc",
                // };
                //
                // setWxinfo(qws);
            }
    // --------------------------------------------------
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


