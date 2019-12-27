// 2019-03-07 wsc 句子对清洗任务
import service from "@/utils/request";
import {pathId} from "@/utils/type";

const missions = {
    state: {
        acceptedTasks: [],
        toBeAcceptedTasks: [],

        sentenceFinished: [],
        sentenceFinishedPage: 0,
        sentenceTaskCount: {},
        sentenceIsOver: false,

        synonymFinished: [],
        synonymFinishedPage: 0,
        synonymTaskCount: {},
        synonymIsOver: false,

        auditFinished: [],
        auditFinishedPage: 0,
        auditTaskCount: {},
        auditIsOver: false,

        scoringFinished: [],
        scoringFinishedPage: 0,
        scoringTaskCount: {},
        scoringIsOver: false,

        rewriteFinished: [],
        rewriteFinishedPage: 0,
        rewriteTaskCount: {},
        rewriteIsOver: false,
    },
    mutations: {
        // 首页：
        // 已接受的任务
        set_accepted_tasks(state, tasks) {
            state.acceptedTasks = function () {
                tasks = _.map(tasks, (v) => {
                    if (v.completionPercentage == "NaN") {
                        v.completionPercentage = 0;
                    }

                    return v;
                });

                return _.take(tasks, 3);
            }()
        },
        // 待接受的任务
        set_tobe_accepted_tasks(state, tasks) {
            state.toBeAcceptedTasks = tasks;
        },

        // 个人中心：

        // 句子对完成的任务
        set_sentence_finished(state, tasks) {
            // state.sentenceFinished = state.sentenceFinished.concat(tasks);
            state.sentenceFinished = [].concat(tasks);
        },

        set_sentence_finished_page(state, page) {
            state.sentenceFinishedPage = page;
        },

        set_sentence_finished_count(state, count) {
            state.sentenceTaskCount = Object.assign({}, count);
        },

        set_sentence_over(state, over) {
            state.sentenceIsOver = over;
        },

        // 改写
        set_rewrite_finished(state, tasks) {
            state.rewriteFinished = [].concat(tasks);
        },

        set_rewrite_finished_page(state, page) {
            state.rewriteFinishedPage = page;
        },

        set_rewrite_finished_count(state, count) {
            state.rewriteTaskCount = count;
        },

        set_rewrite_over(state, over) {
            state.rewriteIsOver = over;
        },

        // 同义词完成的任务
        set_synonym_finished(state, tasks) {
            state.synonymFinished = [].concat(tasks);
        },

        set_synonym_finished_page(state, page) {
            state.synonymFinishedPage = page;
        },

        set_synonym_finished_count(state, count) {
            state.synonymTaskCount = count;
        },

        set_synonym_over(state, over) {
            state.synonymIsOver = over;
        },

        // 已完成的审核任务
        set_audit_finished(state, tasks) {
            state.auditFinished = [].concat(tasks);
        },

        set_audit_finished_page(state, page) {
            state.auditFinishedPage = page;
        },

        set_audit_finished_count(state, count) {
            state.auditTaskCount = count;
        },

        set_audit_over(state, over) {
            state.auditIsOver = over;
        },

        // 已完成的评价任务
        set_scoring_finished(state, tasks) {
            state.scoringFinished = [].concat(tasks);
        },

        set_scoring_finished_page(state, page) {
            state.scoringFinishedPage = page;
        },

        set_scoring_finished_count(state, count) {
            state.scoringTaskCount = count;
        },

        set_scoring_over(state, over) {
            state.scoringIsOver = over;
        },

    },
    actions: {
        getHomeMissions({commit, state}) {
            return new Promise((resolve, reject) => {
                service({
                    url: 'DistributionTask/DistributionTaskIndex?time=' + Date.now(),
                    method: 'get',
                }).then(res => {

                    // res.data.acceptedTasks = _.map(res.data.acceptedTasks, (v)=>{
                    //     if(v.completionPercentage<0){
                    //         v.completionPercentage = _.random(5, 90)
                    //     }

                    //     return v;
                    // })
                    commit('set_accepted_tasks', res.data.acceptedTasks);
                    commit('set_tobe_accepted_tasks', res.data.toBeAcceptedTasks);
                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 任务详情
        getTaskDetail({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                service({
                    url: 'DistributionTask/GetTaskDetail',
                    method: 'post',
                    data: payload
                }).then(res => {
                    resolve(res);

                }).catch(err => {
                    reject(err)
                })
            })
        },

        getMyFinishedTasks({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                payload.taskType = payload.type;

                service({
                    // url: 'DistributionTask/GetFinishedTaskByType',
                    url: 'DistributionTask/GetWriterTaskList',
                    method: 'post',
                    data: Object.assign({}, payload)
                }).then(res => {

                    switch (parseInt(payload.type, 10)) {
                        case pathId.sentence:

                            commit('set_sentence_finished', res.data);
                            commit('set_sentence_finished_page', payload.page);
                            commit('set_sentence_finished_count', {
                                taskCount: res.count,
                                childCount: res.childCount,
                            });

                            if (res.data.length < 10) {
                                commit('set_sentence_over', true);
                            }


                            break;

                        case pathId.rewrite:

                            commit('set_rewrite_finished', res.data);
                            commit('set_rewrite_finished_page', payload.page);
                            commit('set_rewrite_finished_count', {
                                taskCount: res.count,
                                childCount: res.childCount,
                            });

                            if (res.data.length < 10) {
                                commit('set_rewrite_over', true);
                            }


                            break;

                        case pathId.synonym:

                            commit('set_synonym_finished', res.data);
                            commit('set_synonym_finished_page', payload.page);
                            commit('set_synonym_finished_count', {
                                taskCount: res.count,
                                childCount: res.childCount,
                            });

                            if (res.data.length < 10) {
                                commit('set_synonym_over', true);
                            }


                            break;

                        case pathId.audit:

                            commit('set_audit_finished', res.data);
                            commit('set_audit_finished_page', payload.page);
                            commit('set_audit_finished_count', {
                                taskCount: res.count,
                                childCount: res.childCount,
                            });

                            if (res.data.length < 10) {
                                commit('set_audit_over', true);
                            }

                            break;

                        case pathId.scoring:

                            commit('set_scoring_finished', res.data);
                            commit('set_scoring_finished_page', payload.page);
                            commit('set_scoring_finished_count', {
                                taskCount: res.count,
                                childCount: res.childCount,
                            });

                            if (res.data.length < 10) {
                                commit('set_scoring_over', true);
                            }


                            break;
                    }

                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })
            })
        },

        saveAndGet({commit, state}, payload) {

            return new Promise((resolve, reject) => {
                service({
                    url: 'DistributionTask/SaveAndGet',
                    method: 'post',
                    data: payload
                }).then(res => {
                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 接受任务
        acceptTask({commit, state}, payload) {

            return new Promise((resolve, reject) => {
                service({
                    url: 'DistributionTask/TaskAccepted',
                    method: 'post',
                    params: payload
                }).then(res => {
                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 申请任务
        applyForTask({commit, state}, payload) {

            return new Promise((resolve, reject) => {
                service({
                    url: 'DistributionTask/ApplyForTask',
                    method: 'post',
                    data: payload
                }).then(res => {
                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 提交任务
        submitTask({commit, state}, payload) {

            return new Promise((resolve, reject) => {
                service({
                    url: 'DistributionTask/TaskSubmit',
                    method: 'get',
                    params: payload
                }).then(res => {
                    resolve(res.data);

                }).catch(err => {
                    reject(err)
                })
            })
        },
    }
};

export default missions;