$(function () {

    var openid = store.session('openid');
    if (openid) {
        var sUser = store.session('curuser');

        if (sUser) {
            if (sUser.Subjects) {
                selectedSubjects = sUser.Subjects;
            }
        }
        var skey = "";
        if (window.location.search.length > 0) {
            skey = decodeURIComponent($.trim(url("?key")))
        }

        $(".js-keyword").val(skey);

        $('.return').click(function (e) {
            e.preventDefault();
            document.location.href = 'create.html?v='+Math.random(0, Date.now());
        });

        // 关注词添加提交
        $(".js-attention-add").click(function (e) {
            e.preventDefault();
            var kw = $.trim($(".js-keyword").val());
            var kc = $.trim($(".js-comment").val());

            if (kw.length == 0) {
                return;
            }

            $.ajax({
                type: 'post',
                url: 'api/feedback/insert.ashx',
                data: {
                    openid: openid,
                    subject: kw,
                    content: kc,
                    type: 1,
                },
                dataType: 'json',
                success: function (result) {
                    if (result.Code != 200) {
                        layer.open({
                            time: 2,
                            className: 'message message--alert laytip',
                            content: $("#layTipErrorTpl").html()
                        })

                    } else {
                        layer.open({
                            time: 2,
                            className: 'message message--success laytip',
                            content: $("#layTipSuccessTpl").html()
                        });

                        $(".js-keyword").val('')
                        $(".js-comment").val('')
                    }
                },
                error: function () {
                    layer.open({
                        time: 2,
                        className: 'message message--alert laytip',
                        content: $("#layTipErrorTpl").html()
                    })
                }
            });
        });
    }


});