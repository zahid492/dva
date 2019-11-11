/*
 * @Author: wsc
 * @Date:   2018-02-01 14:42:10
 * @Last Modified by:   wsc
 * @Last Modified time: 2018-02-01 16:42:10
 */

var openid = url('openid') || store.session('openid');
// var openid = 'o4eId1jBZxBlr60R9lIZN6J1c_AQ';
$(function () {
    if (openid) {
        store.session('openid', openid);

        getUser(openid).then(function (res) {
            var sUser = res;
            store.session('curuser', sUser);

            // 选定关注词，提交
            $('.js-submit').click(function () {
                var name = _.trim($("#eventName").val());
                var industry = _.trim($("#industry").val());

                if (name.length === 0) {
                    errorTip("请输入品牌名称");
                    return false;
                }

                if (industry.length === 0) {
                    errorTip("请输入行业名称");
                    return false;
                }

                if (name.length > 30) {
                    errorTip("品牌名称过长");
                    return false;
                }

                if (industry.length > 30) {
                    errorTip("行业名称过长");
                    return false;
                }

                // 申请品牌
                $.ajax({
                    type: 'post', //可选get
                    url: 'API/feedback/insert.ashx',
                    data: {
                        openid: openid,
                        subject: name,
                        content: industry,
                        type: 3
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.Code == 200 && result.Data) {
                            $("#js-sq").addClass("hide");
                            $(".js-success").removeClass("hide").addClass("show");

                        } else {
                            errorTip("申请失败，请重试。")
                        }
                    },
                    error: function () {
                        errorTip("申请失败，请重试。")
                    }
                });

            });
        });

        $(".js-more").click(function (e) {
            e.preventDefault();
            document.location.href = 'create.html?v=' + Math.random(0, Date.now());
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

    }

    function getUser(openid) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/user/getuser.ashx',
                data: {openid: openid},
                dataType: 'json',
                success: function (result) {
                    // 将当前用户信息存入缓存
                    if (result.Code == 200) {
                        resolve(result.Data)
                    }
                }
            });
        });
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
