// 2019-08-22 wsc 用户信息
import {
    getToken,
    setToken,
    getWxinfo,
    setWxinfo,
    getUserInfo,
    setUserInfo,
    getUserRole,
    setUserRole
} from "@/utils/auth";
import service from "@/utils/request";

// 登录用户信息
const user = {
    state: {
        // todo  || "EAD3D271DE80E70C5E43274DA8954558""A72255FDD01D6F485BA9229737CC8433" ||
        token: getToken(),
        wxinfo: getWxinfo(),
        userinfo: getUserInfo(),
        role: getUserRole()
    },

    mutations: {

        set_userrole: (state, role) => {
            state.role = role
        },
        set_userinfo: (state, userinfo) => {
            state.userinfo = userinfo
        },
        set_token: (state, token) => {
            //"A72255FDD01D6F485BA9229737CC8433" ||
            state.token = token
        },
    },

    actions: {
        // 登录二维码
        getQrcode({commit, state}) {
            return new Promise((resolve, reject) => {
                service({
                    url: 'User/GetQrcode',
                    method: 'get',
                    responseType: "text"
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 登录
        getUser({commit, state}) {
            return new Promise((resolve, reject) => {
                if (!_.isNil(state.token)) {
                    service({
                        url: 'User/SelfIndex?time=' + Date.now(),
                        method: 'get',
                    }).then(res => {
                        commit('set_userinfo', res.data);

                        setUserInfo(res.data);
                        resolve(res.data);

                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    reject("需要从微信登录")
                }
            })
        },        // 登录
        getUserRole({commit, state}) {
            return new Promise((resolve, reject) => {
                if (!_.isNil(state.token)) {
                    service({
                        url: 'User/Info',
                        method: 'get',
                    }).then(res => {
                        commit('set_userrole', res.data);

                        setUserRole(res.data);
                        resolve(res.data);

                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    reject("需要从微信登录")
                }
            })
        },
        // 登录
        getWx({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                service({
                    url: 'User/QrWxConnect',
                    method: 'get',
                    params: payload,
                }).then(res => {
                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })

            })
        }

    },

};

export default user;