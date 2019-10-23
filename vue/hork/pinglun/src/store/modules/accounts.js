// 用户管理
import {
    getAccounts,
    disbaleAccount,
    addAccount,
    editAccount,
    getAccount,

    roles,
    rolesDic,
    oneRoles,
    updateRoles
} from "@/api/account";

import {resetPass} from "@/api/login";

import {getSuppliersDic} from "@/api/supplier";
import {getProjectsDic} from "@/api/project";
import {toShortDay, toDay, toDateTime, toShortDayTime, num2wan} from "@/utils/index";

const accounts = {
    state: {
        page: 1,
        size: 10,
        count: 0,
        // 账号专用 3个数组
        roles: [],
        projects: [],
        suppliers: []
    },

    mutations: {

        SET_PAGE: (state, page) => {
            state.page = page;
        },

        SET_SIZE: (state, size) => {
            state.size = size;
        },

        SET_COUNT: (state, count) => {
            state.count = count;
        },

        // 所有权限的列表
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        // 所有权限的列表
        SET_PROJECTS: (state, projects) => {
            state.projects = projects;
        },
        // 所有权限的列表
        SET_SUPPLIERS: (state, suppliers) => {
            state.suppliers = suppliers;
        },

    },
    actions: {
        // 获取账号列表
        GetAccounts({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getAccounts(payload).then(res => {

                    res.data = res.data.map((v) => {
                        v.createdt = toDay(v.createdt);
                        v.modifydatetime = toDay(v.modifydatetime);

                        if (_.isNil(v.projectids)) {
                            v.projectids = [];
                        }
                        v.password = "";

                        if (_.isNil(v.supplierid)) {
                            v.supplierid = "";
                        }
                        return v;
                    });

                    commit('SET_COUNT', res.count);
                    commit('SET_PAGE', payload.page);
                    commit('SET_SIZE', payload.size);
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 添加账号
        AddAccount({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addAccount(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 编辑账号
        ChangeAccount({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                editAccount(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 启用禁用账号
        DisbaleAccount({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                disbaleAccount(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取用户角色列表
        GetRoles({commit}) {
            return new Promise((resolve, reject) => {
                rolesDic().then(res => {
                    commit("SET_ROLES", res.data);
                    resolve(res.data);
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
        // 重置密码
        GetAccount({commit}, id) {
            return new Promise((resolve, reject) => {
                getAccount(id).then((res) => {
                    resolve(res.data)

                }).catch(err => {
                    reject(err);
                })
            })
        },
    }
};

export default accounts;