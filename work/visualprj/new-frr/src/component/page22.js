// 二屏2所有轮播
import {EventEmitter} from "eventemitter3";
import {themes} from "../config/config";
import {jb, mediaType} from "../plugs/tbase";
import {ban2, setDom} from "./ban";
import {pauseAll4} from "./page4";
// import {imghost} from "../config/config";


const imghost = 'http://sdadmin.qq.com/api/';
let config = store.session("config");
let psw = [];
let sw = [];
let skip = Boolean(url("?skip"));
let player;
let playerDelay;
let EE = new EventEmitter();

export let ptimer;
export let gameTime = [];
// 图片播放延迟
export let delayer;
export let p2 = {
    psw: [],
    sw: []
};
let baseIconWidth = 45;

// 生成播放列表
export function genPoint2(topData, info) {
    let playPoint2 = _.flatten(_.reduce(topData, function (re, v, i) {
        let infoIndex = _.findIndex(info, function (w) {
            return w.name === v.gamename
        });

        if (infoIndex > -1 && _.size(info[infoIndex].images) > 0) {
            let item = _.map(info[infoIndex].images, function (w, j) {
                w.gamename = v.gamename;
                w.mtype = mediaType(w.path);
                w.dataIndex = i;
                w.mediaIndex = j;
                return w;
            });
            let temp = _.concat(re, item);
            return temp;
        } else {
            return _.concat(re, [{gamename:v.gamename, mtype:null, dataIndex:i, mediaIndex:-1}]);
        }

    }, []));

    console.log(playPoint2);
    return playPoint2;
};

export function pageTo1(opt) {

    opt.ps.slideTo(0, 1000, true);
    $("#js-footdes").text("数据来源：广告投放曝光点击数据来源O2系统和第三方监测公司；");

    ptimer = d3.timeout(function () {
        playCtrl({
            topData: opt.topData,
            ps: opt.ps,
            psw: p2.psw,
            sw: p2.sw,
            go: 0,
        });

        pageTo2(opt.ps);

    }, (config.second_time + 1) * 1000)

};

export function pageTo2(ps, cb) {
    ps.slideTo(1, 800, true);

    // 底部获取后更新获取数据时间
    $("#js-footdes")
        .text("数据来源：广告投放曝光点击数据来源O2系统和第三方监测公司，AppStore榜单来源企鹅风讯，微信搜索指数来源腾讯微信；");
};

// 绘制环图
export function drawPie2(opt) {
    $("[id^='piectr']", opt.curSlide).empty();
    $("[id^='pimectr']", opt.curSlide).empty();
    $("[id^='piecvr']", opt.curSlide).empty();

    jb.ui.pie22({
        i: opt.i,
        c: opt.c,
        rdata: opt.rdata,
    })
};

// 生成具体页 dom，启动具体实例
export function page22dom(opt) {

    if (_.size(opt.topData) === 0) {
        return;
    }
    let playPoint = store.session("playPoint2");
    let r = opt.rd[1].body.data;
    let info = opt.rd[2].body.data;
    let to = playPoint.playList[playPoint.index].dataIndex;

    let curArr = jb.ui.getSeq(opt.topData, to);
    let list2 = _.map(curArr[0], function (v) {
        opt.topData[v].seq = v;
        return opt.topData[v]
    });

    // 两边数据不一致，可能包含undefined
    r = _.compact(_.map(opt.topData, function (v) {
        let rintop = _.findIndex(r, {gameName: v.gamename});
        if (rintop > -1) {
            return r[rintop];
        }

    }));

    r = _.map(r, function (v) {
        v.wechatlist = _.map(v.weChatList, function (w) {
            w.day = jb.util.unix2dayNoYear(w.date, ".");
            return w;
        });

        if (v.weChatList.length > 0) {
            v.wsedate = jb.util.weekDay(v.weChatList[0].date, v.weChatList[v.weChatList.length - 1].date);
        } else {
            v.wsedate = ""
        }

        v.appstorelist = _.map(v.appstoreList, function (w, j) {
            w.day = jb.util.unix2dayNoYear(w.date, ".");
            return w;
        });


        if (v.appstoreList.lenght > 0) {
            v.asedate = jb.util.weekDay(v.appstoreList[0].date, v.appstoreList[v.appstoreList.length - 1].date);
        } else {
            v.asedate = "";
        }

        v.gtype = 0;

        let logoi = _.findIndex(opt.logos, {name: v.gameName});

        if (logoi > -1) {
            v.gtype = opt.logos[logoi].type || 0;
        }
        return v;
    });

    let listLogos = _.map(curArr[0], function (v) {
        opt.logos[v].seq = v;
        return opt.logos[v]
    });

    // 滑动容器构造 build
    let slidedom = $("#page2slide .swiper-wrapper");
    slidedom.empty();

    let topData = _.map(opt.topData, function (v) {
        let t = _.maxBy(v.gamelist, function (w) {
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
            w.pimpressions = w.impressions;
            w.impressions = jb.util.numSplit(w.impressions);

            return w;
        });

        v.impressions = jb.util.numSplit(v.impressions);
        v.sedate = jb.util.weekDay(opt.dataTime.start, opt.dataTime.end);

        return v;
    });

    try {
        // 顶部导航 todo to
        ban2({
            list: listLogos,
            index: to,
            data: topData,
            baseIconWidth: baseIconWidth,
            page: 2
        });

        let slideTpl = require("../template/second/slide.html");
        let slideHtml = slideTpl({list: topData, dataTime: opt.dataTime, slides: r, info: info, host: imghost});
        slidedom.html(slideHtml);

        // swiper 实例
        p2 = page22({
            topData: topData,
            list: list2,
            rdata: r,
            info: info,
            to: to,
        });

        if (p2.sw && p2.sw[to] && p2.sw[to].activeIndex === 0 && !p2.sw[to].animating) {
            setTimeout(function () {
                let infoIndex = _.findIndex(info, function (w) {
                    return w.name === r[to].gameName
                });

                let curSlide = $(p2.sw[to].slides[p2.sw[to].activeIndex]);

                drawPie2({
                    i: to,
                    c: 0,
                    rdata: info[infoIndex].images,
                    curSlide: curSlide
                });
            }, 1000)

        }

        if (p2.psw.activeIndex === to && !p2.psw.animating) {
            setTimeout(function () {
                let pid = $(p2.psw.slides[p2.psw.activeIndex]).attr("id");
                jb.util.animeProgress({dom: "#" + pid + " .progess"});

                let numdom = $(p2.psw.slides[p2.psw.activeIndex]);
                let n1 = numdom.find(".number").eq(0);
                let n2 = numdom.find(".number").eq(1);

                jb.util.animeFontScale({dom: n1[0]});
                jb.util.animeFontScale({dom: n2[0]});

                $("#js-getDate").text(jb.util.unix2day(r[p2.psw.activeIndex].dateLastTime));
            }, config.delayProcess)

        }

        p2.psw.on("slideChangeTransitionEnd", function () {

            try {
                let pswIndex = p2.psw.activeIndex;

                let infoIndex = _.findIndex(info, function (w) {
                    return w.name === topData[pswIndex].gamename
                });

                let curSlide = $(p2.sw[pswIndex].slides[p2.sw[pswIndex].activeIndex]);


                drawPie2({
                    i: pswIndex,
                    c: p2.sw[pswIndex].activeIndex,
                    rdata: info[infoIndex].images,
                    curSlide: curSlide
                });
            } catch (e) {

            }

            setTimeout(function () {
                let pid = $(p2.psw.slides[p2.psw.activeIndex]).attr("id");
                jb.util.animeProgress({dom: "#" + pid + " .progess"});

                let numdom = $(p2.psw.slides[p2.psw.activeIndex]);
                let n1 = numdom.find(".number").eq(0);
                let n2 = numdom.find(".number").eq(1);

                jb.util.animeFontScale({dom: n1[0]});
                jb.util.animeFontScale({dom: n2[0]});
            }, config.delayProcess)
        });

        // 启动具体页
        playCtrl({
            topData: topData,
            ps: opt.ps,
            psw: p2.psw,
            sw: p2.sw,
            go: opt.go,
        });

        // 顶部导航点击
        $(".swiper-nav-slide").click(function (e) {
            let playPoint = store.session("playPoint2");
            let el = $(e.currentTarget);
            let bid = parseInt(el.attr("bid"), 10);
            let cindex = _.findIndex(playPoint.playList, (v, i) => {
                if (v.gamename === topData[bid].gamename) {
                    return true;
                } else {
                    return false;
                }
            });

            pauseAll();
            window.clearTimeout(delayer);

            playStep({
                topData: topData,
                ps: opt.ps,
                psw: p2.psw,
                sw: p2.sw,
            }, cindex);
        });

        // 媒体导航
        $(".js-play .swiper-pagination-bullet").click(function (e) {
            let playPoint = store.session("playPoint2");
            let bl = $(e.currentTarget);
            let bindex = parseInt(bl.index());
            let gamename = bl.closest(".js-play").attr("gname");

            pauseAll();
            window.clearTimeout(delayer);

            let cindex = _.findIndex(playPoint.playList, (v, i) => {
                if (v.gamename === gamename) {
                    return true;
                } else {
                    return false;
                }
            });

            playStep({
                topData: topData,
                ps: opt.ps,
                psw: p2.psw,
                sw: p2.sw,
            }, cindex + bindex);

        })


    } catch (e) {
        console.log(e)
    }


}

// 生成 swiper 实例
export function page22(opt) {
    // 具体各模块
    let app30name = ["总畅销榜", "总免费榜", "游戏畅销榜", "游戏免费榜"];
    let app30en = ["totalbestlistcount", "totalfreelistcount", "gamebestlistcount", "gamefreelistcount"];
    let chart = [];
    // let hasVdata = [];

    let legend30 = [];
    let date30 = [];
    let list30 = [];
    let series = [];
    // let version = [];

    psw = new Swiper("#page2slide", {
        // autoplay: {
        //     delay: (skip === true && config.second_checked === 0) ? (config.seconddetail_time * 1000 + config.picSpeed) : config.delayslide
        // },
        autoplay: false,
        allowTouchMove: false,
        initialSlide: opt.to,
        speed: config.picSpeed,
        on: {
            slideChangeTransitionStart: function () {

                let rIndex = _.findIndex(opt.rdata, {gameName: opt.topData[this.activeIndex].gamename});
                if (rIndex > -1 && !_.isUndefined(opt.rdata[rIndex])) {
                    $("#js-getDate").text(jb.util.unix2day(opt.rdata[rIndex].dataLastTime));
                }

            },
            slideChangeTransitionEnd: function () {

            }
        }
    });

    psw.autoplay.stop();
    // list 已排好序
    _.forEach(opt.rdata, function (v, i) {
        let wxdate = [];
        let wxdata = [];

        let topIndex = _.findIndex(opt.topData, {gamename: v.gameName});
        if (_.has(opt.rdata[i], "wechatlist") && opt.rdata[i].wechatlist.length > 0) {
            _.forEach(opt.rdata[i].wechatlist, function (w) {
                wxdate.push(w.day);
                wxdata.push(w.count);
            });

            // 面积图
            if (topIndex > -1) {
                jb.ui.area2({
                    dom: $("#page2slide>.swiper-wrapper>.swiper-slide").eq(topIndex).find(".chart")[0],
                    date: wxdate,
                    data: wxdata,
                    color: themes[config.theme].color2Line2[4]
                });
            }

        }

        if (_.has(opt.rdata[i], "appstorelist") && opt.rdata[i].appstorelist.length > 0) {
            legend30[i] = [];
            date30[i] = [];
            list30[i] = [];
            series[i] = [];
            // version[i] = [];
            // hasVdata[i] = [];

            _.forEach(app30en, function (w, j) {
                legend30[i].push({
                    name: app30name[j],
                    icon: 'image://static/' + themes[config.theme].legend21Img[j + 1],
                });

                date30[i][w] = [];
                list30[i][w] = [];
                series[i][w] = [];

                _.forEach(opt.rdata[i].appstorelist, function (x, k) {

                    date30[i][w].push(x.day);
                    if (x[w] == 0) {
                        list30[i][w].push("-")
                    } else {
                        list30[i][w].push(x[w]);
                    }

                });

                series[i].push({
                    name: app30name[j],
                    showAllSymbol: false,
                    type: 'line',
                    symbol: "circle",
                    symbolSize: function (value, series) {

                        if (series.dataIndex == 0 || series.dataIndex === (date30[i][w].length - 1)) {
                            return 10
                        }

                        return 4;
                    },
                    lineStyle: {
                        width: 4,
                        // shadowColor: echarts.color.lerp(0.5, color2Line[j], false),
                        // shadowBlur: 45,
                        // shadowOffsetX: 10,
                        // shadowOffsetY: 10,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: themes[config.theme].color2Line2[j][0]
                            }, {
                                offset: 1,
                                color: themes[config.theme].color2Line2[j][1]
                            }],
                            globalCoord: false,
                        }

                    },
                    itemStyle: {
                        color: function (series) {
                            return echarts.color.lerp(series.dataIndex / 7, themes[config.theme].color2Line2[j], false)
                        },
                    },
                    smooth: true,
                    data: list30[i][w]
                });

            });

            // 30 日榜单趋势
            if (_.has(opt.rdata[topIndex], "gtype") && opt.rdata[topIndex].gtype != 2 && topIndex > -1) {
                chart[i] = jb.ui.line5({
                    dom: $("#page2slide>.swiper-wrapper>.swiper-slide").eq(topIndex).find(".chart")[1],
                    legend: legend30[i],
                    legendFontSize: 12,
                    legendWidth: 52,
                    legendHeight: 16,
                    itemGap: 10,
                    gdate: date30[i]['totalbestlistcount'],
                    series: series[i],
                    inverse: true,
                    min: 1,
                    max: function (value) {
                        return value.max + 1;
                    },
                    legendPadding: [5, 5, 10, 5],
                    grid: {
                        top: '15%',
                        right: '4%'
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        formatter: function (params) {
                            let ts = _.map(params, function (w) {
                                return w.seriesName + " " + w.data
                            });

                            return params[0].axisValue + '<br/>' + ts.join("<br/>")

                        },
                        backgroundColor: themes[config.theme].line5ToolTipBgColor,
                        textStyle: {
                            color: themes[config.theme].line5ToolTipColor,
                        }
                    },
                });
            }

        }

        //优秀广告素材展示
        let infoIndex = _.findIndex(opt.info, function (w) {
            return w.name === v.gameName
        });

        if (infoIndex > -1 && !_.isNull(opt.info)
            && _.has(opt.info[infoIndex], "images")
            && opt.info[infoIndex].images.length > 0) {

            sw[i] = new Swiper("#bl" + i, {
                autoplay: {
                    delay: config.img_stays * 1000
                },
                // initialSlide: curIndex,
                speed: config.picSpeed,
                // observer: true,
                // observeParents: true,
                nested: true,
                loop: false,
                pagination: {
                    el: "#blp" + i,
                    clickable: true,
                },
                on: {
                    slideChangeTransitionEnd: function () {
                        let curSlide = $(this.slides[this.activeIndex]);
                        let curIndex = this.activeIndex;

                        drawPie2({
                            i: i,
                            c: curIndex,
                            rdata: opt.info[infoIndex].images,
                            curSlide: curSlide
                        });

                    }
                }
            });
            sw[i].autoplay.stop();
        } else {
            sw[i] = null;
        }
    });
    // todo 
    // if (_.isNull(sw[0]) && skip === true) {
    //     playTimeToGame({psw: psw, sw: sw, pIndex: 0})
    // }

    return {
        psw: psw,
        sw: sw,
        chart: chart,
        app30en: app30en
    }
};

// 起始播放控制
export function playCtrl(opt) {
    let playPoint = store.session("playPoint2");

    if (opt.go > -1) {
        playPoint.prevIndex = playPoint.index;
        playPoint.index = opt.go;
    }
    store.session("playPoint2", playPoint);
    // 注册播放器
    if (!_.includes(EE.eventNames(), "slideBegin")) {
        EE.on("slideBegin", beginSw);
    };

    // jb.ui.interDispatch({
    //     pindex: psw.activeIndex,
    //     hdata: conf.hasVdata[conf.to],
    //     chart: conf.chart,
    //     app30en: conf.app30en,
    // });

    if (skip === true) {
        switch (config.second_checked) {
            case 0: {
                // playClass.type = "pagetime";
                // playClass.time = config.seconddetail_time;
                playStep(opt, playPoint.index);
                break;
            }
            case 1: {
                // playClass.type = "media";
                // playClass.time = config.seconddetail_material_count;

                if (playPoint.index !== -1) {
                    playStep(opt, playPoint.index);
                } else {
                    playStep(opt, playPoint.index);
                }
                break;
            }
        }
    } else {
        playStep(opt, playPoint.index);
    }
}

// 2 版本提示
export function interDispatch(opt) {
    // 取得版本数据的值和位置
    let vd = _.compact(_.map(opt.hdata, function (w, j) {
        if (w !== "") {
            return [w, j]
        } else {
            return false
        }
    }));

    let step = 0;
    let inter = jb.util.interval({
        time: config.appStoreDelay,
        cb: function () {
            if (step <= vd.length - 1) {
                opt.chart[opt.pindex].dispatchAction({
                    type: 'showTip',
                    seriesIndex: opt.app30en.length,
                    dataIndex: vd[step][1],
                });

                if (step == vd.length - 1) {
                    step = 0;
                } else {
                    step += 1;
                }
            }

        }
    });

    return {
        timer: inter,
        vlen: vd.length
    }

};

export function playStep(opt, nextIndex) {
    window.clearTimeout(delayer);
    // 游戏固定时间 config.second_checked ===0 && skip===true
    let curGame = store.get("currentGame");
    let playPoint = store.session("playPoint2");
    let playList = playPoint.playList;
    let prevPoint = playList[playPoint.index];
    let point = playList[nextIndex];

    console.log("pointNext:", nextIndex, "pointPrev:", playPoint.prevIndex);

    playPoint.prevIndex = playPoint.index;
    playPoint.index = nextIndex;
    store.session("playPoint2", playPoint);

    if (playPoint && playPoint.mtype === "video") {
        pauseAll();
    }

    if (config.second_checked === 0 && skip === true) {
        gamePlayTime(opt);
    }

    if (!_.isNil(prevPoint) && (point.dataIndex !== prevPoint.dataIndex
        || !_.isNil(curGame) && skip === true)
        || opt.go > -1) {
        Promise.all(setDom({
            nextIndex: point.dataIndex,
            data: opt.topData,
            baseIconWidth: baseIconWidth,
            dx: 15,
            maxHeight: 90,
        })).then(function () {
            opt.psw.slideTo(point.dataIndex, config.picSpeed);
            opt.psw.autoplay.stop();
            if(!_.isNil(opt.sw[point.dataIndex])){
                opt.sw[point.dataIndex].autoplay.stop();
            }

        });
    }

    if (!_.isNil(prevPoint)
        && (point.mediaIndex !== prevPoint.mediaIndex
            || point.dataIndex !== prevPoint.dataIndex
            || !_.isNil(curGame) && skip === true)) {
        opt.psw.autoplay.stop();
        if(!_.isNil(opt.sw[point.dataIndex])) {
            opt.sw[point.dataIndex].slideTo(point.mediaIndex);
            opt.sw[point.dataIndex].autoplay.stop();
        }
    }

    EE.emit("slideBegin", opt);
};

// 具体每个游戏展示素材个数
export function gamePlayNum(opt) {
    let playPoint = store.session("playPoint2");
    let point = playPoint.playList[playPoint.index];
    let prevPoint = playPoint.playList[playPoint.prevIndex];
    clearTimeout(playerDelay);
    clearTimeout(ptimer);


};

// 具体每个游戏的展示时间
export function gamePlayTime(opt) {
    let playPoint = store.session("playPoint2");
    let point = playPoint.playList[playPoint.index];
    let prevPoint = playPoint.playList[playPoint.prevIndex];

    if (!_.isNil(point) && _.isUndefined(gameTime[point.dataIndex])) {
        console.log("计时创建", moment().format("h:mm:ss"))
        gameTime[point.dataIndex] = d3.timeout(function () {

            if(prevPoint && prevPoint.mtype==="video"){
                pauseAll();
            }

            clearTimeout(playerDelay);
            clearTimeout(ptimer);

            opt.psw.autoplay.stop();

            if(!_.isNil(opt.sw[point.dataIndex])) {
                opt.sw[point.dataIndex].autoplay.stop();
            }

            playPoint.prevIndex = playPoint.index;
            if (point.dataIndex < (opt.topData.length - 1)) {
                let index = _.findIndex(playPoint.playList, (v, i) => {
                    if (v.dataIndex > point.dataIndex) {
                        return true;
                    } else {
                        return false;
                    }
                });
                playPoint.index =  index;
            }else{
                playPoint.index = 0;
                jb.util.time2Url({
                    url: '/third.html?skip=true',
                    time: 100
                });
                return;
            }
            store.session("playPoint2",playPoint);

            playStep(opt, playPoint.index)

        }, config.seconddetail_time * 1000)
    }

};

export function pauseAll() {
    if (!_.isNil(player)) {
        if (!player.paused) {
            player.pause();
            player.src("");
        }
        player && player.dispose();
        player = undefined;
    }
};

// 播放器：播放视频和图片
export function beginSw(opt) {
    let playPoint = store.session("playPoint2");
    let point = playPoint.playList[playPoint.index];

    // 需要提前确定视频的 index, 确定视频 video id
    if (point.mtype === "video") {
        // 视频id
        let vid = "" + point.dataIndex + point.mediaIndex;
        let vdomid = 'bl' + vid;

        $("#" + vdomid + " .vv").empty().append('<video class="video-js"' + "id=v" + vdomid + '></video>');

        try {

            player = videojs('v' + vdomid, {
                controls: true,
                autoplay: false,
                preload: 'none',
                height: $("#" + vdomid).find(".vv").height()
            });

            console.log("video:", player)

            if (player) {
                // player.src($("#" + vdomid).attr("vpath"));
                player.src(imghost + point.path);
                player.ready(function () {
                    player.play();
                });

                try {
                    // 浏览器尝试获取媒体数据失败
                    player.on("stalled", function (s) {
                        console.log("stalled");
                        playerDelay = d3.timeout(function () {
                            player.play();
                        }, 1000);
                    });

                    player.on("error", function (s) {
                        // console.log(player.duration, player.currentTime);
                        console.log("error");
                        player.dispose();
                        // errorDone();
                    });

                    player.on("abort", function (s) {
                        console.log("abort");
                        // playerDelay = d3.timeout(function () {
                        //     player.play()
                        // }, 1000);
                    });

                    player.on("suspend", _.throttle(function (s) {
                        // console.log(player.duration, player.currentTime);
                        // console.log("suspend");
                        try {
                            player.play()
                        } catch (e) {
                            console.log(e)
                        }

                    }, 1000));


                } catch (e) {
                    console.log(e)
                }
            }

            // 播放次数
            let pi = 1;

            // 视频播放完毕
            player.on('ended', function () {
                if (config.video_loops > pi) {
                    playerDelay = d3.timeout(function () {
                        player.play().catch(function (e) {
                            console.log("a.play catch play>", e);
                        });
                    }, 1000);
                    pi += 1;
                    return;
                }
                clearTimeout(playerDelay)
                mediaCtrl(opt);
            });
        } catch (err) {
            errorDone(opt);
        }

    } else {
        delayer = d3.timeout(() => {
            mediaCtrl(opt)
        }, config.img_stays * 1000)

    }
};

// 播放列表循环
function mediaCtrl(opt) {
    let playPoint = store.session("playPoint2");

    if (playPoint.index < (playPoint.playList.length - 1)) {
        playStep(opt, playPoint.index + 1)
    } else {
        clearTimeout(gameTime[point.dataIndex]);

        if (skip === true) {
            jb.util.time2Url({
                url: '/third.html?skip=true',
                time: 100
            });
            return;
        }

        playPoint.prevIndex = playPoint.index;
        playPoint.index = 0;
        store.session("playPoint2", playPoint);
        pageTo1(opt)
    }
}

// 视频错误处理
function errorDone(opt) {
    console.log("error done")
    // 延迟处理
    d3.timeout(function () {
        mediaCtrl(opt)
    }, 3000)
}

