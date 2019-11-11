var delayer;
var player;
var playerDelay;
var ban4dom;
var ban4sw;
var skip = Boolean(url("?skip"));
var Chimee = window.Chimee;
// Chimee.install(chimeePluginCenterState);
// 播放n个游戏然后切页，下次播放后面n个数量
// fourGamePlayCount 离开页面时，记录播放位置
// 手动切换媒体，则重新开始计数

var playPoint;
// 每个媒体播放时间，时间到进入下个媒体。时间富余也进入下个媒体。
// fourMediaPlayTime 同上记录播放位置
// 手动切换媒体，则重新开始计时
// 独立计算时间
var mediaTime = [];
var pageTime = undefined;
// 刷新或，首次进来标记
var frush = true;
var videoList4 = {
    pvIndex: 0,
    pos: [],
    player: []
};

$(function () {
    // jb.util.console();

    var accesstoken = url("?accesstoken");
    if(!_.isUndefined(accesstoken)){
        store.set("accesstoken", accesstoken);
    }

    jb.ui.headRun();
    // 需要获取从第一帧
    var dataTime = {};
    var fz = jb.util.getFontSize();

    run();
    // 配置更新
    jb.util.interval({
        time: config.updateConfig,
        cb: function () {
            jb.ajx.config({
                cb: function (con) {
                    config = _.assignIn(config, con);
                    var hasNew = jb.util.isNewConfig(config, ["video_loops", "img_stays", "material_source_publish", "four_checked", "four_time", "four_meidia_time", "four_game_time", "updatetime"]);

                    _.delay(function(){
                        jb.ui.headTime(config.headtime);
                    }, 600);

                    if (hasNew) {
                        if (player && !player.destroyed) {
                            if(!player.paused){
                                player.pause();
                            }

                            try {
                                player.destroy();

                            } catch (e) {

                            }
                        }

                        _.forEach(mediaTime, function(v, i){
                            if(v){
                                clearTimeout(v)
                            }
                        });


                        window.clearTimeout(delayer);
                        window.clearTimeout(pageTime);
                        store.session.remove("playPoint");
                        store.session("config", config);


                        run();
                    }
                }
            });
        }
    });

    function run() {
        "use strict";
        jb.ajx.config({
            cb: function (con) {
                // todo
                config = _.assignIn(config, con);
                store.session("config", config);
                if (player && !player.destroyed) {
                    if(!player.paused){
                        player.pause();
                    }

                    try {
                        player.destroy();

                    } catch (e) {

                    }
                }
                store.session.remove("playPoint");
                window.clearTimeout(delayer);

                jb.ajx.request({
                    url: api.excellentAdSources,
                }).then(function (res) {

                    _.delay(function(){
                        jb.ui.headTime(config.headtime);
                    }, 600);

                    var rdata = res.body.data;
                    var start = url('?start');
                    var end = url('?end');

                    if ((_.isUndefined(start) || _.isUndefined(end)) || (_.isString(start) && start.length === 0)) {
                        $(".js-week").text(jb.util.weekDay(rdata.start, rdata.end));
                    } else {
                        $(".js-week").text(jb.util.weekDay(start, end));
                    }

                    // 获取后更新获取数据时间
                    $("#js-getDate").text(jb.util.unix2day(rdata.publish));
                    nextPage();

                    function nextPage() {

                        if (rdata.list.length === 0) {
                            return;
                        }

                        var curArr = jb.ui.getSeq(rdata.list, 0);


                        var list = _.map(curArr[0], function (v, i) {
                            rdata.list[v].seq = v;
                            return rdata.list[v]
                        });

                        // 右侧子导航
                        var navdom = $("#js-navbox .swiper-wrapper");
                        navdom.empty();
                        var rwidth = $(".ranking-box").width();
                        $("#js-navbox").width(rwidth);

                        try {
                            jb.ui.tpl({
                                tpl: $("#topCTpl").html(),
                                dom: navdom,
                                data: {list: rdata.list, host: imghost}
                            });
                        } catch (e) {
                            console.log(e)
                        }

                        // 滑动容器构造
                        var rsdom = $("#js-rsbox .swiper-wrapper");
                        rsdom.empty();
                        try {
                            jb.ui.tpl({
                                tpl: $("#slideTpl").html(),
                                dom: $("#js-rsbox .swiper-wrapper"),
                                data: {list: rdata.list, host: imghost, fz: fz}
                            });
                        } catch (e) {
                            console.log(e)
                        }

                        //头部导航图标轮播
                        try {
                            var bandata = _.map(rdata.list, function (v) {
                                v.gamename = v.name;
                                return v;
                            });

                            ban4dom = jb.ui.ban2({
                                list: list,
                                index: 0,
                                data: bandata,
                                baseIconWidth: 45,
                                host: imghost,
                                maxHeight: 80,
                                dx: false,
                            });
                        } catch (e) {
                            console.log(e)
                        }

                        try {

                            ban4sw = new Swiper("#js-navbox", {
                                autoplay: false,
                                allowTouchMove: false,
                                speed: 2000,
                                on: {
                                    slideChangeTransitionStart: function () {
                                        ban4dom(this.activeIndex);
                                    },
                                    slideChangeTransitionEnd: function () {
                                    }
                                }
                            });
                        } catch (e) {
                            console.log(e)
                        }

                        // 媒体固定播放游戏数量, ctr cvr 成对出现

                        var kc = _.reduce(rdata.list, function (r, v, i) {
                            r.push(v.ctr.length + v.cvr.length);
                            return r;
                        }, []);

                        var pla = _.reduce(rdata.list, function (a, v, k) {
                            var pt = _.map(_.range(kc[k]), function (w, i) {
                                return {
                                    k: k,
                                    i: w
                                }
                            });
                            return _.concat(a, pt)
                        }, []);

                        _.forEach(rdata.list, function (v, i) {
                            if (_.size(v.ctr) > 0 || _.size(v.cvr) > 0) {
                                _.forEach(_.concat(v.ctr, v.cvr), function (w, j) {
                                    _.forEach(w.images, function (x, k) {
                                        if (jb.util.hasVideo(x.path)) {
                                            videoList4.pos.push({mediaIndex: i, gameIndex:j, curIndex: k})
                                        }
                                    })
                                })
                            }

                        });

                        console.log("videoList4:", videoList4)
                        //
                        // var remList = _.reduce(rdata.list, function (a, v, k) {
                        //     a.push(v.name)
                        //     return a;
                        // }, []);

                        if (skip === true) {
                            if (config.four_checked === 2) {
                                // 媒体固定数量
                                var fgt = config.four_game_time;
                                var cpla = _.chunk(_.slice(pla, 1), fgt);


                                var point = _.map(cpla, function (v, i) {
                                    return v[v.length - 1]
                                });
                                // 消除分组结尾划分不正确问题
                                var clast = point[point.length-1];
                                var clastprev = point[point.length-2];

                                if((clast.i-fgt+1)===clastprev.i){
                                    point.pop();
                                }

                                console.log("point:", point)
                                // 计数有出错的可能，定好播放轨迹不会错。
                                if (config.four_checked === 2) {
                                    playPoint = {
                                        // point index
                                        index: 0,
                                        nk: 0,
                                        ni: 0,
                                        // 本次播放位置
                                        k: 0,
                                        i: 0,
                                        // 每次轮换可播放到的数量、位置
                                        point: point,
                                        fgt: fgt,
                                        pla: pla,
                                        publish: rdata.publish,
                                        // remList: remList,
                                    };
                                }
                            }
                        } else {
                            // 正常播放
                            store.session.remove("playPoint");
                            playPoint = {
                                index: 0,
                                // point index
                                nk: 0,
                                ni: 0,
                                // 本次播放位置
                                k: 0,
                                i: 0,
                                // 每次轮换可播放到的数量、位置
                                point: [{k: -1, i: -1}],
                                fgt: 1,
                                pla: pla,
                                publish: rdata.publish,
                                // remList: remList,
                            };
                        }

                        // 媒体固定播放时间
                        if (config.four_checked === 1 && skip === true) {
                            store.session.remove("playPoint");
                            // 初始化计时
                            var mlist = _.map(rdata.list, function (v, i) {
                                mediaTime[i] = undefined;
                                return config.four_meidia_time;
                            });

                            playPoint = {
                                // point index
                                index: pla.length,
                                nk: 0,
                                ni: 0,
                                // 本次播放位置
                                k: 0,
                                i: 0,
                                mlist: mlist,
                                // 每次轮换可播放到的数量、位置
                                point: [{k: -1, i: -1}],
                                fgt: 0,
                                pla: pla,
                                publish: rdata.publish,
                                // remList: remList,
                            };
                        }
                        // 页面固定时间
                        if (config.four_checked === 0 && skip === true) {
                            store.session.remove("playPoint");
                            playPoint = {
                                index: pla.length,
                                // point index
                                nk: 0,
                                ni: 0,
                                // 本次播放位置
                                k: 0,
                                i: 0,
                                // 每次轮换可播放到的数量、位置
                                point: [{k: -1, i: -1}],
                                fgt: 0,
                                pla: pla,
                                publish: rdata.publish,
                                // remList: remList,
                            };
                        }

                        var pt = store.session("playPoint");
                        // 类型切换后 todo 清除

                        if (_.isUndefined(pt) || _.isNull(pt)) {
                            store.session("playPoint", playPoint);
                        } else {
                            // 需要严格检查，媒体数量变化
                            // if(playPoint.remList.length !== remList.length || publish!=pt.publish){
                            //     // 媒体数量不一致
                            //     store.session("playPoint", playPoint);
                            // }else{
                            //     // 数量一致
                            //     var cmp = _.every(playPoint.remList, function(v, i){
                            //         return v.name === remList[i].name;
                            //     });
                            //
                            //     if(cmp){
                            //         playPoint = _.extend(playPoint, pt);
                            //     }else{
                            //         store.session("playPoint", playPoint);
                            //     }
                            // }
                            playPoint = _.extend(playPoint, pt);
                            store.session("playPoint", playPoint);
                        }

                        console.log("playPoint：", playPoint)

                        // 整体轮播
                        try {
                            var p4 = jb.ui.page4({
                                mideaData: rdata.list,
                                ban4dom: ban4dom,
                                ban4sw: ban4sw
                            });

                            if (p4.sw && p4.sw[0] && p4.sw[0][0].activeIndex === 0 && !p4.sw[0][0].animating) {
                                setTimeout(function () {
                                    "use strict";
                                    var curSlide = $(p4.sw[0][0].slides[p4.sw[0][0].activeIndex]);


                                    $("[id^='piectr']", curSlide).empty();
                                    $("[id^='pimectr']", curSlide).empty();
                                    $("[id^='piecvr']", curSlide).empty();

                                    jb.ui.pie44({
                                        k: 0,
                                        i: 0,
                                        c: 0,
                                        v: _.concat(rdata.list[0].ctr, rdata.list[0].cvr)
                                    })
                                }, 100)

                            }

                        } catch (e) {
                            console.log(e)
                        }

                        console.log("mideaData:", rdata.list)
                        console.log("p4:", p4)

                        p4.ppsw.on("slideChangeTransitionEnd", function () {
                            "use strict";
                            var k = this.activeIndex;
                            var i = p4.psw[k].activeIndex;


                            var curSlide = $(p4.sw[k][i].slides[p4.sw[k][i].activeIndex]);

                            $("[id^='piectr']", curSlide).empty();
                            $("[id^='piemctr']", curSlide).empty();
                            $("[id^='piecvr']", curSlide).empty();
                            // console.log(_.concat(rdata.list[k].ctr, rdata.list[k].cvr)[i].images)
                            //
                            jb.ui.pie44({
                                k: k,
                                i: i,
                                c: 0,
                                v: _.concat(rdata.list[k].ctr, rdata.list[k].cvr)
                            })

                        });
                        //
                        _.forEach(p4.psw, function (w, j) {

                            p4.psw[j].on("slideChangeTransitionEnd", function () {
                                "use strict";
                                var i = p4.psw[j].activeIndex;

                                var k = j;
                                var curSlide = $(p4.sw[k][i].slides[p4.sw[k][i].activeIndex]);

                                $("[id^='piectr']", curSlide).empty();
                                $("[id^='piemctr']", curSlide).empty();
                                $("[id^='piecvr']", curSlide).empty();
                                // console.log(_.concat(rdata.list[k].ctr, rdata.list[k].cvr)[i].images)
                                //
                                jb.ui.pie44({
                                    k: k,
                                    i: i,
                                    c: 0,
                                    v: _.concat(rdata.list[k].ctr, rdata.list[k].cvr)
                                })

                            });

                        });

                    }

                });
            }
        });
    }

});