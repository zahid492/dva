// 2019-10-11 wsc

//获取URL的参数值
function queryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));

    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];

}

function getData(opt){
    var contentType = (function(){
        if(opt.contentType === false){
            return false
        }else if(opt.contentType === "form"){
            return "application/x-www-form-urlencoded"
        }else {
            return 'application/json'
        }
    }());
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: opt.url,
            type: 'get',
            data: opt.data,
            dataType: 'json',
            contentType: contentType,
            success: function (response) {
                if (response.code == 200) {
                    resolve(response)
                } else {
                    reject(response);
                }
            },
            error: function (err) {
                reject(err);
            }
        })
    });
}

function postData(opt){
    var contentType = (function(){
        if(opt.contentType === false){
            return false
        }else if(opt.contentType === "form"){
            return "application/x-www-form-urlencoded"
        }else {
            return 'application/json'
        }
    }());
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: opt.url,
            type: 'post',
            data: JSON.stringify(opt.data),
            dataType: 'json',
            contentType: contentType,
            success: function (response) {
                if (response.code == 200) {
                    resolve(response.data)
                } else {
                    reject(response);
                }
            },
            error: function (err) {
                reject(err);
            }
        })
    });
}

function uploadData(opt){
    var contentType = (function(){
        if(opt.contentType === false){
            return false
        }else if(opt.contentType === "form"){
            return "application/x-www-form-urlencoded"
        }else {
            return 'application/json'
        }
    }());

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: opt.url,
            type: 'POST',
            processData: false,
            dataType: 'json',
            data: opt.data,
            contentType: contentType,
            success: function (response) {
                if (response.code == 200) {
                    layui.layer.msg(opt.msg);
                    resolve(response.data)
                } else {
                    layui.layer.msg(response.errmsg);
                    reject(response.errmsg);
                }
            }
            , error: function (err) {
                reject(err);
                layui.layer.msg(err);
            },
        })
    });
}

$.extend({
    /**
     * 发起一个 get 请求,参数放在 queryString 中
     * @param {String} url 请求地址
     * @param {Object} data 请求数据
     * @param {Function} success 成功回调
     */
    getJson: function (url, data, success, options) {
        var params = {
            type: "get",
            url: url,
            data: data,
            success: success
        };

        Object.assign(params, options);

        return $.ajax(params);
    }
});
