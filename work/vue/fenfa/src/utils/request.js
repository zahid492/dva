import axios from 'axios';
import {Toast} from 'vant';
import store from '@/store/index';

const config = window.config;

const service = axios.create({
    baseURL: config.apiPath,
    timeout: 15000,
    "Content-Type": " application/json",
    // withCredentials: true,
});

service.interceptors.request.use(config => {
    // console.log("token: in ", store.getters.token)
    if (store.getters.token) {
        config.headers['accessToken'] = store.getters.token;
    }
    return config
}, error => {
    Promise.reject(error)
});

service.interceptors.response.use(response => {
    const res = response.data;
    if (res.code !== 200) {

        console.log("响应错误");
        if (res.code === 400) {
            return Promise.reject(res)
        }

        return Promise.reject(res)
    } else {
        return response.data
    }
}, error => {
    Toast({
        message: "请求出现错误，详情请查看控制台",
        duration: 3 * 1000
    });
    console.log("请求错误")

    return Promise.reject(error)
});

export default service;
