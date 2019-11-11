$(function () {
    var index = $.trim(url("?id"));
    var dmData = [
        {
            id: 1,
            name: "中国哪里的姑娘最好看",
            tip: "",
            result: "朋友圈",
            mdtip: ""
        }, {
            id: 2,
            name: "有史以来最伟大的虚拟人物是谁",
            tip: "",
            result: "别人家孩子",
            mdtip: ""
        }, {
            id: 3,
            name: "如何优雅地表达愤怒",
            tip: "",
            result: "用中指推眼镜",
            mdtip: ""
        }, {
            id: 4,
            name: "有什么赞扬让你比较尴尬",
            tip: "",
            result: "人不可貌相",
            mdtip: ""
        }, {
            id: 5,
            name: "什么叫暖男",
            tip: "",
            result: "云备胎",
            mdtip: ""
        }, {
            id: 6,
            name: "杨过为什么要跳崖",
            tip: "",
            result: "父是康",
            mdtip: ""
        }, {
            id: 7,
            name: "十一去北京旅游有什么好的建议",
            tip: "",
            result: "别去",
            mdtip: ""
        }, {
            id: 8,
            name: "有一女孩站在我的左边打一字",
            tip: "",
            result: "妞",
            mdtip: ""
        }, {
            id: 9,
            name: "长痘痘的另一种说法？",
            tip: "",
            result: "可爱的冒泡",
            mdtip: ""
        }

    ];

    $("#md").text(dmData[index].result);
    // $("#mdTip").text(dmData[index].mdtip);

    $(".js-tj").click(function () {
        // 进入运势，先弹gif图，点击后进入
        var l = layer.open({
            type: 0,
            shade: [0.5, '#850c10'],
            time: 3,
            className: 'message message--lantern laytip yx',
            content: $("#layYuanXiaoTpl").html(),
            end:function(){
                document.location.href = 'yuanxiao2018_ys.html';
            }

        });

    });

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
