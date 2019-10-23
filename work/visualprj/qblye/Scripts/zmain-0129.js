// Allen 2018-01-18 事件相关增加
// 关注词组
var aSubject = [];
// 滑动索引
var subjectIndex = 0;
var pageSize = 10;
var oUser = {};
// 上下滑动数组
var subjectMini = [];

var host = 'http://qbly.ijiebao.com/NewsImage/';
var wxUrl = 'http://qbly.ijiebao.com/wxheadimage/';
// 本地 session
var sd = store.session('state');
// 初始状态
var state = _.isNull(sd) ? {} : sd;
// 滑动数组
var mySwiper = [];
// 包含精选的关注词
var hasChoicenes = [];

var dic = {
    stick: "敏感",
    choiceness: "精选",
    news: "最新",
    event: "事件",
    trade: "行业",
};

var startData;
var lazyArr = [];
var rs;

$(function () {

    var openid = store.session('openid');

    if (openid) {
        // todo 用户微信过来的敏感新闻 id
        var rid = store.session('robotrid');

        if (rid) {
            store.session('robotrid', '');
            // 直接打开敏感新闻
            openNews(rid, openid);
        } else {
            init(openid);
        }
    }

});

// 获得精选判断条件后开始构造DOM
function hasChoiceness(openid) {
    return new Promise(function (resolve, reject) {
        return $.ajax({
            type: 'get',
            url: 'api/report/selectedCount.ashx',
            data: {
                openId: openid
            },
            dataType: 'json'
        }).done(function (result) {

            if (result.Code == 200) {
                resolve(result.Data);
            }

        }).fail(function (err) {
            // alert("error:"+JSON.stringify(err))
        });
    });
}

// 判精选、事件
function filterDic(dic, subject) {
    return _.omitBy(dic, function (k, ii) {
        if (k == "精选" && !_.includes(hasChoicenes.selected, subject)) {
            return true;
        }

        if (k == "事件" && !_.includes(hasChoicenes.events, subject)) {
            return true;
        }

        return false;
    });
}

function init(openid, url) {

    oUser = store.session('curuser');
    aSubject = oUser.Subjects;
    // 记录主屏 swiper 滑屏的索引
    subjectIndex = Number(store.session('qblynewsindex')) || 0;

    // 获取舆情关注词，这块应该在列表构建完毕后再进行
    var sIndestry = store.session('qblyyjSubject');

    if (sIndestry) {
        // 根据舆情关注词，获得应该激活的滑屏索引
        var yjindex = _.indexOf(aSubject, sIndestry);

        if (yjindex > -1) {
            subjectIndex = yjindex;
        }
    }

    var oldsubject = store.session('oldsubject');
    var oldindex = _.indexOf(aSubject, oldsubject);
    if (oldindex > -1) {
        subjectIndex = oldindex;
        store.session('qblynewsindex', subjectIndex)
    } else {
        // 没有包含任何关注词则重置
        store.session('qblynewsindex', 0);
        store.session('oldsubject', aSubject[0]);
    }

    hasChoiceness(openid).then(function (res) {
        var olds = store.session('state');
        hasChoicenes = res;

        if (_.isNull(olds)) {
            olds = {}
        }

        _.forEach(aSubject, function (v) {
            initState(olds, v);
        });

        store.session('state', olds);
        state = _.extend({}, olds);

        rs = Redux.createStore(upDownRducer, state, Redux.applyMiddleware(ReduxThunk));
        rs.subscribe(render);

        buildTab().then(function () {
            var wh = $(window).height();
            var hh = $(".header").height();
            $(".wrap-box").height(wh - hh);

            buildSwipe();

            _.forEach(aSubject, function (v, i) {
                buildContent(v);
            });
            //
            startData = rs.getState();

            // 补充数据
            (function () {
                var v;
                //
                if (subjectIndex > aSubject.length - 1) {
                    subjectIndex = 0;
                    store.session("qblynewsindex", 0)
                }

                v = aSubject[subjectIndex];

                if (aSubject.length > 1) {
                    // olds
                    triggerLoad(v);
                    _.delay(function () {
                        var narr = _.concat([], aSubject);
                        narr.splice(subjectIndex, 1);
                        _.forEach(narr, function (nj) {
                            triggerLoad(nj);
                        })
                    }, 1000);
                }

                if (aSubject.length == 1) {
                    triggerLoad(v);
                }

            }());

            setEvent(openid);
            setTimeout(function () {
                if (url) {
                    openUrl(openid, url);
                }
            }, 1300);

            _.delay(function () {
                store.session('qblyyjSubject', '');
            }, 1000);
        });

    });
}

// 触发加载数据
function triggerLoad(v) {
    var tdic = filterDic(dic, v);

    var olds = store.session('state');
    olds = initState(olds, v);
    store.session('state', olds);

    var timer = 0;

    _.forEach(tdic, function (vl, etitle) {
        var mindex = etitle + v;
        var snum = parseInt(olds[v].scroll[etitle], 10);

        if (_.isUndefined(subjectMini[mindex])) {
            buildContent(v);
        }
        // 无数据加载数据
        if (_.isEmpty(startData[v][etitle])) {
            setTimeout(function () {
                subjectMini[mindex].triggerUpLoading();

            }, timer);
            timer = timer + 80;
        }
        // 有数据渲染
        if (_.size(olds[v][etitle]) > 0) {

            var transData = {
                data: olds[v][etitle],
                etitle: etitle,
                subject: v,
                direction: 0,
                stickNo: false
            };

            renderList(transData);
            if (!_.has(lazyArr, mindex)) {

                lazyArr[mindex] = new LazyLoad({
                    container: document.getElementById(mindex),
                    elements_selector: ".imgLiquid",
                    callback_set: function (element) {
                    }
                });
            }

            lazyArr[mindex].update();
        }
        // 滚动到记录位置
        if (snum > 0) {
            setTimeout(function () {
                subjectMini[mindex].scrollTo(snum, 30);
            }, 500)
        }

        subjectMini[mindex].endUpLoading(false);


    });
}

// 渲染
function render() {
    var newState = rs.getState();
    var mindex = newState.etitle + newState.subject;

    var transData = {
        data: newState["data"],
        etitle: newState["etitle"],
        subject: newState["subject"],
        direction: newState["direction"],
        stickNo: newState["stickNo"]
    };

    var mb = $("#" + transData.subject);

    if (_.has(newState, "direction") && _.size(newState.data) > 0) {

        renderList(transData);
        // up
        if (newState["direction"] == 0) {
            subjectMini[mindex].endUpLoading(false);
        }
        // down
        if (newState["direction"] == 1) {
            subjectMini[mindex].endDownLoading(true);
        }

        if (!_.has(lazyArr, mindex)) {

            lazyArr[mindex] = new LazyLoad({
                container: document.getElementById(mindex),
                elements_selector: ".imgLiquid",
                callback_set: function (element) {
                }
            });
        }

        lazyArr[mindex].update();
    }
    // 上拉无数据
    if (_.has(newState, "direction") && newState.direction === 0 && _.size(newState.data) === 0) {

    }

}

// dir 1 up 0 down 列表渲染
function renderList(tdata) {

    var olds = store.session('state');
    var mb = $("#mini-" + tdata.etitle + tdata.subject);

    if (tdata.stickNo && olds[tdata.subject].nostick) {
        $(".js-stick-no", mb).addClass("no-data");
    }

    var mbox = mb.find(".js-list");
    // 事件
    var eventbox = mb.find(".js-hotsec");
    var liArr = [];

    var wxtpl = $("#wxItemTpl").html();

    var othertpl = $("#otherItemTpl").html();

    if (tdata.etitle === "event") {
        liArr = buildEvent(tdata.data);
        eventbox.append(liArr);
        var mindex = tdata.etitle + tdata.subject;

        mb.find(".minirefresh-upwrap").css({"display": "none"})

    } else {
        liArr = _.map(tdata.data, function (item) {
            return buildItem(item, tdata.subject, tdata.etitle, wxtpl, othertpl);
        });
        if (tdata.dir) {
            mbox.prepend(liArr);
        } else {
            mbox.append(liArr);
        }
        $(".contentList-item", mbox).css("visibility", "visible");
    }


}


function buildEvent(list) {

    var hotlist = list.map(function (v) {
        if (!_.isNull(v.Title)) {
            if (v.Title.length > 18) {
                v.Title = v.Title.substring(0, 18) + "...";
            }
        }
        v.PublishDateTimeStart = _.replace(v.PublishDateTimeStart.substring(0, 10), /-/g, ".");
        v.PublishDateTimeEnd = _.replace(v.PublishDateTimeEnd.substring(0, 10), /-/g, ".");

        return v;
    });

    var ww = $(window).width();
    var sw = ww * 0.84;

    var compiled = _.template($("#hotListTpl").html());
    var slist = compiled({"lists": hotlist});
    var tpl = $("<div></div>");
    tpl.html(slist);

    tpl.find(".js-brand").width(sw / 2);

    return tpl.html();
}

//构建新闻列表中的一条新闻的DOM，这个应该有几种模板对应
function buildItem(item, subject, etitle, wxtpl, othertpl) {
    // oImg.src = 'data:image/png;base64,' + imgurl;
    var time = item.PublishDateTime;
    var tpl;

    if (time) {
        item.time = convertTime(time);
        if (!time) {
            item.time = '今天';
        }
    }

    if (/mp\.weixin\.qq\.com/.test(item.Url)) {
        item.wx = 1;

        if (_.size(item.UserPic) > 1) {
            item.UserPic = wxUrl + _.replace(item.UserPic, /\\/, '\\\/');
        }

        if (!_.isNull(item.VerifyInfo)) {
            if (item.VerifyInfo.length > 16) {
                item.VerifyInfo = item.VerifyInfo.substring(0, 16) + "...";
            }
        }

    } else {
        item.wx = 0;
    }

    if (item.ImageCount == 0) {
        item.ImageUrl = ""
    }

    if (item.ImageCount > 0) {
        item.ImageUrl = host + item.RId.toString().substring(0, 6) + '/' + item.RId;
    }

    if ((item.MediaName).length > 8) {
        item.MediaName = (item.MediaName).substring(0, 8)
    }

    var ww = $(window).width();
    var wx = ww * 0.92;
    var sw = ww * 0.84;

    if (item.wx == 1) {
        tpl = wxtpl;
    } else {
        tpl = othertpl;
    }

    // 根据情况选模板
    var compiled = _.template(tpl);
    var itemHtml = compiled({"item": item, "subject": subject, "etitle": etitle});

    var box = $("<div></div>");
    box.html(itemHtml);

    $(box).find(".js-img").each(function (i, item) {

        if ($(item).hasClass("js-li")) {
            $("li", item).css({"width": sw / 3 + "px", "height": sw * 2 / 9 + "px"});
        }
        // wx one
        if ($(item).hasClass("js-wx")) {
            // $(item).css({"width": wx + "px", "height": wx * 2 / 3 + "px"});
            $(item).css({"width": sw / 3 + "px", "height": sw * 2 / 9 + "px"});
        }

        // other one
        if ($(item).hasClass("js-ot-one")) {
            $(item).css({"width": sw / 3 + "px", "height": sw * 2 / 9 + "px"});
        }

    });

    // console.log(box.html())
    return box.html()
}

// 构造滑动子栏目内容
function buildTab() {

    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: 'api/SubjectAPI.ashx',
            data: {
                cmd: "getLogo",
                names: aSubject.join(",")
            },
            dataType: 'json',
            success: function (result) {
                if (result.Code == 200) {
                    var sr = result.Data;
                    var index = parseInt(subjectIndex, 10) + 1;
                    var compiled = _.template($("#subjectTab").html());
                    var temp = compiled({"subjects": aSubject, "sr": sr});
                    $('#js-inc').append(temp);

                    $('#js-header').tabslet({
                        activeclass: "head-active",
                        container: "#js-tab-box",
                        active: index
                    });

                    aSubject.forEach(function (v, i) {
                        var tdic = filterDic(dic, v);
                        var scompiled = _.template($("#swiperTpl").html());
                        var stemp = scompiled({"datas": {"tdic": tdic, "slide": v}});

                        $('#' + v + 'container .swiper-wrapper').append(stemp);
                    });

                    resolve();
                }
            }
        });
    });
}

// 根据关注词数量构建swipe容器及滑动子标题
function buildSwipe() {
    var olds = store.session('state');

    aSubject.forEach(function (v, i) {
        var tdic = filterDic(dic, v);
        var dics = _.toPairs(tdic);
        mySwiper[v] = new Swiper('#' + v + 'container', {
            autoplay: 0,
            observer: true,
            observeParents: true,
            pagination: {
                el: '#' + v + 'pagination',
                clickable: true,
                bulletActiveClass: 'menu-item--active',
                renderBullet: function (index, className) {
                    return '<li class="' + className + '"><a class="menu-item">' + dics[index][1] + '</a></li>'
                },
            },
            // touchMoveStopPropagation : false,
            on: {
                slideChange: function () {
                    var olds = store.session('state');
                    // 当切换到某个 slider
                    // todo 切换子栏目
                    var index = this.activeIndex;
                    olds[v].active = index;
                    store.session('state', olds);
                }
            }
        });

        mySwiper[v].slideTo(parseInt(olds[v].active, 10), 300);
    });

}

// 上下拉动
function buildContent(v) {
    var ww = $(window).width();
    var hh = $(".header").height();
    var tdic = filterDic(dic, v);
    var tkeys = _.keys(tdic);
    _.forEach(tdic, function (vl, etitle) {
        var mindex = etitle + v;
        subjectMini[mindex] = new MiniRefresh({
            container: "#mini-" + mindex,
            down: {
                progress: 0,
                offset: 90,
                //
                isAllowAutoLoading: true,
                // 初始不自动触发
                isAuto: false,
                // 下拉后也可以上拉
                isAways: true,
                successAnim: {
                    isEnable: false,
                    duration: 1000
                },
                contentdown: '<img src="img/loading.gif">',
                // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: '<img src="img/loading.gif">',
                // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: '<img src="img/loading.gif">',

                callback: function () {
                    var datetime = fecha.format(new Date(), 'YYYY-MM-DD HH:mm');

                    if (etitle !== "event") {
                        rs.dispatch(downRequest({
                            subject: v,
                            etitle: etitle,
                            ctitle: vl,
                            direction: 1,
                            datetime: datetime
                        }));
                    } else {
                        subjectMini[mindex].endDownLoading(true);
                    }
                },
                isWrapCssTranslate: true
            },
            up: {
                isAuto: false,
                toTop: {
                    isEnable: false,
                },
                callback: function () {
                    var olds = store.session('state');
                    olds = initState(olds, v);
                    store.session('state', olds);
                    if (etitle === "event") {
                        rs.dispatch(upEventRequest({
                            subject: v,
                            etitle: etitle,
                            ctitle: vl,
                            direction: 0,
                            page: olds[v].page[etitle] + 1,
                        }));
                    } else {
                        rs.dispatch(upRequest({
                            subject: v,
                            etitle: etitle,
                            ctitle: vl,
                            direction: 0,
                            page: olds[v].page[etitle] + 1,
                        }));
                    }

                },
                onScroll: function () {
                    var scroll = subjectMini[mindex].getPosition();
                    var olds = store.session('state');

                    var index = _.indexOf(tkeys, etitle);

                    var elm = $(subjectMini[mindex].toTopBtn);

                    olds[v].scroll[etitle] = scroll;
                    store.session('state', olds);

                    elm.css({"left": ww - 45 + (index) * ww + "px", "bottom": 2 * hh + "px"});
                }
            }
        });

    });

}

// 全局事件绑定
function setEvent(openid) {
    $("#js-tosearch").click(function (e) {
        e.preventDefault();
        location.href = 'hotevent.html?v=' + Math.random(0, Date.now());
    });

    $('#js-header').on("_after", function (e) {
        var li = $(e.target);
        var index = li.index();
        store.session('qblynewsindex', index);
        store.session('oldsubject', index);
    });

    $('#js-create').click(function () {
        var cindex = store.session('qblynewsindex');
        store.session('oldsubject', aSubject[cindex]);
        document.location.href = 'create.html?v=' + Math.random(0, Date.now());
    });

    $('.js-shezhi').click(function () {
        document.location.href = 'person.html?v=' + Math.random(0, Date.now());
    });

    $(".js-conbox").delegate('.js-rec', 'click', function (event) {
        event.preventDefault();
        var url = $(event.currentTarget).attr('href');
        browseRecord(openid, url);
        window.history.pushState(url, '');
        window.open(url);
    });
    // 媒体点击
    $(".js-conbox").delegate('.js-media', 'click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var $elc = $(event.currentTarget);
        var similarid = $elc.attr("item-similar-id");
        var isClicked = $elc.attr("item-clicked");

        var pitem = $elc.closest(".contentList-item");
        if (isClicked == "0") {
            $.ajax({
                type: 'get',
                url: 'api/report/similarNews.ashx',
                data: {similarid: similarid},
                dataType: 'json',
                success: function (result) {
                    var compiled;
                    var datas;
                    var tpl;
                    if (result.Code == 200) {
                        if (result.Data.length > 0) {
                            compiled = _.template($("#mediaTip").html());
                            datas = result.Data;

                            if (datas.length > 10) {
                                datas = _.take(datas, 10);
                            }

                            datas = _.map(datas, function (v) {
                                if (v.length > 8) {
                                    v = v.substring(0, 8);
                                }
                                return v;
                            });

                            tpl = compiled({"datas": datas});
                            $elc.addClass("src-is-active");
                            pitem.addClass("contentList-item--nopadding");
                            pitem.append(tpl);
                            $elc.attr("item-clicked", 1);

                        }
                    }
                }
            });
        } else {
            $elc.removeClass("src-is-active");
            pitem.removeClass("contentList-item--nopadding");
            pitem.find(".src-drop").remove();
            $elc.attr("item-clicked", 0);
        }

    });
    // 媒体关闭
    $(".js-conbox").delegate('.src-drop', 'click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var sd = $(event.currentTarget);
        var pitem = sd.closest(".contentList-item");
        var $elc = $(".src-is-active", pitem);

        $elc.removeClass("src-is-active");
        pitem.removeClass("contentList-item--nopadding");
        sd.remove();
        $elc.attr("item-clicked", 0);
    });

    // 反馈
    $(".js-conbox").delegate('.js-check', 'click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $a = $(e.currentTarget);

        var $p = $a.closest(".contentList-item");
        var sindex = $a.closest(".js-wrap-box").attr("id");

        var dtitle = $a.attr("data-title");
        var durl = $a.attr("data-url");
        var dmeida = $a.attr("data-meida");
        var rid = $p.attr("itemid");

        $a.qtip({
            content: {
                text: $("#feedbackTip").html()
            },
            style: {
                def: false,
                classes: 'close-box',
                // width: ($(window).width()-20),
                tip: {
                    border: 0,
                    width: 8,
                    height: 8
                }
            },
            position: {
                viewport: $(".js-conbox"),
                my: 'top right',
                at: 'bottom right',
                adjust: {
                    x: -10,
                },
                target: $a
            },
            overwrite: false,
            show: {
                event: event.type,
                ready: true
            },
            hide: {
                event: 'click',
                target: $(".shadow")
            },
            events: {
                show: function (event, api) {
                    $('.shadow').addClass('shadow-bg').show();

                    document.querySelector('.shadow').addEventListener("touchmove", function (e) {
                        e.preventDefault();
                    }, false);

                    var jetitle = $a.attr("data-lan");

                    var tipBox = $(event.currentTarget);

                    // console.log(event, jetitle)

                    if (jetitle === "stick") {
                        $(".js-not-stick", tipBox).css("display", "list-item");
                    }

                    var nref = {
                        up: {
                            isLock: true
                        },
                        down: {
                            isLock: true
                        }
                    };

                    subjectMini[sindex].refreshOptions(nref);
                    $h2 = $(".js-title", $p);


                    $(".js-feed").click(function (e) {
                        console.log(oUser.OpenId)
                        var li = $(e.currentTarget);
                        var feed = $(e.currentTarget).text();
                        var json = {
                            type: 2,
                            rid: $h2.attr("item-rid"),
                            content: feed,
                            OpenId: oUser.OpenId
                        };

                        li.addClass("button--primary");

                        setTimeout(function () {
                            li.removeClass("button--primary");
                        }, 60);

                        $.ajax({
                            type: 'post', //可选get
                            url: 'api/feedback/insert.ashx',
                            data: json,
                            dataType: 'json',
                            success: function (result) {
                                api.hide();
                                $('.shadow').addClass('shadow-bg').show();
                                $('#tip h3').html('提交成功');
                                $('#tip').fadeIn(600);
                                setTimeout(function () {
                                    $('#tip').fadeOut(200);
                                    $('.shadow').hide().removeClass('shadow-bg');

                                }, 2000);

                                $a.empty();
                            },
                            error: function () {
                                api.hide();
                                $('.shadow').addClass('shadow-bg').show();
                                $('#tip i').removeClass("icon-success").addClass("icon-false")
                                $('#tip h3').html('提交失败');

                                $('#tip').fadeIn(600);
                                setTimeout(function () {
                                    $('#tip').fadeOut(200);
                                    $('.shadow').hide().removeClass('shadow-bg');

                                }, 2000);

                                $a.empty();
                            }
                        })
                    });

                    $(".js-nolook").click(function (e) {
                        var li = $(e.currentTarget);
                        var feed = $(e.currentTarget).text();
                        var json = {
                            openid: oUser.OpenId,
                            rid: rid,
                            mediaView: dmeida,
                            title: dtitle,
                            url: durl,
                            description: feed
                        };

                        li.addClass("button--primary");

                        setTimeout(function () {
                            li.removeClass("button--primary");
                        }, 60);

                        $.ajax({
                            type: 'post', //可选get
                            url: 'api/mediaview/insert.ashx',
                            data: json,
                            dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等
                            success: function (result) {
                                api.hide();
                                $('.shadow').addClass('shadow-bg').show();
                                $('#tip h3').html('提交成功');
                                $('#tip').fadeIn(600);
                                setTimeout(function () {
                                    $('#tip').fadeOut(200);
                                    $('.shadow').hide().removeClass('shadow-bg');

                                }, 2000);

                                $a.empty();
                            },
                            error: function () {
                                api.hide();
                                $('.shadow').addClass('shadow-bg').show();
                                $('#tip i').removeClass("icon-success").addClass("icon-false")
                                $('#tip h3').html('提交失败');

                                $('#tip').fadeIn(600);
                                setTimeout(function () {
                                    $('#tip').fadeOut(200);
                                    $('.shadow').hide().removeClass('shadow-bg');

                                }, 2000);

                                $a.empty();
                            }
                        })
                    });
                },
                hide: function (event, api) {
                    $('.shadow').hide().removeClass('shadow-bg');

                    var hideref = {
                        up: {
                            isLock: false
                        },
                        down: {
                            isLock: false
                        }
                    };
                    subjectMini[sindex].refreshOptions(hideref);
                    document.querySelector('.shadow').removeEventListener("touchmove", function (e) {
                        e.preventDefault();

                    }, false);

                    api.destroy();
                },

            }
        }, event);

    });

    // 事件子栏目里事件项点击
    // $(".js-hotsec").on("click", "a", function (e) {
    //     e.preventDefault();
    //     var el = $(e.currentTarget);
    //     var pli = el.closest(".js-brand");
    //     location.href = "event.html?id=" + pli.attr("item-id") + "&from=zmain";
    // });

    // 事件小图标点击
    $(".js-conbox").delegate(".js-event", "click", function (e) {
        var el = $(e.currentTarget);
        // console.log(el)
        var eid = el.attr("eid");
        location.href = "event.html?name=" + encodeURIComponent(eid) + "&from=zmain";
    });
}

function openUrl(openid, url) {
    browseRecord(openid, url, 3);
    document.location.href = url;
}

function convertTime(time) {
    var result = '今天';
    if (time) {
        var date = new Date(time).getTime();
        var now = new Date().getTime();
        var s = (now - date) / 1000;
        if (s >= 24 * 60 * 60) {
            result = parseInt(s / (24 * 60 * 60)) + '天前';
        } else if (s >= 3600) {
            result = parseInt(s / 3600) + '小时前';
        } else if (s >= 60) {
            result = parseInt(s / 60) + '分钟前';
        } else if (s >= 0) {
            result = '刚刚';
        }
    }

    return result;
}

//记录点击
function browseRecord(openid, url, index) {
    var logtype = 2;
    if (index) {
        logtype = index;
    }
    $.ajax({
        type: 'post', //可选get
        url: 'api/user/browseRecord.ashx',
        data: {openid: openid, url: url, logtype: logtype},
        dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等
        success: function (result) {

        },
        error: function () {
            console.log('fetch error!!!');
        }
    });
}

function closeWindow() {
    WeixinJSBridge.call('closeWindow');
}

// 打开新闻，或敏感新闻，rid:0 非敏感
function openNews(rid, openid) {
    $.ajax({
        type: 'get',
        url: 'api/report/getReportEntity.ashx',
        data: {rid: rid},
        dataType: 'json',
        success: function (result) {
            if (result.Code == 200) {
                var data = result.Data;
                var url = data.Url;
                // 新闻所属的关注词
                var Subject = data.Subject;
                // 保存舆情关注词
                store.session('qblyyjSubject', Subject);
                // 初始化页面，传入新闻舆情对应的 url
                init(openid, url);
            } else {
                init(openid);
            }
        },
        error: function () {
            init(openid);
        }
    });
}