import {  modifyPass, resetPass, refreshLogin, refreshUser} from "@/api/login";


// 登录用户信息
const user = {
    state: {
        project:[],
    },

    mutations: {

        SET_TOKEN: (state, pro) => {
            state.token = pro
        },
        SET_PROJECT: (state, pro) => {
            state.project = pro
        }
    },

    actions: {
        // 登录 2019-08-04
        // LoginByUsername({commit}, userInfo) {
        //
        //     return new Promise((resolve, reject) => {
        //         loginBy(userInfo).then(res => {
        //             commit('SET_TOKEN', res.data.token);
        //             commit('SET_PROJECT', res.data.projects);
        //             commit('SET_ROLE', res.data.rolename);
        //             commit('SET_NAME', userInfo.account);
        //             setName(userInfo.account);
        //             resolve(res.data);
        //         }).catch(err => {
        //             reject(err)
        //         })
        //     })
        // },


        // 登录
        RefreshLogin({commit}) {

            return new Promise((resolve, reject) => {
                refreshLogin().then(res => {
                    commit('SET_TOKEN', res.data.token);
                    commit('SET_PROJECT', res.data.projects);
                    resolve(res.data);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 登录
        RefreshUser({commit}) {

            return new Promise((resolve, reject) => {
                refreshUser().then(res => {

                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 修改密码
        UpdatePass({commit}, userInfo) {

            return new Promise((resolve, reject) => {
                modifyPass(this.state.user.id, userInfo).then(res => {

                    resolve(res.data);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 重置密码
        ResetPass({commit}) {

            return new Promise((resolve, reject) => {
                resetPass(this.state.user.id).then(res => {

                    resolve(res.data);
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // LoginOut({commit}) {
        //     return new Promise((resolve, reject) => {
        //
        //         loginOut().then(res => {
        //             commit('SET_PROJECT', null);
        //             commit("SET_SEARCHFORM", {});
        //             commit("SET_CLIENTSEARCHFORM", {});
        //             resolve()
        //         }).catch(err => {
        //             commit('SET_PROJECT', null);
        //             commit("SET_SEARCHFORM", {});
        //             commit("SET_CLIENTSEARCHFORM", {});
        //             reject(err)
        //         })
        //
        //     })
        // }


    }

};

export default user;