import axios from 'axios';
import { message,} from 'antd';
const config = window.config;


const service = axios.create({
    baseURL: config.API_ROOTS,
    timeout: 10000,
    "Content-Type": " application/json",
    // withCredentials: true,
});

service.interceptors.request.use(config => {
    // if (store.getters.oidcAccessToken) {
    //     config.headers['Authorization'] = 'Bearer ' + store.getters.oidcAccessToken;
    // }

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
