$(function () {
    var openid = store.session('openid');

    //点击提交
    $(".js-sub").click(function () {
        var content = $("#content").val();
        if (content.trim() == "") {
            alert("请输入吐槽内容!", 3)
        }
        else {
            $.ajax({
                type: 'post',
                url: 'api/feedback/insert.ashx',
                data: {content: content, openid: openid, type: 0},
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        layer.open({
                            time: 2,
                            className: 'message message--success laytip',
                            content: $("#layTipSuccessTpl").html()
                        });
                        $("#content").val("")
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
        }
    });

    $('.return').click(function () {
        document.location.href = 'person.html?v='+Math.random(0, Date.now());
    });

});