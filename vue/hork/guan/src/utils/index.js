import {Toast} from 'mint-ui';

export function postData(opt){

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: opt.url + "?" + opt.query,
            type: 'post',
            headers:{
                AccessToken:"4a332457-827a-4783-8173-d15714e881ad"
            },
            data: JSON.stringify(opt.data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.code == 200) {
                    if(opt.msg !== undefined){
                        Toast(opt.msg);
                    }
                    resolve(response.data)
                } else {
                    Toast(response.errmsg);
                    reject(response.errmsg);
                }
            },
            error: function (err) {
                Toast(err);
                reject(err);
            }
        })
    });
}