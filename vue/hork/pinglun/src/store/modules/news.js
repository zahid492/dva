// 新闻管理
import {getNews, crawlNews, getRobotComment, setDeltedSign, updateMediaView, crawlComment} from "@/api/news";
import {toShortDay, toDay, toDateTime, toShortDayTime} from "@/utils/index";

const news = {
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
        // 采集新闻
        CrawlNews({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                crawlNews(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取列表
        GetNews({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getNews(payload).then(res => {

                    res.data = res.data.map((v) => {
                        v.publishtime = toDay(v.publishtime);
                        v.createdt = toDay(v.createdt);
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
        // 获取机器推荐评论
        GetRobotComment({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                getRobotComment(payload).then((res) => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 标记新闻被删除
        SetDeltedSign({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                setDeltedSign(payload).then((res) => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 更改新闻调性
        UpdateMediaView({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                updateMediaView(payload).then((res) => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 采集评论数
        CrawlComment({commit, state}, payload) {
            return new Promise((resolve, reject) => {
                crawlComment(payload).then((res) => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },

    }
};

export default news;