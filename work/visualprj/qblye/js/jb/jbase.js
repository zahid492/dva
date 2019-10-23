var jb = {};
var request = window.superagent;

jb.ajx = {};
jb.ui = {};
jb.config = {

};

//记录点击
jb.ajx.browseRecord = function (opt) {

    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: 'post', //可选get
            url: 'api/user/browseRecord.ashx',
            data: {openid: opt.openid, url: opt.url, logtype: opt.logtype, ip: opt.ip},
            dataType: 'json',
            success: function (result) {
                if (result.Code == 200) {
                    resolve()
                } else {
                    reject();
                }
            },
            error: function (err) {
                reject();
            }
        });

    })
};

// 记录错误的 api 请求
jb.ajx.errRecord = function (opt) {

    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: 'post', //可选get
            url: 'api/user/errRecord.ashx',
            data: {openid: opt.openid, url: opt.url, err: err, time: time},
            dataType: 'json',
            success: function (result) {
                if (result.Code == 200) {
                    resolve()
                } else {
                    reject();
                }
            },
            error: function (err) {
                reject();
            }
        });

    })
};

jb.ajx.request = function(opt){
    return request.get(opt.url)
        .query(opt.data)
        .timeout({
            response: 1000,
            deadline: 10000,
        })
        .retry(3)
        .on("error", function (err) {
            console.log("err: ", err);
        })
        .then(function (result) {
            opt.cb(result);

            if(result.body.Code !== 200){
                console.log(result.body.ErrMsg)
            }

            if(opt.defer){
                opt.defer[1](result.body.ErrMsg)
            }
        });
};

jb.ui.alert = function(opt){
    var $tip = $('<i class="iconfont"></i><h3></h3>');

    switch(opt.type){
        case "success":
            $tip.find("iconfont").addClass("icon-alert");
            break;
        case "fail":
            $tip.find("iconfont").addClass("icon-false");
            break;
        case "problem":
            $tip.find("iconfont").addClass("icon-problem");
            break;
        default:
            $tip.find("iconfont").addClass("icon-alert");
    }

    $tip.find("h3").text(opt.msg);

};

