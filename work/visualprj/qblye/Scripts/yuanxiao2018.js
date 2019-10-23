$(function () {

    var openid = url("?openid") || store.session('openid');


    var test = url("?tid");

    if(test==="test"){
        openid = 'o4eId1jBZxBlr60R9lIZN6J1c_AQ';
    }
    var window_H = $(window).height(); //屏幕的高度
    $('.LanternContainer').css('height', window_H + 'px');

    if (openid) {

        store.session('openid', openid);

        var fm;

        if (/Android/gi.test(navigator.userAgent)) {
            window.addEventListener('resize', function () {
                if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                    window.setTimeout(function () {
                        document.activeElement.scrollIntoViewIfNeeded();
                    }, 0);
                }
            })
        }

        $(".fm").click(function(e){
            var el = $(e.currentTarget);
            $(".fm").removeClass("active");
            el.addClass("active");
            fm = el.attr("data-fm");
        });

        $("#js-tj").click(function(){
            var name = $.trim($("#yname").val());
            if(name.length===0){
                alertTip("请输入你的姓名");
                return;
            }

            if(name.length>10){
                name = name.substring(0, 10);
            }

            if(_.isUndefined(fm)){
                alertTip("请选择你的性别");
                return;
            }

            $.ajax({
                type: 'post',
                url: 'api/UserActivity/Create.ashx',
                data: {openid: openid, name: name, sex: fm},
                dataType: 'json',
                success: function (result) {

                    if (result.Code == 200) {
                        store.session('dmname', name);
                        // 进入灯谜
                        document.location.href = 'yuanxiao2018_dm.html?v=' + Math.random(0, Date.now());
                    }else{
                        alertTip(result.ErrMsg);
                    }

                },
                error: function(err){
                    errorTip("请重试")
                }
            });
        });


    }
});

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
