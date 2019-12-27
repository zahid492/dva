// 2019-03-07 wsc 用户信息
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
        // todo  || "EAD3D271DE80E70C5E43274DA8954558"
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
            state.token = token
        },
        set_wxinfo: (state, info) => {
            state.wxinfo = info
        },
    },

    actions: {
        // 登录
        getUser({commit, state}) {
            return new Promise((resolve, reject) => {
                if (!_.isNil(state.token)) {
                    service({
                        url: 'User/SelfIndex',
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
        },
        getUserRole({commit, state}) {
            return new Promise((resolve, reject) => {

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

            })
        },
        // 登录
        postUser({commit, state}) {
            return new Promise((resolve, reject) => {
                console.log("postUser:", state)
                service({
                    url: 'User/WeiXinInfo',
                    method: 'post',
                    data: state.wxinfo,
                }).then(res => {
                    setToken(res.data.token);
                    commit('set_token', res.data.token);
                    resolve(res.data);

                }).catch(err => {
                    console.error(err);
                    reject(err)
                })

            })
        }

    },

};

export default user;