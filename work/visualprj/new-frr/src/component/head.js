import {api, title} from "../config/config";
import {jb} from "../plugs/tbase";

export function tokenToUrl(accesstoken) {

    jb.ajx.send({
        url: api.accesslogin + '?accesstoken=' + accesstoken,
        data: accesstoken
    }).then(function (resa) {
        var res = resa.body.data;

        store.set("accesstoken", res.accesstoken);
        store.set("uname", res.uname);

        // 做页面跳转
        var durl = res.default_url || "";
        var port = ":" + (url('port') === 80 ? "" : url('port'));
        var skip = Boolean(url("?skip"));
        // you tiao zhuang
        var skipif = durl.indexOf("skip") !== -1;

        var gourl;

        if (durl.length > 0) {
            var d = /\d/.test(durl);

            if (d) {
                // guanding
                gourl = skips[Number(durl.split(",")[0])];

                if (url().indexOf(gourl) === -1) {
                    window.location.href = url('protocol') + "://" + url('hostname') + port + '/' + gourl;
                }
            } else {
                if (skipif && !skip) {
                    // first time
                    gourl = durl;

                    if (url().indexOf(gourl) === -1) {
                        window.location.href = url('protocol') + "://" + url('hostname') + port + '/' + gourl;
                    }
                } else {

                }
            }


        } else {
            if (url().indexOf(gourl) === -1 && durl !== "") {
                window.location.href = url('protocol') + "://" + url('hostname') + port + '/first.html';
            }
        }

    })
};

// 下拉菜单 来自 common.js
export function hover(dom, dropdown, isChangeClass) {
    $(dom)
        .hover(function () {
            $(dropdown).stop().slideDown();
            if (isChangeClass) {
                $(dom).find('.icon-up').attr('class', 'iconfont icon-down');
            }
        }, function () {
            $(dropdown).stop().slideUp();
            if (isChangeClass) {
                $(dom).find('.icon-down').attr('class', 'iconfont icon-up');
            }
        })
};

// 头部动画
export function head() {
    hover('.header-logon', '.header-logon__dropdown');
    hover('.header-logo', '.header-logo__dropdown', true);
};

export function headTime(time) {
    "use strict";
    var d = moment.unix(time).format('YYYY-MM-DD')

    $("#time").text(d);
};

// 加载头部
export function headRun() {
    $("#header").load("/static/head.html", function (headDom) {
        var skip = Boolean(url("?skip"));
        head();
        var accesstoken = store.get("accesstoken")
        tokenToUrl(accesstoken);
        $("#fu").click(function (e) {
            jb.util.fullScreen(document.documentElement);
        });

        var filename = window.url("filename") || "first";
        $("#js-name").text(title[filename]);

        var accesstoken = store.get("accesstoken") || url("?accesstoken");
        var lurl = "/login.html";
        //如果没登录跳到登录页
        if (!accesstoken) {
            window.location.href = lurl;
        }
        //退出登录
        $("#js-logonOut").click(function () {
            $.ajax({
                url: api.logout + '?accesstoken=' + accesstoken,
                dataType: 'json',
                async: false,
                data: accesstoken,
                type: 'post',
                success: function (res) {
                    if (res.code == 200) {
                        store.remove("accesstoken");
                        store.remove("accesstoken");
                        store.remove("uname");
                        window.location.href = lurl;
                    } else {
                        console.log("err: ", res);
                    }
                },
                faild: function (res) {
                    console.log("err: ", res);
                }
            })
        });
        //修改密码
        $("#js-passWord").click(function () {
            $("#js-modal").css("display", "block");
        });
        $("#js-modal-close").click(function () {
            empty()
        });
        $("#js-btn-close").click(function () {
            empty()
        });

        //关闭弹窗时清空内容
        function empty() {
            var oVal = $("#o-password").val('');
            var nVal = $("#n-password").val('');
            var cVal = $("#c-password").val('');
            $("#js-alert").css("display", "none");
            $("#js-modal").css("display", "none");
        }

        //修改密码提交
        $("#js-btn-sure").click(function () {
            var uname = store.get("uname");
            var oVal = $("#o-password").val();
            var nVal = $("#n-password").val();
            var cVal = $("#c-password").val();
            if (oVal == '') {
                $("#o-tip").css("display", "block");
                return
            } else {
                $("#o-tip").css("display", "none");
            }
            if (nVal == '') {
                $("#n-tip").css("display", "block");
                return
            } else {
                $("#n-tip").css("display", "none");
            }
            if (cVal == '') {
                $("#c-tip").css("display", "block");
                return
            } else {
                $("#c-tip").css("display", "none");
            }
            if (nVal != cVal) {
                $("#js-alert").find("span").text("新密码与确认密码不一致");
                $("#js-alert").css("display", "block");
                return
            }
            var data = {
                "name": uname,
                "password": $.md5(oVal).toLocaleUpperCase(),
                "newpassword": $.md5(nVal).toLocaleUpperCase()
            }
            $.ajax({
                url: api.changepassword,
                dataType: 'json',
                async: false,
                data: data,
                type: 'post',
                success: function (res) {
                    $("#js-alert").css("display", "none");
                    if (res.code == 200) {
                        $("#js-alert").find("span").text("修改成功！");
                        $("#js-alert").css("display", "block");
                        setTimeout(function () {
                            $("#js-modal").css("display", "none");
                        }, 1000);
                    } else {
                        $("#js-alert").find("span").text(res.errmsg);
                        $("#js-alert").css("display", "block");
                    }
                },
                faild: function (res) {
                    console.log("err: ", res);
                }
            })
        })

        $("#headlink a").click(function (e) {
            e.preventDefault();
            if (skip === true) {
                window.location.href = "/" + $(e.currentTarget).attr("shref") + "?skip=true"
            } else {
                window.location.href = "/" + $(e.currentTarget).attr("shref")
            }
        });
    });
};