import {UserManager} from 'oidc-client';

export const parseJwt = (token) => {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    } catch (error) {
        return {}
    }
};

export const processSilentSignInCallback = () => {
    new UserManager().signinSilentCallback()
};

// export function getData(opt){
//     var contentType = (function(){
//         if(opt.contentType === false){
//             return false
//         }else if(opt.contentType === "form"){
//             return "application/x-www-form-urlencoded"
//         }else {
//             return 'application/json'
//         }
//     }());
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//             url: opt.url,
//             type: 'get',
//             data: opt.data,
//             dataType: 'json',
//             contentType: contentType,
//             success: function (response) {
//                 if (response.code == 200) {
//                     resolve(response)
//                 } else {
//                     reject(response);
//                 }
//             },
//             error: function (err) {
//                 reject(err);
//             }
//         })
//     });
// }
//
// export function postData(opt){
//     var contentType = (function(){
//         if(opt.contentType === false){
//             return false
//         }else if(opt.contentType === "form"){
//             return "application/x-www-form-urlencoded"
//         }else {
//             return 'application/json'
//         }
//     }());
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//             url: opt.url,
//             type: 'post',
//             data: JSON.stringify(opt.data),
//             dataType: 'json',
//             contentType: contentType,
//             success: function (response) {
//                 if (response.code == 200) {
//                     resolve(response.data)
//                 } else {
//                     reject(response);
//                 }
//             },
//             error: function (err) {
//                 reject(err);
//             }
//         })
//     });
// }
//
// export function uploadData(opt){
//     var contentType = (function(){
//         if(opt.contentType === false){
//             return false
//         }else if(opt.contentType === "form"){
//             return "application/x-www-form-urlencoded"
//         }else {
//             return 'application/json'
//         }
//     }());
//
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//             url: opt.url,
//             type: 'POST',
//             processData: false,
//             dataType: 'json',
//             data: opt.data,
//             contentType: contentType,
//             success: function (response) {
//                 if (response.code == 200) {
//                     layui.layer.msg(opt.msg);
//                     resolve(response.data)
//                 } else {
//                     layui.layer.msg(response.errmsg);
//                     reject(response.errmsg);
//                 }
//             }
//             , error: function (err) {
//                 reject(err);
//                 layui.layer.msg(err);
//             },
//         })
//     });
// }
