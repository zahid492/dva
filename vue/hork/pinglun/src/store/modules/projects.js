// 项目管理
import {getProjects, addProject, editProject, editProjectStatus, getProjectsDic, getProjectById} from "@/api/project";
import {toDay} from "@/utils/index";

const projects = {
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
        GetProjects({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getProjects(payload).then(res => {

                    res.data = res.data.map((v) => {
                        v.createdt = toDay(v.createdt);
                        v.modifydt = toDay(v.modifydt);
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

        // id 获取项目
        GetProjectById({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getProjectById(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 添加项目
        AddProject({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                console.log(payload)
                addProject(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 编辑项目
        ChangeProject({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                editProject(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 启用禁用项目
        ChangeProjectStatus({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                editProjectStatus(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 根据项目类型，新闻类型 供应商字典
        GetProjectsDic({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getProjectsDic(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },


    }
};

export default projects;