// 维护列表管理
import {
    getMaintains,
    getProportionStatus,
    getMaintainStatusDic,
    addWrite,
    addPublish,
    addPublishLike,
    addLike,
    addQuicklike,
    getQuicklike,
    getLike,
    getPublish,
    getWrite,
    getReport,
    setStatus,
    getWriteComment,
    getClientTasks,
    informMsg,
    exportExcel,
    getCompanies,
    getProjectComments,
    getMoreReportTasks,
    handleScreenShot,
    deleteTask
} from "@/api/maintain";
import {toShortDay, toDay, toDateTime, toShortDayTime, num2wan} from "@/utils/index";

const maintains = {
    state: {
        page: 1,
        size: 10,
        count: 0,
        // 任务类型
        taskTypeDic:[],
        searchForm:{},
        searchClientForm:{},
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

        SET_TASKTYPEDIC: (state, dic) => {
            state.taskTypeDic = dic;
        },

        SET_SEARCHFORM: (state, searchForm) => {
            state.searchForm = searchForm;
        },

        SET_CLIENTSEARCHFORM: (state, searchForm) => {
            state.searchClientForm = searchForm;
        },
    },
    actions: {
        // 获取列表
        Getmaintains({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getMaintains(payload).then(res => {
                    res.data = res.data.map((v) => {

                        v.firsttaskcreatedt = toDay(v.firsttaskcreatedt);
                        v.publishdtSC = toShortDay(v.publishdt);
                        v.fans = num2wan(v.fans);
                        v.proportion = (v.proportion*100).toFixed(0);

                        v.urgentstatus = _.every(v.tasks, (t)=>{
                            if(t.isurgent){
                                return true;
                            }

                            return false;
                        });

                        v.tasks = _.map(v.tasks, (t) => {
                            t.createdt = toShortDay(t.createdt);

                            return t;
                        });


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
        SetSearchForm({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                commit("SET_SEARCHFORM", payload)
                resolve()
            });
        },

        // 客户端任务搜索状态
        ClientSetSearchForm({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                commit("SET_CLIENTSEARCHFORM", payload)
                resolve()
            });
        },

        // 任务类型字典
        TaskTypeDic({commit, state}) {
            return new Promise((resolve, reject) => {
                let dics = [{
                    key: 0,
                    value: "全部"
                }, {
                    key: 1,
                    value: "撰写"
                }, {
                    key: 2,
                    value: "发布 "
                }, {
                    key: 3,
                    value: "点赞"
                }, {
                    key: 4,
                    value: "反向"
                }];

                resolve(dics)
            });
        },

        // 占比状态字典
        GetProportionStatus({commit, state}) {
            return new Promise((resolve, reject) => {
                getProportionStatus().then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 集团字典
        GetCompanies({commit, state}) {
            return new Promise((resolve, reject) => {
                getCompanies().then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 任务状态字典
        GetMaintainStatusDic({commit, state}) {
            return new Promise((resolve, reject) => {
                getMaintainStatusDic().then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 创建撰写
        AddWrite({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addWrite(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 创建发布
        AddPublish({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addPublish(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 创建发布点赞
        AddPublishLike({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addPublishLike(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 创建反向
        AddQuicklike({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addQuicklike(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 创建点赞
        AddLike({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                addLike(payload).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },

        GetWrite({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getWrite(payload).then((res) => {
                    res.data.finisheddt = toDateTime(res.data.finisheddt);
                    res.data.supplierfinisheddt = toDateTime(res.data.supplierfinisheddt);
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        GetPublish({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getPublish(payload).then((res) => {
                    res.data.finisheddt = toDateTime(res.data.finisheddt);
                    res.data.supplierfinisheddt = toDateTime(res.data.supplierfinisheddt);
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        GetLike({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getLike(payload).then((res) => {
                    res.data.finisheddt = toDateTime(res.data.finisheddt);
                    res.data.supplierfinisheddt = toDateTime(res.data.supplierfinisheddt);
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        GetQuicklike({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getQuicklike(payload).then((res) => {
                    res.data.finisheddt = toDateTime(res.data.finisheddt)
                    res.data.supplierfinisheddt = toDateTime(res.data.supplierfinisheddt)
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 设置维护任务的重要状态
        SetStatus({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                setStatus(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 获取统计日报
        GetReport({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getReport(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 获取统计日报
        GetMoreReportTasks({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getMoreReportTasks(payload).then((res) => {
                    res.data = _.map(res.data, (v)=>{
                        v.finisheddt = toDateTime(v.finisheddt);
                        v.supplierfinisheddt = toDateTime(v.supplierfinisheddt);
                        return v;
                    });
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 通知客户和供应商
        InformMsg({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                informMsg(payload).then((res) => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 获取撰写内容的评论
        GetWriteComment({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getWriteComment(payload).then((res) => {
                    res.data = _.map(res.data, (v)=>{
                        v.comment = v.content;
                        if(!v.count){
                            v.count = 0;
                        }
                        return v;
                    })
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 客户端查询效果列表
        GetClientTasks({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getClientTasks(payload).then(res => {
                    res.data = res.data.map((v) => {
                        v.publishtime = toShortDay(v.publishtime);
                        // v.firsttaskcreatedt = toDay(v.firsttaskcreatedt);
                        v.proportion = (v.proportion*100).toFixed(0);
                        v.fans = num2wan(v.fans);
                        v.tasks = _.map(v.customermaintaintasks, (t) => {
                            t.taskdatetime = toShortDayTime(t.taskdatetime);
                            t.finisheddt = toShortDayTime(t.finisheddt);
                            return t;
                        });

                        return v;
                    });


                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 客户端查询效果列表
        GetProjectComments({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getProjectComments(payload).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //  当反向，点赞，发布任务时，触发手动截图
        HandleScreenShot({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                handleScreenShot(payload).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        //  删除任务
        DeleteTask({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                deleteTask(payload).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

    }
};

export default maintains;