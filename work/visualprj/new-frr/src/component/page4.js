import {EventEmitter} from "eventemitter3";
import {jb, mediaType} from "../plugs/tbase";
import {imghost} from "../config/config";


// const imghost = 'http://sdadmin.qq.com/api/';
// 本地配置
const config = store.session("config");
// 循环跳转标志
const skip = Boolean(url("?skip"));
// 全局播放列表
let playPoint = {};
// 媒体时间
let mediaTime = [];
// 重复播放实例
let playerDelay;
// 页面延迟实例
let pageTime;
// 播放延迟控制实例
let delayer;
// 播放器实例
let player4;
let EE = new EventEmitter();

// 生成播放列表
export function genPlayList(data) {
    return _.flatten(_.reduce(data, function (r, v, k) {
        return _.concat(r, _.map(_.concat(v.ctr, v.cvr), (t, i) => {
            return _.map(t.images, (w, j) => {
                return {
                    mtype: mediaType(w.path),
                    path: w.path,
                    mediaIndex: j,
                    ctvrIndex: i,
                    dataIndex: k
                }
            });
        }));
    }, []));
};

// 跳转到下一页面
export function go5() {
    if (skip === true) {
        console.log("转到第5页")

        jb.util.time2Url({
            url: '/fifth.html?skip=true',
            time: 100
        });
        return;
    }
};

// 固定游戏数量
export function gameNum4(opt) {
    let playPoint = store.session("playPoint");
    let point = playPoint.playList[playPoint.index];
    let prevPoint = playPoint.playList[playPoint.prevIndex];
    let numPoint = store.get("numPoint4");

    if (_.isNil(numPoint)) {
        let temp1 = _.map(playPoint.playList, (v) => {
            return {dataIndex: v.dataIndex, ctvrIndex: v.ctvrIndex}
        });

        let temp2 = _.uniqBy(temp1, (v) => {
            return "" + v.dataIndex + v.ctvrIndex
        });
        let temp3 = _.chunk(temp2, config.four_game_time)

        numPoint = {
            list: temp3,
            index: 0,
            nextIndex: 1,
        };

        store.set("numPoint4", numPoint);
    }
    // 已启动固定计数，并适时修正playPoint, 到达下一个chunk 点
    if (point.dataIndex === numPoint.list[numPoint.nextIndex][0].dataIndex
        && point.ctvrIndex === numPoint.list[numPoint.nextIndex][0].ctvrIndex) {


        if(prevPoint && prevPoint.mtype==="video"){
            pauseAll4();
        }

        opt.psw[point.dataIndex].autoplay.stop();
        opt.sw[point.dataIndex][point.ctvrIndex].autoplay.stop();

        window.clearTimeout(delayer);

        numPoint.index = numPoint.nextIndex;
        if (numPoint.nextIndex < numPoint.list.length - 1) {
            numPoint.nextIndex = numPoint.nextIndex + 1;
        } else {
            numPoint.nextIndex = 0;
        }

        store.set("numPoint4", numPoint);
        store.set("playPoint", playPoint);

        go5();
    }

};

// 不对手动的媒体切换进行记录
function mediaGo(opt) {
    let playPoint = store.session("playPoint");
    let point = playPoint.playList[playPoint.index];
    let prevPoint = playPoint.playList[playPoint.prevIndex];
    let curMedia = store.get("currentMedia");

    if(prevPoint && prevPoint.mtype==="video"){
        pauseAll4();
    }

    if (!_.isNil(curMedia) && curMedia !== point.dataIndex) {

    } else {
        let index = _.findIndex(playPoint.playList, (v, i) => {
            if (v.dataIndex > curMedia) {
                return true;
            } else {
                return false;
            }
        });
        playPoint.prevIndex = playPoint.index;
        playPoint.index = index;
    }

    store.set("playPoint", playPoint);

    opt.psw[point.dataIndex].autoplay.stop();
    opt.sw[point.dataIndex][point.ctvrIndex].autoplay.stop();

    console.log("媒体计时销毁", moment().format("h:mm:ss"));
    window.clearTimeout(delayer);

    go5();
    window.clearTimeout(mediaTime[point.dataIndex]);
}

// 媒体固定时间
export function media4(opt) {
    let playPoint = store.session("playPoint");
    let point = playPoint.playList[playPoint.index];

    if (_.isUndefined(mediaTime[point.dataIndex])) {
        store.set("currentMedia", point.dataIndex);
        console.log("媒体计时创建", moment().format("h:mm:ss"));

        mediaTime[point.dataIndex] = d3.timeout(function () {
            mediaGo(opt)
        }, config.four_meidia_time * 1000);

    } else {
        let curMedia = store.get("currentMedia");

        if (!_.isNil(curMedia) && curMedia !== point.dataIndex) {
            mediaGo(opt)
        }
    }

};

// 页面固定时间
export function pageTime4(opt) {

    if (_.isUndefined(pageTime)) {
        console.log("页面计时创建", moment().format("h:mm:ss"))
        pageTime = d3.timeout(function () {
            let playPoint = store.session("playPoint");
            let point = playPoint.playList[playPoint.index];
            let prevPoint = playPoint.playList[playPoint.prevIndex];

            if(prevPoint && prevPoint.mtype==="video"){
                pauseAll4();
            }

            opt.psw[point.dataIndex].autoplay.stop();
            opt.sw[point.dataIndex][point.ctvrIndex].autoplay.stop();

            store.session.remove("playPoint");
            console.log("页面计时销毁", moment().format("h:mm:ss"))
            go5();
            window.clearTimeout(delayer);
            window.clearTimeout(pageTime);
        }, config.four_time * 1000);

    }

};

// 视频实例清除
export function pauseAll4() {
    if (!_.isNil(player4)) {
        if (!player4.paused) {
            player4.pause();
            player4.src("");
        }
        player4 && player4.dispose();
        player4 = undefined;
    }
};

// 播放列表循环
function mediaCtrl(opt) {
    let playPoint = store.session("playPoint");

    if (playPoint.index < (playPoint.playList.length - 1)) {
        playStep4(opt, playPoint.index + 1)
    } else {
        playStep4(opt, 0)
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

// 播放器：播放视频和图片
export function beginSw4(opt) {
    "use strict";
    let playPoint = store.session("playPoint");
    let point = playPoint.playList[playPoint.index];

    // 需要提前确定视频的 index, 确定视频 video id
    if (point.mtype === "video") {
        // 视频id
        let vid = "" + point.dataIndex + point.ctvrIndex + point.mediaIndex;
        let vdomid = 'bl' + vid;

        $("#"+ vdomid + " .vv4").empty().append('<video class="video-js"'+ "id=v" + vdomid  + '></video>');

        try {

            player4 = videojs('v' + vdomid, {
                controls: true,
                autoplay: false,
                preload: 'none',
                height: $("#" + vdomid).find(".vv4").height()
            });

            console.log("video:", player4)

            if (player4) {
                // player4.src($("#" + vdomid).attr("vpath"));
                player4.src(imghost + point.path);
                player4.ready(function () {
                    player4.play();
                });

                try {
                    // 浏览器尝试获取媒体数据失败
                    player4.on("stalled", function (s) {
                        console.log("stalled");
                        playerDelay = d3.timeout(function () {
                            player4.play();
                        }, 1000);
                    });

                    player4.on("error", function (s) {
                        // console.log(player.duration, player.currentTime);
                        console.log("error");
                        player4.dispose();
                        // errorDone();
                    });

                    player4.on("abort", function (s) {
                        console.log("abort");
                        // playerDelay = d3.timeout(function () {
                        //     player4.play()
                        // }, 1000);
                    });

                    player4.on("suspend", _.throttle(function (s) {
                        // console.log(player.duration, player.currentTime);
                        // console.log("suspend");
                        try {
                            player4.play()
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
            player4.on('ended', function () {
                if (config.video_loops > pi) {
                    playerDelay = d3.timeout(function () {
                        player4.play().catch(function (e) {
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

// 绘制环图
export function drawPie4(opt) {
    $("[id^='piectr']", opt.curSlide).empty();
    $("[id^='piemctr']", opt.curSlide).empty();
    $("[id^='piecvr']", opt.curSlide).empty();

    jb.ui.pie44({
        k: opt.k,
        i: opt.i,
        c: opt.c,
        //rdata.list[n]
        v: opt.v
    })
};

// 切换媒体// 切换游戏 // 控制 swipers 切换
export function playStep4(opt, nextIndex) {

    window.clearTimeout(delayer);

    let curMedia = store.get("currentMedia");

    let playPoint = store.session("playPoint");
    let playList = playPoint.playList;


    let prevPoint = playList[playPoint.index];
    let point = playList[nextIndex];

    console.log("pointNext:", nextIndex, "pointPrev:", playPoint.prevIndex);

    playPoint.prevIndex = playPoint.index;
    playPoint.index = nextIndex;

    store.session("playPoint", playPoint);

    if(prevPoint && prevPoint.mtype==="video"){
        pauseAll4();
    }

    // 页面固定时间
    if (config.four_checked === 0 && point.index !== -1 && skip == true) {
        store.remove("currentMedia");
        pageTime4(opt);
    }

    // 媒体固定时间
    if (config.four_checked === 1 && point.index !== -1 && skip == true) {
        media4(opt)
    }

    // 游戏固定数量
    if (config.four_checked === 2 && point.index !== -1 && skip == true) {
        gameNum4(opt)
    }

    if(!_.isNil(prevPoint) && (point.dataIndex !== prevPoint.dataIndex
        || point.ctvrIndex !== prevPoint.ctvrIndex)){
        changeLeftNav();
    }

    if (!_.isNil(prevPoint) && (point.dataIndex !== prevPoint.dataIndex
        || !_.isNil(curMedia) && skip === true)) {
        opt.ppsw.slideTo(point.dataIndex, config.picSpeed);
        opt.ban4sw.slideTo(point.dataIndex, config.picSpeed);
        opt.psw[point.dataIndex].slideTo(point.ctvrIndex, config.picSpeed);
        opt.psw[point.dataIndex].autoplay.stop();
        opt.sw[point.dataIndex][point.ctvrIndex].autoplay.stop();
    }

    if (!_.isNil(prevPoint) && (point.ctvrIndex !== prevPoint.ctvrIndex
        || !_.isNil(curMedia) && skip === true)) {
        opt.psw[point.dataIndex].slideTo(point.ctvrIndex, config.picSpeed);
        opt.psw[point.dataIndex].autoplay.stop();
        opt.sw[point.dataIndex][point.ctvrIndex].autoplay.stop();
    }

    if (!_.isNil(prevPoint)
        && (point.mediaIndex !== prevPoint.mediaIndex
            || point.dataIndex !== prevPoint.dataIndex
            || point.ctvrIndex !== prevPoint.ctvrIndex
            || !_.isNil(curMedia) && skip === true)) {
        opt.psw[point.dataIndex].autoplay.stop();
        opt.sw[point.dataIndex][point.ctvrIndex].slideTo(point.mediaIndex);
        opt.sw[point.dataIndex][point.ctvrIndex].autoplay.stop();
    }

    EE.emit("slideBegin", opt);
};

// 左侧 ctr cvr 导航切换
function changeLeftNav() {
    let playPoint = store.session("playPoint");
    let point = playPoint.playList[playPoint.index];

    let ncvr = $("#js-navCvr" + point.dataIndex);
    let nctr = $("#js-navCtr" + point.dataIndex);
    let nctli = nctr.find("li");
    let ncvli = ncvr.find("li");
    let ctrlen = nctli.length;
    let cvrlen = ncvli.length;

    nctli.removeClass("active");
    ncvli.removeClass("active");

    if (point.ctvrIndex <= ctrlen - 1) {
        nctr.find("li").eq(point.ctvrIndex).addClass("active");
    }

    if (point.ctvrIndex <= (cvrlen + ctrlen - 1) && point.ctvrIndex >= ctrlen) {
        ncvr.find("li").eq(point.ctvrIndex - ctrlen).addClass("active");
    }

}

// 起始播放控制
function playCtrl(opt) {
    let playPoint = store.session("playPoint");

    if (skip === true) {
        switch (config.four_checked) {
            case 0: {
                // playClass.type = "page";
                // playClass.time = config.four_time;
                playStep4(opt, 0);
                break;
            }
            case 1: {
                // playClass.type = "media";
                // playClass.time = config.four_meidia_time;

                if (playPoint.index !== -1) {
                    playStep4(opt, playPoint.index);
                } else {
                    playStep4(opt, 0);
                }
                break;
            }
            case 2: {
                // playClass.type = "game";
                // playClass.time = config.four_game_time;

                if (playPoint.index !== -1) {
                    playStep4(opt, playPoint.index);
                } else {
                    playStep4(opt, 0);
                }

                break;
            }
            default: {
                playClass.type = "normal";
                playClass.time = undefined;
            }
        }
    } else {
        playStep4(opt, 0);
    }


    // 正常播放
    changeLeftNav();
}

// 四屏右侧所有轮播
export function page4(opt) {
    // 生成播放列表
    let playList = genPlayList(opt.rdata);

    playPoint = {
        playList: playList,
        index: -1,
        prevIndex: -1,
    };
    // 取原来的播放点
    let pt = store.get("playPoint");
    store.remove("playPoint");

    if (_.isNil(pt)) {
        store.session("playPoint", playPoint);
    } else {
        playPoint = _.assignIn(playPoint, pt);
        store.session("playPoint", playPoint);
    }

    // 注册播放器
    EE.on("slideBegin", beginSw4);

    let pswLen = [];
    let psw = [];
    let sw = [];

    // 右侧总的轮播，可触发顶部导航
    let ppsw = new Swiper("#js-rsbox", {
        autoplay: false,
        allowTouchMove: false,
        speed: config.picSpeed,
        on: {
            slideChangeTransitionStart: function () {
                // 头部导航切换
                opt.ban4dom(this.activeIndex);
            }
        }
    });
    ppsw.autoplay.stop();

    _.forEach(opt.rdata, function (w, k) {
        sw[k] = Array(6);
        _.fill(sw[k], null);

        let childSlide = $("#js-pbox" + k + " .swiper-container");
        let childLen = childSlide.length;
        pswLen.push(childLen);

        // 右侧根据左侧导航对应的轮播，可触发左侧导航， k 对应左侧导航索引
        psw[k] = new Swiper("#js-pbox" + k, {
            autoplay: false,
            allowTouchMove: false,
            speed: config.picSpeed,
            nested: true
        });
        psw[k].autoplay.stop();
        // 具体各模块

        _.forEach(_.concat(w.ctr, w.cvr), function (v, i) {
            //优秀广告素材展示
            sw[k][i] = new Swiper("#bl" + k + i, {
                // autoplay: {
                //     delay: config.img_stays * 1000
                // },
                autoplay: false,
                allowTouchMove: false,
                speed: config.picSpeed,
                nested: true,
                loop: false,
                effect: 'fade',
                pagination: {
                    el: "#blp" + k + i,
                    clickable: true,
                },
                on: {
                    slideChangeTransitionEnd: function () {
                        let curSlide = $(this.slides[this.activeIndex]);
                        let curIndex = this.activeIndex;

                        drawPie4({
                            curSlide: curSlide,
                            k: k,
                            i: i,
                            c: curIndex,
                            v: _.concat(w.ctr, w.cvr)
                        });

                    }
                }
            });
            sw[k][i].autoplay.stop();
        });

        sw[k] = _.compact(sw[k]);
    });

    // 开始播放
    playCtrl({ban4sw: opt.ban4sw, ppsw: ppsw, psw: psw, sw: sw});

    // 顶部导航
    $(".swiper-nav-slide").click(function (e) {
        let playPoint = store.session("playPoint");
        let point = playPoint.playList[playPoint.index];
        let prevPoint = playPoint.playList[playPoint.prevIndex];
        let el = $(e.currentTarget);
        let cindex = parseInt(el.attr("bid"), 10);

        psw[point.dataIndex].autoplay.stop();
        sw[point.dataIndex][point.ctvrIndex].autoplay.stop();

        if(prevPoint && prevPoint.mtype==="video"){
            pauseAll4();
        }

        let pt = _.findIndex(playPoint.playList, function (v) {
            if (v.dataIndex === cindex && v.ctvrIndex >= 0) {
                return true;
            } else if (v.dataIndex > cindex) {
                return true;
            } else {
                return false;
            }
        });
        playStep4(_.assign(opt, {
            psw: psw,
            sw: sw,
            ppsw: ppsw,
        }), pt);
    });

    // 左侧导航
    $(".ranking-box li").click(function (e) {

        let playPoint = store.session("playPoint");
        let point = playPoint.playList[playPoint.index];
        let prevPoint = playPoint.playList[playPoint.prevIndex];
        let el = $(e.currentTarget);
        let cinArr = el.attr("nid").split("-");

        cinArr = _.map(cinArr, function (v) {
            return parseInt(v, 10)
        });
        psw[point.dataIndex].autoplay.stop();
        sw[point.dataIndex][point.ctvrIndex].autoplay.stop();

        if(prevPoint && prevPoint.mtype==="video"){
            pauseAll4();
        }
        // 位置和跳跃点一致就会跳出。跳跃点是本次的结束，下次的起始。
        let pt = _.findIndex(playPoint.playList, function (v) {
            if (v.dataIndex === cinArr[0] && v.ctvrIndex >= cinArr[1]) {
                return true;
            } else if (v.dataIndex > cinArr[0] && v.ctvrIndex < cinArr[1]) {
                return true;
            } else {
                return false;
            }
        });

        playStep4(_.assign(opt, {
            psw: psw,
            sw: sw,
            ppsw: ppsw,
        }), pt);
    });

    // 媒体播放控制
    $(".js-play4 .swiper-pagination-bullet").click(function (e) {
        let playPoint = store.session("playPoint");
        let point = playPoint.playList[playPoint.index];
        let prevPoint = playPoint.playList[playPoint.prevIndex];
        let el = $(e.currentTarget);
        let parent = el.closest(".js-play4");
        let nk = parseInt(parent.attr("nk"), 10);
        let ni = parseInt(parent.attr("ni"), 10);
        let elIndex = parseInt(el.index(), 10);

        console.log(nk, ni, elIndex)
        psw[point.dataIndex].autoplay.stop();
        sw[point.dataIndex][point.ctvrIndex].autoplay.stop();

        if(prevPoint && prevPoint.mtype==="video"){
            pauseAll4();
        }
        // 位置和跳跃点一致就会跳出。跳跃点是本次的结束，下次的起始。
        let pt = _.findIndex(playPoint.playList, function (v) {
            if (v.dataIndex === nk && v.ctvrIndex === ni && v.mediaIndex === elIndex) {
                return true;
            } else {
                return false;
            }
        });

        playStep4(_.assign(opt, {
            psw: psw,
            sw: sw,
            ppsw: ppsw,
        }), pt);
    });

    // 返回 swiper 实例
    return {
        ppsw: ppsw,
        psw: psw,
        sw: sw
    }

};