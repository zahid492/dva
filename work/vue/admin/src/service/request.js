import axios from 'axios';
import {Message} from 'element-ui';
import store from '@/store/index';
import qs from 'qs';
// import axiosRetry, {isNetworkOrIdempotentRequestError} from 'axios-retry';


const service = axios.create({
    baseURL: config.apiPath,
    timeout: 10000,
    "Content-Type": " application/json",
    // withCredentials: true,
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            arrayFormat: 'repeat',
        })
    },

});

service.interceptors.request.use(config => {
    if (store.getters.oidcAccessToken) {
        config.headers['Authorization'] = 'Bearer ' + store.getters.oidcAccessToken;
    }
    return config
}, error => {
    Promise.reject(error)
});


// axiosRetry(service, {
//     retries: 3,
//     retryDelay: (retryCount) => {
//         return retryCount * 1000;
//     },
//
//     // retryCondition: function (err) {
//     //     // if (/.*timeout/.test(err)) {
//     //     //     Message.error("连接超时")
//     //     //     return true;
//     //     // }
//     //
//     //     return isNetworkOrIdempotentRequestError
//     // }
// });

service.interceptors.response.use(response => {
    const res = response.data;

    if (res.code !== 200) {

        if (res.code == 400) {
            Message.error(res.message)
        }

        if (res.code == 500) {
            Message.error("内部错误")
        }

        if (res.code == 406) {
            console.error("参数错误")
        }

        return Promise.reject(res)
    } else {
        return response.data
    }
}, error => {
    Message({
        message: "请求出现错误，详情请查看控制台",
        type: "error",
        duration: 5 * 1000
    });
    console.log("请求错误")

    return Promise.reject(error)
});


export default service;
