
jb.ui.beginSw4 = function (ban4sw, ppsw, psw, sw, k, i, curSlide, curIndex) {
    "use strict";
    var vpindex = jb.ui.findPreV4(k, i, curIndex, videoList);
    var vprev;

    if(vpindex > -1){
        // 暂停前一个视频的播放
        vprev = videoList.player[vpindex];

        if ( vprev && !vprev.paused) {
            console.log("destroy")
            try {
                vprev.pause();

            } catch (e) {

            }
        }
    }

    window.clearTimeout(delayer);
    // 媒体固定时间
    if (config.four_checked === 1 && skip == true) {
        jb.ui.media4(ban4sw, ppsw, psw, sw, k, i)
    }
    // 页面固定时间
    if (config.four_checked === 0 && skip == true) {
        jb.ui.pageTime4(ban4sw, ppsw, psw, sw, k, i);
    }

    // 媒体数量
    var dlen = ppsw.slides.length;
    var hasVideo = curSlide.hasClass("video");

    // 手动切换过来，关闭前面的视频
    // 停止轮播
    sw[k][i].autoplay.stop();

    // 需要提前确定视频的 index, 确定视频 video id

    function errorDone() {
        console.log("error done")
        if (player && !player.destroyed) {


            try {
                player.destroy();


            } catch (e) {

            }
        }
        clearTimeout(delayer);
        // 延迟处理
        _.delay(function () {
            if (sw[k][i].isEnd && !sw[k][i].animating) {
                if (i === (sw[k].length - 1)) {
                    if (k === dlen - 1) {

                        if (skip === true) {
                            jb.util.time2Url({
                                url: '/fifth.html?skip=true',
                                time: 100
                            });
                            return;
                        }

                        jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, k, i, 0, 0, true)
                    } else {
                        jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, k + 1, 0, true)
                    }

                } else {
                    jb.ui.playSwitchOther4(ban4sw, ppsw, psw, sw, k, i + 1, true)
                }
            } else {
                // 游戏的其他素材
                console.log("error done游戏的其他素材:", k, i)
                jb.ui.playOther4(ban4sw, ppsw, psw, sw, k, i, true)
            }
        }, 3000)
    }

    if (hasVideo) {
        // 视频id
        var vid = curSlide.attr("id");
        // 播放视频

        try {
            var pvIndex = jb.ui.findVL4(k, i, curIndex, videoList);

            videoList.pvIndex = pvIndex;
            if(pvIndex>-1 && !_.isUndefined(videoList.player[pvIndex])){
                videoList.player[pvIndex];

            }else{
                videoList.player[pvIndex] = new Chimee({
                    src: $("#" + vid).attr("vpath"),
                    wrapper: "#v" + vid,
                    // poster: $("#"+vid).attr("poster"),
                    // width: 60,
                    // height: 90,
                    volume: 1,
                    preload: "auto",
                    autoplay: false,
                    controls: false,
                    // muted: true,
                    // plugin: [{
                    //     name: chimeePluginCenterState.name,
                    //     errorTips: 'cuowuaaa'
                    // }],
                });

            }


            if (videoList.player[pvIndex]) {
                videoList.player[pvIndex].pause()
                try {
                    playerDelay = _.delay(function () {
                        videoList.player[pvIndex].play();

                        // 浏览器尝试获取媒体数据失败
                        videoList.player[pvIndex].on("stalled", function (s) {
                            console.log("stalled");
                            // errorDone();
                            playerDelay = _.delay(function () {
                                videoList.player[pvIndex].play();
                            }, 1000);
                        });

                        videoList.player[pvIndex].on("error", function (s) {
                            // console.log(player.duration, player.currentTime);
                            console.log("error");
                            errorDone();
                        });

                        videoList.player[pvIndex].on("abort", function (s) {
                            // console.log("abort");
                            playerDelay = _.delay(function () {
                                videoList.player[pvIndex].play()
                            }, 1000);
                        });

                        videoList.player[pvIndex].on("suspend", _.throttle(function (s) {
                            // console.log(player.duration, player.currentTime);
                            // console.log("suspend");
                            try {
                                videoList.player[pvIndex].play()
                            } catch (e) {
                                console.log(e)
                            }

                        }, 1000));


                    }, 1000);
                } catch (e) {
                    console.log(e)
                }

            }

            // 播放次数
            var pi = 1;

            // 视频播放完毕
            videoList.player[pvIndex].on('ended', function () {
                if (config.video_loops > pi) {
                    playerDelay = _.delay(function () {
                        videoList.player[pvIndex].play().catch(function (e) {
                            console.log("a.play catch play>", e);
                        });
                    }, 1000);
                    pi += 1;
                    return;
                }
                clearTimeout(playerDelay)
                // 开始轮播
                if (!sw[k][i].isEnd) {
                    sw[k][i].slideTo(curIndex + 1, config.picSpeed);
                }

                // 最后一个 slide 并且动画完毕，游戏的最后一个素材播放完毕
                if (sw[k][i].isEnd && !sw[k][i].animating) {
                    // 进行到该媒体的最后一款游戏
                    if (i === (sw[k].length - 1)) {
                        console.log("v最后一款游戏:", k, i)
                        // 最后一个媒体
                        if (k === dlen - 1) {
                            if (skip === true) {
                                jb.ui.go5();
                            }
                            console.log("v最后一个媒体:", k, i)
                            jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, k, i, 0, 0, true)
                        } else {
                            // 其他媒体
                            console.log("v其他媒体:", k + 1, 0)
                            jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, k + 1, 0, true)
                        }

                    } else {
                        console.log("v媒体的其他游戏:", k, i + 1)
                        jb.ui.playSwitchOther4(ban4sw, ppsw, psw, sw, k, i + 1, true)
                    }
                } else {
                    // 游戏的其他素材
                    console.log("v游戏的其他素材:", k, i)
                    jb.ui.playOther4(ban4sw, ppsw, psw, sw, k, i, true)
                }
            });
        } catch (err) {
            errorDone();
        }

    } else if (sw[k][i].isEnd && !sw[k][i].animating) {
        // k 媒体中游戏的最后，每个媒体的右下角
        if (i === (sw[k].length - 1)) {
            console.log("最后一款游戏:", k, i)
            // 也进行到该媒体的最后
            if (k === dlen - 1) {
                if (skip === true) {
                    jb.ui.go5();
                }

                console.log("最后一个媒体:", k, i)
                jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, 0, 0, false)

            } else {
                console.log("其他媒体:", k + 1, 0)
                // 该媒体还有未播放的游戏
                jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, k + 1, 0, false)
            }
        } else {
            console.log("媒体的其他游戏:", k, i + 1)
            // k 媒体还有未播放的游戏
            jb.ui.playSwitchOther4(ban4sw, ppsw, psw, sw, k, i + 1, false)
        }

    } else {
        console.log("v游戏的其他素材:", k, i)
        jb.ui.playOther4(ban4sw, ppsw, psw, sw, k, i, false)
    }

};


try {
    var pvIndex = jb.ui.findVL4(k, i, curIndex, videoList4);

    videoList4.pvIndex = pvIndex;
    if (pvIndex > -1 && !_.isUndefined(videoList4.player[pvIndex])) {
        videoList4.player[pvIndex];

    } else {
        videoList4.player[pvIndex] = videojs("v" + vid, {
            controls: true,
            autoplay: false,
            preload: 'none',
            height: $("#" + vid).find(".vv4").height()
        });

        console.log("be videoList4:", videoList4)
    }


    if (videoList4.player[pvIndex]) {
        videoList4.player[pvIndex].src($("#" + vid).attr("vpath"))
        videoList4.player[pvIndex].ready(function () {
            videoList4.player[pvIndex].play();
        });

        try {
            // 浏览器尝试获取媒体数据失败
            videoList4.player[pvIndex].on("stalled", function (s) {
                console.log("stalled");
                playerDelay = _.delay(function () {
                    videoList4.player[pvIndex].play();
                }, 1000);
            });

            videoList4.player[pvIndex].on("error", function (s) {
                // console.log(player.duration, player.currentTime);
                console.log("error");
                videoList4.player[pvIndex].dispose();
                errorDone();
            });

            videoList4.player[pvIndex].on("abort", function (s) {
                console.log("abort", pvIndex);
                // playerDelay = _.delay(function () {
                //     videoList4.player[pvIndex].play()
                // }, 1000);
            });

            videoList4.player[pvIndex].on("suspend", _.throttle(function (s) {
                // console.log(player.duration, player.currentTime);
                // console.log("suspend");
                try {
                    videoList4.player[pvIndex].play()
                } catch (e) {
                    console.log(e)
                }

            }, 1000));


        } catch (e) {
            console.log(e)
        }

    }

    // 播放次数
    var pi = 1;

    // 视频播放完毕
    videoList4.player[pvIndex].on('ended', function () {
        if (config.video_loops > pi) {
            playerDelay = _.delay(function () {
                videoList4.player[pvIndex].play().catch(function (e) {
                    console.log("a.play catch play>", e);
                });
            }, 1000);
            pi += 1;
            return;
        }
        clearTimeout(playerDelay)
        // 开始轮播
        if (!sw[k][i].isEnd) {
            sw[k][i].slideTo(curIndex + 1, config.picSpeed);
        }

        // 最后一个 slide 并且动画完毕，游戏的最后一个素材播放完毕
        if (sw[k][i].isEnd && !sw[k][i].animating) {
            // 进行到该媒体的最后一款游戏
            if (i === (sw[k].length - 1)) {
                console.log("v最后一款游戏:", k, i)
                // 最后一个媒体
                if (k === dlen - 1) {
                    if (skip === true) {
                        jb.ui.go5();
                    }
                    console.log("v最后一个媒体:", k, i)
                    jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, k, i, 0, 0, true)
                } else {
                    // 其他媒体
                    console.log("v其他媒体:", k + 1, 0)
                    jb.ui.playSwitch4(ban4sw, ppsw, psw, sw, k + 1, 0, true)
                }

            } else {
                console.log("v媒体的其他游戏:", k, i + 1)
                jb.ui.playSwitchOther4(ban4sw, ppsw, psw, sw, k, i + 1, true)
            }
        } else {
            // 游戏的其他素材
            console.log("v游戏的其他素材:", k, i)
            jb.ui.playOther4(ban4sw, ppsw, psw, sw, k, i, true)
        }
    });
} catch (err) {
    errorDone();
}