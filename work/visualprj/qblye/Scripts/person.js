var oUser = {};
$(function () {
    // alert(JSON.stringify(navigator.userAgent));

    var openid = store.session('openid');
    // var openid = 'ogHAKj0p37NEUbRZH1yWSn1NR_eg';

    if (openid) {
        setUser(openid);
    }

    $('.js-return').click(function () {
        document.location.href = 'zmain.html?v='+Math.random(0, Date.now());
    });

    $('.js-user').click(function () {
        document.location.href = 'user.html?v='+Math.random(0, Date.now());
    });

    $('.js-setting').click(function () {
        document.location.href = 'setting.html?v='+Math.random(0, Date.now());
    });

    $('.js-feedback').click(function () {
        document.location.href = 'feedback.html?v='+Math.random(0, Date.now());
    });

    $('.js-cancel').click(function () {
        $('.shadow').addClass('shadow-bg').show();

        $('#confirm').fadeIn(400);
        //确认取消订阅
        $('#confirmOK').unbind();

        $('#confirmOK').click(function () {
            if (!name) {
                $.ajax({
                    type: 'post',
                    url: 'api/user/cancel.ashx',
                    data: {openid: openid},
                    dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等
                    success: function (result) {
                        if (result.Code == 200) {
                            store.session.remove('curuser');
                            store.session.remove('oldsubject');
                            store.session.remove('qblynewsindex');
                            store.session.remove('qblyyjSubject');
                            store.session.remove('state');

                            setTimeout(function(){
                                closeWindow();
                            }, 30)
                        }
                    },
                    error: function () {
                        console.log('fetch error!!!');
                    }
                });
            }
        });

        $('#confirmCancel').click(function () {
            $('#confirm').fadeOut(400);
            $('.shadow').hide().removeClass('shadow-bg');
        });

    });

});
function closeWindow() {
    // wxJsBridgeReady.call('closeWindow');
    WeixinJSBridge.call('closeWindow');
}
function setUser(openid) {
    var sUser = store.session('curuser');
    var name;

    function setNotic() {
        if (oUser.Headportrait) {
            $('.js-head').attr('src', oUser.Headportrait);
        } else {
            $('.js-head').attr('src', 'img/user.png');
        }

        $('.user__name').html(name);
    }

    if (sUser) {
        oUser = sUser;
        name = oUser.NickName;

        if (!name) {
            $.ajax({
                type: 'get',
                url: 'api/user/getuser.ashx',
                data: {openid: openid},
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        oUser = result.Data;
                        name = oUser.NickName;
                        setNotic();
                    }
                },
                error: function (err) {
                }

            });
        } else {
            setNotic();
        }
    }
}
