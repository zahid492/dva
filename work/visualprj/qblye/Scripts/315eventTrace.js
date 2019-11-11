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

    var sh = $(window).height() - $(".header").height();

    if (_.isNull(openid) || _.isUndefined(openid)) {
        $('.js-esc').hide();
    }

    // 退出
    $('.js-esc').click(function (e) {
        e.preventDefault();

        if (hasFrom) {
            document.location.href = 'zmain.html?v=' + Math.random(0, Date.now());
        }

    });


    // 事件详情
    getEventDetail({"id": id, "name": name}).then(function (ed) {
        var protocol = window.location.protocol;
        var host = window.location.host;

        $("#wxlogo").attr("src", protocol + "//" + host + "/styles/img/315bb.jpg");

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



                    wx.onMenuShareTimeline({
                        // 分享标题
                        title: ed.Title + "-来自“情报来也”智能机器人",
                        // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        link: link,
                        //需要的缩略图地址
                        imgUrl: protocol + "//" + host + "/styles/img/315bb.jpg",
                    });

                    wx.onMenuShareAppMessage({ // 分享标题
                        title: ed.Title + "-来自“情报来也”智能机器人", // 分享描述
                        desc: "", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        link: link, // 分享图标
                        imgUrl: protocol + "//" + host + "/styles/img/315bb.jpg",
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

                $("#js-event").delegate('.js-rec', 'click', function (event) {
                    event.preventDefault();
                    var el = $(event.currentTarget);
                    var url = el.attr('href');

                    if(_.isNull(openid)){
                        jb.ajx.browseRecord({ip:returnCitySN.cip, url:url, logtype: 2}).then(function(){
                            location.href = url;

                        });
                    }else{
                        jb.ajx.browseRecord({openid:openid, url:url, logtype: 2}).then(function(){
                            location.href = url;

                        });
                    }


                });

            }

        });

    });

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