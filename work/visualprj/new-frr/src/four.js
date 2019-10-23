
import {headRun, headTime} from "./component/head";
import {jb, rem} from "./plugs/tbase";
import {api, configs, imghost} from "./config/config";
import {page4, drawPie4} from "./component/page4";
import ban2 from "./component/ban.js";

// const imghost = 'http://sdadmin.qq.com/api/';

$(function () {
// 播放n个游戏然后切页，下次播放后面n个数量

// 手动切换媒体，则重新开始计数

// 每个媒体播放时间，时间到进入下个媒体。时间富余也进入下个媒体。

// 手动切换媒体，则重新开始计时
// 独立计算时间
    let config = configs;
    rem();

// 刷新或，首次进来标记
    let ban4dom;
    let ban4sw;

    let accesstoken = url("?accesstoken");
    if (!_.isUndefined(accesstoken)) {
        store.set("accesstoken", accesstoken);
    }

    headRun();
    // 需要获取从第一帧
    let dataTime = {};
    let fz = jb.util.getFontSize();

    run();
    // 配置更新
    // jb.util.interval({
    //     time: config.updateConfig,
    //     cb: function () {
    //         jb.ajx.config({
    //             cb: function (con) {
    //                 let config = _.assignIn(config, con);
    //                 let hasNew = jb.util.isNewConfig(config, ["video_loops", "img_stays", "material_source_publish", "four_checked", "four_time", "four_meidia_time", "four_game_time", "updatetime"]);
    //
    //                 d3.timeout(function(){
    //                     headTime(config.headtime);
    //                 }, 600);
    //
    //                 if (hasNew) {
    //                     pauseAll4();
    //
    //                     _.forEach(mediaTime, function(v, i){
    //                         if(v){
    //                             clearTimeout(v)
    //                         }
    //                     });
    //
    //                     window.clearTimeout(delayer);
    //                     window.clearTimeout(pageTime);
    //                     store.session.remove("playPoint");
    //                     store.session("config", config);
    //
    //                     run();
    //                 }
    //             }
    //         });
    //     }
    // });

    function run() {
        "use strict";
        jb.ajx.config({
            cb: function (con) {
                // todo
                // let config = _.assignIn(config, con);
                store.session("config", config);
                // pauseAll4();
                store.session.remove("playPoint");
                window.clearTimeout(delayer);

                jb.ajx.request({
                    url: api.excellentAdSources,
                }).then(function (res) {

                    d3.timeout(function () {
                        headTime(config.headtime);
                    }, 600);

                    let rdata = res.body.data;
                    let start = url('?start');
                    let end = url('?end');

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

                        let curArr = jb.ui.getSeq(rdata.list, 0);
                        let list = _.map(curArr[0], function (v, i) {
                            rdata.list[v].seq = v;
                            return rdata.list[v]
                        });

                        // 右侧子导航
                        let navdom = $("#js-navbox .swiper-wrapper");
                        navdom.empty();
                        let rwidth = $(".ranking-box").width();
                        $("#js-navbox").width(rwidth);

                        rdata.list = _.map(rdata.list, function(x){
                            x.ctr = _.map(x.ctr, function(v){
                                v.ctr = jb.util.fixed(v.ctr, 3);
                                v.mctr = jb.util.fixed(v.mctr, 3);
                                v.nameWidth = jb.util.getTextWidth({txt: v.name, fontSize: fz*0.31})+72
                                return v;
                            })

                            x.cvr = _.map(x.cvr, function(v){
                                v.cvr = jb.util.fixed(v.cvr, 3);
                                v.nameWidth = jb.util.getTextWidth({txt: v.name, fontSize: fz*0.31})+72
                                return v;
                            })

                            return x;
                        })

                        let leftCtrlTpl = require("./template/four/leftCtrl.html");
                        let leftCtrlDom = leftCtrlTpl({lists: rdata.list, host: imghost});
                        navdom.html(leftCtrlDom);

                        // 滑动容器构造
                        let rsdom = $("#js-rsbox .swiper-wrapper");
                        rsdom.empty();

                        let slideTpl = require("./template/four/rslide.html");
                        let slideDom = slideTpl({lists: rdata.list, host: imghost, fz: fz});
                        $("#js-rsbox .swiper-wrapper").html(slideDom);


                        //头部导航图标轮播

                        let bandata = _.map(rdata.list, function (v) {
                            v.gamename = v.name;
                            return v;
                        });

                        ban4dom = ban2({
                            list: list,
                            index: 0,
                            data: bandata,
                            baseIconWidth: 45,
                            host: imghost,
                            maxHeight: 80,
                            dx: false,
                            page: 4
                        });

                        try {
                            ban4sw = new Swiper("#js-navbox", {
                                autoplay: false,
                                allowTouchMove: false,
                                speed: 2000,
                                on: {
                                    slideChangeTransitionStart: function () {
                                        // ban4dom(this.activeIndex);
                                    },
                                    slideChangeTransitionEnd: function () {
                                    }
                                }
                            });
                        } catch (e) {
                            console.log(e)
                        }

                        // 整体轮播

                        let p4 = page4({
                            rdata: rdata.list,
                            ban4dom: ban4dom,
                            ban4sw: ban4sw
                        });

                        if (p4.sw && p4.sw[0] && p4.sw[0][0].activeIndex === 0 && !p4.sw[0][0].animating) {
                            setTimeout(function () {
                                "use strict";
                                let curSlide = $(p4.sw[0][0].slides[p4.sw[0][0].activeIndex]);

                                drawPie4({
                                    curSlide:curSlide,
                                    k:0,
                                    i:0,
                                    c:0,
                                    v:_.concat(rdata.list[0].ctr, rdata.list[0].cvr)
                                });
                            }, 1000)

                        }


                        p4.ppsw.on("slideChangeTransitionEnd", function () {
                            "use strict";
                            let k = this.activeIndex;
                            let i = p4.psw[k].activeIndex;
                            let curSlide = $(p4.sw[k][i].slides[p4.sw[k][i].activeIndex]);

                            drawPie4({
                                curSlide:curSlide,
                                k:k,
                                i:i,
                                c:0,
                                v:_.concat(rdata.list[k].ctr, rdata.list[k].cvr)
                            });

                        });
                        //
                        _.forEach(p4.psw, function (w, j) {

                            p4.psw[j].on("slideChangeTransitionEnd", function () {
                                "use strict";
                                let i = p4.psw[j].activeIndex;

                                let k = j;
                                let curSlide = $(p4.sw[k][i].slides[p4.sw[k][i].activeIndex]);

                                drawPie4({
                                    curSlide:curSlide,
                                    k:k,
                                    i:i,
                                    c:0,
                                    v:_.concat(rdata.list[k].ctr, rdata.list[k].cvr)
                                });

                            });

                        });

                    }

                });
            }
        });
    }

});