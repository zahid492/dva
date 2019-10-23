$(function () {
    var openid = store.session('openid');
    var myScroll;
    // var openid = 'ogHAKj0p37NEUbRZH1yWSn1NR_eg';
    if (openid) {
        setUser(openid).then(function () {
            var sUser = store.session('curuser');
            var tel = _.isNull(sUser.Tel) ? "" : sUser.Tel;
            // alert(JSON.stringify(sUser))
            var email = _.isNull(sUser.Email) ? "" : sUser.Email;
            setNotic(sUser);


            var etpl = $("#userEmailTpl").html();
            var ptpl = $("#userPhoneTpl").html();

            var ebtpl = $("#userEmailBindTpl").html();
            var pbtpl = $("#userPhoneBindTpl").html();

            var ecompiled = _.template(etpl);
            var ehtml = ecompiled({"email": email});

            var pcompiled = _.template(ptpl);
            var phtml = pcompiled({"tel": tel.substring(0,3) + "...." + tel.substring(7, 11)});

            var jet = $("#js-etbox");
            // 绑定操作面板
            var jb = $("#js-bind");
            jet.html(phtml);
            jb.html(pbtpl);


            $(".loginMode--phone").click(function (e) {
                $(e.currentTarget).addClass("is-active");
                $(".loginMode--email").removeClass("is-active");

                $(".js-pa").addClass("icon-phone-active");
                $(".js-ea").removeClass("icon-email-active");

                jet.empty().html(phtml).show();
                jb.empty().html(pbtpl).hide();
            });

            $(".loginMode--email").click(function (e) {
                $(e.currentTarget).addClass("is-active");
                $(".loginMode--phone").removeClass("is-active");

                $(".js-pa").removeClass("icon-phone-active");
                $(".js-ea").addClass("icon-email-active");

                jet.empty().html(ehtml).show();
                jb.empty().html(ebtpl).hide();
            });
            // 绑定邮箱
            jet.on("click", ".js-noemail", function (e) {
                e.preventDefault();
                jet.hide();
                jb.show();
                var ei = $("#js-ei input");
                ei.focus();
                $("#js-esub").on("click", function () {
                    var iemail = $.trim(ei.val());
                    var ep = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                    if (ep.test(iemail)) {
                        $.ajax({
                            type: 'post',
                            url: 'api/user/binduser.ashx',
                            data: {email: iemail, openid: openid, type: "email"},
                            dataType: 'json',
                            success: function (result) {

                                if (result.Code == 200) {
                                    layer.open({
                                        time: 2,
                                        className: 'message message--success laytip',
                                        content: $("#layTipSuccessTpl").html()
                                    });

                                    if (sUser) {
                                        sUser.Email = iemail;
                                        store.session('curuser', sUser);
                                    }

                                    ehtml = ecompiled({"email": iemail});
                                    jb.hide();
                                    jet.empty().html(ehtml).show();
                                } else {
                                    layer.open({
                                        time: 2,
                                        className: 'message message--success laytip',
                                        content: $("#layTipErrorTpl").html()
                                    });
                                }
                            },
                            error: function () {
                                layer.open({
                                    time: 2,
                                    className: 'message message--success laytip',
                                    content: $("#layTipErrorTpl").html()
                                });
                            }
                        });
                    } else {
                        layer.open({
                            time: 2,
                            className: 'message message--alert laytip',
                            content: $("#layTipErrorEmailTpl").html()
                        });
                    }
                });
            });
            // 绑定手机
            jet.on("click", ".js-notel", function (e) {
                e.preventDefault();
                jet.hide();
                jb.show();

                var pbox = $("#js-pi");
                var pni = pbox.find('input[name="phone"]');
                var pncbtn = pbox.find(".pcheck");
                var pncn = pbox.find('input[name="pcheck"]');
                var pn;
                var isPhone = false;
                pni.focus();
                pncbtn.prop("disabled", true);

                pni.on("input", _.throttle(function () {
                    pn = $.trim(pni.val());
                    var tpat = /^1\d{10}$/;

                    if (pn.length < 11 || pn.length > 11) {
                        pncbtn.prop("disabled", true);
                    }

                    isPhone = tpat.test(pn);

                    if (!isPhone && pn.length === 11) {

                        layer.open({
                            time: 2,
                            className: 'message message--success laytip',
                            content: $("#layTipErrorPhoneTpl").html()
                        });
                        pni.focus();

                        pncbtn.prop("disabled", true);
                    } else {

                        pncbtn.prop("disabled", false);
                    }

                }, 200));

                pni.on("blur", function () {
                    pn = $.trim(pni.val());
                    var tpat = /^1\d{10}$/;

                    if (pn.length === 0) {
                        layer.open({
                            time: 2,
                            className: 'message message--success laytip',
                            content: $("#layTipEmptyPhoneTpl").html()
                        });
                        pncbtn.prop("disabled", true);
                    }
                    isPhone = tpat.test(pn);

                    if (!isPhone) {
                        layer.open({
                            time: 2,
                            className: 'message message--success laytip',
                            content: $("#layTipErrorPhoneTpl").html()
                        });
                        pncbtn.prop("disabled", true);
                    } else {
                        pncbtn.prop("disabled", false);
                    }

                });

                var suctip = $("#layTipSuccessTpl");
                var failtip = $("#layTipErrorTpl");
                // 获取验证码
                pncbtn.on("click", function () {
                      $.ajax({
                        type: 'post',
                        url: 'api/user/SendSecurityCodeToTel.ashx',
                        data: {mobile: pn},
                        dataType: 'json',
                        success: function (result) {
                            var tip = $("<div></div>");
                            if (result.Code === 200) {
                                var tip = $("<div></div>");
                                tip.html(suctip.html());
                                tip.find("h3").text("验证码发送成功");
                                layer.open({
                                    time: 2,
                                    className: 'message message--success laytip',
                                    content: tip.html()
                                });
                            } else {
                                tip.html(failtip.html());
                                tip.find("h3").text("验证码发送失败");
                                layer.open({
                                    time: 2,
                                    className: 'message message--success laytip',
                                    content: tip.html()
                                });
                            }
                        },
                        error: function () {
                            tip.html(failtip.html());
                            tip.find("h3").text("验证码发送失败");
                            layer.open({
                                time: 2,
                                className: 'message message--success laytip',
                                content: tip.html()
                            });
                        }
                    });
                });
                // 提交绑定
                $("#js-psub").on("click", function () {
                    var pnc = $.trim(pncn.val());
                    if(pnc.length !== 4){
                        layer.open({
                            time: 2,
                            className: 'message message--success laytip',
                            content: $("#layTipCheckTpl").html()
                        });

                        return false;
                    }

                    if(pn.length !== 11){
                        layer.open({
                            time: 2,
                            className: 'message message--success laytip',
                            content: $("#layTipErrorPhoneTpl").html()
                        });

                        return false;
                    }

                    // 4 位数字验证码
                    if (isPhone && pnc.length === 4) {
                        $.ajax({
                            type: 'post',
                            url: 'api/user/binduser.ashx',
                            data: {tel: pn, openid: openid, type: "tel", code:pnc},
                            dataType: 'json',
                            success: function (result) {

                                if (result.Code == 200) {
                                    layer.open({
                                        time: 2,
                                        className: 'message message--success laytip',
                                        content: $("#layTipSuccessTpl").html()
                                    });

                                    if (sUser) {
                                        sUser.Tel = pn;
                                        store.session('curuser', sUser);
                                    }

                                    phtml = pcompiled({"tel": pn.substring(0,3) + "...." + pn.substring(7, 11)});
                                    jb.hide();
                                    jet.empty().html(phtml).show();
                                } else {
                                    var tip = $("<div></div>");
                                    var et = $("#layTipErrorTpl");
                                    tip.html(et.html());
                                    tip.find("h3").text(result.ErrMsg);

                                    layer.open({
                                        time: 2,
                                        className: 'message message--success laytip',
                                        content: tip.html()
                                    });
                                }
                            },
                            error: function () {
                                layer.open({
                                    time: 2,
                                    className: 'message message--success laytip',
                                    content: $("#layTipErrorTpl").html()
                                });
                            }
                        });
                    }
                })
            });

            $('.js-return').click(function () {
                document.location.href = 'person.html?v='+Math.random(0, Date.now());
            });

            if (/Android/gi.test(navigator.userAgent)) {
                window.addEventListener('resize', function () {
                    if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                        window.setTimeout(function () {
                            document.activeElement.scrollIntoViewIfNeeded();
                        }, 0);
                    }
                })
            }

        });

    }

});

function setNotic(oUser) {
    if (oUser.Headportrait) {
        $('.js-head').attr('src', oUser.Headportrait);
    } else {
        $('.js-head').attr('src', 'img/user.png');
    }

    $('.user__name').html(oUser.NickName);
}

function setUser(openid) {
    return new Promise(function (resolve, reject) {
        var sUser = store.session('curuser');
        if (sUser) {
            var NickName = sUser.NickName;
            if (!NickName) {
                $.ajax({
                    type: 'get',
                    url: 'api/user/getuser.ashx',
                    data: {openid: openid},
                    dataType: 'json',
                    success: function (result) {
                        if (result.Code == 200) {
                            var user = result.Data;

                            store.session('curuser', user);
                            resolve();
                        }
                    },
                    error: function () {
                        console.log('fetch error!!!');
                    }
                });
            } else {
                resolve();
            }
        }
    });
}
