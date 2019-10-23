var clist;
var searchResult = [];
var imgpath = '/BrandsLogo/';
var mylazy;
var myScroll;

$(function(){
    var openid = store.session('openid');
    if (openid) {
        var sUser = store.session('curuser');

        if (sUser && _.has(sUser, "Subjects")) {

            var t = decodeURIComponent(url('?t'));

            getSubjects().then(function (res) {
                var skey = "";
                clist = res.map(function (v) {
                    v.Logo = imgpath + v.Logo;
                    return v;
                });

                var sh = $(window).height() - $(".header").height() - $(".header-logo").height() - $(".menubar").height();

                $(".brand").height(sh);

                mylazy = new LazyLoad({
                    container: document.getElementById("js-blist"),
                    callback_set: function (element) {}
                });

                // 搜索关注词
                $('.js-search').on('input', function () {
                    var key = $(this).val();
                    skey = key;
                    if ($.trim(key)) {
                        searchResult = [];
                        searchResult = _.filter(clist, function (v) {
                            return _.includes(v.Keywords, key);
                        });

                        if (searchResult.length > 0) {
                            $('.searchNull').fadeOut(function () {
                                buildSubjects(searchResult);
                                $(".brand__list").show();
                            });

                        } else {
                            buildSubjects([]);
                            $('.searchNull').fadeIn();
                            $(".brand__list").css({"display": "none"});
                        }
                    }
                });

                // 关注词添加
                $('#js-blist').on('click', 'li', function (e) {
                    e.preventDefault();

                    var lic = $(e.currentTarget);
                    var key = lic.attr('title');

                    if (_.includes(sUser.Subjects, key)) {
                        layer.open({
                            time: 2,
                            className: 'message message--alert laytip',
                            content: $("#layTipHasTpl").html()
                        })
                    } else {
                        //最多关注3个，如果改变关注词数量限制，修改这里
                        if (_.size(sUser.Subjects) === 3) {
                            layer.open({
                                time: 2,
                                className: 'message message--alert laytip',
                                content: $("#layTipThreeTpl").html()
                            });
                        } else {
                            sUser.Subjects.push(key);

                            $.ajax({
                                type: 'post', //可选get
                                url: 'api/user/createSubjects.ashx',
                                data: {openid: openid, subjects: sUser.Subjects.join(',')},
                                dataType: 'json',
                                success: function (result) {

                                    if (result.Code == 200) {
                                        store.session('curuser', sUser);
                                        var tip = $("<div></div>");
                                        var et = $("#layTipHasTpl");
                                        tip.html(et.html());
                                        tip.find("h3").text("添加"+ key + "关注成功");
                                        layer.open({
                                            time: 2,
                                            className: 'message message--alert laytip',
                                            content: tip.html()
                                        });
                                        // document.location.href = 'zmain.html?v='+Math.random(0, Date.now());
                                        document.location.href = 'create.html?v='+Math.random(0, Date.now());

                                    } else {
                                        layer.open({
                                            time: 2,
                                            className: 'message message--success laytip',
                                            content: $("#layTipErrorTpl").html()
                                        })
                                    }
                                },
                                error: function () {
                                }
                            });

                        }
                    }

                    store.session('curuser', sUser);
                });

                // 返回添加关注词
                $('.return').click(function (e) {
                    e.preventDefault();
                    document.location.href = 'create.html?t=' + encodeURIComponent(t);
                });

                $("#js-skey").click(function (e) {
                    e.preventDefault();
                    location.href = "attention.html?key="+skey;
                });

            });

        }


    }

});

function getSubjects() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'get', //可选get
            url: 'api/SubjectAPI.ashx',
            data: {cmd: 'list'},
            dataType: 'json',
            success: function (result) {
                if (result.Code == 200) {
                    resolve(result.Data);
                }
            },
            error: function () {
                reject()
                //document.location.href = 'create.html';
            }
        });
    });
}

function buildSubjects(list) {
    var ww = $(window).width();
    var sw = ww * 0.76;
    $('.brand__list').html('');
    var compiled = _.template($("#contentTpl").html());
    var slist = compiled({"lists": list});
    var tpl = $("<div></div>");
    tpl.html(slist);

    tpl.find(".js-brand").width(sw / 4);

    $(".brand__list").append(tpl.html());

    mylazy.update();
}
