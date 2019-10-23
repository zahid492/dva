var mylazy;
var myScroll;
var openid = store.session('openid');
var host = 'http://qbly.ijiebao.com/NewsImage/';
// 上下滑动数组
var hMini;
var page = 1;
var pageSize = 10;
var imgpath = '/BrandsLogo/';
var tipConfirm = '取消对“{key}”的关注？';
var iconList = [];
var eventImaPath = '/QBLYNewsImage/Events/';
var rPic = /^http.*/i;
// 所有查询到的关注词对象列表
var ynList = [];
$(function () {
    var jnull = $(".js-null");
    var jsec = $(".js-hotsec");
    var h2tit = $("#js-hottit");
    var $hotListBox = $('#js-hotlist');
    var $iv = $("#js-ser input");
    var $dc = $('#dcontent');
    var $dcbox = $(".js-list", $dc);
    var hotlist;
    var hotHead = $("#hotSHeadTpl").html();
    var $info = $("#js-info");
    var sUser = store.session('curuser');

    function transItem(v) {
        if (!_.isNull(v.Title)) {
            if (v.Title.length > 18) {
                v.Title = v.Title.substring(0, 18) + "...";
            }
        }
        v.PublishDateTimeStart = _.replace(v.PublishDateTimeStart.substring(0, 10), /-/g, ".");
        v.PublishDateTimeEnd = _.replace(v.PublishDateTimeEnd.substring(0, 10), /-/g, ".");

        if (!rPic.test(v.PicUrl)) {
            v.PicUrl = eventImaPath + v.PicUrl;
        }

        return v;
    }

    getHotList("").then(function (res) {

        var sh = $(window).height() - $(".header").height();

        // $(".hot").height(sh);

        mylazy = new LazyLoad({
            container: document.getElementById("js-hotlist"),
            callback_set: function (element) {
            }
        });

        hotlist = res.map(function (v) {
            return transItem(v);
        });

        buildList(hotlist);

        var pt = "/";

        if(url('path').indexOf("dev")>-1){
            pt = "/dev/"
        }

        if(url('path').indexOf("test")>-1){
            pt = "/test/"
        }

        // 点击事件
        $hotListBox.on("click", "a", function (e) {
            e.preventDefault();
            var el = $(e.currentTarget);
            var pli = el.closest(".js-brand");
            var itype = $(e.currentTarget).attr("item-type");

            var turl = url('protocol') + "://" + url('hostname') +":"+ url('port') + pt;


            if(itype == 2) {
                turl += "event.html?id=" + pli.attr("item-id") + "&from=zmain&v=" + Math.random(0, Date.now());
            }

            if (itype == 4) {
                turl += "eventBrand315.html?id=" + pli.attr("item-id") + "&sty=315" + "&from=zmain&v=" + Math.random(0, Date.now());
            }

            if (itype == 5) {
                turl += "315eventTrace.html?id=5aa9278cbaea2922cc53d77d&sty=315" + "&from=zmain&v=" + Math.random(0, Date.now());
            }

            if (itype == 3) {
                turl += "eventBrand.html?id=" + pli.attr("item-id") + "&from=zmain&v=" + Math.random(0, Date.now());
            }


            jb.ajx.browseRecord({openid: openid, url:turl, logtype: 4}).then(function(){
                location.href = turl;
                return;
            });
        });

        $('.tab__nav .tit').on("click", function (e) {
            var el = $(e.currentTarget);
            var index = el.index();
            el.addClass('active').siblings('.tit').removeClass(
                'active');
            $('.tab__con').removeClass('tab__con--active');
            $('.tab__con').eq(index).addClass('tab__con--active');
        });

    });

    // 搜索按钮
    $("#js-ser").on("click", ".js-i", function (e) {
        var vl = $.trim($iv.val());
        // $iv.val("");
        $iv.blur();
        search(vl);
    });
    // 回车
    $("#js-ser").on("keyup", " input", function (e) {
        var el = $(e.currentTarget);
        var vl = $.trim(el.val());
        if (e.keyCode === 13) {
            // el.val("");
            el.blur();
            search(vl);
        }
    });

    function search(vl) {
        $("#gzYes").removeClass("show").addClass("hide");
        $("#gzNo").removeClass("show").addClass("hide");
        $("#split1").removeClass("show").addClass("hide");

        page = 1;
        // $(".data").empty();
        renderHead('7', {
            AllNewsCount: 0,
            ForwardNewsCount: 0,
            OriginalNewsCount: 0
        });
        renderHead('30', {
            AllNewsCount: 0,
            ForwardNewsCount: 0,
            OriginalNewsCount: 0
        });
        renderHead('90', {
            AllNewsCount: 0,
            ForwardNewsCount: 0,
            OriginalNewsCount: 0
        });

        if (vl.length === 0) {
            alertTip("请填写搜索内容！")
        } else {
            sUser = store.session('curuser');
            Promise.all([getHotList(vl), getSubjects(vl, "listByVal"), getLogo(sUser.Subjects)]).then(function (res) {
                h2tit.css("display", "none");
                $hotListBox.empty();
                $dcbox.empty();
                $info.show();
                iconList = res[2].map(function (v) {
                    v.Logo = imgpath + v.Logo;
                    return v;
                });
                res[1] = res[1].map(function (v) {
                    v.Logo = imgpath + v.Logo;
                    return v;
                });
                ynList = _.uniqBy(_.concat(iconList, res[1]), "Name");

                if (res[0].length > 0) {
                    $hotListBox.show();
                    hotlist = res[0].map(function (v) {
                        return transItem(v);
                    });

                    $(".js-line").removeClass("bgwhite");

                    buildList(hotlist);
                } else {
                    $hotListBox.hide();
                    $(".js-line").addClass("bgwhite");

                    var ch = $(window).height() - 20 - $(".header").height() - $(".tab").height() - $(".js-line").height();

                    if (ch > 300) {
                        $dc.height(ch)
                    }

                }

                getSHead({id: vl, days: 7}).then(function (res) {
                    renderHead('7', res)
                });

                getSHead({id: vl, days: 30}).then(function (res) {
                    renderHead('30', res)
                });

                getSHead({id: vl, days: 90}).then(function (res) {
                    renderHead('90', res)
                });

                buildMini(vl);

                // 关注词相关操作
                var gzYesBox = $("#gzYes ul");
                var gzNoBox = $("#gzNo ul");

                if (res[1].length > 0) {
                    $("#gzYes").removeClass("hide").addClass("show");
                    $("#gzNo").removeClass("hide").addClass("show");
                    $("#split1").removeClass("hide").addClass("show");

                    // 显示当前关注词
                    gzYesBox.empty().append(gzYNDom(ynList, iconList, sUser.Subjects, "1"));
                    // 显示搜索到的相关关注词，包含已关注的
                    gzNoBox.empty().append(gzYNDom(ynList, res[1], sUser.Subjects, "0"));

                    $('#gzYes').on('click', 'li', function (e) {
                        var $lic = $(e.currentTarget);
                        //确认是否取消
                        var key = $lic.attr('title');
                        var tipContent = tipConfirm.replace('{key}', key);
                        var lctip = $("#layTipCancelTpl").html();
                        var tpl = $("<div></div>").html(lctip);
                        tpl.find("h3").text(tipContent);

                        sUser = store.session('curuser');

                        if (sUser.Subjects.length > 1) {
                            // 取消关注
                            layer.open({
                                className: 'messageBox message message--alert laytip',
                                content: tpl.html(),
                                btn: ['取消', '确定'],
                                no: function (index) {
                                    // 实际为确定按钮
                                    _.pull(sUser.Subjects, key);
                                    gzSubmit(sUser.Subjects, function () {
                                        store.session('curuser', sUser);
                                        gzYesBox.empty().append(gzYNDom(ynList, iconList, sUser.Subjects, "1"));
                                        gzNoBox.empty().append(gzYNDom(ynList, res[1], sUser.Subjects, "0"));
                                        layer.close(index);
                                    })
                                },
                                yes: function (index) {
                                    layer.close(index);
                                }
                            });
                        } else {
                            // 提示不能少于1个关注
                            errorTip("至少要关注 1 个")
                        }

                    });

                    $('#gzNo').on('click', 'li', function (e) {
                        var $lic = $(e.currentTarget);
                        var hsgz = $lic.hasClass("active");
                        //确认是否取消
                        var key = $lic.attr('title');
                        var tipContent = tipConfirm.replace('{key}', key);
                        var lctip = $("#layTipCancelTpl").html();
                        var tpl = $("<div></div>").html(lctip);
                        tpl.find("h3").text(tipContent);

                        sUser = store.session('curuser');

                        if (hsgz) {

                            if (sUser.Subjects.length > 1) {
                                // 取消关注
                                layer.open({
                                    className: 'messageBox message message--alert laytip',
                                    content: tpl.html(),
                                    btn: ['取消', '确定'],
                                    no: function (index) {
                                        // 实际为确定按钮
                                        _.pull(sUser.Subjects, key);
                                        gzSubmit(sUser.Subjects, function () {
                                            store.session('curuser', sUser);
                                            gzYesBox.empty().append(gzYNDom(ynList, iconList, sUser.Subjects, "1"));
                                            gzNoBox.empty().append(gzYNDom(ynList, res[1], sUser.Subjects, "0"));
                                            layer.close(index);
                                        })
                                    },
                                    yes: function (index) {
                                        layer.close(index);
                                    }
                                });
                            } else {
                                // 提示不能少于1个关注
                                errorTip("至少要关注 1 个")
                            }

                        } else {

                            if (sUser.Subjects.length === 3) {
                                errorTip("最多关注 3 个")
                            } else {
                                sUser.Subjects.push(key);
                                gzSubmit(sUser.Subjects, function () {
                                    store.session('curuser', sUser);
                                    gzYesBox.empty().append(gzYNDom(ynList, iconList, sUser.Subjects, "1"));
                                    gzNoBox.empty().append(gzYNDom(ynList, res[1], sUser.Subjects, "0"));
                                });
                            }

                        }

                    });
                }
                else {

                }

            })
        }
    }

    // 提交关注
    function gzSubmit(subjects, callback) {
        $.ajax({
            type: 'post', //可选get
            url: 'api/user/createSubjects.ashx',
            data: {openid: openid, subjects: subjects.join(',')},
            dataType: 'json',
            success: function (result) {
                if (result.Code == 200) {
                    callback();
                } else {
                    errorTip("关注失败，请重新关注")
                }
            },
            error: function () {
                errorTip("关注失败，请重新关注")
            }
        });
    }

    // 生成关注列表
    function gzYNDom(ynList, iconList, gzlist, gz) {
        var lists;
        if (gz === "0") {
            lists = _.map(iconList, function (v) {
                var index = _.findIndex(ynList, {Name: v.Name});
                var checked = _.includes(gzlist, v.Name);
                return {
                    Name: v.Name,
                    Logo: v.Logo,
                    checked: checked
                };
            });
        } else {
            lists = _.map(gzlist, function (v) {
                var index = _.findIndex(ynList, {Name: v});

                return {
                    Name: ynList[index].Name,
                    Logo: ynList[index].Logo,
                    checked: true
                };
            });
        }

        //
        // var lists = _.map(list, function (sb) {
        //     var sbi = _.findIndex(iconList, {"Name": sb});
        //
        //     var checked = _.includes(gzlist, sb);
        //
        //     if (sbi !== -1) {
        //         return {
        //             Name: iconList[sbi].Name,
        //             Logo: iconList[sbi].Logo,
        //             checked: checked
        //         };
        //     }
        // });
        var compiled = _.template($("#gzListTpl").html());
        return compiled({"lists": lists, "gz": gz});
    }

    // 获取系统所有关注词图标信息
    function getSubjects(val, cmd) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get', //可选get
                url: 'api/SubjectAPI.ashx',
                data: {
                    cmd: cmd,
                    val: val
                },
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
        })

    }

    // 退出
    $('.js-esc').click(function (e) {
        e.preventDefault();
        document.location.href = 'zmain.html?v=' + Math.random(0, Date.now());
    });

    // 搜索的信息列表
    function buildSearchList(list) {
        var compiledList = _.template($("#hotSListTpl").html());

        var hotlist = list.map(function (v) {
            if (!_.isNull(v.Title)) {
                if (v.Title.length > 32) {
                    v.Title = v.Title.substring(0, 32) + "...";
                }
            }
            if (!_.isNull(v.MediaName)) {
                if (v.MediaName.length > 12) {
                    v.MediaName = v.MediaName.substring(0, 12) + "...";
                }
            }

            var time = v.PublishDateTime;

            if (time) {
                v.time = convertTime(time);
                if (!time) {
                    v.time = '今天';
                }
            }

            return v;
        });

        var slist = compiledList({"lists": hotlist});

        $dcbox.append(slist);
    }

    // 热门事件
    function buildList(list) {
        jnull.css({"display": "none"});
        jsec.css({"display": "block"});

        var ww = $(window).width();
        var sw = ww * 0.88;

        var compiled = _.template($("#hotListTpl").html());
        var slist = compiled({"lists": list});
        var tpl = $("<div></div>");
        tpl.html(slist);

        tpl.find(".js-brand").width(sw / 2);

        $hotListBox.append(tpl.html());

        mylazy.update();
    }

    // 事件搜索
    function getHotList(txt) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/events/f_hotEvents.ashx',
                dataType: 'json',
                data: {
                    val: txt
                },
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    }
                },
                error: function () {
                    reject()
                }
            });
        });
    }

    // 事件搜索信息部分
    function getSList(opt) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/search/GetRecordsDetail.ashx',
                data: {
                    val: opt.id,
                    page: opt.page,
                    pageSize: pageSize
                },
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    }
                },
                error: function () {
                    reject()
                }
            });
        });
    }

    // 事件搜索统计信息
    function getSHead(opt) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/search/GetRecordsSummary.ashx',
                data: {
                    val: opt.id,
                    days: opt.days,
                },
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    }
                },
                error: function () {
                    reject()
                }
            });
        });
    }

    function getLogo(subjects) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/SubjectAPI.ashx',
                data: {
                    cmd: "getLogo",
                    names: subjects.join(",")
                },
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    } else {
                        reject("logo")
                    }
                }
            });
        });
    }

    // 统计信息
    function renderHead(id, res) {
        var $h = $('#d' + id);
        var $head = $(".data", $h);
        $head.empty();
        var compiledHead = _.template(hotHead);

        var shead = compiledHead({
            AllNewsCount: numSplit(res.AllNewsCount),
            ForwardNewsCount: numSplit(res.ForwardNewsCount),
            OriginalNewsCount: numSplit(res.OriginalNewsCount)
        });

        $head.append(shead);
    }

    // 信息列表
    function buildMini(val) {
        var pheight = $(window).height() - 20 - $(".tab").height() - $(".js-line").height();

        hMini = new MiniRefresh({
            container: "#dcmin",
            down: {
                isLock: true,
            },
            up: {
                isAuto: true,
                toTop: {
                    isEnable: false,
                },
                loadFull: {
                    isEnable: false,
                    delay: 200,
                },
                onPull: function (downHight, downOffset) {
                    // console.log(downHight, downOffset)
                },
                callback: function () {
                    var opt = {
                        id: val,
                        page: page
                    };

                    getSList(opt).then(function (res) {

                        if (res.length > 0) {
                            jsec.css({"display": "block"});
                            jnull.css({"display": "none"});
                            buildSearchList(res);
                            hMini.endUpLoading(false);
                            page = page + 1;

                        } else {
                            if (page === 1) {
                                jsec.css({"display": "none"});
                                jnull.css({"display": "block"});
                            }

                            hMini.endUpLoading(true);
                        }

                    });
                },
                onScroll: function (dy) {
                    var ch;
                    if (dy > 50) {
                        ch = pheight - $(".header").height();
                        $hotListBox.slideUp(300);

                        $dc.height(ch);
                    } else {
                        ch = pheight - $(".header").height();
                        $hotListBox.slideDown(300);

                        $dc.height(ch);
                    }
                }
            }
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

    function numSplit(str) {
        if (_.toString(str).length < 3) {
            return str
        }

        if (!_.isUndefined(str)) {
            if (str <= 0) {
                str = 0;
            }
            return _.reverse(_.map(_.reverse(_.toArray(_.toString(str))), function (c, i) {
                if (i % 3 == 0 && i !== 0) {
                    return c + ","
                } else {
                    return c;
                }
            })).join("");
        } else {
            return ""
        }
    }

    function convertTime(time) {
        var date = new Date(time).getTime();
        var now = new Date().getTime();
        var s = (now - date) / 1000;

        var result;

        switch (true) {
            case s >= (6 * 24 * 60 * 60):
                result = formatDate(time, "-");
                break;
            case s >= (24 * 60 * 60):
                result = Math.ceil(s / (24 * 60 * 60)) + '天前';
                break;
            case s >= 3600:
                result = Math.ceil(s / 3600) + '小时前';
                break;
            default:
                result = Math.ceil(s / 60) + '分钟前';

        }
        return result;
    }

    function formatDate(date) {
        var arg1 = _.toArray(arguments)[1];
        var sep = _.isUndefined(arg1) ? "-" : arg1;
        var tdate = fecha.parse(date, 'YYYY-MM-DD');
        return fecha.format(tdate, 'YYYY' + sep + 'MM' + sep + 'DD');
    }

});

