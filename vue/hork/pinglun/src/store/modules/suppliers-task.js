// 供应商任务
import Vue from 'vue'
import {getSupTasks, updateSupTaskStatus, addScreenShot, delScreenShot, addSupTask, updateSupTask, deleteSupTask, getSupQQMsg} from "@/api/supplier-task";
import {toDay} from "@/utils/index";
import store from '@/store/index';
import {Message} from "element-ui";

Vue.component(Message);

const suptasks = {
    state: {
        page: 1,
        size: 10,
        count: 0,
        searchSupplierForm:{}
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

        SET_SEARCHSUPPLIERFORM: (state, searchForm) => {
            state.searchSupplierForm = searchForm;
        },
    },
    actions: {
        // 获取列表
        GetSupTasks({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getSupTasks(payload).then(res => {

                    res.data = res.data.map((v) => {
                        v.tasktime = toDay(v.tasktime);
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

        // 任务搜索状态
        SetSupplierSearchForm({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                commit("SET_SEARCHSUPPLIERFORM", payload)
                resolve()
            });
        },

        // 更新供应商任务状态
        UpdateSupTaskStatus({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                updateSupTaskStatus(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //  发布任务，反身任务，点赞任务 上传截图
        AddScreenShot({commit, state}, payload) {
            var that = this;
            let fileObj = payload.file;
            let FileController = config.apiPath() + 'maintaintasks/' + payload.id + "/screenshot/upload";

            let forms = new FormData();

            forms.append("file", fileObj);


            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: FileController,
                    type: 'POST',
                    processData: false,
                    headers:{
                        accessToken:store.getters.token
                    },
                    dataType: 'json',
                    data: forms,
                    contentType: false,
                    success: function (res) {
                        if (res.code == 200) {
                            resolve(res.data);
                        } else {
                            reject(res.message);
                        }
                    }
                    , error: function (err) {
                        reject(err);
                    },
                })
            });
        },

        // 删除截图
        DelScreenShot({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                delScreenShot(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 更新撰写任务内容
        AddSupTask({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addSupTask(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 更新撰写任务内容
        UpdateSupTask({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                updateSupTask(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 删除撰写任务内容
        DeleteSupTask({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                deleteSupTask(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 删除撰写任务内容
        GetSupQQMsg({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getSupQQMsg(payload).then((res) => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },



    }
};

export default suptasks;