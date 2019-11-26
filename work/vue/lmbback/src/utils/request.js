import axios from 'axios';
import {Message} from 'element-ui';
import store from '@/store/index';

const service = axios.create({
    baseURL: config.apiPath,
    timeout: 10000,
    headers: {
        post: {
            "Content-Type": 'application/json',
        }
    },
    "Content-Type": " application/json",
    // withCredentials: true,
});

service.interceptors.request.use(config => {
    if (store.getters.oidcAccessToken) {
        config.headers['Authorization'] = 'Bearer ' + store.getters.oidcAccessToken;
    }

    return config
}, error => {
    Promise.reject(error)
});

service.interceptors.response.use(response => {
    const res = response.data;
    if (res.code !== 200) {
        Message({
            message: res.errmsg || "请求发生错误",
            type: 'error',
            duration: 5 * 1000
        });
        console.log("响应错误");

        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
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
