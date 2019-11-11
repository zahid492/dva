$(function () {

    var openid = url("?openid") || store.session('openid');

    var test = url("?tid");

    if (test === "test") {
        openid = 'o4eId1jBZxBlr60R9lIZN6J1c_AQ';
    }

    var u315 = [];
    var userArr;
    //315消费者权益日
    function has315(userArr) {
        return _.includes(userArr, "315")
    }

    if (openid) {
        store.session('openid', openid)

        var emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        var phoneReg = /^1[34578]\d{9}$/;

        if (/Android/gi.test(navigator.userAgent)) {
            window.addEventListener('resize', function () {
                if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                    window.setTimeout(function () {
                        document.activeElement.scrollIntoViewIfNeeded();
                    }, 0);
                }
            })
        }
        // getUser()

        have315().then(function(data){
            if(data === true){
                store.session("has315", 1);
                location.href = '315dy.html?v=' + Math.random(0, Date.now());
            }else{
                add315().then(function () {
                    getUser().then(function (res) {
                        userArr = res;
                        // console.log(res)
                        var userLen = _.size(userArr);

                        $(".js-tj").click(function () {
                            var res = [];

                            var ph = $.trim($(".js-ph").val());

                            if(ph.length===0){
                                alertTip("请输入邮箱或手机");
                                return false;
                            }

                            if(ph.length>40){
                                alertTip("请输入正确邮箱或手机");
                                return false;
                            }

                            var isPhone = phoneReg.test(ph);
                            var isEmail = emailReg.test(ph);

                            if(!isPhone && !isEmail){
                                alertTip("请输入正确邮箱或手机");
                                return false;
                            }

                            $(".js-p").each(function (i, v) {
                                var p = $.trim($(v).val());
                                if (p.length > 10) {
                                    p = p.substring(0, 10);
                                }

                                res.push(p);
                            });

                            res = _.uniq(res);
                            // 去重根据已有关注词
                            // var res = _.filter(res, function (v) {
                            //     return !_.includes(userArr, v)
                            // });
                            //
                            // if (user.length != res.length) {
                            //     alertTip("请输入没有关注的品牌");
                            //     return;
                            // }

                            if (res.length < 1) {
                                alertTip("请输入希望关注的品牌");
                                return;
                            }

                            res = res.join(",");
                            store.session("u315", res);

                            $.ajax({
                                type: 'post',
                                url: 'api/feedback/insert.ashx',
                                data: {
                                    openid: openid,
                                    subject: res,
                                    tel: ph,
                                    content: '',
                                    type: 4,
                                },
                                dataType: 'json',
                                success: function (result) {
                                    if (result.Code != 200) {
                                        alertTip(result.ErrMsg);

                                    } else {
                                        store.session("has315", 1);
                                        successTip("申请成功");
                                        $(".js-p").val('');

                                        location.href = '315dy.html?v=' + Math.random(0, Date.now());
                                    }
                                },
                                error: function () {
                                    errorTip("请重试")
                                }
                            });
                        });

                    });

                });
            }
        })

    }

    // 判断用户是否填写过
    function have315() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'post',
                url: 'api/feedback/isExist.ashx',
                data: {openid: openid},
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data)
                    } else {
                        reject()
                        alertTip(result.ErrMsg);
                    }
                },
                error: function () {
                }
            });
        })
    }

    // $(".js-create").click(function() {
    //     // 判断用户是否是老用户, 比较然后添加关注词
    //     // Promise.all([getUser(), getSubjects("list")]).then(function(res) {
    //     //     console.log(res)
    //     //     var mustArr;
    //     //     // 用户已关注
    //     //     var userArr = res[0];

    //     //     var needArr = [];
    //     //     var clist = res[1].map(function(v) {
    //     //         v.Logo = imgpath + v.Logo;
    //     //         return v;
    //     //     });
    //     //     // 已包含在现有关注词列表中的，需要添加的关注词
    //     //     needArr = _.compact(_.uniq(_.map(clist, function(v) {
    //     //         if (_.includes(uarr, v.Name)) {
    //     //             return v.Name
    //     //         } else {
    //     //             return false;
    //     //         }
    //     //     })));

    //     //     // 需要新加的关注词 2, 1, 0
    //     //     if (_.size(needArr) === 3) {
    //     //         needArr = _.take(needArr, 2);
    //     //     }
    //     //     // 老用户
    //     //     var userLen = _.size(userArr);
    //     //     console.log(userArr, needArr)

    //     //     function has315(userArr) {
    //     //         return _.includes(userArr, "315消费者权益日")
    //     //     }

    //     //     switch (userLen) {
    //     //         // 老用户已有3个关注词
    //     //         case 3:
    //     //             goIndex()
    //     //             break;

    //     //         case 2:
    //     //             var tempArr = _.filter(needArr, function(v) {
    //     //                 return !_.includes(userArr, v)
    //     //             });
    //     //             console.log("2:", "315")
    //     //             if (!has315(userArr)) {
    //     //                 add315().then(function() {
    //     //                     goIndex()
    //     //                 });
    //     //             } else {
    //     //                 // 已添加 315，加一个有效关注词
    //     //                 if (_.size(tempArr) >= 1) {
    //     //                     addSubject(_.take(tempArr, 1)).then(function() {
    //     //                         goIndex();
    //     //                     })
    //     //                 }
    //     //             }

    //     //             break;

    //     //         case 1:
    //     //             var tempArr = _.filter(needArr, function(v) {
    //     //                 return !_.includes(userArr, v)
    //     //             });

    //     //             console.log("temp:", tempArr)
    //     //             if (!has315(userArr)) {
    //     //                 // 没有添加305
    //     //                 if (_.size(tempArr) >= 1) {
    //     //                     console.log("1:", _.take(tempArr, 1))
    //     //                     // 添加315和一个有效关注词
    //     //                     Promise.all([add315(), addSubject(_.take(tempArr, 1))]).then(function() {
    //     //                         goIndex()
    //     //                     });
    //     //                 } else {
    //     //                     console.log("1:", "315")
    //     //                     // 没有有效关注词则只添加315
    //     //                     add315().then(function() {
    //     //                         goIndex()
    //     //                     });
    //     //                 }
    //     //             } else {
    //     //                 // 已包含315
    //     //                 if (_.size(tempArr) >= 2) {
    //     //                     // 添加2个有效关注词
    //     //                     addSubject(_.take(tempArr, 2)).then(function() {
    //     //                         goIndex();
    //     //                     })
    //     //                 } else {
    //     //                     // 添加一个有效关注词
    //     //                     if (_.size(tempArr) == 1) {
    //     //                         addSubject(_.take(tempArr, 1)).then(function() {
    //     //                             goIndex();
    //     //                         })
    //     //                     }
    //     //                 }
    //     //             }

    //     //             break;

    //     //         case 0:
    //     //             // 新用户
    //     //             console.log("0:", needArr)
    //     //             Promise.all([add315(), addSubject(needArr)]).then(function() {
    //     //                 goIndex()
    //     //             });

    //     //             break;
    //     //     }

    //     // });
    //     goIndex();

    // })

    function add315() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'post',
                url: 'api/user/SubjectOper.ashx',
                data: {openid: openid, cmd: "subject315"},
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve()
                    } else {
                        reject()
                        alertTip(result.ErrMsg);
                    }
                },
                error: function () {
                }
            });
        })
    }

    function addSubject(sub) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'post',
                url: 'api/user/createSubjects.ashx',
                data: {openid: openid, subjects: sub.join(',')},
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve()
                    } else {
                        reject()
                        alertTip(result.ErrMsg);
                    }
                },
                error: function () {
                }
            });
        })
    }

    // 获取系统所有关注词图标信息
    function getSubjects(cmd) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get', //可选get
                url: 'api/SubjectAPI.ashx',
                data: {
                    cmd: cmd
                },
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    }
                },
                error: function () {
                    reject()
                }
            });
        })

    }

    function getUser() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/user/getuser.ashx',
                data: {openid: openid},
                dataType: 'json',
                success: function (result) {
                    // 将当前用户信息存入缓存
                    if (result.Code == 200) {
                        var user = result.Data;
                        if (user && user.Subjects && user.Subjects.length > 0) {
                            resolve(user.Subjects)
                        } else {
                            resolve(0)
                        }
                    }
                }
            });
        })

    }

    function errorTip(txt) {
        var tip = $("<div></div>");
        var et = $("#layTipErrorTpl");
        tip.html(et.html());
        tip.find("h3").text(txt);

        layer.open({
            time: 2,
            className: 'message message--success laytip',
            content: tip.html()
        });
    }

    function successTip(txt) {
        var tip = $("<div></div>");
        var et = $("#layTipSuccessTpl");
        tip.html(et.html());
        tip.find("h3").text(txt);

        layer.open({
            time: 2,
            className: 'message message--success laytip',
            content: tip.html()
        });
    }

    function alertTip(txt) {
        var tip = $("<div></div>");
        var et = $("#layTipAlertTpl");
        tip.html(et.html());
        tip.find("h3").text(txt);

        layer.open({
            time: 2,
            className: 'message message--success laytip',
            content: tip.html()
        });
    }


});