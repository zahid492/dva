import request from "superagent";
import qs from 'qs';

import userManager from '../services/userManager'

export function callData(url, opt) {
    let qss;
    if (opt) {
        qss = "?" + qs.stringify(opt) + '&_r=' + Math.random()
    } else {
        qss = '?_r=' + Math.random()
    }

    return new Promise((resolve, reject) => {

        userManager.getUser().then(function (user) {
            return request.get(url + qss)
                .set('Authorization', "Bearer " + user.access_token)
                .then(res => {
                    resolve(res.body);
                }, err => {
                    resolve({errmsg: 'service error', code: 503});
                });

        })
    });
}

export function setData(url, opt) {
    return new Promise((resolve, reject) => {
        userManager.getUser().then(function (user) {
            return request.post(url)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', "Bearer " + user.access_token)
                .send(JSON.stringify(opt))
                .then(res => {
                    resolve(res.body);
                }, err => {
                    resolve({errmsg: 'service error', code: 503});
                });
        });
    })
}

export function __request(mothed, url, opt, success, fail, error) {
    let p = null;
    if (mothed === 'get') {
        p = callData(url, opt);
    } else if (mothed === 'post') {
        p = setData(url, opt);
    }
    if (p) {
        p.then(res => {
            if (res.code === 200) {
                success && success(res);
            } else {
                fail && fail(res);
            }
        }).catch(res => {
            error && error();
        })
    }
}

export function __request_Temp(mothed, url, opt, success, error) {
    let p = null;
    if (mothed === 'get') {
        p = callData(url, opt);
    } else if (mothed === 'post') {
        p = setData(url, opt);
    }
    if (p) {
        p.then(res => {

            success && success(res);

        }).catch(res => {
            error && error();
        })
    }
}