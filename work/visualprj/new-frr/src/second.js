// 每个游戏播放n个数量素材，然后进入下个游戏，到最后游戏进入下页。再次进入页面播放后n个素材。
// fourGamePlayCount 离开页面时，记录播放位置
// 手动切换媒体，则重新开始计数
import {headRun, headTime} from "./component/head";
import {api, configs, themes} from "./config/config";
import {jb, rem} from "./plugs/tbase";
import {page21dom} from "./component/page21";
import {ptimer, genPoint2, page22dom, pageTo2} from "./component/page22";



$(function () {
    let config = configs;
    let accesstoken = url("?accesstoken");

    if (!_.isUndefined(accesstoken)) {
        store.set("accesstoken", accesstoken);
    }

    rem();
    headRun();
    run();
    // 配置更新 展示规则

    // jb.util.interval({
    //     time: config.updateConfig,
    //     cb: function () {
    //         jb.ajx.config({
    //             cb: function (con) {
    //                 // let config = _.assignIn(config, con);
    //
    //                 // 曝光排名和固定游戏
    //                 let hasNew = jb.util.isNewConfig(config, ["game_show_rule", "game_show_names", "material_source_publish", "second_checked", "second_time", "seconddetail_time", "seconddetail_material_count", "video_loops", "updatetime"]);
    //                 if (hasNew) {
    //
    //                     if (videoList.player.length > 0) {
    //                         pauseAll();
    //                         disposeAll();
    //                         console.log("stop cur on change game")
    //                     }
    //
    //                     d3.timeout(function () {
    //                         headTime(config.headtime);
    //                     }, 600);
    //
    //                     ps.slideTo(0, 100, true);
    //                     ps.autoplay.stop();
    //                     // 刷新已经代替
    //
    //                     window.clearTimeout(ptimer);
    //
    //                     // 配置更改清除播放列表
    //                     store.session.remove("secondPlayList");
    //                     store.session("config", config);
    //                     reqtopFiveImpressionsGame(config);
    //                 }
    //
    //             }
    //         });
    //     }
    // });


    function run() {

        jb.ajx.config({
            cb: function (con) {
                store.session.remove("secondPlayList");
                // let config = _.assignIn(config, con);
                store.session("config", config);
                // 刷新不用销毁了

                d3.timeout(function () {
                    headTime(config.headtime);
                }, 600);

                reqtopFiveImpressionsGame(config);
            }
        });
    }

    function reqtopFiveImpressionsGame(config) {

        let ps = new Swiper("#page", {
            // autoplay: {
            //     delay: (skip == true && config.second_checked === 0) ? config.second_time * 1000 : config.delay1to2,
            // },
            autoplay: false,
            allowTouchMove: false,
            initialSlide: 0,
            // effect : 'fade',
            // fadeEffect: {
            //     crossFade: true,
            // },
            speed: 1000,
        });
        ps.autoplay.stop();

        let games = "";

        if (config.game_show_rule) {
            games = _.trim(config.game_show_names);
        }

        jb.ajx.request({
            url: api.topFiveImpressionsGame,
            data: {
                games: games
            }
        }).then(function (resa) {
            let res = resa.body.data;

            if (res.length === 0) {
                return;
            }

            $(".js-week").text("(" + jb.util.weekDay(res.start, res.end) + ")");
            // 底部获取后更新获取数据时间
            $("#js-getDate").text(jb.util.unix2day(res.end + 3600 * 24));

            let dataTime = {
                start: res.start,
                end: res.end
            };
            // 根据游戏名称查询优秀素材,微信指数，appstore榜单
            let trendParam;

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

                let fz = jb.util.getFontSize();
                let logoNull = {
                    logo: "img/logo2.png",
                    icon: "img/iconx.png",
                    name: ""
                };
                let topData = res.gamelist;
                let logos = rd[0].body.data;
                let info = rd[2].body.data;
                logos = _.map(res.gamelist, function (v, i) {
                    let li = _.findIndex(logos, {name: v.gamename});
                    if (li === -1) {
                        let temp = _.extend({}, logoNull);
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
                //------------------
                let playList = genPoint2(topData, info);

                let playPoint = {
                    playList: playList,
                    index: 0,
                    prevIndex: 0,
                };

                let pt = store.get("playPoint2");
                store.remove("playPoint2");

                if (_.isNil(pt)) {
                    store.session("playPoint2", playPoint);
                } else {
                    // 需要严格检查，媒体数量变化
                    playPoint = _.assign(playPoint, pt);
                    store.session("playPoint2", playPoint);
                }
                //--------------------------
                page21dom({
                    topData: topData,
                    logos: logos
                });

                ps.on("slideChangeTransitionStart", function () {
                    if (ps.activeIndex === 0) {
                        anime({
                            targets: '.exposure-con__item',
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

                let pto2 = d3.timeout(function () {
                    page22dom({
                        ps: ps,
                        topData: topData,
                        logos: logos,
                        dataTime: dataTime,
                        rd: rd,
                        go:0,
                    });
                    pageTo2(ps);
                }, config.second_time * 1000)

                //
                $("#js-top5 .js-topitem").unbind("click").bind("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.clearTimeout(pto2);
                    window.clearTimeout(ptimer);

                    let playPoint = store.session("playPoint2");
                    let el = $(e.currentTarget);
                    let eindex = el.index() / 2;
                    let cindex = _.findIndex(playPoint.playList, (v) => {
                        if (v.gamename === topData[eindex].gamename) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    page22dom({
                        ps: ps,
                        topData: topData,
                        logos: logos,
                        dataTime: dataTime,
                        rd: rd,
                        go: cindex
                    });

                    pageTo2(ps);

                });
            });

        });


    }

});