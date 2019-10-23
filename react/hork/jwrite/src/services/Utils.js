import request from "superagent"
import store from "store2";
import _ from 'lodash';
import qs from 'qs';
 
import * as apiUrl from './ApiUrl';
import mgr from '@/containers/userManager'
  

export function removePic(url, opt) {
    return new Promise((resolve, reject) => {

        mgr.getUser().then(function(user){  
            if (!user || user.expired) {
                // 清除旧数据后
                if (apiUrl.OIDCConfig.silent_redirect_uri) {
                    // 静默授权
                    mgr.signinSilent().then(function(_user){
                        ajaxPost(_user,url + opt.id,opt,resolve,reject)
                         
                    }).catch(function(err){
                        mgr.signoutRedirect();
                    })
                }
            }
             else 
            {
                ajaxPost(user,url + opt.id,opt,resolve,reject)        
            } 
        })   

        
    });
}
function ajaxPost(user,url,opt,resolve,reject)
{
    return request.post(url)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', "Bearer " + user.access_token)
                .send(JSON.stringify(opt))
                .then((res) => {
                     if (res.body.code !== 200) {
                             resolve(false)
                        } else {
                                resolve({response: res.body})
                            }
                        }).catch(res => {
                            reject({error: 'service error', code: 503});
                }); 
}




export function customRequest(url, opt) {
    let formData = new FormData();

    if (_.has(opt, "data") && !_.isEmpty(opt.data)) {

        Object.keys(opt.data).forEach(key => {
            formData.append(key, opt.data[key]);
        });
    }

    formData.append(opt.filename, opt.file);
    return new Promise((resolve, reject) => {
    mgr.getUser().then(function(user){  
        if (!user || user.expired) {
            // 清除旧数据后
            if (apiUrl.OIDCConfig.silent_redirect_uri) {
                // 静默授权
                mgr.signinSilent().then(function(_user){
                    return request.post(url)
                            .set('Accept', 'application/json')
                            .set('Authorization', "Bearer " + _user.access_token)
                            .send(formData)
                            .then(res => { 
                                if (res.body.code !== 200) {
                                    reject ({error: res.body})
                                } else {
                                    if(_.isFunction(opt.dispatch)){
                                        opt.dispatch(opt.actions.success(opt, res.body.data))
                                    }
                                    resolve({response: res.body.data})
                                }

                            }, err => {
                                reject({error: {errmsg: 'service error', code: 503}});
                            });
                            
                        }).catch(function(err){
                            mgr.signoutRedirect();
                        })
            }
        }
         else 
        {
            return request.post(url)
                    .set('Accept', 'application/json')
                    .set('Authorization', "Bearer " + user.access_token)
                    .send(formData)
                    .then(res => { 
                        if (res.body.code !== 200) {
                            reject({error: res.body})
                        } else {
                            if(_.isFunction(opt.dispatch)){
                                opt.dispatch(opt.actions.success(opt, res.body.data))
                            }
                            resolve({response: res.body.data})               

                        }

                    }, err => {
                        reject({error: {errmsg: 'service error', code: 503}})
                    });       
        } 
    })   
})



    
}


export function callData(url, opt) {
    let qss;   
    if (opt) {
        qss = "?" + qs.stringify(opt) + '&_r=' + Math.random()
    } else {
        qss = '?_r=' + Math.random()
    }
   
    return new Promise((resolve, reject) => {
        mgr.getUser().then(function(user){   
            if (!user || user.expired) {
                // 清除旧数据后
                if (apiUrl.OIDCConfig.silent_redirect_uri) {
                    // 静默授权
                    mgr.signinSilent().then(function(_user){
                        return  request.get(url  + qss) 
                        .set('Authorization', "Bearer " + _user.access_token)
                        .then(res => {
                            resolve(res.body);         
                        }, err => {
                            resolve({errmsg: 'service error', code: 503});
                        });
                         
                    }).catch(function(err){
                        mgr.signoutRedirect();
                    })
                }
            }
             else 
            {
                return  request.get(url  + qss) 
                .set('Authorization', "Bearer " + user.access_token)
                .then(res => { 
                    resolve(res.body);         
                }, err => { 
                    resolve({errmsg: 'service error', code: 503});
                });
            } 
        })   

      
    });
}

export function setData(url, opt) {
     
    return new Promise((resolve, reject) => {

        mgr.getUser().then(function(user){  
            if (!user || user.expired) {
                // 清除旧数据后
                if (apiUrl.OIDCConfig.silent_redirect_uri) {
                    // 静默授权
                    mgr.signinSilent().then(function(_user){
                        return  request.post(url)
                                .set('Content-Type', 'application/json')
                                .set('Accept', 'application/json')
                                .set('Authorization', "Bearer " + _user.access_token)
                                .send(JSON.stringify(opt))
                                .then(res => {
                                    resolve(res.body);         
                                }, err => {
                                    reject({errmsg: 'service error', code: 503});
                                });
                         
                    }).catch(function(err){
                        mgr.signoutRedirect();
                    })
                }
            }
             else 
            {
                return  request.post(url)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', "Bearer " + user.access_token)
                .send(JSON.stringify(opt))
                .then(res => {
                    resolve(res.body);         
                }, err => {
                    resolve({errmsg: 'service error', code: 503});
                });
            } 
        })


         
    });
      
}

export function __request(mothed,url,opt,success,fail,error){
    let p = null;
   if(mothed == 'get')
   {
      p = callData(url,opt);
   }
   else if(mothed == 'post')
   {
     p = setData(url,opt);
   }
   if(p)
   {
        p.then(res=>{ 
            if(res.code == 200)
            {
            success && success(res);
            }else{
            fail && fail(res);
            }
        }).catch(res=>{
            error && error();
        })
    }
}