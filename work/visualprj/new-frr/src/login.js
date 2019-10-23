import {api} from "./config/config";
import {jb, rem} from "./plugs/tbase";

$(function () {
    rem();
    var accesstoken = store.get("accesstoken");

    if (accesstoken) {
        jb.ui.tokenToUrl(accesstoken);
    }
    $(".login-btn").click(function () {
        loginUser();
    });

    $(".loginBox li input").keyup(function(e){
        if(e.keyCode === 13){
            loginUser()
        }
    });

    function loginUser(){
        "use strict";
        var uname = $("#UserName").val();
        var upwd = $.md5($("#Password").val()).toLocaleUpperCase();
        if (uname == '') {
            $('.login_user').find(".tip").css("display", "block");
            return
        }

        if ($("#Password").val() == '') {
            $('.login_pass').find(".tip").css("display", "block");
            return
        }

        var data = {
            "uname": uname,
            "upwd": upwd
        };
        request(data);
    }

    function request(data) {
        $.ajax({
            url: api.login,
            dataType: 'json',
            async: false,
            data: data,
            method: 'post',
            success: function (res) {
                $('.login_user').find(".tip").css("display", "none");
                $('.login_pass').find(".tip").css("display", "none");
                $(".alert").css("display", "none");
                if (res.code == 200) {
                    if ($('#RememberMe').is(':checked')) {
                        store.set("accesstoken", res.data.accesstoken);
                    }

                    store.set("accesstoken", res.data.accesstoken);
                    store.set("uname", res.data.uname);

                    // 做页面跳转
                    var durl = res.data.default_url || "";
                    var port = ":" + (url('port')===80 ? "" : url('port'));

                    var gourl;
                    if(durl.length>0){
                        var noskip = /\d/.test(durl);

                        if(noskip){
                            gourl = skips[Number(durl.split(",")[0])];
                        }else{
                            gourl = durl;
                        }

                        window.location.href = url('protocol') + "://" + url('hostname') + port +  '/' + gourl;

                    }else{
                        window.location.href = url('protocol') + "://" + url('hostname') + port +  '/first.html';
                    }

                } else {
                    $(".alert").find("span").text(res.errmsg);
                    $(".alert").css("display", "block");
                }
            },
            faild: function (res) {
                console.log("err: ", res);
            }
        })
    }
});