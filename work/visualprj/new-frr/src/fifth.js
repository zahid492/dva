import {api, configs, themes, apihost} from "./config/config";
import {jb, rem} from "./plugs/tbase";
import slideCarsousel from "./plugs/slideCarsousel";
import {headRun, headTime} from "./component/head";



$(function () {
    var config = configs;
    rem();
    var skip = Boolean(url("?skip"));
    var playlist;
    slideCarsousel();

    var accesstoken = url("?accesstoken");
    if (!_.isUndefined(accesstoken)) {
        store.set("accesstoken", accesstoken);
    }

    headRun();

    // 需要获取从第一帧
    var fz = jb.util.getFontSize();
    run();
    // 配置更新
    jb.util.interval({
        time: config.updateConfig,
        cb: function () {
            jb.ajx.config({
                cb: function (con) {
                    // let config = _.assignIn(config, con);

                    d3.timeout(function () {
                        headTime(config.headtime);
                    }, 600);

                    var hasNew1 = jb.util.isNewConfig(config, ["publishcase_publish", "five_checked", "five_time", "five_case_count"]);

                    if (hasNew1) {
                        store.session.remove("fivePlayList");
                        store.session("config", config);
                        newsPublishCases()
                    }

                    var hasNew2 = jb.util.isNewConfig(config, ["publishdata_publish"]);

                    if (hasNew2) {
                        store.session("config", config);
                        reqNewsPublishOverview();
                        gameNewsStatisticsByMonth(config.media_sentiment_interval);
                    }
                }
            });
        }
    });

    function run() {
        jb.ajx.config({
            cb: function (con) {
                // todo
                // let config = _.assignIn(config, con);
                store.session("config", config);
                store.session.remove("fivePlayList");

                d3.timeout(function () {
                    headTime(config.headtime);
                }, 600);

                gameNewsStatisticsByMonth(config.media_sentiment_interval);
            }
        });
        reqNewsPublishOverview();

        store.session.remove("fivePlayList");
        newsPublishCases();
    }


    // 新闻发布情况总览
    function reqNewsPublishOverview() {
        jb.ajx.request({
            url: api.newsPublishOverview

        }).then(function (res) {
            res = res.body.data;

            $("#js-week1").text("(" + jb.util.weekDay(res.start, res.end) + ")");
            $("#js-getDate").text(jb.util.unix2day(res.end));

            var yldom = $("#js-newsPublishOverview");
            yldom.empty();

            var publishOverTpl = require("./template/fifth/publishOverview.html");
            var publishOverDom = publishOverTpl({oNews: res.news, gMedia: res.media});
            yldom.html(publishOverDom);

            var oNewsTdata = [];
            var oNewsData = [];
            var gMediaTdata = [];
            var gMediaData = [];

            if (_.size(res.news.data) >= 1) {
                _.forEach(res.news.data, function (o) {
                    oNewsTdata.push(jb.util.unix2dayNoYear(o.date, "."));
                    oNewsData.push(o.count)
                });
                // 外发新闻面积图

                jb.ui.area2({
                    dom: $("#chartTpl1")[0],
                    date: oNewsTdata,
                    data: oNewsData,
                    color: themes[config.theme].color2Line5[5],
                    label: true
                });
            }

            if (_.size(res.media.data) >= 1) {
                _.forEach(res.media.data, function (o) {
                    gMediaTdata.push(jb.util.unix2dayNoYear(o.date, "."));
                    gMediaData.push(o.count)
                });

                // 落地媒体面积图
                jb.ui.area2({
                    dom: $("#chartTpl2")[0],
                    date: gMediaTdata,
                    data: gMediaData,
                    color: themes[config.theme].color2Line5[6],
                    label: true
                });
            }

        });

    }

    // 一月游戏产品新闻发布一览
    var mySwiper;

    function gameNewsStatisticsByMonth(time) {
        jb.ajx.request({
            url: api.gameNewsStatisticsByMonth,
        }).then(function (res) {
            if (mySwiper) {
                mySwiper.destroy(true, true);
            }

            res = res.body.data;
            $("#js-month").text(moment(parseInt(res.date + "000")).format('M'));
            //debugger
            var allData = [];
            if (res.list != '') {
                var maxNum = _.maxBy(res.list, function (v) {
                    "use strict";
                    return v.groundmediacount
                }).groundmediacount;
            } else {
                maxNum = 0;
            }
            if (res.list.length >= 15) {
                allData = _.chunk(res.list, 15)
            } else {
                allData = [res.list]
            }

            var yldom = $("#js-gameNewsStatisticsByMonth");
            yldom.empty();
            var newsStatisticsTpl = require("./template/fifth/newsStatistics.html");
            var newStatisticsDom = newsStatisticsTpl({list: allData, maxNum: maxNum});
            yldom.html(newStatisticsDom);

            var aniIn = _.map(allData, function (v, i) {
                return anime({
                    autoplay: false,
                    targets: '#slide' + i + ' li',
                    opacity: [0, 1],
                    // top: function (el, i) {
                    //     return i * fz * 0.51;
                    // },
                    height: {
                        value: [0, fz * 0.51],
                        duration: 200,
                        easing: 'easeInOutSine'
                    },
                    easing: 'easeInOutQuad',
                    // duration: function (el, i, l) {
                    //     return (i * 100);
                    // },
                    delay: function (target, index) {
                        return index * (time * 1000 / (15 * 5));
                    },

                });
            });

            mySwiper = new Swiper('#swiper1', {
                watchOverflow: true,
                autoplay: {
                    delay: time * 1000
                },
                speed: time / 5,
                pagination: {
                    el: '.pagination',
                    clickable: true
                },
                slidesPerView: 1,
                on: {
                    slideChangeTransitionStart: function () {
                        var el = $('#slide' + this.activeIndex + ' li');
                        el.each(function (i, v) {
                            $(v).height(0);

                            $(v).css("opacity", 0)
                        });
                        aniIn[this.activeIndex].restart();
                    },
                    slideChangeTransitionEnd: function () {

                    }
                }
            });

            aniIn[0].play();
        })

    }

    //获取参数
    function getQueryString(name) {
        var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));

        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];

    }

    //新闻发布案例
    function newsPublishCases() {
        var str = getQueryString('dataids');
        jb.ajx.request({
            url: api.newsPublishCases,
            data: {
                dataids: str
            }
        }).then(function (res) {
            res = res.body.data;
            $("#js-week2").text("(" + jb.util.weekDay(res.start, res.end) + ")");
            // 获取后更新获取数据时间

            if (res.list.length > 0) {
                if (skip !== true) {
                    playlist = {
                        // 播放列表
                        pl: res.list,
                        posMax: res.list.length - 1,
                        // 子列表序号
                        posGroup: 0,
                        // 子列表播放位置等于 curIndex
                        posIndex: 0,
                    }
                }
                // 固定个数
                if (config.five_checked === 1 && skip === true) {
                    pl = _.chunk(_.range(res.list.length), config.five_case_count);
                    playlist = {
                        // 播放列表
                        pl: pl,
                        posMax: pl.length - 1,
                        // 子列表序号
                        posGroup: 0,
                        // 子列表播放位置等于 curIndex
                        posIndex: 0,
                    }
                }
                // 固定时间
                if (config.five_checked === 0 && skip === true) {
                    store.session.remove("fivePlayList");
                    playlist = {
                        // 播放列表
                        pl: _.range(res.list.length),
                        posMax: res.list.length - 1,
                        // 子列表序号
                        posGroup: 0,
                        // 子列表播放位置等于 curIndex
                        posIndex: 0,
                    }
                }

                var pt = store.session("fivePlayList");
                // 类型切换后 todo 清除

                if (_.isUndefined(pt) || _.isNull(pt)) {
                    store.session("fivePlayList", playlist);
                } else {
                    playlist = _.extend(playlist, pt);
                }
            }

            var yldom = $("#js-newsPublishCases");
            yldom.empty();
            var newsPublishCaseTpl = require("./template/fifth/publishCases.html");
            var newsPublishCaseDom = newsPublishCaseTpl({newLists: res.list, host: apihost.visual});
            yldom.html(newsPublishCaseDom);

            var id = $(".item2").find(".item-content").attr("id");

            res.list.forEach(function (v, i) {
                var logoIndex = _.findIndex(res.logos, {gameName: v.gamename});

                if (i == id) {
                    var logourl = '';

                    if (logoIndex === -1) {
                        logourl = '../img/logo2.png'
                    } else {
                        if (res.logos[logoIndex].gameLogoUrl == "") {
                            logourl = '../img/logo2.png'
                        } else {
                            logourl = res.logos[logoIndex].gameLogoUrl
                        }

                    }

                    var txt = '<div class="gameBox"><h2><span>游戏<i></i></span></h2><img src="' + logourl + '" /><strong>' + res.list[i].gamename + '</strong></div><span class="gradientLine"></span><div class="mediaBox"><h2><span>网站<i></i></span></h2><strong>' + res.list[i].medianame + '</strong></div><span class="gradientLine"></span><div class="dateBox"><h2><span>报道日期 <i></i></span></h2><strong>' + jb.util.unix2day(res.list[i].publish, ".") + '</strong></div>';
                    $("#js-contentBoxR").append(txt);
                }
            });

            store.session("newsPublishData", res.list);
            store.session("logos", res.logos);

            $("#slide3d").slideCarsousel({
                slideType: '3d',
                indicatorEvent: 'mouseover'
            });


        })

    }

});
