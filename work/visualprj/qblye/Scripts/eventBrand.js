var mylazy;
var myScroll;
var openid = store.session('openid');
var host = 'http://qbly.ijiebao.com/NewsImage/';
var wxUrl = 'http://qbly.ijiebao.com/wxheadimage/';

$(function () {

    var id = $.trim(url("?id"));

    var name = decodeURIComponent($.trim(url("?name")));

    var from = $.trim(url("?from"));
    var hasId = !_.isUndefined(id);
    var hasFrom = !_.isUndefined(from) && from.length > 0;

    var head = $(".header__title");
    var ww = $(window).width();
    var cbox = $("#chart-box");
    cbox.width(ww * 0.96);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(cbox[0]);

    var sh = $(window).height() - $(".header").height();

    // $("#js-cbox").height(sh);

    if (_.isNull(openid) || _.isUndefined(openid)) {
        $('.js-esc').hide();
    }

    // 退出
    $('.js-esc').click(function (e) {
        e.preventDefault();

        if (hasFrom) {
            document.location.href = 'zmain.html?v=' + Math.random(0, Date.now());
        } else {
            document.location.href = 'hotevent.html?v=' + Math.random(0, Date.now());
        }

    });
    // 事件详情
    getEventDetail({"id": id, "name": name}).then(function (ed) {

        if (ed.Title.length > 14) {
            ed.Title = ed.Title.substring(0, 14) + "...";
        }

        // 标题
        $("title").text(ed.Title + "-来自“情报来也”智能机器人");
        head.text(ed.Title);

        $("#wxlogo").attr("src", ed.PicUrl);

        $.ajax({
            type: "get",
            url: "api/wxapi/getsignature.ashx",
            dataType: "json",
            data: {
                url: location.href.split('#').toString()
            },
            success: function (data) {

                wx.config({
                    debug: false,
                    appId: data.appid,
                    timestamp: data.timestamp,
                    nonceStr: data.noncestr,
                    signature: data.signature,
                    jsApiList: [
                        'onMenuShareTimeline', 'onMenuShareAppMessage'
                    ]
                });

                wx.ready(function () {
                    var link = location.href.split('#').toString();
                    // var link = "http://w.ijiebao.com/callback_qingbaolaiyebluefocus2017.html";
                    var protocol = window.location.protocol;
                    var host = window.location.host;

                    wx.onMenuShareTimeline({
                        // 分享标题
                        title: ed.Title + "-来自“情报来也”智能机器人",
                        // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        link: link,
                        //需要的缩略图地址
                        imgUrl: ed.PicUrl,
                    });

                    wx.onMenuShareAppMessage({ // 分享标题
                        title: ed.Title + "-来自“情报来也”智能机器人", // 分享描述
                        desc: "透过媒体信息看" + ed.Subject + "这一年。年度热词，活跃媒体，年度新闻Top10，年度新闻盘点...", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        link: link, // 分享图标
                        imgUrl: ed.PicUrl,
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        }
                    });

                });

            },
            error: function (xhr, status, error) {
                //alert(status);
                //alert(xhr.responseText);
            }
        });

        myScroll = {
            refresh: function () {
            }
        };

        // myScroll = new IScroll('#swrapper', {
        //     probeType: 3,
        //     click: true,
        //     tap: true,
        //     scrollbars: true,
        //     mouseWheel: true,
        //     interactiveScrollbars: true,
        //     shrinkScrollbars: 'scale',
        //     fadeScrollbars: true
        // });

        var rangeTime = "数据起止时间：" + formatDate(ed.PublishDateTimeStart, ".") + "—" + formatDate(ed.PublishDateTimeEnd, ".");

        $("#js-rtime").text(rangeTime);
        $("#AllNewsCount").text(ed.AllNewsCount);
        $("#ForwardNewsCount").text(ed.ForwardNewsCount);
        $("#OriginalNewsCount").text(ed.OriginalNewsCount);
        // 信息趋势图
        var xdata = _.map(_.toPairs(ed.NewsCountByDayList), function (v) {
            v[2] = v[0].substring(0, 4) + "年" + v[0].substring(4, 6) + "月";
            v[0] = v[0].substring(4, 6);

            return v;
        });

        //
        var lopt = {
            grid: {
                left: "15%",
                    top: 20,
                    bottome: 20,
            },
            tooltip: {
                show: true,
                    trigger: "axis",
                    backgroundColor: "#b2b2b2",
                    formatter: "2017.{b0}<br />{c0}",
                    textStyle: {
                    fontSize: 12
                }
            },
            xAxis: {
                nameLocation: "start",
                    axisLabel: {
                    fontSize: 10
                },
                axisLine: {
                    lineStyle: {
                        color: "#b6b6b6"
                    }
                },
                axisPointer: {
                    show: true,
                        status: "show",
                        lineStyle: {
                        type: "dashed",
                            opacity: 0.3
                    }
                },
                data: xdata.map(function (item) {
                    return item[0];
                })
            },
            yAxis: {
                axisLabel: {
                    fontSize: 10
                },
                axisLine: {
                    lineStyle: {
                        color: "#b6b6b6"
                    }
                },
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    data: xdata.map(function (item) {
                        return item[1];
                    }),
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: "#FF4A44"
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: "#FF4A44"
                        }
                    }
                }
            ]
        };

        myChart.setOption(lopt);

        const myoption = myChart.getOption();
        const maxIndex = _.indexOf(myoption.series[0].data, _.max(myoption.series[0].data));
        // 主动触发提示框
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: maxIndex,
        });
        // 声量
        var maxDay = _.maxBy(xdata, function (o) {
            return o[1];
        });
        // maxDay[0] = formatEventDate(maxDay[0], ".");

        var $ctip = $('#js-charTip');
        var ctcompiled = _.template($("#charTipTpl").html());
        var ctip = ctcompiled({title: ed.Subject, day: maxDay[2], num: maxDay[1]});

        $ctip.append(ctip);

        // 核心媒体
        var cmediaHtml = _.map(ed.MediaNames, function (v) {
            return '<span>' + v + '</span>';
        });
        $("#js-coreMedia").append(cmediaHtml);

        // 词云短语
        var cloudHtml = '与<span class="primary">' + ed.Subject + '</span>相关的全部信息中，被提及频率最高的词语分别为';
        var cloudWordHtml = _.map(_.reverse(_.takeRight(_.sortBy(ed.KeywordsList, "Frequency"), 3)), function (v) {
            return '<span class="danger">' + v.Word + '</span>';
        });
        $("#js-wordcloud").html(cloudHtml + cloudWordHtml);

        if(_.size(ed.KeywordsList) === 0){
            $(".bg--second").css({"display": "none"})
        }

        // 词云
        var kwords = _.map(ed.KeywordsList, function (v, i) {
            v.value = v.Frequency * 1000;
            v.name = v.Word;
            if (i === 0) {
                v.textStyle = {
                    normal: {
                        color: '#C1232B'
                    },
                    // emphasis: {
                    //     color: '#001852'
                    // }
                };
            }

            return v;
        });

        var kww = ww * 0.90;
        var kord = $('#js-kord');
        kord.width(kww);
        kord.height(kww * 0.8);

        var chart = echarts.init(kord[0]);

        var option = {
            grid: {
                top: 40,
                bottom: 40
            },
            tooltip: {
                show: false,
            },
            series: [{
                type: 'wordCloud',
                gridSize: 2,
                sizeRange: [10, 42],
                rotationRange: [-90, 90],
                width: kww,
                height: kww * 0.9,
                drawOutOfBound: true,
                textStyle: {
                    normal: {
                        color: function () {
                            return 'rgb(' + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')';
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: kwords
            }]
        };

        chart.setOption(option);

        // chart.on("click", function(e){
        //     console.log(e)
        // });

        // scrollRefresh()
        // 事件跟踪
        getEvents(ed.Name).then(function (res) {
            if (res.TraceRecords.length === 0) {
                $("#js-eventTrack").hide();
            } else {
                $("#js-eventTrack").show();
                var $threeBox = $('#js-event .js-three');
                var $bigthreeBox = $('#js-event .js-bigthree');
                var othertpl = $('#eventTpl').html();

                var thlist = [];
                var thbiglist = [];

                if (res.TraceRecords.length > 8) {
                    thbiglist = _.slice(res.TraceRecords, 8)
                }

                thlist = _.slice(res.TraceRecords, 0, 8);

                var thlistTpl = _.map(thlist, function (v, i) {
                    return buildEvent(v, othertpl)
                });

                var thbiglistTpl = _.map(thbiglist, function (v, i) {
                    return buildEvent(v, othertpl)
                });

                $threeBox.append(thlistTpl);
                $bigthreeBox.append(thbiglistTpl);
                var jt = $(".js-toggle");
                jt.text("查看剩余" + thbiglistTpl.length + "条>>");

                if (_.size(res.TraceRecords) <= 8 && thbiglist.length === 0) {
                    jt.hide();
                } else {
                    jt.click(function (e) {
                        e.preventDefault();
                        var el = $(e.currentTarget);
                        if ($bigthreeBox.hasClass("hide")) {
                            $bigthreeBox.removeClass("hide");
                            $bigthreeBox.addClass("show");
                            el.text("收起 >>")
                        } else {
                            $bigthreeBox.removeClass("show");
                            $bigthreeBox.addClass("hide");
                            el.text("查看剩余" + thbiglistTpl.length + "条>>")
                        }
                        // scrollRefresh()
                    });
                }

            }


            // 热门排行
            var hotlist = res.HotRecords.map(function (v) {
                if (!_.isNull(v.Title)) {
                    if (v.Title.length > 32) {
                        v.Title = v.Title.substring(0, 32) + "...";
                    }
                }

                var time = formatDate(v.PublishDateTime, ".");

                v.time = time;

                return v;
            });
            buildHotPai(hotlist);

            // 点击记录
            $("#js-cbox").delegate('.js-rec', 'click', function (event) {
                event.preventDefault();
                console.log("click")
                var url = $(event.currentTarget).attr('href');

                if(_.isNull(openid)){
                    jb.ajx.browseRecord({ip:returnCitySN.cip, url:url, logtype: 2}).then(function(){
                        location.href = url;

                    });
                }else{
                    jb.ajx.browseRecord({openid:openid, url: url, logtype: 2}).then(function(){
                        location.href = url;

                    });
                }


            });
        });

    });

    function scrollRefresh() {
        setTimeout(function () {
            myScroll.refresh();
        }, 200);

    }

// 热门排行项
    function buildHotPai(list) {
        var $hlist = $('#js-hotpai');
        $hlist.empty();
        var compiled = _.template($("#hotPaiTpl").html());
        var slist = compiled({"lists": list});
        var tpl = $("<div></div>");
        tpl.html(slist);

        $hlist.append(tpl.html());

        // scrollRefresh()

        // mylazy.update();
    }

// 事件跟踪项
    function buildEvent(item, othertpl, index) {
        var time = item.PublishDateTime;

        if (time) {

            item.time = eventTime(time);
            if (!time) {
                item.time = '今天';
            }
        }

        if (!_.isNull(item.Title)) {
            if (item.Title.length > 28) {
                item.Title = item.Title.substring(0, 28) + "...";
            }
        }

        if (/mp\.weixin\.qq\.com/.test(item.Url)) {
            item.wx = 1;

            if (_.size(item.UserPic) > 1) {
                item.UserPic = wxUrl + _.replace(item.UserPic, /\\/, '\\\/');
            }

        } else {
            item.wx = 0;
        }

        if (item.ImageCount == 0) {
            item.ImageUrl = ""
        }

        if (item.ImageCount > 0) {
            item.ImageUrl = host + item.RId.toString().substring(0, 6) + '/' + item.RId;
        }

        if ((item.MediaName).length > 8) {
            item.MediaName = (item.MediaName).substring(0, 8)
        }

        var ww = $(window).width();
        var sw = ww * 0.83;
        var thw = ww * 0.69;

        // if (item.wx == 1) {
        //     tpl = wxtpl;
        // } else {
        // }

        // 根据情况选模板
        var compiled = _.template(othertpl);
        var itemHtml = compiled({"item": item});

        var box = $("<div></div>");
        box.html(itemHtml);

        $(box).find(".js-img").each(function (i, item) {
            // 3 tu
            if ($(item).hasClass("js-li")) {
                $("li", item).css({"width": thw / 3 + "px", "height": thw * 2 / 9 + "px"});
            }
            // 1 tu
            if ($(item).hasClass("js-ot-one")) {
                $(item).css({"width": sw / 3 + "px", "height": sw * 2 / 9 + "px"});
            }

        });

        return box.html()
    }

// 事件跟踪
    function getEvents(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/events/f_recordHot.ashx',
                data: {
                    val: id,
                },
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    }
                },
                error: function () {
                    reject()
                }
            });
        });
    }

// 事件详情
    function getEventDetail(opt) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: 'api/events/f_eventsDetail.ashx',
                data: {
                    id: opt.id,
                    name: opt.name
                },
                dataType: 'json',
                success: function (result) {
                    if (result.Code == 200) {
                        resolve(result.Data);
                    }
                },
                error: function () {
                    reject()
                }
            });
        });
    }


});

function convertTime(time) {
    var date = new Date(time).getTime();
    var now = new Date().getTime();
    var s = (now - date) / 1000;

    var result;

    switch (true) {
        case s >= (6 * 24 * 60 * 60):
            result = formatDate(time, "-");
            break;
        case s >= (24 * 60 * 60):
            result = Math.ceil(s / (24 * 60 * 60)) + '天前';
            break;
        case s >= 3600:
            result = Math.ceil(s / 3600) + '小时前';
            break;
        default:
            result = Math.ceil(s / 60) + '分钟前';

    }
    return result;
}

function eventTime(time) {

    var date = new Date(time).getTime();
    var now = new Date().getTime();
    var s = (now - date) / 1000;
    var result;

    switch (true) {
        case s > (3 * 24 * 60 * 60):
            result = formatDate(time, ".");
            break;
        case s >= (24 * 60 * 60):
            result = Math.ceil(s / (24 * 60 * 60)) + '天前';
            break;
        case s >= 3600:
            result = parseInt(s / 3600) + '小时前';
            break;
        default:
            result = parseInt(s / 60) + '分钟前';

    }
    return result;

}

function formatDate(date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    var tdate = fecha.parse(date, 'YYYY-MM-DD');
    return fecha.format(tdate, 'YYYY' + sep + 'MM' + sep + 'DD');
}

function formatEventDate(date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    var tdate = fecha.parse(date, 'YYYY-MM');
    return fecha.format(tdate, 'YYYY' + sep + 'MM');
}