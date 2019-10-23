// 供应商管理
import {getSuppliers, addSupplier, editSupplier, editSupplierStatus, getSuppliersDic, getSupplierOne} from "@/api/supplier";
import {toDay} from "@/utils/index";

const suppliers = {
    state: {
        page: 1,
        size: 10,
        count: 0,
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

    },
    actions: {
        // 获取列表
        GetSuppliers({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getSuppliers(payload).then(res => {

                    res.data = res.data.map((v) => {
                        v.createdt = toDay(v.createdt);
                        v.modifydt = toDay(v.modifydt);
                        return v;
                    });

                    commit('SET_COUNT', res.count);
                    commit('SET_PAGE', payload.Page);
                    commit('SET_SIZE', payload.Size);
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 添加供应商
        AddSupplier({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addSupplier(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 编辑供应商
        ChangeSupplier({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                editSupplier(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 启用禁用供应商
        ChangeSupplierStatus({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                editSupplierStatus(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 供应商类型字典 0通用 1撰写 2发布 3点赞 4反向
        GetSuppliersDic({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getSuppliersDic(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 根据项目类型，新闻类型 供应商字典
        GetSupplierOne({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getSupplierOne(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },


    }
};

export default suppliers;