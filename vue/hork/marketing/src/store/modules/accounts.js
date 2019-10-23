import {getAccounts, addAccount, editAccount, roles, resetPass} from "@/api/account";
import {toDateTime} from "@/utils/index";

const accounts = {
    state: {
        list: [],
        page: 1,
        size: 10,
        count: 0,
        roles: {}
    },

    mutations: {
        SET_ACCOUNT: (state, accountInfo) => {
            let ai = _.findIndex(state, {account: accountInfo.account});
            if (ai !== -1) state[ai] = accountInfo;
        },
        SET_ACCOUNTS: (state, accounts) => {
            state.list = accounts;
        },

        SET_PAGE: (state, page) => {
            state.page = page;
        },

        SET_COUNT: (state, count) => {
            state.count = count;
        },

        SET_ACCOUNT_ROLES: (state, roles) => {
            state.roles = roles;
        },


    },
    actions: {
        // 获取账号列表
        GetAccounts({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getAccounts(payload.page, payload.size).then(res => {

                    res.data = res.data.map((v) => {
                        v.lastModifyDt = toDateTime(v.lastModifyDt);
                        return v;
                    });

                    commit('SET_ACCOUNTS', res.data);
                    commit('SET_COUNT', res.count);
                    commit('SET_PAGE', payload.page);
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 添加账号
        AddAccount({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addAccount({
                    ...payload,
                    roleId: parseInt(payload.roleId, 10),
                    disabled: payload.disabled === "0" ? false : true
                }).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 编辑账号
        ChangeAccount({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                editAccount({
                    ...payload,
                    roleId: parseInt(payload.roleId, 10),
                    disabled: payload.disabled === "0" ? false : true
                }).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取用户角色列表
        GetRoles({commit}) {
            return new Promise((resolve, reject) => {
                roles().then(res => {
                    commit("SET_ACCOUNT_ROLES", res.data);
                    resolve();
                }).catch(err => {
                    reject(err);
                })
            })

        },
        // 重置密码
        ResetPass({commit}, id) {
            return new Promise((resolve, reject) => {
                resetPass(id).then((res) => {
                    resolve(res)

                }).catch(err => {
                    reject(err);
                })
            })

        },


    }
};

export default accounts;