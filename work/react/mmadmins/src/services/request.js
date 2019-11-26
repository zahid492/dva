import axios from 'axios';
import {message} from 'antd';
import * as store2 from "store2";

const config = window.config;

const service = axios.create({
    baseURL: config.rootApi,
    timeout: 10000,
    "Content-Type": " application/json",
    // withCredentials: true,
    headers: {
        post: {
            "Content-Type": 'application/json',
        }
    },
});

service.interceptors.request.use(config => {
    let oc = store2.session("oidc_user");
    if (oc && oc.access_token) {
        config.headers['Authorization'] = 'Bearer ' + oc.access_token;
    }

    return config
}, error => {
    Promise.reject(error)
});

service.interceptors.response.use(response => {
    const res = response.data;
    if (res.code !== 200) {
        console.log("响应错误");
        return Promise.reject(res)
    } else {
        return response.data
    }
}, error => {
    message.error("请求出现错误，详情请查看控制台", 2);
    console.log("请求错误")

    return Promise.reject(error)
});

export default service;
