import axios from 'axios';
import {Message} from 'element-ui';
import store from '@/store/index';
// import {getToken, removePluser} from '@/utils/auth';
import qs from 'qs';
// import axiosRetry, {isNetworkOrIdempotentRequestError} from 'axios-retry';


const service = axios.create({
    baseURL: config.apiPath(),
    timeout: 10000,
    "Content-Type": " application/json",
    // withCredentials: true,
    // 创建点赞任务推荐评论
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            arrayFormat: 'repeat',
        })
    },

});


service.interceptors.request.use(config => {
    if (store.getters.authorization) {
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['accessToken'] = store.getters.token;
        config.headers['authorization'] = 'Bearer ' + store.getters.authorization;
    }
    return config
}, error => {
    Promise.reject(error)
});


// axiosRetry(service, {
//     retries: 3,
//     retryDelay: (retryCount) => {
//         return retryCount * 2000;
//     },
//
//     retryCondition: function (err) {
//         if (/.*timeout/.test(err)) {
//             Message.error("连接超时")
//             return true;
//         }
//
//         return isNetworkOrIdempotentRequestError
//     }
// });

service.interceptors.response.use(response => {
    const res = response.data;
    if (res.code !== 200) {

        console.log("响应错误");

        // if(res.code == 400 || res.code == 500){
        //
        // }

        // if (res.code === 401) {
        //     // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //     //     confirmButtonText: '重新登录',
        //     //     cancelButtonText: '取消',
        //     //     type: 'warning'
        //     // }).then(() => {
        //     //
        //     // })
        //     // store.dispatch('LogOut').then(() => {
        //     //     location.reload() // 为了重新实例化vue-router对象 避免bug
        //     // })
        //
        //
        // }
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
