import axios from 'axios';
import {Message} from "element-ui";
import store from '@/store/index';
// import { getToken } from '@/utils/auth';

const service = axios.create({
    baseURL: config.apiPath,
    timeout: 20000,
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

    if(_.has(res, "code")){
        if (res.code !== 200) {

            if (res.code === 400) {
                return Promise.reject(res)
            }
            Message.warning("内部错误")
            return Promise.reject(res)
        } else {
            return response.data
        }
    }else{
        return res;
    }

}, error => {
    // Message.warning("请求出现错误，详情请查看控制台");
    console.log("请求错误")

    return Promise.reject(error)
});

export default service;
