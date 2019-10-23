var skip = Boolean(url("?skip"));
$(function () {
    // clearTimeout(id)
    // jb.util.console();
    jb.ui.headRun();
    // 需要获取从第一帧
    var dataTime = {};

    var fz = jb.util.getFontSize();
    run();

    //3 配置更新：主流媒体近期舆情
    jb.util.interval({
        time: config.updateConfig,
        cb: function () {
            jb.ajx.config({
                cb: function (con) {
                    config = _.assignIn(config, con);
                    var hasNew = jb.util.isNewConfig(config, ["three_time", "media_sentiment_size", "media_sentiment_interval", "media_sentiment_order"]);


                    _.delay(function(){
                        jb.ui.headTime(config.headtime);
                    }, 600);

                    // 根据配置更新广告曝光之媒体分布
                    if (hasNew) {
                        store.session("config", config);
                        mediaNearSentiments(config.media_sentiment_interval, config.media_sentiment_size, config.media_sentiment_order);
                    }
                }
            });
        }
    });
    // 3 媒体舆情， 整点更新
    jb.util.intervalHour({
        minute: 0,
        second: 0,
        cb: function () {
            mediaNearSentiments(config.media_sentiment_interval, config.media_sentiment_size, config.media_sentiment_order);
        }
    });

    // 每天更新
    // jb.util.intervalHour({
    //     hour: 4,
    //     minute: 0,
    //     second: 0,
    //     cb: function () {
    //         run();
    //     }
    // });
    // 定时每分更新
    jb.util.interval({
        time: config.updateMinute,
        cb: function () {
            top3();
        }
    });

    function top3(){

        // 底部获取后更新获取数据时间
        $("#js-getDate").text(jb.util.formatDate(new Date(), "-"));
        // 曝光量 top3
        jb.ajx.request({
            url: api.topThreeImpressionsMedia,
            data: jb.util.time2unix(new Date())
        }).then(function (res) {
            try {
                $(".topImpressionsDate1").text("(" + jb.util.unix2day(res.body.data.date) + ")");
                $(".topImpressionsDate2").text("(" + jb.util.unix2day(res.body.data.date) + ")");
                $("#js-getDate").text(jb.util.unix2day(res.body.data.date + 3600 * 24));
            } catch (e) {
                console.log(e)
            }

            if (_.has(res.body.data, "mediaimpressionslist") && _.size(res.body.data.mediaimpressionslist) > 0) {

                var rmax = _.maxBy(res.body.data.mediaimpressionslist, function (v) {
                    "use strict";
                    return v.impressions;
                }).impressions;

                var mil = res.body.data.mediaimpressionslist;
                mil = _.map(mil, function (v, i) {
                    "use strict";
                    if(v.medianame.length>10){
                        v.medianame = v.medianame.substring(0, 10);
                    }

                    return v;
                });


                var top3dom = $("#js-imTop3");
                jb.ui.tpl({
                    tpl: $("#topImpressionsTpl").html(),
                    dom: top3dom,
                    data: {list: mil, rmax: rmax * 1.1}
                });

                jb.util.animeNumber({dom: ".percentNum"});
                jb.util.animeProgress({dom: ".progess"});
                // 3 曝光趋势(近7日）

                try {
                    jb.ui.trend3({
                        dom: $("#js-trend")[0],
                        legendPadding: [10, 5, 10, 5],
                        data: res.body.data.mediaimpressionslist,
                        grid: {
                            top: '18%',
                        }
                    });
                } catch (e) {
                    console.log(e)
                }

                // 3 曝光环比增长
                var bt = _.reduce(res.body.data.mediaradiolist, function (r, v) {
                    r[0].push(v.medianame);
                    r[1].push(_.round(v.impressionsratio*100, 0));
                    return r;
                }, [[], []]);


                var bmax = parseFloat(jb.util.fixed(_.maxBy(res.body.data.mediaradiolist, function (v) {
                    "use strict";
                    return v.impressionsratio;
                }).impressionsratio, 2), 10);

                var bmin = jb.util.fixed(_.minBy(res.body.data.mediaradiolist, function (v) {
                    "use strict";
                    return v.impressionsratio;
                }).impressionsratio, 2);

                if (bmin < 0) {
                    var bm = _.round(Math.abs(bmin) / 5, 0);
                    if (bm >= 1) {
                        bmin = 0 - _.round((bm) * 6, 0)
                    } else {
                        bmin = -5;
                    }

                } else {
                    bmin = 0;
                }

                if (bmax > 0) {
                    var bx = _.ceil(bmax / 5);
                    if (bx >= 1) {
                        bmax = _.ceil((bx) * 6, 0)
                    } else {
                        bmax = 5;
                    }
                }


                try {
                    jb.ui.bar3({
                        dom: $("#js-bar3")[0],
                        vMin: bmin,
                        vMax: bmax,
                        vYFontSize: 12,
                        labelFontSize: 14,
                        nameData: bt[0],
                        data: bt[1]
                    });
                } catch (e) {
                    console.log(e)
                }

            }

        });
    }

    function run() {
        jb.ajx.config({
            cb: function (con) {
                config = _.assignIn(config, con);
                store.session("config", config);


                _.delay(function(){
                    jb.ui.headTime(config.headtime);
                }, 600);
                mediaNearSentiments(config.media_sentiment_interval, config.media_sentiment_size, config.media_sentiment_order);

            }
        });

        top3();

    }


    var psw;
    var aniIn;

    function mediaNearSentiments(time, size, order) {
        jb.ajx.request({
            url: api.mediaNearSentiments,
            data: {
                TopNumber: size,
                OrderBy: order
            }
        }).then(function (res) {
            if (psw) {
                psw.destroy(true, true);
            }

            var tdata = res.body.data;
            var pph = $(".third-content-r").height();

            var sh = pph - $(".title").height() - $(".top").height() - fz * 0.45;
            $(".carousel").height(sh);

            var dls = [];

            if (tdata.length >= 15) {
                dls = _.chunk(tdata, 15)
            } else {
                dls = [tdata];
            }


            var yqdom = $("#js-yqbox .swiper-wrapper");
            yqdom.empty();
            jb.ui.tpl({
                tpl: $("#mediaNearSentimentsTpl").html(),
                dom: yqdom,
                data: {dls: dls}
            });

            aniIn = _.map(dls, function (v, i) {
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

            psw = new Swiper("#js-yqbox", {
                watchOverflow: true,
                autoplay: {
                    delay: time * 1000
                },
                speed: time / 5,

                pagination: {
                    el: "#yq",
                    clickable: true,
                },
                on: {
                    slideChangeTransitionStart: function () {
                        var el = $('#slide' + this.activeIndex + ' li');
                        el.each(function (i, v) {
                            $(v).height(0);
                            // $(v).css("top", 0);
                            $(v).css("opacity", 0)
                        });
                        aniIn[this.activeIndex].restart();
                    },
                    slideChangeTransitionEnd: function () {

                    }
                }
            });

            if (tdata.length >= 15) {
                psw.autoplay.start();
            } else {
                psw.autoplay.stop();
            }


            aniIn[0].play();

            if (skip === true) {
                jb.util.time2Url({
                    url: '/fourth.html?skip=true',
                    time: config.three_time * 1000
                });
                return;
            }
            // 跳转到下一页

        });
    }


});