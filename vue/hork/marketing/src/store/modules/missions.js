import {missionList, refuseMsg, disWriter, closeMission, getTaskStatusObj, taskGroup} from "@/api/mission";
import {writers} from "@/api/account";
import {toDateTime} from "@/utils/index";

const missions = {
    state: {
        taskStatusObj: {},
        list: [],
        page: 1,
        size: 10,
        count: 100,
        writersObj:{},
        writers: [],
    },
    mutations: {
        set_state(state, list) {
            list = _.map(list, (v) => {
                v.score = _.isNull(v.score) ? "-" : v.score;
                return v;
            });

            state.list = list;
        },
        set_count(state, count) {
            state.count = count;
        },
        set_page(state, page) {
            state.page = page;
        },
        set_ts(state, tsObj) {
            state.taskStatusObj = tsObj;
        },

        // 非数组返回值
        set_writers_obj(state, writers) {
            state.writersObj = writers;
        },
        // 非数组返回值
        set_writers(state, writers) {
            state.writers = writers;
        },
    },
    actions: {
        // 任务列表
        GetMissions({commit}, payload) {
            return new Promise((resolve, reject) => {
                missionList(payload).then((res) => {

                    if (res.data.length > 0) {
                        res.data = res.data.map((v) => {
                            v.submitDt = toDateTime(v.submitDt);
                            return v;
                        })
                    }

                    commit("set_state", res.data);
                    commit("set_count", res.count);
                    commit("set_page", res.page);

                    resolve(res.data);
                }).catch((err) => {
                    reject(err);
                })
            })

        },

        // 拒稿原因
        GetRefuseMsg({commit}, tId) {
            return new Promise((resolve, reject) => {
                refuseMsg(tId).then((res) => {
                    resolve(res.data);
                }).catch((err) => {
                    reject(err);
                })
            })

        },

        // 分配写手
        DistributionWriter({commit}, payload) {
            return new Promise((resolve, reject) => {
                disWriter(payload).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                })
            })

        },

        // 关闭任务
        CloseTask({commit}, tId) {
            console.log("aaa:", tId)
            return new Promise((resolve, reject) => {
                closeMission(tId).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                })
            })

        },

        // 关闭任务
        GetTaskStatus({commit}) {
            return new Promise((resolve, reject) => {
                getTaskStatusObj().then((res) => {
                    commit("set_ts", res.data);
                    resolve();
                }).catch((err) => {
                    reject(err);
                })
            })

        },

        // 写手列表
        GetWriters({commit}) {
            return new Promise((resolve, reject) => {
                writers().then((res) => {

                    let writers = _.map(_.keys(res.data), (k)=>{
                        let v = res.data[k];
                        v.value= v.name;
                        v.key = k;
                        return v;
                    });

                    console.log(writers)

                    commit("set_writers", writers);


                    commit("set_writers_obj", res.data);
                    resolve();
                }).catch((err) => {
                    reject(err);
                })
            })

        },

        // 获取详情列表
        TaskGroup({commit}, payload) {
            return new Promise((resolve, reject) => {
                taskGroup(payload).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                })
            })

        },


    }
};

export default missions;