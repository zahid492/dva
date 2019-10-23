import {themes} from "../config/config";
import {jb} from "../plugs/tbase";
import {playList5, playTime5, go5} from "../component/page5";


var config = store.session("config");
var ltSetting = {
    slideInterval: "slideInterval",
    isAutoChange: !0,
    direction: 5000,
    callbackFunc: null,
    indicatorEvent: "click",
    slideType: "2d"
}
export default function slideCarsousel(){
    !function (e) {
        var playlist = store.session("fivePlayList");
        var skip = Boolean(url("?skip"));

        // 只是右侧信息显示
        function rightSlide(t, s) {
            var res = store.session("newsPublishData");
            var logos = store.session("logos");

            $("#js-contentBoxR").empty();
            var id = $(".item2").find(".item-content").attr("id");

            res.forEach(function (v, i) {
                var logoIndex = _.findIndex(logos, {gameName: v.gamename});

                if (i == id) {
                    var logourl = '';

                    if (logoIndex === -1) {
                        logourl = '../img/logo2.png'
                    } else {
                        if (logos[logoIndex].gameLogoUrl == "") {
                            logourl = '../img/logo2.png'
                        } else {
                            logourl = logos[logoIndex].gameLogoUrl
                        }
                    }

                    var txt = '<div class="gameBox"><h2><span>游戏<i></i></span></h2><img src="' + logourl + '" /><strong>' + res[i].gamename + '</strong></div><span class="gradientLine"></span><div class="mediaBox"><h2><span>网站<i></i></span></h2><strong>' + res[i].medianame + '</strong></div><span class="gradientLine"></span><div class="dateBox"><h2><span>报道日期 <i></i></span></h2><strong>' + jb.util.unix2day(res[i].publish, ".") + '</strong></div>';
                    $("#js-contentBoxR").append(txt);
                }
            })

            playList5(s.currentIndex, function () {
                go5(t, s)

            }, function () {
                console.log("当前：", s.currentIndex)
            })
        }

        e.fn.slideCarsousel = function (t) {
            //debugger
            t = e.extend({},
                e.fn.slideCarsousel.defaultSetting, t);
            var i = e(this),
                n = i.children("ul.item-list"),
                r = n.children(),
                s = {
                    slideCarousel: i,
                    count: r.length,
                    ul: n,
                    liList: r,
                    currentIndex: playlist.posIndex,
                    indicatorList: i.children(".indicator-list").children("a"),
                    itemPrev: i.children(".controls").children(".item-prev"),
                    itemNext: i.children(".controls").children(".item-next"),
                    itemClassArr: [],
                    init: function () {
                        for (var e = 0, t = s.count; e < t; e++) s.itemClassArr.push("item" + e);
                        s.slideAutoChange();
                        if (skip === true) {
                            playTime5(function () {
                                go5(t, s)
                            })
                        }

                    },
                    slideAutoChange: function () {
                        //debugger
                        t.isAutoChange && (t.slideInterval = setInterval(function () {
                            s.toNext()
                        }, t.direction))

                        playList5(s.currentIndex, function () {

                            go5(t, s)

                        }, function () {
                            console.log("当前：", s.currentIndex)
                        })
                    },
                    toNext: function () {
                        s.itemClassArr.unshift(s.itemClassArr[s.count - 1]);
                        s.itemClassArr.pop();
                        s.currentIndex++;
                        s.currentIndex = s.currentIndex >= s.count ? 0 : s.currentIndex;
                        s.resetItemClass();

                        rightSlide(t, s);

                    },
                    toPrev: function () {
                        s.itemClassArr.push(s.itemClassArr[0]);
                        s.itemClassArr.shift();
                        s.currentIndex--;
                        s.currentIndex = s.currentIndex < 0 ? s.count - 1 : s.currentIndex;
                        s.resetItemClass();

                        rightSlide(t, s);

                    },
                    processIndicatorEvent: function (t) {
                        var i = t - s.currentIndex;
                        if (0 != i) {
                            if (s.currentIndex = t, i > 0) {
                                n = s.itemClassArr.splice(s.itemClassArr.length - i);
                                return s.itemClassArr = e.merge(n, s.itemClassArr),
                                    void s.resetItemClass()
                            }

                            if (i < 0) {
                                var n = s.itemClassArr.splice(0, -i);
                                return s.itemClassArr = e.merge(s.itemClassArr, n),
                                    void s.resetItemClass()
                            }
                        }
                    },
                    resetItemClass: function () {
                        // debugger
                        e.each(s.liList, function (t, i) {
                            e(i).removeClass().addClass(s.itemClassArr[t])
                        }),
                            s.indicatorList.removeClass("selected").eq(s.currentIndex).addClass("selected"),
                            s.processCallbackFunc(s.currentIndex)
                    },
                    processCallbackFunc: function (e) {
                        null != t.callbackFunc && void 0 != t.callbackFunc && t.callbackFunc(e)
                    }
                };
            switch (s.init(), s.itemNext.click(function () {
                s.toNext()
            }), s.itemPrev.click(function () {
                s.toPrev()
            }), t.indicatorEvent) {
                case "click":
                    s.indicatorList.click(function () {
                        s.processIndicatorEvent(e(this).attr("data-slide-index"))
                    });
                    break;
                case "mouseover":
                    s.indicatorList.mouseover(function () {
                        s.processIndicatorEvent(e(this).attr("data-slide-index"))
                    })
            }
            switch (t.slideType) {
                case "2d":
                    break;
                case "3d":
                    s.ul.on("click", ".item1 img",
                        function () {
                            s.toPrev()
                        }),
                        s.ul.on("click", ".item3 img",
                            function () {
                                s.toNext()
                            })
            }
            s.slideCarousel.mouseover(function () {
                clearInterval(t.slideInterval)
            }).mouseleave(function () {
                s.slideAutoChange()
            })
        };

        e.fn.slideCarsousel.defaultSetting = {
            slideInterval: "slideInterval",
            isAutoChange: !0,
            direction: 5000,
            callbackFunc: null,
            indicatorEvent: "click",
            slideType: "2d"
        }
    }(jQuery);
}

