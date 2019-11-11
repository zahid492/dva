var pageTo1;
var pageTo2;
var ptimer = undefined;
var lineIns;
var ps;
var delayer = undefined;
var ban2dom = undefined;
var p2 = null;
var Chimee = window.Chimee;
Chimee.install(chimeePluginCenterState);
var skip = Boolean(url("?skip"));
var nextPage;
var list2 = [];
var topData = [];
// 每个游戏播放n个数量素材，然后进入下个游戏，到最后游戏进入下页。再次进入页面播放后n个素材。
// fourGamePlayCount 离开页面时，记录播放位置
// 手动切换媒体，则重新开始计数
var playlist = [];
var videoList = {
    pvIndex: 0,
    pos: [],
    player: []
};
var playGameTime = undefined;
var endtime = undefined;
var psw = [];
var sw = [];

$(function () {
    // jb.util.console();

    var accesstoken = url("?accesstoken");
    if (!_.isUndefined(accesstoken)) {
        store.set("accesstoken", accesstoken);
    }

    jb.ui.headRun();

    var dataTime = {};

    run();
    // 配置更新 展示规则

    jb.util.interval({
        time: config.updateConfig,
        cb: function () {
            jb.ajx.config({
                cb: function (con) {
                    config = _.assignIn(config, con);

                    // 曝光排名和固定游戏
                    var hasNew = jb.util.isNewConfig(config, ["game_show_rule", "game_show_names", "material_source_publish", "second_checked", "second_time", "seconddetail_time", "seconddetail_material_count", "video_loops", "updatetime"]);
                    if (hasNew) {

                        if(videoList.player.length>0){

                            jb.ui.pauseAll();
                            jb.ui.disposeAll();
                            videoList = {
                                pvIndex: 0,
                                pos: [],
                                player: []
                            };

                            console.log("stop cur on change game")
                        }

                        _.delay(function () {
                            jb.ui.headTime(config.headtime);
                        }, 600);

                        ps.slideTo(0, 100, true);
                        ps.autoplay.stop();
                        // 刷新已经代替

                        // if (!_.isUndefined(psw) && !psw.destroyed) {
                        //     psw.destroy();
                        // }
                        //
                        // _.forEach(sw, function (v) {
                        //     if (!_.isNull(v) && !_.isUndefined(v) && !v.destroyed) {
                        //         v.destroy()
                        //     }
                        //
                        // });

                        window.clearTimeout(ptimer);
                        window.clearTimeout(delayer);
                        // window.clearTimeout(pageTo2);
                        window.clearTimeout(playGameTime);

                        playGameTime = undefined;
                        // 配置更改清除播放列表
                        store.session.remove("secondPlayList");
                        store.session("config", config);
                        reqtopFiveImpressionsGame(config);
                    }

                }
            });
        }
    });

    ps = new Swiper("#page", {
        autoplay: {
            delay: (skip == true && config.second_checked === 0) ? config.second_time * 1000 : config.delay1to2,
        },
        allowTouchMove: false,
        initialSlide: 0,
        // effect : 'fade',
        // fadeEffect: {
        //     crossFade: true,
        // },
        speed: 1000,
        on: {
            slideChangeTransitionStart: function () {
                // opt.ban2dom(this.activeIndex);
            },
            slideChangeTransitionEnd: function () {
            }
        }
    });
    ps.autoplay.stop();

    function run() {
        clearTimeout(ptimer);

        // todo
        jb.ajx.config({
            cb: function (con) {
                store.session.remove("secondPlayList");
                config = _.assignIn(config, con);
                store.session("config", config);
                // 刷新不用销毁了

                clearTimeout(ptimer);
                clearTimeout(playGameTime);
                playGameTime = undefined;
                window.clearTimeout(delayer);

                _.delay(function () {
                    jb.ui.headTime(config.headtime);
                }, 600);

                reqtopFiveImpressionsGame(config);
            }
        });
    }

    function reqtopFiveImpressionsGame(config) {

        var games = "";

        if (config.game_show_rule) {
            games = _.trim(config.game_show_names);
        }

        jb.ajx.request({
            url: api.topFiveImpressionsGame,
            data: {
                games: games
            }
        }).then(function (resa) {
            var res = resa.body.data;

            $(".js-week").text("(" + jb.util.weekDay(res.start, res.end) + ")");
            // 底部获取后更新获取数据时间
            $("#js-getDate").text(jb.util.unix2day(res.end + 3600 * 24));

            dataTime.start = res.start;
            dataTime.end = res.end;
            // todo

            if (_.size(res.gamelist) === 0) {
                ps.autoplay.stop();
                // return;
            }
            // 根据游戏名称查询优秀素材,微信指数，appstore榜单
            var trendParam;

            // 固定游戏展示
            if (config.game_show_rule) {
                trendParam = {
                    gameName: _.trim(config.game_show_names)
                };
                $("#baotao").text("投放TOP 5（近7日）");
            } else {
                trendParam = {
                    gameName: _.map(res.gamelist, "gamename").join(";")
                };
                $("#baotao").text("曝光量TOP 5（近7日）");
            }

            if (res.length === 0) {
                return;
            }

            Promise.all([jb.ajx.request({
                url: api.gameLogo,
                data: trendParam
            }), jb.ajx.request({
                url: api.trend,
                data: {
                    games: trendParam.gameName
                },
            }), jb.ajx.request({
                url: api.info,
                data: trendParam,
            })]).then(function (rd) {

                var logos = rd[0].body.data;
                var fz = jb.util.getFontSize();
                var logoNull = {
                    logo: "img/logo2.png",
                    icon: "img/iconx.png",
                    name: ""
                };
                // 2屏构造变量
                var p2 = {
                    psw: [],
                    sw: []
                };

                topData = res.gamelist;
                logos = _.map(res.gamelist, function (v, i) {
                    var li = _.findIndex(logos, {name: v.gamename});
                    if (li === -1) {
                        var temp = _.extend({}, logoNull);
                        temp.name = v.gamename;
                        return temp;
                    } else if (_.isNull(logos[li].icon) || _.isUndefined(logos[li].icon) || logos[li].icon === "") {
                        logos[li].icon = "img/iconx.png";
                        if (_.isNull(logos[li].logo) || _.isUndefined(logos[li].logo) || logos[li].logo === "") {
                            logos[li].logo = "img/logo2.png";

                        }
                    } else if (_.isNull(logos[li].logo) || _.isUndefined(logos[li].logo) || logos[li].logo === "") {
                        logos[li].logo = "img/logo2.png";

                    }
                    return logos[li]


                });

                pageTo2 = function (to) {
                    to = to || 0;
                    if (skip == true && config.second_checked === 0) {
                        ps.slideTo(1, 1000, true);
                        if (p2.psw.length > 0) {

                            jb.ui.page22action(p2.psw, p2.sw, {
                                list: list2,
                                chart: p2.chart,
                                hasVdata: p2.hasVdata,
                                app30en: p2.app30en,
                                to: to,
                            });
                        } else {
                            nextPage(res.gamelist, to);
                        }
                        // 底部获取后更新获取数据时间
                        $("#js-footdes").text("数据来源：广告投放曝光点击数据来源O2系统和第三方监测公司，AppStore榜单来源企鹅风讯，微信搜索指数来源腾讯微信；");
                    } else {
                        return _.delay(function () {
                            ps.slideTo(1, 1000, true);
                            if (p2.psw.length > 0) {
                                console.log("act page")
                                jb.ui.page22action(p2.psw, p2.sw, {
                                    list: list2,
                                    chart: p2.chart,
                                    hasVdata: p2.hasVdata,
                                    app30en: p2.app30en,
                                    to: to,
                                });
                            } else {
                                console.log("new page")
                                nextPage(res.gamelist, to);
                            }
                            // 底部获取后更新获取数据时间 todo 板块4

                            $("#js-footdes").text("数据来源：广告投放曝光点击数据来源O2系统和第三方监测公司，AppStore榜单来源企鹅风讯，微信搜索指数来源腾讯微信；");
                        }, (skip == true && config.second_checked === 0) ? config.second_time * 1000 : config.delay1to2);
                    }
                };

                pageTo1 = function () {

                    jb.ui.pauseAll();
                    jb.ui.disposeAll();

                    playGameTime = undefined;
                    window.clearTimeout(delayer);
                    location.replace(location.href)
                    return;

                    // window.clearTimeout(playGameTime);
                    //
                    // if (skip === true) {
                    //     jb.util.time2Url({
                    //         url: '/third.html?skip=true',
                    //         time: 100
                    //     });
                    //     return;
                    // }
                    //
                    // ps.slideTo(0, 1000, true);
                    //
                    // $("#js-getDate").text(jb.util.unix2day(res.end + 3600 * 24));
                    // $("#js-footdes").text("数据来源：广告投放曝光点击数据来源O2系统和第三方监测公司；");
                    //
                    // ptimer = pageTo2(0);
                };

                // build
                var top5dom = $("#js-top5");
                top5dom.empty();
                jb.ui.tpl({
                    tpl: $("#topFiveTpl").html(),
                    dom: top5dom,
                    data: {list: res.gamelist, logos: logos, en2num: en2num, colorSeq: colorSeq, medalImg: medalImg}
                });
                //
                jb.ui.page21({
                    topData: topData
                });
                // // 11 animation list
                ps.on("slideChangeTransitionStart", function () {
                    if (ps.activeIndex === 0) {
                        anime({
                            targets: '.exposure-con__item',
                            // height: [0, 1.58 * fz],
                            // opacity: [0, 1],
                            opacity: 1,
                            duration: function (el, i, l) {
                                return 500 + (i * 500);
                            },
                            easing: 'easeInOutQuad'
                        });
                    }

                });

                if (ps.isBeginning) {
                    anime({
                        targets: '.exposure-con__item',
                        height: [0, 1.58 * fz],
                        opacity: [0, 1],
                        // opacity: 1,
                        duration: function (el, i, l) {
                            return 100 + (i * 100);
                        },
                        easing: 'easeInOutQuad'
                    });
                }

                // event
                $("#js-top5 .js-topitem").unbind("click").bind("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    clearTimeout(ptimer);
                    var el = $(e.currentTarget);
                    var eindex = el.index() / 2;

                    ps.slideTo(1, 2000, true);

                    if (p2.psw.length > 0 && eindex !== 0) {
                        jb.ui.page22action(p2.psw, p2.sw, {
                            list: list2,
                            chart: p2.chart,
                            hasVdata: p2.hasVdata,
                            app30en: p2.app30en,
                            to: eindex,
                        });
                    } else {
                        nextPage(res.gamelist, eindex);
                    }

                });

                // action
                if (_.size(topData) !== 0 && skip === true && config.second_checked === 0) {
                    _.delay(function () {
                        ptimer = pageTo2(0);
                    }, config.second_time * 1000)

                } else {
                    _.size(topData) !== 0 && (ptimer = pageTo2(0));
                }

                var r = rd[1].body.data;
                var info = rd[2].body.data;

                _.forEach(topData, function (v, i) {
                    var infoIndex = _.findIndex(info, function (w) {
                        return w.name === v.gamename
                    });

                    if (infoIndex > -1) {
                        var infoV = info[infoIndex];

                        if (_.size(infoV.images) > 0) {
                            _.forEach(infoV.images, function (w, j) {
                                if (jb.util.hasVideo(w.path)) {
                                    videoList.pos.push({pIndex: i, curIndex: j})
                                }
                            })
                        }
                    }

                });

                console.log("videoList:", videoList);

                playlist = _.map(info, function (v) {
                    var vlen = _.size(v.images);
                    var pl;

                    if (vlen > 0) {
                        // 固定个数
                        if (config.second_checked === 1 && skip === true) {
                            pl = _.chunk(_.range(vlen), config.seconddetail_material_count);
                            return {
                                name: v.name,
                                // 播放列表
                                pl: pl,
                                posMax: pl.length - 1,
                                // 子列表序号
                                posGroup: 0,
                                // 子列表播放位置等于 curIndex
                                posIndex: 0,
                                // remList: remList,
                            }
                        }
                        // 固定时间
                        if (config.second_checked === 0 || !skip) {
                            return {
                                name: v.name,
                                // 播放列表
                                pl: _.chunk(_.range(vlen), vlen),
                                posMax: vlen - 1,
                                // 子列表序号
                                posGroup: 0,
                                // 子列表播放位置等于 curIndex
                                posIndex: 0,
                                // remList: remList,
                            }
                        }
                    }
                });

                var pt = store.session("secondPlayList");

                if (_.isUndefined(pt) || _.isNull(pt)) {
                    store.session("secondPlayList", playlist);
                } else {
                    // 需要严格检查，媒体数量变化
                    playlist = _.extend(playlist, pt);
                    store.session("secondPlayList", playlist);
                }

                nextPage = function nextPage(topData, to) {

                    if (_.size(topData) === 0) {
                        return;
                    }


                    var curArr = jb.ui.getSeq(topData, to);
                    console.log(curArr)

                    list2 = _.map(curArr[0], function (v, i) {
                        topData[v].seq = v;
                        return topData[v]
                    });

                    // 两边数据不一致，可能包含undefined
                    r = _.compact(_.map(topData, function (v, i) {
                        var rintop = _.findIndex(r, {gameName: v.gamename});
                        if (rintop > -1) {
                            return r[rintop];
                        }

                    }));

                    r = _.map(r, function (v, i) {
                        v.wechatlist = _.map(v.weChatList, function (w, j) {
                            w.day = jb.util.unix2dayNoYear(w.date, ".");
                            return w;
                        });

                        v.appstorelist = _.map(v.appstoreList, function (w, j) {
                            w.day = jb.util.unix2dayNoYear(w.date, ".");
                            return w;
                        });

                        v.gtype = 0;

                        var logoi = _.findIndex(logos, {name: v.gameName});

                        if (logoi > -1) {
                            v.gtype = logos[logoi].type || 0;
                        }
                        return v;
                    });


                    var listLogos = _.map(curArr[0], function (v, i) {
                        logos[v].seq = v;
                        return logos[v]
                    });

                    // 滑动容器构造 build
                    var slidedom = $("#page2slide .swiper-wrapper");
                    slidedom.empty();
                    //
                    topData = _.map(topData, function (v) {
                        var t = _.maxBy(v.gamelist, function (w) {
                            return w.impressions;
                        });
                        v.maxi = t.impressions * 1.2;
                        if (v.maxi === 0) {
                            v.maxi = 1;
                        }
                        v.gamelist = _.map(v.gamelist, function (w) {
                            if ((typeof w.date) === "number") {
                                w.date = jb.util.unix2day(w.date, ".")
                            }

                            return w;
                        });

                        return v;
                    });

                    try {
                        ban2dom = jb.ui.ban2({
                            list: listLogos,
                            index: to,
                            data: topData,
                            baseIconWidth: 52,
                            dx: 21,
                            maxHeight: 90,
                        });
                    } catch (e) {
                        console.log(e)
                    }

                    try {
                        jb.ui.tpl({
                            tpl: $("#slideTpl").html(),
                            dom: slidedom,
                            data: {list: topData, dataTime: dataTime, slides: r, info: info, host: imghost}
                        });
                    } catch (e) {
                        console.log(e)
                    }

                    // 整体轮播 build
                    try {
                        p2 = jb.ui.page22({
                            topData: topData,
                            list: list2,
                            rdata: r,
                            info: info,
                            ban2dom: ban2dom,
                            to: to,
                            pageTo2: pageTo2,
                            pageTo1: pageTo1,
                        });

                        if (p2.sw && p2.sw[to] && p2.sw[to].activeIndex === 0 && !p2.sw[to].animating) {
                            setTimeout(function () {
                                "use strict";
                                var infoIndex = _.findIndex(info, function (w) {
                                    return w.name === r[to].gameName
                                });

                                var curSlide = $(p2.sw[to].slides[p2.sw[to].activeIndex]);

                                $("[id^='piectr']", curSlide).empty();
                                $("[id^='pimectr']", curSlide).empty();
                                $("[id^='piecvr']", curSlide).empty();

                                jb.ui.pie22({
                                    i: to,
                                    c: 0,
                                    rdata: info[infoIndex].images,
                                })
                            }, 100)

                        }

                        if (p2.psw.activeIndex === to && !p2.psw.animating) {
                            setTimeout(function () {
                                "use strict";

                                var pid = $(p2.psw.slides[p2.psw.activeIndex]).attr("id");
                                jb.util.animeProgress({dom: "#" + pid + " .progess"});

                                var numdom = $(p2.psw.slides[p2.psw.activeIndex]);
                                var n1 = numdom.find(".number").eq(0);
                                var n2 = numdom.find(".number").eq(1);

                                jb.util.animeFontScale({dom: n1[0]});
                                jb.util.animeFontScale({dom: n2[0]});

                                $("#js-getDate").text(jb.util.unix2day(r[p2.psw.activeIndex].dataLastTime));
                            }, config.delayProcess)

                        }

                        p2.psw.on("slideChangeTransitionEnd", function () {
                            "use strict";

                            try {
                                var pswIndex = p2.psw.activeIndex;

                                var infoIndex = _.findIndex(info, function (w) {
                                    return w.name === topData[pswIndex].gamename
                                });

                                var curSlide = $(p2.sw[pswIndex].slides[p2.sw[pswIndex].activeIndex]);
                                $("[id^='piectr']", curSlide).empty();
                                $("[id^='piecvr']", curSlide).empty();
                                //
                                jb.ui.pie22({
                                    i: pswIndex,
                                    c: p2.sw[pswIndex].activeIndex,
                                    rdata: info[infoIndex].images,
                                });
                            } catch (e) {

                            }

                            setTimeout(function () {
                                var pid = $(p2.psw.slides[p2.psw.activeIndex]).attr("id");
                                jb.util.animeProgress({dom: "#" + pid + " .progess"});

                                var numdom = $(p2.psw.slides[p2.psw.activeIndex]);
                                var n1 = numdom.find(".number").eq(0);
                                var n2 = numdom.find(".number").eq(1);

                                jb.util.animeFontScale({dom: n1[0]});
                                jb.util.animeFontScale({dom: n2[0]});
                            }, config.delayProcess)
                        });


                        $(".swiper-nav-slide").click(function (e) {
                            var el = $(e.currentTarget);
                            var cindex = el.attr("bid");
                            playlist = store.session("secondPlayList");

                            // var pvIndex = videoList.pvIndex;
                            //
                            // // 注意刷新和原实例
                            // if(pvIndex > -1) {
                            //     if (!videoList.player[pvIndex].paused) {
                            //         videoList.player[pvIndex].pause();
                            //     }
                            //     console.log("pageto1 player pause")
                            // }
                            jb.ui.pauseAll();
                            window.clearTimeout(delayer);

                            p2.psw.slideTo(cindex, config.picSpeed);

                            // 注意游戏可能没有播放素材
                            // 有播放素材：
                            if (!_.isNull(p2.sw[cindex])) {
                                console.log("手动到游戏从0开始:", cindex)
                                var pobjIndex = _.findIndex(playlist, {name: topData[p2.psw.activeIndex].gamename});
                                var curIndex = 0;

                                playlist[pobjIndex].posGroup = 0;
                                playlist[pobjIndex].posIndex = 0;
                                store.session("secondPlayList", playlist);
                                p2.psw.autoplay.stop();
                                p2.sw[cindex].slideTo(0);
                                p2.sw[cindex].autoplay.stop();
                                // jb.ui.beginSw({
                                //     psw: p2.psw,
                                //     sw: p2.sw,
                                //     pIndex: cindex,
                                //     curSlide: $(p2.sw[cindex].slides[0]),
                                //     curIndex: 0
                                // });
                            } else {
                                console.log("没有可播放的素材：")
                                p2.psw.autoplay.start();
                            }

                        });

                        // action
                        //
                        jb.ui.page22action(p2.psw, p2.sw, {
                            list: list2,
                            chart: p2.chart,
                            hasVdata: p2.hasVdata,
                            app30en: p2.app30en,
                            to: to
                        });

                        // 会导致视频播放不记录 todo
                        $(".js-play .swiper-pagination-bullet").click(function (e) {


                            console.log("videoList:", videoList);
                            window.clearTimeout(delayer);
                            jb.ui.pauseAll();
                            var bl = $(e.currentTarget);
                            var bindex = bl.index();
                            console.log("click:", bindex)

                            jb.ui.playList({
                                psw: p2.psw,
                                sw: p2.sw,
                                pIndex: p2.psw.activeIndex,
                                curSlide: $(p2.sw[p2.psw.activeIndex].slides[bindex]),
                                curIndex: bindex
                            }, function () {
                                // 防止直接跳过，先播放
                                jb.ui.beginSw({
                                    psw: p2.psw,
                                    sw: p2.sw,
                                    pIndex: p2.psw.activeIndex,
                                    curSlide: $(p2.sw[p2.psw.activeIndex].slides[bindex]),
                                    curIndex: bindex
                                });

                            }, function () {

                                playlist = store.session("secondPlayList");

                                var pobjIndex = _.findIndex(playlist, {name: topData[p2.psw.activeIndex].gamename});
                                var curIndex = 0;

                                if (pobjIndex > -1) {
                                    var pobj = playlist[pobjIndex];
                                    curIndex = pobj.posIndex;
                                }

                                // 播放子列表的最后一个序号，定位当前的播放分组
                                if(_.isArray(pobj.pl[0])){
                                    _.forEach(pobj.pl, function (v, i) {
                                        if (_.includes(v, bindex)) {
                                            pobj.posGroup = i;
                                            pobj.posIndex = bindex;
                                        }
                                    });
                                }

                                // 只记录位置不操作
                                console.log("手动到素材:", bindex)
                                store.session("secondPlayList", playlist);
                            });
                        })

                    } catch (e) {
                        console.log(e)
                    }


                }


            });

        });


    }

});