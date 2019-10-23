$(function () {

    var rid = store.session('rid') || url('?rid');
    var openid = store.session('openid') || url('?openid');
    // var hasrid = store.get('hasrid');
    var test = url("?tid");

    if (test === "test") {
        openid = 'o4eId1jBZxBlr60R9lIZN6J1c_AQ';

        window.vConsole = new window.VConsole({
            defaultPlugins: ['system', 'network', 'element', 'storage'],
            maxLogNumber: 1000,
            onReady: function () {
            }
        });
    }


    if (openid) {

        $(".tbtn").click(function (e) {
            e.preventDefault();
            createUser(openid);
        });

        store.session('openid', openid);
        // && (_.isNull(hasrid) || store.get('hasrid')!== rid )
        if (rid) {
            store.session('robotrid', rid);
            // store.set('hasrid', rid);
            jb.ajx.browseRecord({openid: openid, url: document.URL, logtype: 1}).then(function(){
                getUser();
            });
        }else{
            getUser()
        }

    }

    function getUser() {
        $.ajax({
            type: 'get',
            url: 'api/user/getuser.ashx',
            data: {openid: openid},
            dataType: 'json',
            success: function (result) {
                // 将当前用户信息存入缓存
                if (result.Code == 200) {
                    var user = result.Data;
                    if (user) {
                        var keys = user.Subjects;

                        store.session('curuser', user);

                        //是否创建过关注词
                        if (keys && keys.length > 0) {
                            document.location.href = 'zmain.html?v=' + Math.random(0, Date.now());
                            //已经创建过关键词去新闻列表页(首页)
                        } else {
                            document.location.href = 'create.html?v=' + Math.random(0, Date.now());
                        }

                    } else {
                        $(".swiper-container").show();
                        new Swiper('.swiper-container', {
                            autoplay: 0
                        });
                    }

                } else {
                    if (result.ErrMsg == "nouser") {
                        $(".swiper-container").show();
                        new Swiper('.swiper-container', {
                            autoplay: 0
                        });
                    }
                }
            }
        });
    }

//添加用户
    function createUser(openid) {
        $.ajax({
            type: 'post',
            url: 'api/user/create.ashx',
            data: {openid: openid},
            dataType: 'json',
            success: function (result) {
                if (result.Code == 200) {
                    store.session('curuser', result.Data);
                    document.location.href = 'create.html?v=' + Math.random(0, Date.now());
                }
            }
        });
    }

});

