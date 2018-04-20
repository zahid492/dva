$(function() {

    var data = [{
            name: "今日头条",
            logo: "1",
            data: {
                ctr: ["t1", "t2", "t3"],
                cvr: ["c1", "c2", "c3"]
            }
        }, {
            name: "新浪",
            logo: "2",
            data: {
                ctr: ["t12", "t22", "t33"],
                cvr: ["c12", "c22", "c33"]
            }
        },
        {
            name: "凤凰",
            logo: "3",
            data: {
                ctr: ["t111", "t222", "t333"],
                cvr: ["c111", "c222", "c333"]
            }
        }
    ];

    var Chimee = window.Chimee;

    var sw = [];
    var childSlide = $("#s1 .swiper-container");
    var childLen = childSlide.length;
    // 需要建立每个slide 的视频列表，并确定那个正在播放
    var playerList = [];

    $(".video").each(function(i, v) {
        $(v).attr("id", "v" + i)

        playerList[i] = new Chimee({
            src: $(v).attr("vpath"),
            wrapper: "#v" + i,
            // width: 60,
            // height: 90,
            volume: 1,
            autoplay: false,
            controls: true,
        });
    });

    var psw = new Swiper('#s1', {
        autoplay: false,
        speed: 2000,
        effect: "fade",
        fadeEffect: "crossFade",
        pagination: {
            el: '.s1p',
            observer: true,
            observeParents: true,
            clickable: true,
            renderBullet: function(index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
        on: {
            slideChangeTransitionEnd: function() {
                pstop()

                _.forEach(sw, function(v) {
                    v.autoplay.stop();
                    v.slideTo(0, 100, false);
                })

                // sw[this.activeIndex].slideTo(0);

                sw[this.activeIndex].autoplay.start();

            }
        }
    });

    function pstop() {
        _.forEach(playerList, function(v, i) {
            v.pause();
        })
    }

    childSlide.each(function(i, el) {

        var cel = $(el);

        sw[i] = new Swiper(cel[0], {
            autoplay: false,
            speed: 2000,
            observer: true,
            observeParents: true,
            nested: true,
            effect: "fade",
            fadeEffect: "crossFade",
            pagination: {
                el: cel.find(".swiper-pagination")[0],
                clickable: true,
                renderBullet: function(index, className) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                },
            },
            on: {
                slideChangeTransitionEnd: function() {
                    // console.log(this.activeIndex, this.slides[this.activeIndex])
                    // 手动切换走，需要关闭视频
                    var curSlide = $(this.slides[this.activeIndex])

                    var hasVideo = curSlide.hasClass("video");
                    // 手动切换过来，关闭前面的视频
                    pstop();
                    // 需要提前确定视频的 index, 确定视频 video id
                    if (hasVideo) {
                        // 停止轮播
                        sw[i].autoplay.stop();

                        // 视频id
                        var vid = curSlide.attr("id").slice(1)
                        console.log(vid, playerList[vid].duration)
                        // 播放视频
                        playerList[vid].play();

                        // 视频播放完毕
                        playerList[vid].on('ended', function() {
                            // 开始轮播
                            sw[i].autoplay.start();
                            // 最后一个 slide 并且动画完毕
                            if (sw[i].isEnd && !sw[i].animating) {
                                console.log("end:", i)

                                if (i === childLen - 1) {
                                    psw.slideTo(0, 2000, function() {
                                        sw[0].autoplay.stop();
                                        sw[0].slideTo(0);
                                        sw[0].autoplay.start();
                                        return true;
                                    });

                                } else {
                                    psw.slideTo(i + 1, 2000, function() {
                                        sw[i + 1].autoplay.start();
                                        sw[i + 1].slideTo(0);
                                        sw[i + 1].autoplay.start();
                                        return true;
                                    });
                                }
                            }
                        });

                    } else if (sw[i].isEnd && !sw[i].animating) {
                        sw[i].autoplay.stop();
                        // 最后一个 slide 并且动画完毕
                        if (i === childLen - 1) {
                            psw.slideTo(0, 2000, function() {
                                sw[0].autoplay.stop();
                                sw[0].slideTo(0);
                                sw[0].autoplay.start();
                                return true;
                            });

                        } else {
                            psw.slideTo(i + 1, 2000, function() {
                                sw[i + 1].autoplay.stop();
                                sw[i + 1].slideTo(0);
                                sw[i + 1].autoplay.start();
                                return true;
                            });
                        }
                    }

                }
            }
        });


    })

    sw[0].autoplay.start();

})