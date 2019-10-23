import {loginByUsername, loginOut, getUserInfo} from "@/api/login";
import {getAccounts} from "@/api/account";
import {
    getToken,
    setToken,
    getAccount,
    setAccount,
    removeToken,
    getName,
    setName,
    getRole,
    setRole,
    getId,
    setId
} from "@/utils/auth";

// 登录用户信息
const user = {
    state: {
        id: getId(),
        account: getAccount(),
        name: getName(),
        token: getToken(),
        roleName: getRole(),
        statusName: ""
    },

    mutations: {
        SET_ID: (state, id) => {
            state.id = id
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_STATUS: (state, statusName) => {
            state.statusName = statusName
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_ACCOUNT: (state, account) => {
            state.account = account
        },
        SET_ROLE: (state, roleName) => {
            state.roleName = roleName
        }
    },

    actions: {
        // 登录
        LoginByUsername({commit}, userInfo) {

            return new Promise((resolve, reject) => {
                loginByUsername(userInfo).then(res => {
                    commit('SET_TOKEN', res.data.token);
                    commit('SET_ID', res.data.id);
                    commit('SET_ACCOUNT', userInfo.account);
                    setToken(res.data.token);
                    setAccount(userInfo.account);
                    setId(res.data.id);

                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })
            })
        },

        GetUserInfo({commit}) {
            return new Promise((resolve, reject) => {

                getUserInfo().then(res => {
                    let data = res.data;
                    commit('SET_NAME', data.name);
                    commit('SET_ROLE', data.roleName);

                    setName(data.name);
                    setRole(data.roleName);

                    resolve(data)
                }).catch(err => {
                    reject(err)
                })

            })
        },

        LoginOut({commit}) {
            return new Promise((resolve, reject) => {

                loginOut().then(res => {
                    commit('SET_NAME', "");
                    commit('SET_ROLE', "");

                    setName("");
                    setRole("");
                    removeToken();
                    resolve()
                }).catch(err => {
                    setName("");
                    setRole("");
                    removeToken();
                    reject(err)
                })

            })
        }


    }

};

export default user;