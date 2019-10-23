function change() {
    document.documentElement.style.fontSize = 100 * (document.documentElement.clientWidth / 1920) + 'px';
}

change();
window.onresize = change;

var jb = {};
var request = window.superagent;

jb.ajx = {};
jb.ui = {};
jb.util = {};
jb.config = {};


if (!config.debug) {
    console.log = _.identity;
}
store.session("errcount", 0);
store.session("errvideo2", {});
store.session("errvideo4", {});

jb.util.fullScreen = function (element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }

};

jb.util.exitFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};
// 增加 vConsole 调试
jb.util.console = function () {
    window.vConsole = new window.VConsole({
        defaultPlugins: ['system', 'network', 'element', 'storage'],
        maxLogNumber: 1000,
        onReady: function () {
        }
    });
};
jb.util.getFontSize = function () {
    var fs = document.documentElement.style.fontSize;
    return fs.substring(0, fs.indexOf("p"));
};
// 需要 fecha 年月日
jb.util.formatTime = function (date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return fecha.format(date, 'YYYY' + sep + 'MM' + sep + 'DD' + " HH:mm");
};

jb.util.formatDate = function (date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return fecha.format(date, 'YYYY' + sep + 'MM' + sep + 'DD');
};

// 年月
jb.util.formatMonth = function (date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return fecha.format(date, 'YYYY' + sep + 'MM');
};

// 数字拆分加逗号
jb.util.numSplit = function (nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
};

// 文本长度
jb.util.getTextWidth = function (opt) {
    var span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.style.font = 'bold ' + opt.fontSize + 'px "microsoft yahei", sans-serif';
    span.innerText = opt.txt;
    span.textContent = opt.txt;
    document.body.appendChild(span);
    // 求得文字内容宽度
    var width = span.clientWidth;
    // 移除dom元素
    document.body.removeChild(span);

    return width;
};

// 转换到时间戳
jb.util.time2unix = function (time) {
    return moment(time).unix()
};

// 时间戳转换日期1
jb.util.unix2day = function (time) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return moment(parseInt(time + "000", 10)).format('YYYY' + sep + 'MM' + sep + 'DD')
};
// 时间戳转换日期2
jb.util.unix2dayLong = function (time) {
    console.log(time)
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;

    return moment.unix(parseInt(time, 10)).format('YYYY' + sep + 'MM' + sep + 'DD')
};

jb.util.unix2dayNoYear = function (time) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return moment(parseInt(time + "000", 10)).format('MM' + sep + 'DD')
};

// 时间戳转换时间
jb.util.unix2time = function (time) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return moment(parseInt(time + "000", 10)).format('YYYY' + sep + 'MM' + sep + 'DD' + " HH:mm:ss")
};

// 七天日期范围
jb.util.day7 = function () {
    var arg0 = _.toArray(arguments)[0];
    if (arg0 && arg0 === "u") {
        return [jb.util.time2unix(moment().subtract(6, 'days')), jb.util.time2unix(moment())]
    }
    return [moment().subtract(6, 'days').format('YYYY.MM.DD'), moment().format('YYYY.MM.DD')]
};

// 日期范围 2018.04.10-2018.04.16
jb.util.weekDay = function (start, end) {
    return jb.util.unix2day(start, ".") + "-" + jb.util.unix2day(end, ".")
};

// 日期时间段比较
jb.util.compareDays = function (opt) {
    return jb.util.unix2day(opt.start) === jb.util.unix2day(opt.ostart) &&
        jb.util.unix2day(opt.end) === jb.util.unix2day(opt.oend)
};

// 轮询
jb.util.interval = function (opt) {
    return d3.interval(function () {
        opt.cb();
    }, opt.time * 1000);
};

// 切换
jb.util.time2Url = function (opt) {
    window.setTimeout(function () {
        window.location.href = opt.url;
    }, opt.time);
};

// 定时更新
jb.util.intervalHour = function (opt) {
    d3.interval(function () {
        var mm = moment();
        var nh = mm.get('hour');
        var nm = mm.get('minute');
        var ns = mm.get('second');

        if (nh == opt.hour && nm == opt.minute && ns == opt.second) {
            opt.cb();
        } else if (nm == opt.minute && ns == opt.second) {
            opt.cb();
        }

    }, 1000);
};

// 比较配置
jb.util.isNewConfig = function (config, proarr) {
    var oc = store.session("config");
    var ca = _.map(config, function (v, i) {
        if (_.includes(proarr, i)) {
            return oc[i] !== v
        }
    });

    return _.compact(ca).length > 0;
};

// 视频判断
jb.util.hasVideo = function (v) {
    return /mp4/.test(v)
};

// 小数尾数修正 * 100
jb.util.fixed = function (n, p) {
    if (n == 0) {
        return 0
    }

    var red = (new RegExp('.*?\\.\\d{0,' + (p + 1) + '}'));
    var res = red.exec(n.toString());
    var re;


    if (!_.isNull(res)) {
        var rd = _.round(res[0] * 100, p - 1);
        re = _.round(rd, 1);
    } else {
        re = 100 * n;
    }

    if (re.toString().indexOf(".") == -1) {
        re = re + ".0"
    }

    return re;
};

jb.util.animeFontScale = function (opt) {
    "use strict";
    anime({
        targets: opt.dom,
        // rotate: 3600,
        scale: [0.5, 1.05, 1],
        duration: function () {
            return anime.random(800, 1200);
        },
        // easing: 'easeInOutExpo'
    });
};

jb.util.animeNumber = function (opt) {
    "use strict";
    var format = d3.format(",d");

    d3.selectAll(opt.dom)
        .transition()
        .duration(1500)
        .tween("text", function () {
            var that = d3.select(this),
                i = d3.interpolateNumber(0, that.text().replace(/,/g, ""));
            return function (t) {
                that.text(format(i(t)));
            };
        });
};

jb.util.animeProgress = function (opt) {
    "use strict";
    d3.selectAll(opt.dom)
        .transition()
        .duration(1500)
        .styleTween("width", function () {
            var that = d3.select(this);
            var i;
            var iw = that.attr("pw");

            if (_.isNull(iw)) {
                return 0;
            }

            if (iw.indexOf("%") > -1) {
                i = d3.interpolateNumber(0, iw.replace(/%/g, ""));
                return function (t) {
                    return i(t) + "%"
                };

            } else {
                i = d3.interpolateNumber(0, iw.replace(/px/g, ""));
                return function (t) {
                    return i(t) + "px"
                };
            }

        });
};

// get 请求
jb.ajx.request = function (opt) {
    var accesstoken = store.get("accesstoken");
    opt.data = _.extend(opt.data, {
        accesstoken: accesstoken
    });

    return request.get(opt.url)
        .query(opt.data)
        // .use(superagentJSONP)
        .timeout({
            response: 10000,
            deadline: 10000,
        })
        .retry(3)
        .on("error", function (err) {
            console.log("err: ", err);
        })
};

jb.ajx.requestAjax = function (opt, cb) {
    var accesstoken = store.get("accesstoken");
    opt.data = _.extend(opt.data, {
        accesstoken: accesstoken
    });

    $.ajax({
        type: "get",
        url: opt.url,
        data: opt.data,
        success: function (res) {
            cb(res)
        }
    })
};

// post 请求
jb.ajx.send = function (opt) {
    return request.post(opt.url)
        .send(opt.data)
        // .use(superagentJSONP)
        .timeout({
            response: 3500,
            deadline: 10000,
        })
        .retry(3)
        .on("error", function (err) {
            console.log("err: ", err);
        })
};

// 比较时间段更新
jb.ajx.reqUpdate = function (opt) {
    jb.ajx.request({
        url: opt.api,
        data: opt.data
    }).then(function (res) {
        var result;
        var isOld = true;
        var od;
        if (res.body.code === 200) {
            result = res.body.data;
            od = store.session(opt.session);
            // 判时间段数据是否更新
            if (!_.isNull(od) && !_.isUndefined(od)) {
                isOld = jb.util.compareDays({
                    start: result.start,
                    end: result.end,
                    ostart: od.start,
                    oend: od.end
                });
                opt.cb(result);
            } else {
                opt.cb(result);
            }

            if (!isOld) {
                // 保存数据，执行更新
                store.session(opt.session, res.body.data);
                opt.cb(result);
            }
        }
    });

};

// 读取配置
jb.ajx.config = function (opt) {
    jb.ajx.request({
        url: api.configure,
    }).then(function (res) {

        opt.cb(res.body.data)
    }, function (err) {

    });
};

// 环状饼图
jb.ui.cpie = function (opt) {
    var width = opt.width,
        height = opt.height;

    var svg = d3.select(opt.dom).append("svg")
        .attr("width", width)
        .attr("height", height)

    var gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient" + opt.linearGradientNum)
        // 这里能控制方向
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", opt.color1)
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", opt.color2)
        .attr("stop-opacity", 1);

    var blurId = "blur" + _.now();

    var filter = svg.append("defs")
        .append("filter")
        .attr("id", blurId);

    filter
        .append("feGaussianBlur")
        .attr("result", "blurOut")
        .attr("in", "offOut")
        .attr("stdDeviation", 2);

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offset")

    var g2 = svg.append("g");

    var nl = opt.num.toString().length;

    g2.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dx", function () {

            if (nl == 5) {
                return opt.numDx * 1.5;
            }

            if (nl == 4) {
                return opt.numDx * 1.3;
            }

            if (nl == 3) {
                return opt.numDx * 0.9;
            }

            if (nl == 2) {
                return opt.numDx;
            }

            if (nl == 1) {
                return opt.numDx * 0.3;
            }
        })
        .attr("dy", opt.numDy)
        .attr("fill", "url(#gradient" + opt.linearGradientNum + ")")
        .attr("font-size", opt.numFontSize)
        .transition()
        .duration(1500)
        .tween("text", function () {
            var that = d3.select(this);
            if (opt.num != "-") {
                var i = d3.interpolate(0, opt.num);
                return function (t) {
                    var temp = _.floor(i(t), 1)
                    if (t !== 1) {
                        return that.text(temp);
                    } else {
                        return that.text(opt.num);
                    }

                };
            } else {
                return function (t) {
                    return that.text("-");
                };
            }
        });

    if (opt.num != "-") {
        g2.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("dx", opt.percentDx)
            .attr("dy", opt.percentDy)
            .attr("fill", opt.percentColor)
            .attr("font-size", opt.percentFontSize)
            .text("%");
    }


    g2.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dx", opt.desDx)
        .attr("dy", opt.desDy)
        .attr("fill", opt.desColor)
        .attr("font-size", opt.desFontSize)
        .text(opt.des);

    var g1 = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var bgpath = d3.arc()
        .outerRadius(opt.outRadius - opt.restRadius)
        .innerRadius(opt.inRadius + opt.restRadius)
        .startAngle(opt.endAngle)
        .endAngle(Math.PI * 2);

    var path = d3.arc()
        .outerRadius(opt.outRadius)
        .innerRadius(opt.inRadius)
        .startAngle(0);

    // var pathShadow = d3.arc()
    //     .outerRadius(opt.outRadius)
    //     .innerRadius(opt.inRadius)
    //     .startAngle(0)
    //     .endAngle(opt.endAngle);

    g1.append("path")
        .attr("class", "bg")
        .attr("d", bgpath)
        .attr("fill", opt.restColor);

    g1.append("path")
        .attr("class", "fb")
        // .attr("d", path)
        .attr("fill", "url(#gradient" + opt.linearGradientNum + ")")
        .transition()
        .duration(1500)
        .attrTween("d", function () {
            var i = d3.interpolate(0, opt.endAngle);
            return function (t) {
                return path({endAngle: i(t)});
            };
        });

    // g1.append("path")
    //     .attr("class", "fbs")
    //     .attr("d", pathShadow)
    //     .attr("opacity", 0.6)
    //     .attr("fill", "url(#gradient" + opt.linearGradientNum + ")")
    //     .attr("filter", "url(#" + blurId + ")");
};

// 下拉菜单 来自 common.js
jb.ui.hover = function (dom, dropdown, isChangeClass) {
    $(dom)
        .hover(function () {
            $(dropdown).stop().slideDown();
            if (isChangeClass) {
                $(dom).find('.icon-up').attr('class', 'iconfont icon-down');
            }
        }, function () {
            $(dropdown).stop().slideUp();
            if (isChangeClass) {
                $(dom).find('.icon-down').attr('class', 'iconfont icon-up');
            }
        })
};

jb.ui.tokenToUrl = function (accesstoken) {

    jb.ajx.send({
        url: api.accesslogin + '?accesstoken=' + accesstoken,
        data: accesstoken
    }).then(function (resa) {
        var res = resa.body.data;

        store.set("accesstoken", res.accesstoken);
        store.set("uname", res.uname);

        // 做页面跳转
        var durl = res.default_url || "";
        var port = ":" + (url('port') === 80 ? "" : url('port'));
        var skip = Boolean(url("?skip"));
        // you tiao zhuang
        var skipif = durl.indexOf("skip") !== -1;

        var gourl;

        if (durl.length > 0) {
            var d = /\d/.test(durl);

            if (d) {
                // guanding
                gourl = skips[Number(durl.split(",")[0])];

                if (url().indexOf(gourl) === -1) {
                    window.location.href = url('protocol') + "://" + url('hostname') + port + '/' + gourl;
                }
            } else {
                if (skipif && !skip) {
                    // first time
                    gourl = durl;

                    if (url().indexOf(gourl) === -1) {
                        window.location.href = url('protocol') + "://" + url('hostname') + port + '/' + gourl;
                    }
                } else {

                }
            }


        } else {
            if (url().indexOf(gourl) === -1 && durl !== "") {
                window.location.href = url('protocol') + "://" + url('hostname') + port + '/first.html';
            }
        }

    })
};

// 头部动画
jb.ui.head = function () {
    jb.ui.hover('.header-logon', '.header-logon__dropdown');
    jb.ui.hover('.header-logo', '.header-logo__dropdown', true);
};

jb.ui.headTime = function (time) {
    "use strict";
    var d = moment.unix(time).format('YYYY-MM-DD')

    $("#time").text(d);
};

// 加载头部
jb.ui.headRun = function () {
    $("#header").load("./head.html", function (headDom) {
        jb.ui.head();
        var accesstoken = store.get("accesstoken")
        jb.ui.tokenToUrl(accesstoken);
        $("#fu").click(function (e) {
            jb.util.fullScreen(document.documentElement);
        });

        var filename = window.url("filename") || "first";
        $("#js-name").text(title[filename]);

        var accesstoken = store.get("accesstoken") || url("?accesstoken");
        var lurl = "/login.html";
        //如果没登录跳到登录页
        if (!accesstoken) {
            window.location.href = lurl;
        }
        //退出登录
        $("#js-logonOut").click(function () {
            $.ajax({
                url: api.logout + '?accesstoken=' + accesstoken,
                dataType: 'json',
                async: false,
                data: accesstoken,
                type: 'post',
                success: function (res) {
                    if (res.code == 200) {
                        store.remove("accesstoken");
                        store.remove("accesstoken");
                        store.remove("uname");
                        window.location.href = lurl;
                    } else {
                        console.log("err: ", res);
                    }
                },
                faild: function (res) {
                    console.log("err: ", res);
                }
            })
        });
        //修改密码
        $("#js-passWord").click(function () {
            $("#js-modal").css("display", "block");
        });
        $("#js-modal-close").click(function () {
            empty()
        });
        $("#js-btn-close").click(function () {
            empty()
        });

        //关闭弹窗时清空内容
        function empty() {
            var oVal = $("#o-password").val('');
            var nVal = $("#n-password").val('');
            var cVal = $("#c-password").val('');
            $("#js-alert").css("display", "none");
            $("#js-modal").css("display", "none");
        }

        //修改密码提交
        $("#js-btn-sure").click(function () {
            var uname = store.get("uname");
            var oVal = $("#o-password").val();
            var nVal = $("#n-password").val();
            var cVal = $("#c-password").val();
            if (oVal == '') {
                $("#o-tip").css("display", "block");
                return
            } else {
                $("#o-tip").css("display", "none");
            }
            if (nVal == '') {
                $("#n-tip").css("display", "block");
                return
            } else {
                $("#n-tip").css("display", "none");
            }
            if (cVal == '') {
                $("#c-tip").css("display", "block");
                return
            } else {
                $("#c-tip").css("display", "none");
            }
            if (nVal != cVal) {
                $("#js-alert").find("span").text("新密码与确认密码不一致");
                $("#js-alert").css("display", "block");
                return
            }
            var data = {
                "name": uname,
                "password": $.md5(oVal).toLocaleUpperCase(),
                "newpassword": $.md5(nVal).toLocaleUpperCase()
            }
            $.ajax({
                url: api.changepassword,
                dataType: 'json',
                async: false,
                data: data,
                type: 'post',
                success: function (res) {
                    $("#js-alert").css("display", "none");
                    if (res.code == 200) {
                        $("#js-alert").find("span").text("修改成功！");
                        $("#js-alert").css("display", "block");
                        setTimeout(function () {
                            $("#js-modal").css("display", "none");
                        }, 1000);
                    } else {
                        $("#js-alert").find("span").text(res.errmsg);
                        $("#js-alert").css("display", "block");
                    }
                },
                faild: function (res) {
                    console.log("err: ", res);
                }
            })
        })

        $("#headlink a").click(function (e) {
            e.preventDefault();
            if (skip === true) {
                window.location.href = "/" + $(e.currentTarget).attr("shref") + "?skip=true"
            } else {
                window.location.href = "/" + $(e.currentTarget).attr("shref")
            }
        });
    });
};

jb.ui.mapFilter = function (svga) {
    "use strict";
    svga.append("defs")
        .append("filter")
        .attr("id", "mapBlur")
        .append("feGaussianBlur")
        .attr("result", "blurOut")
        .attr("in", "offOut")
        .attr("stdDeviation", 10)
        .append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offset");
};
// 地图
jb.ui.cmap = function (svg, path, path1, width, height) {
    "use strict";
    return new Promise(function (resolve, reject) {
        // 南海
        d3.json("./lib/nh.geojson", function (error, toporoot) {
            if (error) {
                return console.error(error);
            }

            svg.append("g").attr("nsname", "南海")
                .selectAll("path")
                .data(toporoot.features)
                .enter()
                .append("path")
                .attr("class", "province")
                .style("stroke", "#0A1646")
                .attr("d", path1)
        });

        d3.json("./lib/china.geojson", function (error, georoot) {
            if (error) {
                return console.error(error);
            }

            svg.append("g").attr("class", "cbg")
                .selectAll("path")
                .data(georoot.features)
                .enter()
                .append("path")
                .attr("class", "province")
                .style("fill", "#506EDC")
                .attr("d", path)
                .attr("filter", "url(#mapBlur)");

            svg.append("g")
                .selectAll("path")
                .data(georoot.features)
                .enter()
                .append("path")
                .attr("class", "province")
                .style("fill", "#0A1646")
                .attr("d", path);

            // 右侧指示色带
            var rIndicator = svg.append("g")
                .attr("transform", "translate(" + (width - 150) + "," + (height - 340) + ")")
                .attr("class", "rightIndicator");

            rIndicator.append("path")
                .attr("d", "M 48.643053,32.403169 48.108515,288.98191 59.868373,32.403169 Z")
                .attr("fill", "url(#gradientIndicator)");

            rIndicator.append("image")
                .attr("x", 60)
                .attr("y", 30)
                .attr("xlink:href", "img/mapMan1.png")
                .attr("width", 25)
                .attr("height", 32);

            rIndicator.append("image")
                .attr("x", 50)
                .attr("y", 250)
                .attr("xlink:href", "img/mapMan2.png")
                .attr("width", 28)
                .attr("height", 34);

            // 右侧指示器颜色
            var gradientIndicator = svg.append("defs").append("linearGradient")
                .attr("id", "gradientIndicator")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            gradientIndicator.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "rgb(250, 81, 0)");


            gradientIndicator.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "rgb(249, 214, 0)");

            resolve();

        });
    })

};
// 闪烁

jb.ui.curRepeat = function (cl, top5, mean, xi) {
    "use strict";
    // if (d.value[2] === 0) {
    //     return;
    // }
    //
    // var rdmin = xi.circleRadius(d.value[2]);
    // var rdmax = (d.value[2] <= mean / 2) ? rdmin * 3.5 : rdmin * 2;

    // d3.active(this)
    //     .attr("r", rdmax)
    //     .transition()
    //     .delay(200)
    //     .attr("r", rdmin)
    //     .transition()
    //     .delay(500)
    //     .on("start", curRepeat);

    // 闪烁动画
    d3.selectAll(cl).each(function (d, i, nodes) {
        if (d.value[2] === 0) {
            return;
        }

        var t5 = _.findIndex(top5, function (w, j) {
            return w.name === d.name;
        });

        var rdmin;

        if (t5 > -1) {
            rdmin = xi.circleRadiusTop5(d.value[2])
        } else {
            rdmin = xi.circleRadius(d.value[2]);
        }

        var rdmax = (d.value[2] <= mean / 2) ? rdmin * 2 : rdmin * 1.5;

        anime({
            targets: nodes[i],
            r: [rdmin, rdmax],
            easing: 'easeInOutQuart',
            duration: 300,
            delay: function () {
                return _.random(900, 2000);
            },
            loop: true
        });
    });
};

// 城市闪烁
jb.ui.curEnup = function (xi, enup, top5, curRadial, projection, s, mean, ensize, exitsize) {
    "use strict";
    if (ensize === exitsize) {
        return;
    }

    $(".curRadial").empty();
    enup.append("g")
        .attr("class", "current")
        .attr("transform", function (d) {
            //计算标注点的位置
            var coor = projection([d.value[0], d.value[1]]);
            return "translate(" + coor[0] + "," + coor[1] + ")";
        })
        .append("circle")
        .attr("class", function (d) {
            return "slash " + d.name;
        })
        .attr("cx", function (d) {
            switch (d.name) {
                case "天津市":
                    return "0.3em";
                    break;
                case "黑河市":
                    return "-0.2em";
                    break;
                default:
                    return "0"
            }
        })
        .attr("cy", function (d) {
            switch (d.name) {
                case "北京市":
                    return "-0.3em";
                    break;
                default:
                    return "0"
            }
        })
        .attr("fill", function (d, i) {
            var gradient = curRadial.append("defs")
                .append("radialGradient")
                .attr("id", "gradient" + i)
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", s(xi.xdomain(d.value[2])));

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "rgba(255,142,0,0.1)");

            return "url(#gradient" + i + ")";
        })

        .attr("opacity", 0.6)
        .transition()
        .delay(function (d, i) {
            return i * 20;
        })
        .on("start", function curRepeatT(d) {
            if (d.value[2] === 0) {
                return;
            }

            var t5 = _.findIndex(top5, function (w, j) {
                return w.name === d.name;
            });

            var rdmin;

            if (t5 > -1) {
                rdmin = xi.circleRadiusTop5(d.value[2])
            } else {
                rdmin = xi.circleRadius(d.value[2]);
            }

            var rdmax = (d.value[2] <= mean / 2) ? rdmin * 3 : rdmin * 2;

            d3.active(this)
                .transition()
                .duration(400)
                .ease(d3.easeQuadOut)
                .attr("r", function () {
                    return rdmax;
                })
                .transition()
                .duration(400)
                .ease(d3.easeQuadOut)
                .attr("r", function () {
                    return rdmin;
                })
                .transition()
                .delay(1200)
                .on("start", curRepeatT);
        });


};

// 城市圆圈
jb.ui.eup = function (xi, enup, top5, projection, s, capitals) {
    "use strict";
    var eu = enup.append("g")
        .attr("class", "location")
        .attr("na", function (d) {
            return d.name + d.value[2];
        })
        .attr("intop5", function (d) {
            return _.findIndex(top5, function (w, j) {
                return w.name === d.name;
            });
        })
        .attr("transform", function (d) {
            var coor = projection([d.value[0], d.value[1]]);
            return "translate(" + coor[0] + "," + coor[1] + ")";
        });

    //标注点的圆底
    eu.append("circle")
        .attr("cx", function (d) {
            switch (d.name) {
                case "天津市":
                    return "0.3em";
                    break;
                case "黑河市":
                    return "-0.2em";
                    break;

                default:
                    return "0"
            }
        })
        .attr("cy", function (d) {
            switch (d.name) {
                case "北京市":
                    return "-0.3em";
                    break;

                default:
                    return "0"
            }
        })
        .attr("fill", function (d) {
            return s(xi.xdomain(d.value[2]))
        })
        .attr("opacity", function (d) {
            var td = $(this).parent().attr("intop5");

            return (td > -1) ? 1 : 0.7;
        })
        .attr("r", function (d) {
            var td = $(this).parent().attr("intop5");

            if (td > -1) {
                if (d.value[2] === 0) {
                    return 0;
                } else {
                    return xi.circleRadiusTop5(d.value[2]);
                }
            } else if (d.value[2] === 0) {
                return 0;
            } else {
                return xi.circleRadius(d.value[2]);
            }
        });
    //外圈
    eu.append("circle")
        .attr("cx", function (d) {
            switch (d.name) {
                case "天津市":
                    return "0.3em";
                    break;
                case "黑河市":
                    return "-0.2em";
                    break;

                default:
                    return "0"
            }
        })
        .attr("cy", function (d) {
            switch (d.name) {
                case "北京市":
                    return "-0.3em";
                    break;

                default:
                    return "0"
            }
        })
        .attr("stroke", function (d) {
            return s(xi.xdomain(d.value[2]))
        })
        .attr("stroke-width", function (d) {
            var td = $(this).parent().attr("intop5");

            if (td > -1) {
                return 0
            } else {
                return 1
            }

        })
        .attr("r", function (d) {
            var td = $(this).parent().attr("intop5");
            if (td > -1) {
                if (d.value[2] === 0) {
                    return 0;
                } else {
                    return xi.circleRadiusTop5(d.value[2]);
                }
            } else if (d.value[2] === 0) {
                return 0;
            } else {
                return xi.circleRadius(d.value[2]);
            }

        });

    // 城市名称
    eu.append("text")
        .attr("text-anchor", "middle ")
        .attr("y", function (d) {
            return xi.circleRadius(d.value[2]) + 8;
        })
        .attr("font-size", function (d) {
            return xi.fontSize(d.value[2]);
        })
        .attr("dy", function (d) {
            switch (d.name) {
                case "北京市":
                    return "0.40em";
                    break;
                case "深圳市":
                    return "-0.2em";
                    break;
                case "澳门特别行政区":
                    return "0.8em";
                    break;
                case "香港特别行政区":
                    return "0.9em";
                    break;
                default:
                    return "0.5em"
            }
        })
        .attr("dx", function (d) {
            switch (d.name) {
                case "北京市":
                    return "-0.5em";
                    break;
                case "天津市":
                    return "0.5em";
                    break;
                case "澳门特别行政区":
                    return "-1em";
                    break;
                case "香港特别行政区":
                    return "1em";
                    break;
                case "太原市":
                    return "-0.8em";
                    break;
                case "石家庄市":
                    return "0.5em";
                    break;
                case "南京市":
                    return "0.6em";
                    break;
                case "合肥市":
                    return "-0.6em";
                    break;
                case "上海市":
                    return "0.6em";
                    break;
                case "广州市":
                    return "-0.6em";
                    break;
                case "深圳市":
                    return "2em";
                    break;

                default:
                    return "0em"
            }
        })
        .attr("fill", function (d) {
            var td = $(this).parent().attr("intop5");

            if (td > -1 && d.value[2] != 0) {
                return "#fff"
            } else {
                return "#9A9FC5"
            }
        })
        .text(function (d) {
            var wd = _.findIndex(capitals, function (w, j) {
                return w.name === d.name;
            });

            var td = $(this).parent().attr("intop5");

            if (wd > -1 || td > -1) {
                switch (d.name) {
                    case "澳门特别行政区":
                        return "澳门";
                        break;
                    case "香港特别行政区":
                        return "香港";
                        break;
                }

                return d.name;
            }
        });
    // 排名
    eu.append("text")
        .attr("text-anchor", "middle ")
        .attr("font-size", function (d) {
            return 12;
        })
        .attr("dx", function (d) {
            switch (d.name) {
                case "北京市":
                    return "-0.05em";
                    break;
                case "天津市":
                    return "0.3em";
                    break;
                case "黑河市":
                    return "-0.2em";
                    break;

                default:
                    return "0"
            }
        })
        .attr("dy", function (d) {
            switch (d.name) {
                case "北京市":
                    return "0.12em";
                    break;

                default:
                    return "0.42em"
            }
        })
        .attr("fill", "#fff")
        .text(function (d, i) {
            if (d.value[2] != 0) {
                var tindex = _.findIndex(top5, {name: d.name});
                if (tindex > -1) {
                    return tindex + 1;
                } else {
                    return ""
                }
            }

        });
};

// 数据转换，all 不返回数据
jb.ui.mapData = function (res) {
    "use strict";

    if (_.isUndefined(res) || _.isUndefined(res.body.data) || _.isUndefined(res.body.data.current)) {
        res.body.data.current = store.get("current")
    }

    store.set("current", res.body.data.current);

    var capitals = store.session("capitals");

    var nanArr = [{"name": "南沙群岛", "coordinates": "112.019144,16.330884"}];

    var cdc = _.filter(res.body.data.current, function (v, i) {
        return !_.isNull(v.coordinates) && !_.includes(nanhai, v.city) && v.city !== "未知";
    });

    var nandc = _.filter(res.body.data.current, function (v, i) {
        return _.includes(nanhai, v.city)
    });
    var minCount = _.minBy(cdc, function (v, i) {
        "use strict";
        return v.count;
    }) || {count: 0};

    // 更新数据后，需要重新排序 根据 count
    var cityAll = _.map(cdc, function (v, i) {

        var l = _.map(v.coordinates.split(","), function (w, k) {
            return parseFloat(_.trim(w));
        });

        return {name: v.city, value: _.concat(l, [v.count])};
    });


    var nanData = _.map(nanArr, function (v, i) {
        var l = _.map(v.coordinates.split(","), function (w, k) {
            return parseFloat(_.trim(w));
        });

        return {name: v.name, value: _.concat(l, [minCount.count])}
    });


    var nanCurData = _.map(nandc, function (v, i) {
        var l = _.map(v.coordinates.split(","), function (w, k) {
            return parseFloat(_.trim(w));
        });

        return {name: v.city, value: _.concat(l, [minCount.count])}
    });

    capitals = _.filter(capitals, function (w, j) {
        return !_.includes(nanhai, w.name)
    });


    var cityCapitals = _.map(capitals, function (v, i) {

        var l = _.map(v.coordinates.split(","), function (w, k) {
            return parseFloat(_.trim(w));
        });

        return {name: v.name, value: _.concat(l, [0])}
    });

    var cityData = [];
    var topCounts = [];

    if (config.capitals) {
        // cityAll = _.reverse(_.sortBy(cityAll, function (v, i) {
        //     return v.value[2];
        // }));

        cityData = _.take(cityAll, config.mapCount);

        topCounts = _.unionBy(cityData, cityCapitals, 'name');
        // topCounts = cityData;
    } else {
        cityAll = _.unionBy(cityAll, cityCapitals, 'name');

        // cityData = _.reverse(_.sortBy(cityAll, function (v, i) {
        //     return v.value[2];
        // }));
        cityData = cityAll;

        topCounts = _.take(cityData, config.mapCount);
    }

    nanData = _.size(nanCurData) === 2 ? nanCurData : nanData;

    topCounts = _.reverse(_.sortBy(topCounts, function (v) {
        return v.value[2];
    }));

    return {
        nanData: nanData,
        nanCurrent: nanCurData,
        cityCurrent: topCounts,
        cityCapitals: cityCapitals
    }
};

// 数据映射
jb.ui.xis = function (data) {
    "use strict";
    var top5 = _.take(data, 5);
    var xiTop5 = d3.extent(_.map(top5, function (v, i) {
        return v.value[2]
    }));

    var xi = d3.extent(_.map(_.slice(data, 5), function (v, i) {
        return v.value[2]
    }));

    var xiall = d3.extent(_.map(data, function (v, i) {
        return v.value[2]
    }));

    var fontSize = d3.scaleLinear()
        .domain(xiall)
        .range([10, 14])
        .clamp(true);

    var circleRadius = d3.scaleLinear()
        .domain(xi)
        .range([2, 5])
        .clamp(true);

    var circleRadiusTop5 = d3.scaleLinear()
        .domain(xiTop5)
        .range([6, 10])
        .clamp(true);

    var xdomain = d3.scaleLinear()
        .domain(xiall)
        .range([0, 1])
        .clamp(true);
    return {
        fontSize: fontSize,
        circleRadius: circleRadius,
        circleRadiusTop5: circleRadiusTop5,
        xdomain: xdomain
    };
};
// 中国地图
jb.ui.tmap = function (opt, res) {
    "use strict";

    var capitals = store.session("capitals");
    var data = jb.ui.mapData(res, capitals);
    var s = d3.interpolate(d3.rgb(249, 214, 0), d3.rgb(250, 81, 0));

    var cur = data.cityCurrent;
    var nan = data.nanData;
    var nancur = data.nanCurrent;
    var xi = jb.ui.xis(cur);
    var top5 = _.take(cur, 5);

    var svg = opt.svg;
    var curRadial = opt.curRadial;
    var projection = opt.projection;
    var projection1 = opt.projection1;
    var t = d3.transition().duration(750);
    var smap = store.get("map");
    var mapCount = _.isNull(smap) ? 0 : smap.mapCount;

    store.set("map", {
        mapCount: mapCount + 1,
        cur: cur.length,
        time: jb.util.formatTime(new Date())
    });
    var mean = _.floor(d3.mean(cur, function (v) {

        return v.value[2];
    }), 0);


    // 闪烁的圆圈
    var curUpdate = svg.selectAll(".current")
        .data(cur, function (d) {
            return d.name + d.value[2];
        });


    var curExit = curUpdate.exit()
        .attr("class", "exit")
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();


    var curEnter = curUpdate.enter();
    jb.ui.curEnup(xi, curEnter, top5, curRadial, projection, s, mean, curExit.size(), curEnter.size());


    var locUpdate = svg.selectAll(".location")
        .data(_.reverse(cur), function (d) {
            return d.name + d.value[2];
        });

    locUpdate.exit()
        .attr("class", "exit")
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();

    var locEnter = locUpdate.enter();
    jb.ui.eup(xi, locEnter, top5, projection, s, capitals);
    //南海

    // $(".nhailocation").remove();
    var nlocUpdate = svg.selectAll(".nhlocation")
        .data(nan, function (d) {
            return d.name + d.value[2];
        });

    nlocUpdate.exit().remove();
    var nlocEnter = nlocUpdate.enter()
        .append("g")
        .attr("class", "nhailocation")
        .attr("transform", function (d) {
            //计算标注点的位置
            var coor = projection1([d.value[0] + 17, d.value[1] + 6]);
            return "translate(" + coor[0] + "," + coor[1] + ")";
        });
    //-----------
    var chasss = _.findIndex(nancur, {name: "三沙市"});
    //标注点的圆底
    nlocEnter.append("circle")
        .attr("fill", function (d) {
            return s(xi.xdomain(d.value[2]))
        })
        .attr("opacity", function (d) {
            return 1
        })
        .attr("r", function (d) {
            if (chasnan > -1 && d.name === "南沙群岛") {
                return xi.circleRadius(d.value[2]);
            } else if (chasss > -1 && d.name === "三沙市") {
                return xi.circleRadius(d.value[2]);
            } else {
                return 0;
            }

        });
    // 外圈
    nlocEnter.append("circle")
        .attr("chname", function (d) {
            return d.name;
        })
        .attr("stroke", function (d) {

            if (chasnan > -1 && d.name === "南沙群岛") {
                return s(xi.xdomain(d.value[2]))
            } else if (chasss > -1 && d.name === "三沙市") {
                return s(xi.xdomain(d.value[2]))
            } else {
                return 0;
            }

        })
        .attr("stroke-width", function (d) {
            var td = _.findIndex(top5, function (w, j) {
                return w.name === d.name;
            });

            if (td > -1) {
                return 0
            } else {
                return 1
            }

        })
        .attr("r", function (d) {
            if (d.name === "南沙群岛") {
                return 0;
            }

            var td = _.findIndex(top5, function (w, j) {
                return w.name === d.name;
            });

            if (td > -1) {
                return xi.circleRadiusTop5(d.value[2]);
            } else {
                return xi.circleRadius(d.value[2]);
            }

        });
    nlocEnter.append("text")
        .attr("text-anchor", "middle")
        .attr("y", function (d) {
            return xi.circleRadius(d.value[2]) + 8;
        })
        .attr("font-size", function (d) {
            return xi.fontSize(d.value[2]);
        })
        .attr("dy", function (d) {
            if (d.name === "南沙群岛") {
                return "1em"
            }
            return "0.5em"
        })
        .attr("dx", function (d) {
            return "0em"
        })
        .attr("fill", function (d) {
            "use strict";
            var td = _.findIndex(top5, function (w, j) {
                return w.name === d.name;
            });

            if (td > -1 && d.value[2] != 0) {
                return "#fff"
            } else {
                return "#9A9FC5"
            }
        })
        .text(function (d) {
            if (d.name === "南沙群岛" || d.name === "三沙市") {
                return d.name;
            }
        });

    // 闪烁的圆圈
    $(".ncurrent").remove();
    $(".nradial").remove();
    var ncurUp = svg.selectAll(".ncurrent")
        .data(nancur, function (d) {
            return d.name + d.value[2];
        });

    ncurUp.exit().remove();
    var ncurEnter = ncurUp.enter()
        .append("g")
        .attr("class", "ncurrent")
        .attr("transform", function (d) {
            //计算标注点的位置
            var coor = projection1([d.value[0] + 17, d.value[1] + 6]);
            return "translate(" + coor[0] + "," + coor[1] + ")";
        });
    //-------------

    var chasnan = _.findIndex(opt.nancur, {name: "南沙群岛"});
    ncurEnter.append("circle")
        .attr("class", "nslash")
        .attr("fill", function (d, i) {
            $("#gradient" + i + 1000).remove();
            var gradient = curRadial.append("defs")
                .append("radialGradient")
                .attr("class", "radial2")
                .attr("id", "gradient" + i + 1000)
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", s(xi.xdomain(d.value[2])));

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "rgba(255,142,0,0.05)");

            return "url(#gradient" + i + 1000 + ")";

        })
        .attr("opacity", 0.6)

    jb.ui.curRepeat(".nslash", top5, mean, xi);
    // .transition()
    // .delay(function (d, i) {
    //     return i * 50;
    // })
    // .ease(d3.easeQuadOut)
    // .on("start", function repeat(d) {
    //     if (d.value[2] === 0) {
    //         return;
    //     }
    //
    //     var rt = xi.circleRadius(d.value[2]);
    //     var rdmin = rt;
    //     var rdmax = rt * 2;
    //
    //     if (d.value[2] <= mean / 2) {
    //         rdmax = rt * 2;
    //     }
    //
    //     d3.active(this)
    //         .attr("r", function () {
    //             return rdmax;
    //         })
    //         .transition()
    //         .delay(150)
    //         .attr("r", function () {
    //             return rdmin;
    //         })
    //         .transition()
    //         .delay(200)
    //         .on("start", repeat);
    // });


};

// 词云
jb.ui.wordCloud = function (opt) {

    var cloud = d3.layout.cloud;
    var fill = opt.color;
    var wordEl = $(opt.dom);

    var xi = d3.extent(_.map(opt.data, opt.size));
    var fontSize = d3.scaleLinear()
        .domain(xi)
        .range([10, 36]);

    var words = _.map(opt.data, function (v) {
        return {text: v[opt.text], size: fontSize(v[opt.size])}
    });
    var cw = wordEl.width();
    var ch = wordEl.height();

    var layout = cloud()
        .size([cw, ch])
        .words(words)
        .padding(opt.padding)
        .rotate(0)
        .fontSize(function (d) {
            return d.size;
        })
        .text(function (d) {
            return d.text
        })
        .spiral("archimedean")
        // .on("word", function (word, i) {
        //     // 这里不要干扰旋转等，会扰乱布局
        //     return word
        // })
        .on("end", function () {
            d3.select(opt.dom).append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("font-family", opt.fontFamily)
                .style("fill", "#485dad")
                .attr("class", "cword")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                });


            var cwords = d3.selectAll(".cword");
            var len = cwords.nodes().length;
            var ani = [];

            cwords.each(function (d, i, nodes) {
                ani[i] = anime({
                    autoplay: false,
                    targets: nodes[i],
                    fill: ["#485dad", fill[i % 6], "#485dad"],
                    fontWeight: [800, 1500],
                    easing: 'easeOutQuad',
                    duration: opt.duration,
                    delay: function (el) {
                        return i * opt.delay;
                    },
                    // loop: true
                });
            });

            function sweep() {
                cwords.each(function (d, i) {
                    ani[i].restart();
                })
            }

            sweep();
            d3.interval(function () {
                sweep();
            }, len * opt.delay);
        });

    layout.start();

};

jb.ui.word3d = function (opt) {
    "use strict";
    try {
        TagCanvas.Start(opt.dom, opt.tags, {
            weight: true,
            weightMode: 'size',
            textFont: '"Microsoft YaHei", Impact, "Arial Black", sans-serif',
            textColour: null,
            shape: "sphere",
            stretchY: 1,
            stretchX: 1,
            outlineColour: null,
            initial: [0.1, -0.1],
            noSelect: true,
            noMouse: true,
            minBrightness: 1,
            hideTags: true,
            depth: 0.98,
            minSpeed: 0.02,
            maxSpeed: 0.03
        });
    } catch (e) {
        document.getElementById('js-wordc').style.display = 'none';
    }
};

// 二屏首页线图
jb.ui.line5 = function (opt) {

    var myChart = echarts.init(opt.dom);
    var tip = {};

    if (opt.tooltip) {
        tip = opt.tooltip;
    }

    var option = {
        silent: false,
        animationDuration: 2000,

        // 图例图标要固定大小
        legend: {
            left: "center",
            selectedMode: false,
            padding: opt.legendPadding,
            itemGap: opt.itemGap,
            itemWidth: opt.legendWidth || 62,
            itemHeight: opt.legendHeight || 16,
            textStyle: {
                color: "#fff",
                fontSize: opt.legendFontSize,
                lineHeight: 50
            },
            data: opt.legend
        },
        grid: {
            left: '4%',
            right: opt.grid.right || '1%',
            top: opt.grid.top,
            bottom: '1%',
            containLabel: true
        },
        xAxis: [{
            boundaryGap: false,
            type: 'category',
            scale: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: xyLineColor
                },
                align: "center"
                // showMinLabel: true,
                // showMaxLabel: true,

            },
            axisLabel: {
                color: "#fff",
                interval: 'auto',
            },
            splitLine: {
                show: true,
                interval: 'auto',
                // interval: function (i, v) {
                //     return 1
                // },
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisPointer: {
                lineStyle: {
                    type: "dashed"
                },
            },
            data: opt.gdate
        }],
        yAxis: [{
            type: 'value',
            min: opt.min ? opt.min : null,
            max: opt.max ? opt.max : null,
            inverse: opt.inverse ? opt.inverse : false,
            axisLine: {
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisLabel: {
                color: "#fff",
                margin: 10,
            },
            splitLine: {
                interval: 0,
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisPointer: {
                show: false
            }
        }],
        series: opt.series
    };

    option = _.extend(option, {
        tooltip: tip
    });

    myChart.setOption(option);

    return myChart;
};

// 二屏微信指数30日变
jb.ui.area2 = function (opt) {
    if (!opt.label) {
        opt.label = false;
    }

    var myChart = echarts.init(opt.dom);
    var option = {
        silent: false,
        animationDuration: 2000,
        tooltip: {
            show: true,
            trigger: "axis"
        },
        grid: {
            left: '1%',
            right: '4%',
            top: '16%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            // boundaryGap: true,
            // boundaryGap: ['20%', '20%'],
            scale: true,
            axisTick: {
                show: false
            },
            axisLabel: {
                color: "#fff"
            },
            axisLine: {
                lineStyle: {
                    color: xyLineColor
                }
            },
            splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisPointer: {
                lineStyle: {
                    type: "dashed"
                },
            },

            data: opt.date
        }],
        yAxis: [{
            // name: "单位(次)",
            nameTextStyle: {
                color: "#fff"
            },
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisLabel: {
                color: "#fff"
            },
            splitLine: {
                interval: 0,
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisPointer: {
                show: false
            }
        }],
        series: [{
            type: 'line',
            symbol: "circle",
            symbolSize: function (value, series) {
                if (series.dataIndex == 0) {
                    return 10
                }

                if (series.value == 520) {
                    return 10
                }

                return 4
            },
            // showSymbol: false,
            // showAllSymbol: true,
            lineStyle: {
                width: 4,
                shadowColor: 'rgba(84,199,252, 0.2)',
                shadowBlur: 45,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: opt.color[0]
                    }, {
                        offset: 1,
                        color: opt.color[1]
                    }],
                    globalCoord: false
                }

            },
            areaStyle: {
                // origin: "end",
                color: {
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 0,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: opt.color[1]
                    }, {
                        offset: 1,
                        color: opt.color[0]
                    }],
                    globalCoord: false // 缺省为 false
                },
                // shadowColor: "rgba(84,199,252, 1)",
                // shadowBlur: 25,
                opacity: 0.2,

            },
            itemStyle: {
                color: function (series) {
                    return echarts.color.lerp(series.dataIndex / 7, opt.color, false)
                },
            },
            label: {
                'show': opt.label,
                'position': "top",
                'color': '#fff',
            },
            smooth: true,
            data: opt.data
        }]
    };


    myChart.setOption(option);

};

// 求初始化拣选索引数组，为了构造dom
jb.ui.getSeq = function (list, startIndex) {

    var len = list.length;
    //中间位置
    var midPos = Math.floor(len / 2);
    var ran = _.range(0, len);
    // 3 4 0 1 2 初始序列
    var ret = new Array(len);
    // z-index
    var z = new Array(len);
    // 填充ret 起始位置
    ret[midPos] = parseInt(startIndex, 10);
    z[midPos] = len;

    // 填充后半部分
    for (var i = midPos + 1, j = parseInt(startIndex, 10) + 1; i <= len - 1; i++, j++) {
        if (j <= len - 1) {

            ret[i] = ran[j]

        } else {
            ret[i] = ran[0];
            j = 0;
        }
    }

    for (var i = midPos - 1, j = parseInt(startIndex, 10) - 1; i >= 0; i--, j--) {
        if (j >= 0) {
            ret[i] = ran[j]
        } else {
            ret[i] = ran[len - 1];
            j = len - 1;
        }
    }

    z = _.map(ran, function (v, i) {
        if (i < midPos) {
            return i;
        } else if (i === midPos) {
            return len;
        } else {
            return len - i - 1;
        }
    });

    return [ret, z];
};

// 求偏移数组，和z轴
jb.ui.getOffset = function (opt) {
    var fz = jb.util.getFontSize();
    // 1 0
    switch (opt.data.length) {
        case 1:
            var txtlen = jb.util.getTextWidth({txt: opt.data[0].gamename, fontSize: 0.25 * fz});

            return [txtlen + opt.baseIconWidth + fz * 0.3 + fz * 0.25 * 2 + 0.35 * fz];
        case 2:
            var r = [0];
            var txtlen = jb.util.getTextWidth({txt: opt.data[opt.seq[1]].gamename, fontSize: 0.25 * fz});
            r.push(txtlen + opt.baseIconWidth * 2 + fz * 0.3 + fz * 0.25 * 2 + 0.35 * fz)

        default:
            return _.reduce(_.range(1, opt.data.length), function (r, v, i) {
                // v 位置
                if (v === opt.midPos + 1) {

                    if (opt.dx) {
                        var txtlen = jb.util.getTextWidth({
                            txt: opt.data[opt.seq[v - 1]].gamename,
                            fontSize: 0.25 * fz
                        });
                        r.push(r[v - 1] + txtlen + opt.baseIconWidth + fz * 0.1 * (v + 2) + fz * 0.25 * 2 - (opt.midPos + 0.8) * opt.dx)
                    } else {
                        var txtlen = jb.util.getTextWidth({
                            txt: opt.data[opt.seq[v - 1]].gamename,
                            fontSize: 0.24 * fz
                        });
                        r.push(r[v - 1] + txtlen + opt.baseIconWidth + fz * 0.25 * 2)
                    }
                } else if (v === opt.midPos) {
                    if (opt.dx) {
                        r.push(r[v - 1] + opt.baseIconWidth + fz * 0.1) - (opt.midPos) * opt.dx
                    } else {
                        r.push(r[v - 1] + opt.baseIconWidth)
                    }
                } else {
                    // 重叠 10px
                    if (opt.dx) {
                        if (v == 1) {
                            r.push(r[v - 1] + opt.baseIconWidth - opt.dx - opt.dx / 3)
                        } else {
                            r.push(r[v - 1] + opt.baseIconWidth - opt.dx)
                        }


                    } else {
                        r.push(r[v - 1] + opt.baseIconWidth)
                    }

                }
                return r;
            }, [0]);
    }


};

// 摆放元素
jb.ui.setDom = function (opt) {
    var nextArr = jb.ui.getSeq(opt.data, opt.nextIndex);
    var offsetArr = jb.ui.getOffset({
        data: opt.data,
        curIndex: opt.nextIndex,
        midPos: opt.midPos,
        baseIconWidth: opt.baseIconWidth,
        seq: nextArr[0],
        dx: opt.dx ? opt.dx : false
    });

    // console.log(offsetArr)

    var opac = d3.scaleLinear()
        .domain([nextArr[1][0], nextArr[1][opt.midPos]])
        .range([0.6, 1])
        .clamp(true);
    var fz = jb.util.getFontSize();

    var iconBox = $("#js-topBullet");
    iconBox.width(offsetArr[opt.data.length - 1] + opt.baseIconWidth * 2);

    opt.ele.each(function (i, v) {
        var elv = $(v);
        elv.removeClass("swiper-nav-slide-active");
        elv.width(opt.baseIconWidth);
        // 下一个位置
        var pi = _.indexOf(nextArr[0], opt.curArr[0][i]);
        var curWidth;

        if (opt.midPos === pi && opt.midPos !== 0 && opt.ele.length > 2) {
            curWidth = offsetArr[opt.midPos + 1] - offsetArr[opt.midPos];
            elv.addClass("swiper-nav-slide-active");
            elv.width(curWidth);
        } else if (opt.ele.length === 1) {
            elv.addClass("swiper-nav-slide-active");
            elv.width(offsetArr[0]);
        } else if (opt.ele.length === 2 && pi === opt.midPos) {
            var txtlen = jb.util.getTextWidth({txt: opt.data[pi].gamename, fontSize: 0.25 * fz});
            curWidth = offsetArr[opt.midPos] * 2 + txtlen;
            elv.addClass("swiper-nav-slide-active");
            elv.width(curWidth);
        }

        var hi = (opt.maxHeight - (2 / (nextArr[1][pi] + 1)) * 10).toFixed(1);
        var per = opac(nextArr[1][pi]);

        if (opt.ele.length > 2) {
            anime({
                targets: elv[0],
                left: offsetArr[pi],
                height: hi + '%',
                opacity: per,
                zIndex: nextArr[1][pi],
                // easing: 'easeInOutQuad'
            });
        } else if (opt.ele.length === 2) {
            anime({
                targets: elv[0],
                left: offsetArr[pi],
                height: hi + '%',
                opacity: per,
                zIndex: nextArr[1][pi],
                // easing: 'easeInOutQuad'
            });
        } else if (opt.ele.length === 1) {
            anime({
                targets: elv[0],
                left: 0,
                height: hi + '%',
                opacity: 1,
                zIndex: nextArr[1][pi],
                // easing: 'easeInOutQuad'
            });
        }

    });

};

// 模板
jb.ui.tpl = function (opt) {
    var dom = _.template(opt.tpl)(opt.data);
    opt.dom.html($(dom).html());
};

// 二屏具体页面头部导航图标轮播
jb.ui.ban2 = function (opt) {
    // 实际数据数组索引构造
    // 中间位置，activeIndex
    var curIndex = opt.index;
    var data = opt.data;
    var tlen = data.length;
    var midPos = Math.floor(tlen / 2);
    var baseIconWidth = opt.baseIconWidth;
    var curArr = jb.ui.getSeq(data, curIndex);
    var iconBox = $("#js-topBullet");
    iconBox.empty();
    var offsetArr = jb.ui.getOffset({
        data: data,
        curIndex: curIndex,
        midPos: midPos,
        baseIconWidth: baseIconWidth,
        seq: curArr[0],
        dx: opt.dx ? opt.dx : false
    });

    iconBox.width(offsetArr[tlen - 1] + baseIconWidth * 2);

    jb.ui.tpl({
        tpl: $("#topBulletTpl").html(),
        dom: iconBox,
        data: {list: opt.list, z: curArr[1], host: opt.host}
    });

    var ele = iconBox.find(".swiper-nav-slide");

    jb.ui.setDom({
        ele: ele,
        data: data,
        curArr: curArr,
        nextIndex: curIndex,
        midPos: midPos,
        baseIconWidth: baseIconWidth,
        dx: opt.dx ? opt.dx : false,
        maxHeight: opt.maxHeight
    });

    iconBox.css({"visibility": "visible"});

    return function (index) {
        jb.ui.setDom({
            ele: ele,
            data: data,
            curArr: curArr,
            nextIndex: index,
            midPos: midPos,
            baseIconWidth: baseIconWidth,
            dx: opt.dx ? opt.dx : false,
            maxHeight: opt.maxHeight
        });
    }

};

// 二屏1
jb.ui.page21 = function (opt) {
    var legend = [];
    var gdate = [];
    // 清除实例
    if (lineIns && !lineIns.isDisposed()) {
        lineIns.dispose();
    }

    var p1line5dom = $("#js-main2line");
    p1line5dom.empty();

    var series = _.map(opt.topData, function (v, i) {
        legend.push({
            name: v.gamename,
            icon: 'image://img/line' + (i + 1) + '.png',
        });

        var glist = [];
        gdate = [];
        _.forEach(v.gamelist, function (k, j) {
            k.dateNoYear = jb.util.unix2dayNoYear(k.date, ".");
            glist.push(k.impressions);
            gdate.push(k.dateNoYear);
        });

        return {
            name: v.gamename,
            type: 'line',
            symbol: "circle",
            symbolSize: function (value, series) {

                if (series.dataIndex == 0 || series.dataIndex === gdate.length - 1) {
                    return 10
                }

                return 4;
            },
            lineStyle: {
                width: 4,
                // shadowColor: echarts.color.lerp(0.5, color2Line[i], false),
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
                        color: color2Line[i][0]
                    }, {
                        offset: 1,
                        color: color2Line[i][1]
                    }],
                    globalCoord: false,
                }

            },
            areaStyle: {
                // origin: "end",
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: color2Line[i][1]
                    }, {
                        offset: 0.35,
                        color: color2Line[i][0]
                    }, {
                        offset: 0.85,
                        color: 'rgba(84,199,252, 0.1)'
                    }],
                    globalCoord: false // 缺省为 false
                },
                // shadowColor: "rgba(84,199,252, 1)",
                // shadowBlur: 25,
                opacity: 0.1,

            },
            itemStyle: {
                color: function (series) {
                    return echarts.color.lerp(series.dataIndex / 7, color2Line[i], false)
                },
            },
            smooth: true,
            data: glist
        }
    });


    lineIns = jb.ui.line5({
        dom: p1line5dom[0],
        legend: legend,
        legendFontSize: 11,
        itemGap: 10,
        gdate: gdate,
        series: series,
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        legendPadding: [20, 5, 10, 5],
        legendWidth: 50,
        legendHeight: 16,
        grid: {
            top: '8%',
            right: '5.5%'
        }
    });

};
// 2 按播放列表播放后，不存在从2-2 到 2-1 的跳转了。
jb.ui.playList = function (opt, callback, vc) {
    // 记录播放数量和位置 secondGamePlayCount， 切分每个游戏下的可播放素材
    playlist = store.session("secondPlayList");

    if (_.size(topData) === 0) {
        return;
    }

    if ((_.size(playlist) === 0 || _.isNull(playlist)) && skip === true) {
        console.log("page2计时销毁", moment().format("h:mm:ss"))
        location.href = "/third.html?skip=true"
    }

    var pobjIndex = _.findIndex(playlist, {name: topData[opt.pIndex].gamename});
    // 有数据的
    if (pobjIndex > -1) {
        var pobj = playlist[pobjIndex]
        // 获取播放子列表
        var posGroup = pobj.posGroup;

        // 播放子列表的最后一个序号
        var pls = pobj.pl[posGroup];
        var subLastIndex = pls[pls.length - 1];

        console.log("subLastIndex:", subLastIndex, "curIndex:", opt.curIndex, "pIndex:", opt.pIndex)
        // 已播放到子列表的最后最后，记录播放位置，并调到下一个游戏

        // 调整子列表位到 下一个分组位置的开始

        if (opt.curIndex === subLastIndex) {
            if (posGroup === pobj.posMax) {
                pobj.posGroup = 0;
                pobj.posIndex = 0;
            } else {
                // 固定个数
                if (skip === true && config.second_checked === 1) {
                    // 至少2个分组
                    pobj.posGroup = posGroup + 1;
                    pobj.posIndex = pobj.pl[posGroup + 1][0];
                } else {
                    // 下一游戏的分组重置（固定时间 和 正常）
                    pobj.posGroup = 0;
                    pobj.posIndex = 0;
                }
            }

            store.session("secondPlayList", playlist);
            // 执行跳转
            callback();
            console.log("playlist 准备跳转：")
        } else {
            if (skip === true && config.second_checked === 1) {
                pobj.posIndex = opt.curIndex + 1;
            }

            // if(skip === true && config.second_checked===0){
            //     opt.sw.length - 1 === opt.pIndex
            // }


            store.session("secondPlayList", playlist);
            if (_.isFunction(vc)) {
                console.log("playlist 执行下一个：")
                vc();
            }
        }
    } else {
        console.log("playlist 无素材")
        //  info 中无该游戏的播放素材，如果为最后一个需要执行下页跳转
        // opt.psw.autoplay.start();

    }

};
// 二屏2所有轮播
jb.ui.page22 = function (opt) {
    // 具体各模块
    var app30name = ["总畅销榜", "总免费榜", "游戏畅销榜", "游戏免费榜"];
    var app30en = ["totalbestlistcount", "totalfreelistcount", "gamebestlistcount", "gamefreelistcount"];
    var chart = [];
    // var hasVdata = [];

    var legend30 = [];
    var date30 = [];
    var list30 = [];
    var series = [];
    // var version = [];

    psw = new Swiper("#page2slide", {
        autoplay: {
            delay: (skip === true && config.second_checked === 0) ? (config.seconddetail_time * 1000 + config.picSpeed) : config.delayslide
        },
        allowTouchMove: false,
        initialSlide: opt.to,
        speed: config.picSpeed,
        on: {
            slideChangeTransitionStart: function () {
                opt.ban2dom(this.activeIndex);
                var rIndex = _.findIndex(opt.rdata, {gameName: topData[this.activeIndex].gamename});
                if (rIndex > -1 && !_.isUndefined(opt.rdata[rIndex])) {
                    $("#js-getDate").text(jb.util.unix2day(opt.rdata[rIndex].dataLastTime));
                }

            },
            slideChangeTransitionEnd: function () {
                // jb.ui.interDispatch({
                //     pindex: this.activeIndex,
                //     hdata: hasVdata[this.activeIndex],
                //     chart: chart,
                //     app30en: app30en,
                // });
                // 第一个游戏无素材可播，从第二个开始启用播放列表
                var that = this;

                console.log("psw内部计时", this.activeIndex, moment().format("h:mm:ss"))

                var curIndex = 0;
                if (config.second_checked === 1 && skip === true) {
                    curIndex = jb.ui.getCurIndex(this.activeIndex);
                }

                // 第一款游戏素材播放 && sw[this.activeIndex].isBeginning todo
                if (!_.isUndefined(sw[this.activeIndex]) && !_.isNull(sw[this.activeIndex])) {
                    console.log("psw 开始播放素材: ", this.activeIndex)
                    if (!_.isUndefined(psw.autoplay)) {
                        psw.autoplay.stop();
                    }

                    delayer = _.delay(function () {
                        jb.ui.beginSw({
                            psw: psw,
                            sw: sw,
                            pIndex: that.activeIndex,
                            curSlide: $(sw[that.activeIndex].slides[curIndex]),
                            curIndex: curIndex
                        });
                    }, 100);

                }
                // 最后一款游戏
                if (this.activeIndex === opt.rdata.length - 1) {
                    // 播完最后一组
                    // if (!_.isUndefined(sw[this.activeIndex]) && !_.isNull(sw[this.activeIndex])) {
                    //     // 有可播放的素材
                    //     psw.autoplay.stop();
                    //     console.log("psw 最后播放: ", this.activeIndex)
                    //     jb.ui.beginSw({
                    //         psw: psw,
                    //         sw: sw,
                    //         pIndex: this.activeIndex,
                    //         curSlide: $(sw[this.activeIndex].slides[curIndex]),
                    //         curIndex: curIndex
                    //     });
                    // } else { }
                    if (skip === true) {
                        // 没得播就跳页
                        if (_.has(psw, "autoplay") && !_.isUndefined(psw.autoplay)) {
                            psw.autoplay.stop();
                        }

                        delayer = _.delay(function () {
                            "use strict";
                            if (skip === true) {
                                console.log("psw 最后游戏跳转1");
                                location.href = "/third.html?skip=true"
                            }

                        }, config.delayslide);
                    } else {
                        if (_.has(psw, "autoplay") && !_.isUndefined(psw.autoplay)) {
                            psw.autoplay.stop();
                        }


                        delayer = _.delay(function () {
                            console.log("psw 最后游戏跳转2");
                            pageTo1();
                            // psw.slideTo(0, config.picSpeed);
                            // if (!_.isNull(sw[0])) {
                            //     sw[0].slideTo(0, config.picSpeed);
                            // } else {
                            //     psw.autoplay.start();
                            // }
                        }, config.delayslide);
                    }

                }
                // have todo
                // else {
                //     if (!_.isNil(psw)) {
                //         psw.autoplay.start();
                //     }
                //
                // }


            }
        }
    });

    psw.autoplay.stop();
    // list 已排好序
    _.forEach(opt.rdata, function (v, i) {
        var wxdate = [];
        var wxdata = [];

        var topIndex = _.findIndex(opt.topData, {gamename: v.gameName});
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
                    color: color2Line[4]
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
                    icon: 'image://img/line' + (j + 1) + '.png',
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
                                color: color2Line[j][0]
                            }, {
                                offset: 1,
                                color: color2Line[j][1]
                            }],
                            globalCoord: false,
                        }

                    },
                    itemStyle: {
                        color: function (series) {
                            return echarts.color.lerp(series.dataIndex / 7, color2Line[j], false)
                        },
                    },
                    smooth: true,
                    data: list30[i][w]
                });

            });

            // _.forEach(opt.rdata[i].appstorelist, function (x, k) {
            //     version[i].push(1);
            //     hasVdata[i].push(x.version);
            // });

            // series[i].push({
            //     name: "版本号",
            //     type: 'line',
            //     symbol: "circle",
            //     symbolSize: function (value, series) {
            //
            //         if (series.dataIndex === 0 || series.dataIndex === (version[i].length - 1)) {
            //             return 10
            //         }
            //
            //         return 4;
            //     },
            //     lineStyle: {
            //         width: 4,
            //         color: '#D4FB7C'
            //
            //     },
            //     itemStyle: {
            //         color: '#D4FB7C',
            //     },
            //     smooth: true,
            //     data: version[i],
            //
            // });

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
                            var ts = _.map(params, function (w) {
                                // var vd = hasVdata[i][w.dataIndex];
                                // if (w.seriesName === "版本号" && !_.isNull(vd)) {
                                //     if (vd.length > 0) {
                                //         return w.seriesName + " " + hasVdata[i][w.dataIndex]
                                //     } else {
                                //         var prev = _.findLast(_.take(hasVdata[i], w.dataIndex), function (e) {
                                //             return e.length > 0;
                                //         });
                                //
                                //         if (!_.isUndefined(prev)) {
                                //             return w.seriesName + " " + prev;
                                //         } else {
                                //             return ""
                                //         }
                                //     }
                                //
                                // } else {
                                //     return w.seriesName + " " + w.data
                                // }
                                return w.seriesName + " " + w.data
                            });

                            return params[0].axisValue + '<br/>' + ts.join("<br/>")

                        },
                        backgroundColor: 'rgba(50,50,50,0.7)',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                });
            }

        }

        //优秀广告素材展示
        var infoIndex = _.findIndex(opt.info, function (w) {
            return w.name === v.gameName
        });

        if (infoIndex > -1 && !_.isNull(opt.info) && _.has(opt.info[infoIndex], "images") && opt.info[infoIndex].images.length > 0) {

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
                        var curSlide = $(this.slides[this.activeIndex]);
                        var curIndex = this.activeIndex;
                        // psw.autoplay.stop();

                        console.log("sw other: ", this.activeIndex)

                        jb.ui.beginSw({
                            psw: psw,
                            sw: sw,
                            pIndex: i,
                            curSlide: curSlide,
                            curIndex: curIndex
                        });


                        $("[id^='piectr']", curSlide).empty();
                        $("[id^='piecvr']", curSlide).empty();

                        jb.ui.pie22({
                            i: i,
                            c: curIndex,
                            rdata: opt.info[infoIndex].images,
                        });

                    }
                }
            });
            sw[i].autoplay.stop();
        } else {
            sw[i] = null;
        }

    });

    if (_.isNull(sw[0]) && skip === true) {
        jb.ui.playTimeToGame({psw: psw, sw: sw, pIndex: 0})
    }


    return {
        psw: psw,
        sw: sw,
        chart: chart,
        // hasVdata: hasVdata,
        app30en: app30en
    }
};
// 2 饼
jb.ui.pie22 = function (opt) {

    var fz = jb.util.getFontSize();

    var ctrNum;
    var ctrAngle;
    var cvrNum;
    var cvrAngle;

    if (_.isArray(opt.rdata)) {
        ctrNum = opt.rdata[opt.c].ctr == 0 ? "-" : jb.util.fixed(opt.rdata[opt.c].ctr, 3);
        ctrAngle = 2 * Math.PI * opt.rdata[opt.c].ctr;
        cvrNum = opt.rdata[opt.c].mctr == 0 ? "-" : jb.util.fixed(opt.rdata[opt.c].mctr, 3);
        cvrAngle = 2 * Math.PI * opt.rdata[opt.c].mctr;
    } else {
        ctrNum = "-";
        ctrAngle = 0;
        cvrNum = "-";
        cvrAngle = 0;
    }

    jb.ui.cpie({
        dom: "#piectr" + opt.i + opt.c,
        width: 1.3 * fz,
        height: 1.3 * fz,
        linearGradientNum: "a" + opt.i + opt.c,
        color1: "#FF9782",
        color2: "#F9D34C",
        numDx: -fz * 0.28,
        // numDx: -fz * 0.14,
        numDy: fz * 0.13,
        numFontSize: 0.32 * fz,
        num: ctrNum,
        percentDx: fz * 0.20,
        percentDy: -fz * 0.15,
        percentColor: "#fff",
        percentFontSize: fz * 0.14,
        desDx: -fz * 0.13,
        desDy: fz * 0.35,
        desColor: "#fff",
        desFontSize: fz * 0.12,
        des: "CTR",
        outRadius: fz * 0.6,
        inRadius: fz * 0.45,
        endAngle: ctrAngle,
        restRadius: 4,
        restColor: "#1D3569",

    });

    jb.ui.cpie({
        dom: "#piecvr" + opt.i + opt.c,
        width: 1.3 * fz,
        height: 1.3 * fz,
        linearGradientNum: "b" + opt.i + opt.c,
        color1: "#90BEED",
        color2: "#48F8B6",
        numDx: -fz * 0.28,
        numDy: fz * 0.13,
        numFontSize: 0.32 * fz,
        num: cvrNum,
        percentDx: fz * 0.20,
        percentDy: -fz * 0.15,
        percentColor: "#fff",
        percentFontSize: fz * 0.14,
        desDx: -fz * 0.25,
        desDy: fz * 0.35,
        desColor: "#fff",
        desFontSize: fz * 0.12,
        des: "大盘CTR",
        outRadius: fz * 0.6,
        inRadius: fz * 0.45,
        endAngle: cvrAngle,
        restRadius: 4,
        restColor: "#1D3569",
    });
};

// 播放子组的第一个元素
jb.ui.getCurIndex = function (pIndex) {
    var plss = store.session("secondPlayList");

    var pobjIndex = _.findIndex(plss, {name: topData[pIndex].gamename});

    var curIndex = -1;

    if (pobjIndex > -1) {
        pobj = plss[pobjIndex];
        curIndex = pobj.pl[pobj.posGroup][0];
        // curIndex = pobj.posIndex;
    }

    return curIndex;
};
// 2 轮播实例
jb.ui.page22action = function (psw, sw, conf) {

    psw.slideTo(conf.to);
    psw.autoplay.stop();
    // jb.ui.interDispatch({
    //     pindex: psw.activeIndex,
    //     hdata: conf.hasVdata[conf.to],
    //     chart: conf.chart,
    //     app30en: conf.app30en,
    // });
    // && sw[conf.to].isBeginning
    if (config.second_checked === 0) {
        endtime = _.now() + config.seconddetail_time * 1000;
    }

    if (!_.isNull(sw[conf.to])) {

        var curIndex = 0;
        if (config.second_checked === 1 && skip === true) {
            curIndex = jb.ui.getCurIndex(conf.to);
        }

        sw[conf.to].slideTo(curIndex);
        sw[conf.to].autoplay.stop();

        jb.ui.beginSw({
            psw: psw,
            sw: sw,
            pIndex: conf.to,
            curSlide: $(sw[conf.to].slides[curIndex]),
            curIndex: curIndex
        });
    } else {
        psw.autoplay.start();
    }
};

// 2 版本提示
jb.ui.interDispatch = function (opt) {
    // 取得版本数据的值和位置
    var vd = _.compact(_.map(opt.hdata, function (w, j) {
        if (w !== "") {
            return [w, j]
        } else {
            return false
        }
    }));

    var step = 0;
    var inter = jb.util.interval({
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
// 下一游戏
jb.ui.play2NextGame = function (opt) {

    var curIndex = 0;
    var pvIndex = jb.ui.findVL(opt, videoList);

    // 停止当前游戏
    if (pvIndex > -1) {
        if (!videoList.player[pvIndex].paused) {
            videoList.player[pvIndex].pause();
        }
        console.log("play2NextGame")
    }


    if (!_.isNull(opt.sw[opt.pIndex + 1]) && !_.isUndefined(opt.sw[opt.pIndex + 1])) {

        window.clearTimeout(playGameTime);
        playGameTime = undefined;
        window.clearTimeout(delayer);
        // 后面还有游戏
        if (!_.isNull(opt.sw[opt.pIndex]) && !_.isUndefined(opt.sw[opt.pIndex])) {
            opt.sw[opt.pIndex].autoplay.stop();
        }

        opt.psw.slideTo(opt.pIndex + 1, config.picSpeed);
        opt.sw[opt.pIndex + 1].slideTo(curIndex, config.picSpeed);

        console.log("手动到下一个游戏：", opt.pIndex + 1, opt.curIndex, moment().format("h:mm:ss"))

    } else if ((_.isNull(opt.sw) || (opt.sw.length - 1) === opt.pIndex) && skip === true) {
        // 当前是最后游戏，或者没有可播放的素材，跳页
        console.log("无播放内容或最后跳页：")
        jb.ui.playToPage(opt);
    } else if (((opt.sw.length - 1) === opt.pIndex && !skip)) {
        // 最后游戏，回第一个游戏
        pageTo1();
        // console.log("第一游戏：", 0, opt.curIndex)
        // opt.psw.slideTo(0, config.picSpeed);
        // if (!_.isNull(opt.sw[0])) {
        //     opt.sw[0].slideTo(0, config.picSpeed);
        // } else {
        //     opt.psw.autoplay.start();
        // }
        window.clearTimeout(delayer);

    } else {

        window.clearTimeout(playGameTime);
        playGameTime = undefined;
        window.clearTimeout(delayer);

        console.log("下一游戏：", 0, opt.curIndex)
        if (!_.isNull(opt.sw[opt.pIndex])) {
            // 当前游戏可播放，则先停止
            opt.sw[opt.pIndex].autoplay.stop();
        }
        // 到下一游戏

        if (!_.isNull(opt.sw[opt.pIndex])) {
            opt.sw[opt.pIndex].autoplay.stop();
        }

        opt.psw.slideTo(opt.pIndex + 1, config.picSpeed);
        opt.psw.autoplay.stop();

        // 下一游戏，
        if (!_.isNull(opt.sw[opt.pIndex + 1])) {
            // 自动播放
            opt.sw[opt.pIndex + 1].autoplay.start();
        } else {
            // 无可播放素材，自动切换
            opt.psw.autoplay.start();
        }
    }


};
// 开启自动播放, player should be array
jb.ui.play2Next = function (opt) {

    var pvIndex = jb.ui.findVL(opt, videoList);

    if (pvIndex > -1) {
        if (!videoList.player[pvIndex].paused) {
            videoList.player[pvIndex].pause();
        }

        if (!opt.sw[opt.pIndex].isEnd) {
            opt.sw[opt.pIndex].autoplay.stop();
            opt.sw[opt.pIndex].slideTo(opt.curIndex + 1, config.picSpeed);
            delayer = _.delay(function () {
                opt.sw[opt.pIndex].autoplay.start();
            }, config.img_stays * 1000)

        }

    } else {
        opt.sw[opt.pIndex].autoplay.start();
    }

    console.log("play2Next:", moment().format("h:mm:ss"))
    // window.clearTimeout(delayer);
};
// todo one step 下一游戏或自动播放
jb.ui.playStep = function (opt, hasVideo) {
    // 最后跳到下一游戏不用管
    jb.ui.playList(opt, function () {
        if (hasVideo) {
            opt.curIndex = 0;
            jb.ui.play2NextGame(opt);
        } else {
            delayer = _.delay(function () {
                console.log("step 图片最后跳转到：", opt.pIndex);
                opt.curIndex = 0;
                jb.ui.play2NextGame(opt);
            }, config.img_stays * 1000);
        }

    }, function () {
        if (hasVideo) {
            jb.ui.play2Next(opt)
        } else {
            if (skip === true && config.second_checked === 0) {
                console.log("step skip 图片过滤到：", opt.curIndex);
                jb.ui.play2Next(opt);

            } else {
                // delayer = _.delay(function () {// }, config.img_stays * 1000);
                console.log("step 图片过滤到：", opt.curIndex);
                jb.ui.play2Next(opt);

            }

        }
    });
};

jb.ui.playToPage = function (opt) {
    // 不跳到第一个
    if (!_.isNull(opt.sw[opt.pIndex])) {
        opt.sw[opt.pIndex].autoplay.stop();
        opt.psw.autoplay.stop();
    }
    var pvIndex = jb.ui.findVL(opt, videoList);

    if (pvIndex > -1) {
        if (!videoList.player[pvIndex].paused) {
            videoList.player[pvIndex].pause();
        }
    }

    if (skip === true && config.second_checked === 0) {
        window.clearTimeout(delayer);
        window.clearTimeout(playGameTime);
        playGameTime = undefined;
        console.log("page2计时销毁", moment().format("h:mm:ss"));
        location.href = "/third.html?skip=true";
    }

    if (skip === true && config.second_checked === 1) {
        jb.ui.playList(opt, function () {
            console.log("from v next page");
            window.clearTimeout(delayer);
            window.clearTimeout(playGameTime);
            playGameTime = undefined;
            console.log("page2计时销毁", moment().format("h:mm:ss"));
            location.href = "/third.html?skip=true";
        });
    }

};

jb.ui.playTimeToGame = function (opt) {
    if (config.second_checked === 0 && skip === true) {
        console.log("计时创建", moment().format("h:mm:ss"))
        var pvIndex = jb.ui.findVL(opt, videoList);
        playGameTime = _.delay(function () {

            try {
                if (pvIndex > -1) {
                    videoList.player[pvIndex].pause();
                }
            } catch (e) {

            }
            console.log("计时跳转", moment().format("h:mm:ss"))
            opt.curIndex = 0;
            jb.ui.play2NextGame(opt);
        }, config.seconddetail_time * 1000)
    }
};

jb.ui.findVL = function (opt, videoList) {
    return _.findIndex(videoList.pos, function (v, j) {
        if (v.pIndex === opt.pIndex && opt.curIndex === v.curIndex) {
            return true;
        } else {
            return false;
        }

    });
};

jb.ui.pauseAll = function () {
    videoList.player.forEach(function (v) {
        if (!v.paused()) {
            v.pause();
            console.log("pause:", v.id_)
        }

    })
};

jb.ui.disposeAll = function (resume) {
    videoList.player.forEach(function (v) {
        v.dispose();
    })
};
// 2 视频播放
jb.ui.beginSw = function (opt) {

    opt.pIndex = parseInt(opt.pIndex, 10);
    clearTimeout(delayer);
    // 游戏固定时间
    if (_.isUndefined(playGameTime)) {
        jb.ui.playTimeToGame(opt);
    }

    //
    var childSlide = $("#page2slide .swiper-container");

    // 游戏数量
    var childLen = childSlide.length;
    var hasVideo = opt.curSlide.hasClass("video");
    // 停止上级自动播放
    opt.psw.autoplay.stop();

    if (!_.isNull(opt.sw)) {
        opt.sw[opt.pIndex].autoplay.stop();
    }
    jb.ui.pauseAll();
    function errorDone(playerCur) {
        console.log("errorDone")
        if (playerCur) {
            try {
                playerCur.destroy();
            } catch (e) {
                console.log("video over 2:", opt.pIndex)
            }

        }
        clearTimeout(delayer);
        _.delay(function () {

            // 最后一个 slide 并且动画完毕
            if (opt.pIndex === childLen - 1) {
                if (skip === true) {
                    jb.ui.playToPage(opt);
                } else {
                    jb.ui.playStep(opt, true);
                }
            } else {
                jb.ui.playStep(opt, true);
            }

        }, 5000);
    }

    // 需要提前确定视频的 index, 确定视频 video id
    if (hasVideo) {
        // 视频id
        var vid = opt.curSlide.attr("id");

        try {
            var pvIndex = jb.ui.findVL(opt, videoList);
            videoList.pvIndex = pvIndex;
            if (pvIndex > -1 && !_.isUndefined(videoList.player[pvIndex])) {
                videoList.player[pvIndex];

            } else {
                videoList.player[pvIndex] = videojs("v" + vid, {
                    controls: true,
                    autoplay: false,
                    preload: 'none',
                    height: $("#" + vid).find(".vv").height()
                });
                console.log("be videoList:", videoList)
            }

            if (videoList.player[pvIndex]) {
                videoList.player[pvIndex].src($("#" + vid).attr("vpath"));
                videoList.player[pvIndex].ready(function () {
                    videoList.player[pvIndex].play();
                });

                // 浏览器尝试获取媒体数据失败
                videoList.player[pvIndex].on("stalled", function (s) {
                    // console.log(player.duration, player.currentTime);
                    console.log("stalled, need valid video ended");
                    try {
                        videoList.player[pvIndex].play();
                    } catch (e) {
                        console.log("stalled :", e);
                    }

                });
                //获取媒体数据过程中出错
                videoList.player[pvIndex].on("error", function (s) {
                    // console.log(player.duration, player.currentTime);
                    console.log("error");
                    videoList.player[pvIndex].dispose();
                    errorDone(videoList.player[pvIndex]);
                });
                //浏览器在下载完全部媒体数据之前中止获取媒体数据，但是并不是由错误引起的
                videoList.player[pvIndex].on("abort", function (s) {
                    console.log("abort");
                });
                //浏览器暂停获取媒体数据
                videoList.player[pvIndex].on("suspend", _.throttle(function (s) {
                    try {
                        videoList.player[pvIndex].play();

                    } catch (e) {
                        console.log("suspend :", e);
                    }
                }, 1000));
            }

            // 播放次数
            var pi = 1;

            videoList.player[pvIndex].on('ended', function () {
                console.log("video ended: ", opt.pIndex, opt.curIndex)
                // 拦截非最后的视频播放，所以要都包裹住
                if (config.video_loops > pi) {
                    videoList.player[pvIndex].play().catch(function (e) {
                        console.log("a.play catch play>", e);
                    });
                    pi += 1;
                    return;
                }

                // 最后一个 slide 并且动画完毕
                if (opt.sw[opt.pIndex].isEnd && !opt.sw[opt.pIndex].animating) {
                    if (opt.pIndex === childLen - 1) {
                        if (skip === true) {
                            jb.ui.playToPage(opt);
                        } else {
                            jb.ui.playStep(opt, true);
                        }
                    } else {
                        jb.ui.playStep(opt, true);
                    }

                } else {
                    jb.ui.playStep(opt, true);
                }
            });

        } catch (err) {
            console.log(err)
            // errorDone();
        }

    } else if (opt.sw[opt.pIndex].isEnd && !opt.sw[opt.pIndex].animating) {

        // 最后一个 slide 并且动画完毕
        if (opt.pIndex === childLen - 1) {
            if (skip === true) {
                _.delay(function () {
                    jb.ui.playToPage(opt);
                }, config.img_stays * 1000 + config.picSpeed)
            } else {
                _.delay(function () {
                    jb.ui.playStep(opt, false);
                }, config.img_stays * 1000)
            }

        } else {
            jb.ui.playStep(opt, false);
        }
    } else {
        console.log("beginsw 图片继续");
        jb.ui.playStep(opt, false);
    }


};

jb.ui.playPointStart = function (ban4sw, ppsw, psw, sw, k, i) {
    if (sw[k][i].isBeginning) {
        console.log("开始：", k, i);
        var ncvr = $("#js-navCvr" + k);
        var nctr = $("#js-navCtr" + k);
        var nctli = nctr.find("li");
        var ncvli = ncvr.find("li");
        var nlen = nctli.length;
        // 左侧导航的列切换
        if (i > (nlen - 1)) {
            if (i == nlen) {
                nctli.removeClass("active")
            }

            ncvli.removeClass("active");
            ncvli.eq(i % nlen).addClass("active");
        } else {
            if (i == 0) {
                ncvli.removeClass("active")
            }

            nctli.removeClass("active");
            nctli.eq(i).addClass("active");
        }
        jb.ui.playStep4(ban4sw, ppsw, psw, sw, k, i);
    }
};
// 四屏右侧所有轮播
jb.ui.page4 = function (opt) {

    var pswLen = [];
    var psw = [];

    var sw = [];

    // 右侧总的轮播，可触发顶部导航
    var ppsw = new Swiper("#js-rsbox", {
        autoplay: {
            delay: config.delayslide
        },
        allowTouchMove: false,
        speed: config.picSpeed,
        on: {
            slideChangeTransitionStart: function () {
                opt.ban4dom(this.activeIndex);
            },
            slideChangeTransitionEnd: function () {
                "use strict";
                var data = opt.mideaData[this.activeIndex];

                var ctrlen = data.ctr.length;
                var cvrlen = data.cvr.length;
                console.log("ppsw:", this.activeIndex)
                var nctr = $("#js-navCtr" + this.activeIndex);
                var ncvr = $("#js-navCvr" + this.activeIndex);
                nctr.find("li").removeClass("active");
                ncvr.find("li").removeClass("active");

                if (playPoint.nk === this.activeIndex) {
                    if (playPoint.i <= ctrlen - 1) {
                        nctr.find("li").eq(playPoint.i).addClass("active");
                    }

                    if (playPoint.i <= (cvrlen + ctrlen - 1) && playPoint.i > ctrlen) {
                        ncvr.find("li").eq(playPoint.i - ctrlen).addClass("active");
                    }

                    jb.ui.point4(ban4sw, ppsw, psw, sw, playPoint.nk, playPoint.i, null, function () {
                        console.log("ppsw计时", moment().format("h:mm:ss"))

                        jb.ui.playStepOther4(ban4sw, ppsw, psw, sw, playPoint.nk, playPoint.i)

                    });
                }


            }
        }
    });
    ppsw.autoplay.stop();

    _.forEach(opt.mideaData, function (w, k) {
        sw[k] = Array(6);
        _.fill(sw[k], null);

        var childSlide = $("#js-pbox" + k + " .swiper-container");
        var childLen = childSlide.length;
        pswLen.push(childLen);

        endtime = _.now() + config.four_meidia_time * 1000;
        // 右侧根据左侧导航对应的轮播，可触发左侧导航， k 对应左侧导航索引
        psw[k] = new Swiper("#js-pbox" + k, {
            autoplay: {
                duration: config.delayslide
            },
            allowTouchMove: false,
            speed: config.picSpeed,
            nested: true,
            on: {
                slideChangeTransitionStart: function () {
                    console.log("psw游戏：", k, this.activeIndex)
                    var ncvr = $("#js-navCvr" + k);
                    var nctr = $("#js-navCtr" + k);
                    var nctli = nctr.find("li");
                    var ncvli = ncvr.find("li");
                    var nlen = nctli.length;
                    // 左侧导航的列切换
                    if (this.activeIndex > (nlen - 1)) {
                        if (this.activeIndex == nlen) {
                            nctli.removeClass("active")
                        }

                        ncvli.removeClass("active");
                        ncvli.eq(this.activeIndex % nlen).addClass("active");
                    } else {
                        if (this.activeIndex == 0) {
                            ncvli.removeClass("active")
                        }

                        nctli.removeClass("active");
                        nctli.eq(this.activeIndex).addClass("active");
                    }

                },
                slideChangeTransitionEnd: function () {

                }

            }
        });
        psw[k].autoplay.stop();
        // 具体各模块

        _.forEach(_.concat(w.ctr, w.cvr), function (v, i) {
            //优秀广告素材展示
            sw[k][i] = new Swiper("#bl" + k + i, {
                autoplay: {
                    delay: config.img_stays * 1000
                },
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

                        var curSlide = $(this.slides[this.activeIndex]);
                        var curIndex = this.activeIndex;

                        console.log("播放：", k, i);
                        // if (!sw[k][i].animating && sw[k][i].isEnd) {
                        //     jb.ui.point4(ppsw, psw, sw, k, i)
                        // }
                        if (player && !player.destroyed) {
                            try {
                                player.destroy();
                            } catch (e) {

                            }
                        }
                        // 右侧具体播放的 swiper 的第一个
                        if (sw[k][i].isBeginning) {
                            curSlide = $(sw[k][i].slides[0]);
                            jb.ui.beginSw4(opt.ban4sw, ppsw, psw, sw, k, i, curSlide, 0);
                        } else {
                            jb.ui.beginSw4(opt.ban4sw, ppsw, psw, sw, k, i, curSlide, curIndex)
                        }

                        $("[id^='piectr']", curSlide).empty();
                        $("[id^='piemctr']", curSlide).empty();
                        $("[id^='piecvr']", curSlide).empty();

                        jb.ui.pie44({
                            k: k,
                            i: i,
                            c: curIndex,
                            v: _.concat(w.ctr, w.cvr)
                        })

                    }
                }
            });
            sw[k][i].autoplay.stop();
        });

        sw[k] = _.compact(sw[k]);

    });

    jb.ui.playPointStart(ban4sw, ppsw, psw, sw, playPoint.nk, playPoint.ni);

    // 顶部导航与 swiper 整合
    $(".swiper-nav-slide").click(function (e) {
        var el = $(e.currentTarget);
        var cindex = parseInt(el.attr("bid"), 10);

        psw[playPoint.k].autoplay.stop();
        sw[playPoint.k][playPoint.i].autoplay.stop();

        if (player && !player.destroyed) {

            console.log("nav paused:", player.paused)
            try {
                player.destroy();


            } catch (e) {

            }
        }

        clearTimeout(delayer);

        var nctr = $("#js-navCtr" + cindex);
        nctr.find("li").removeClass("active");
        nctr.find("li").eq(0).addClass("active");

        playPoint.k = cindex;
        playPoint.nk = cindex;
        playPoint.i = 0;
        playPoint.ni = 0;

        if (!skip) {
            // playPoint.index = ;
        }

        store.session("playPoint", playPoint);
        jb.ui.playStep4(opt.ban4sw, ppsw, psw, sw, cindex, 0);
    });

    // 左侧导航与 swiper 整合
    $(".ranking-box li").click(function (e) {
        $(".ranking-box li").removeClass("active");
        var el = $(e.currentTarget);
        el.addClass("active");

        var cinArr = el.attr("nid").split("");
        cinArr = _.map(cinArr, function (v) {
            return parseInt(v, 10)
        });

        psw[playPoint.k].autoplay.stop();
        sw[playPoint.k][playPoint.i].autoplay.stop();

        if (player && !player.destroyed) {


            try {
                player.destroy();


            } catch (e) {

            }
        }


        clearTimeout(delayer);
        // 位置和跳跃点一致就会跳出。跳跃点是本次的结束，下次的起始。

        playPoint.k = cinArr[0];
        playPoint.i = cinArr[1];

        playPoint.nk = cinArr[0];
        playPoint.ni = cinArr[1];

        store.session("playPoint", playPoint);
        jb.ui.playStepOther4(opt.ban4sw, ppsw, psw, sw, cinArr[0], cinArr[1])
    });

    return {
        ppsw: ppsw,
        psw: psw,
        sw: sw
    }

};
// 切换媒体
jb.ui.playStep4 = function (ban4sw, ppsw, psw, sw, nk, ni) {
    console.log("step4 切换媒体")
    jb.ui.pauseAll4();

    window.clearTimeout(delayer);
    ppsw.slideTo(nk, config.picSpeed);
    ban4sw.slideTo(nk, config.picSpeed);
    psw[nk].slideTo(ni, config.picSpeed);
    psw[nk].autoplay.stop();
    sw[nk][ni].autoplay.stop();
    sw[nk][ni].slideTo(0);
    jb.ui.beginSw4(ban4sw, ppsw, psw, sw, nk, ni, $(sw[nk][ni].slides[0]), 0);


};

// 切换游戏
jb.ui.playStepOther4 = function (ban4sw, ppsw, psw, sw, nk, ni, hasVideo) {
    console.log("stepother4 切换游戏11111")
    jb.ui.pauseAll4();

    window.clearTimeout(delayer);
    clearTimeout(playerDelay)
    psw[nk].slideTo(ni, config.picSpeed);
    psw[nk].autoplay.stop();

    sw[nk][ni].slideTo(0);

    jb.ui.beginSw4(ban4sw, ppsw, psw, sw, nk, ni, $(sw[nk][ni].slides[0]), 0);


};

// 准备切换媒体
jb.ui.playSwitch4 = function (ban4sw, ppsw, psw, sw, nk, ni, hasVideo) {
    console.log("playSwitch4 准备切换媒体")

    if (hasVideo) {
        console.log("playSwitch4v：", nk, ni)
        jb.ui.point4(ban4sw, ppsw, psw, sw, nk, ni, null, function (k, i) {
            jb.ui.playStep4(ban4sw, ppsw, psw, sw, k, i, hasVideo)
        });
    } else {
        delayer = _.delay(function () {
            console.log("playSwitch4：", nk, ni)
            jb.ui.point4(ban4sw, ppsw, psw, sw, nk, ni, null, function (k, i) {
                jb.ui.playStep4(ban4sw, ppsw, psw, sw, k, i, hasVideo)
            });
        }, config.delayslide);
    }
};

// 准备切换游戏
jb.ui.playSwitchOther4 = function (ban4sw, ppsw, psw, sw, nk, ni, hasVideo) {
    console.log("playSwitchOther4 准备切换游戏")
    if (hasVideo) {
        console.log("playSwitchOther4v：", nk, ni)
        jb.ui.point4(ban4sw, ppsw, psw, sw, nk, ni, null, function () {
            jb.ui.playStepOther4(ban4sw, ppsw, psw, sw, nk, ni, hasVideo)
        });

    } else {
        delayer = _.delay(function () {
            console.log("playSwitchOther4：", nk, ni)
            if (skip === true) {
                jb.ui.point4(ban4sw, ppsw, psw, sw, nk, ni, null, function () {
                    jb.ui.playStepOther4(ban4sw, ppsw, psw, sw, nk, ni, hasVideo)
                });
            } else {
                jb.ui.playStepOther4(ban4sw, ppsw, psw, sw, nk, ni, hasVideo)
            }

        }, config.img_stays * 1000);
    }
};

// 播放媒体游戏
jb.ui.playOther4 = function (ban4sw, ppsw, psw, sw, nk, ni, hasVideo) {
    console.log("playOther4 播放游戏")
    if (hasVideo) {
        console.log("播放playOther4v：", nk, ni)
        jb.ui.point4(ban4sw, ppsw, psw, sw, nk, ni, null, function () {
            sw[nk][ni].autoplay.start();
        });

    } else {
        delayer = _.delay(function () {
            console.log("播放playOther4：", nk, ni)

            jb.ui.point4(ban4sw, ppsw, psw, sw, nk, ni, null, function () {
                sw[nk][ni].autoplay.start();
            });

        }, config.img_stays);
    }
};

jb.ui.go5 = function () {
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
jb.ui.point4 = function (ban4sw, ppsw, psw, sw, k, i, cbgo, cb) {
    // 先在此判断条件，然后才播放或跳转。跳转应该在播放后
    playPoint = store.session("playPoint");
    console.log("playPoint:", playPoint)
    // 固定数量拦截记录
    // four_game_time 至少执行完一次，计算总共播放了多少素材，记录播放位置
    var plen = playPoint.point.length - 1;
    var plalen = playPoint.pla.length - 1;

    var pi = _.findIndex(playPoint.point, {k: k, i: i}, playPoint.index);
    var plai = _.findIndex(playPoint.pla, {k: k, i: i});
    // 播放到跳转位置， 最后一个位置没播到，区分是否是刷进来的
    if (pi > -1) {
        if (pi < plen) {
            playPoint.index = pi + 1;
            playPoint.k = k;
            playPoint.i = i;
            playPoint.nk = playPoint.point[pi].k;
            playPoint.ni = playPoint.point[pi].i;
        } else if (pi === plen) {
            playPoint.index = 0;
            playPoint.k = k;
            playPoint.i = i;
            playPoint.nk = 0;
            playPoint.ni = 0;
        }
        // 保存位置，并跳转
        clearTimeout(delayer);
        store.session("playPoint", playPoint);

        // 跳转调用
        if (_.isFunction(cbgo)) {
            cbgo();
        }
        psw[k].autoplay.stop();
        sw[k][playPoint.i].autoplay.stop();

        if (frush && pi === plen - 1) {
            frush = false;
        } else {
            jb.ui.go5(psw, sw, k, i);
        }

        console.log("下一页：", k, i, playPoint.nk, playPoint.ni)
    } else {
        // 不跳转的，sw[k][i] 没播完，要判断末尾
        playPoint.k = k;
        playPoint.i = i;

        if (plai < plalen) {
            // 还没到最后游戏
            playPoint.nk = playPoint.pla[plai].k;
            playPoint.ni = playPoint.pla[plai].i;

            store.session("playPoint", playPoint);

            if (_.isFunction(cb)) {
                cb(playPoint.nk, playPoint.ni);
            }
        } else if (plai === plalen) {
            // 最后游戏 todo video over? 07-11 11:32 add 回调的默认值
            playPoint.nk = playPoint.pla[plai].k;
            playPoint.ni = playPoint.pla[plai].i;

            if (sw[k][i].isEnd && !sw[k][i].animating) {
                playPoint.nk = 0;
                playPoint.ni = 0;
                playPoint.k = 0;
                playPoint.i = 0;
                store.session("playPoint", playPoint);
                location.replace(location.href)
            }

            console.log("下一个：", k, i, playPoint.nk, playPoint.ni);
            store.session("playPoint", playPoint);

            if (_.isFunction(cb)) {
                cb(playPoint.nk, playPoint.ni);
            }
        }
    }


};

// 媒体固定时间
jb.ui.media4 = function (ban4sw, ppsw, psw, sw, k, i) {

    if (_.isUndefined(mediaTime[k])) {
        console.log("计时创建", k, moment().format("h:mm:ss"))
        mediaTime[k] = _.delay(function () {

            jb.ui.pauseAll4();

            playPoint = store.session("playPoint");
            playPoint.mlist[k] = 0;
            psw[k].autoplay.stop();
            sw[k][playPoint.i].autoplay.stop();
            console.log("dd:", k, psw.length)

            if (k === psw.length - 1) {
                playPoint.mlist = _.fill(playPoint.mlist, config.four_meidia_time);
                playPoint.i = 0;
                playPoint.ni = 0;
                playPoint.k = k;
                playPoint.nk = 0;
                store.session("playPoint", playPoint);
                console.log("dd计时销毁", k, moment().format("h:mm:ss"))
                window.clearTimeout(delayer);
                jb.ui.go5();
                window.clearTimeout(mediaTime[k]);
            } else {
                // skip if
                playPoint.i = 0;
                playPoint.ni = 0;
                playPoint.k = k + 1;
                playPoint.nk = k + 1;
                store.session("playPoint", playPoint);
                window.clearTimeout(delayer);
                console.log("dd计时销毁", k, moment().format("h:mm:ss"))
                jb.ui.playStep4(ban4sw, ppsw, psw, sw, playPoint.nk, 0);
                window.clearTimeout(mediaTime[k]);
            }


        }, config.four_meidia_time * 1000);
        console.log("mt:", mediaTime[k])
    } else {
        if (psw[k].isEnd && sw[k][i].isEnd && !sw[k][i].animating) {
            if (player && !player.destroyed) {

                try {
                    player.destroy();
                } catch (e) {

                }
            }

            if (k === psw.length - 1) {
                playPoint.mlist = _.fill(playPoint.mlist, config.four_meidia_time);
                playPoint.i = 0;
                playPoint.ni = 0;
                playPoint.k = k;
                playPoint.nk = 0;
                store.session("playPoint", playPoint);
                console.log("媒体最后销毁1", k, moment().format("h:mm:ss"))
                window.clearTimeout(delayer);
                jb.ui.go5();
                window.clearTimeout(mediaTime[k]);
            } else {
                // skip if
                playPoint.i = 0;
                playPoint.ni = 0;
                playPoint.k = k + 1;
                playPoint.nk = k + 1;
                window.clearTimeout(delayer);
                store.session("playPoint", playPoint);
                console.log("媒体最后销毁2", k, moment().format("h:mm:ss"))
                jb.ui.playStep4(ban4sw, ppsw, psw, sw, playPoint.nk, 0);
                window.clearTimeout(mediaTime[k]);
            }
        }
    }

};

// 页面固定时间
jb.ui.pageTime4 = function (ban4sw, ppsw, psw, sw, k, i) {

    if (config.four_checked === 0 && skip === true) {
        if (_.isUndefined(pageTime)) {
            console.log("页面计时创建", k, moment().format("h:mm:ss"))
            pageTime = _.delay(function () {

                jb.ui.pauseAll4();

                psw[k].autoplay.stop();
                sw[k][i].autoplay.stop();

                store.session.remove("playPoint");
                console.log("页面计时销毁", k, i, moment().format("h:mm:ss"))
                jb.ui.go5();
                window.clearTimeout(delayer);
                window.clearTimeout(pageTime);
            }, config.four_time * 1000);

        }

    }
};

jb.ui.findVL4 = function (k, i, curIndex, videoList) {
    return _.findIndex(videoList.pos, function (v, j) {
        if (v.mediaIndex === k && v.gameIndex === i && curIndex === v.curIndex) {
            return true;
        } else {
            return false;
        }

    });
};

jb.ui.findPreV4 = function (k, i, curIndex, videoList) {
    var vindex = jb.ui.findVL(k, i, curIndex, videoList);
    var vplen = videoList.pos.length - 1;
    if (vindex === 0) {
        return vplen;
    } else {
        return vindex - 1;
    }
};

jb.ui.pauseAll4 = function () {
    videoList4.player.forEach(function (v) {
        if (!v.paused()) {
            v.pause();
        }
    });
};

jb.ui.beginSw4 = function (ban4sw, ppsw, psw, sw, k, i, curSlide, curIndex) {
    "use strict";

    window.clearTimeout(delayer);
    // 媒体固定时间
    if (config.four_checked === 1 && skip == true) {
        jb.ui.media4(ban4sw, ppsw, psw, sw, k, i)
    }
    // 页面固定时间
    if (config.four_checked === 0 && skip == true) {
        jb.ui.pageTime4(ban4sw, ppsw, psw, sw, k, i);
    }

    var dlen = ppsw.slides.length;
    var hasVideo = curSlide.hasClass("video");

    // 手动切换过来，关闭前面的视频
    // 停止轮播
    sw[k][i].autoplay.stop();

    // 需要提前确定视频的 index, 确定视频 video id

    function errorDone() {
        console.log("error done")
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

jb.ui.pie44 = function (opt) {
    "use strict";
    var ctr;
    var mctr;
    var cvr;
    var data = opt.v[opt.i].images;
    var tdata = data.length > 0 ? data[opt.c] : 0;

    var tctr = tdata.ctr;
    var tmctr = tdata.mctr;
    var tcvr = tdata.cvr;

    var ctrAngle = 2 * Math.PI * tctr;
    var mctrAngle = 2 * Math.PI * tmctr;
    var cvrAngle = 2 * Math.PI * tcvr;

    ctr = (tctr === 0 || _.isUndefined(tctr)) ? "-" : jb.util.fixed(tctr, 3);
    mctr = (tmctr === 0 || _.isUndefined(tmctr)) ? "-" : jb.util.fixed(tmctr, 3);
    cvr = (tcvr === 0 || _.isUndefined(tcvr)) ? "-" : jb.util.fixed(tcvr, 3);

    var fz = jb.util.getFontSize() * 0.95;

    if (opt.i <= (opt.v.length / 2 - 1)) {
        jb.ui.cpie({
            dom: "#piectr" + opt.k + opt.i + opt.c,
            width: 1.3 * fz,
            height: 1.3 * fz,
            linearGradientNum: "a" + opt.k + opt.i + opt.c,
            color1: "#FF9782",
            color2: "#F9D34C",
            numDx: -fz * 0.26,
            numDy: fz * 0.13,
            numFontSize: 0.32 * fz,
            num: ctr,
            percentDx: fz * 0.20,
            percentDy: -fz * 0.15,
            percentColor: "#fff",
            percentFontSize: fz * 0.14,
            desDx: -fz * 0.13,
            desDy: fz * 0.35,
            desColor: "#fff",
            desFontSize: fz * 0.12,
            des: "CTR",
            outRadius: fz * 0.6,
            inRadius: fz * 0.45,
            endAngle: ctrAngle,
            restRadius: 4,
            restColor: "#1D3569",

        });

        jb.ui.cpie({
            dom: "#piemctr" + opt.k + opt.i + opt.c,
            width: 1.3 * fz,
            height: 1.3 * fz,
            linearGradientNum: "b" + opt.k + opt.i + opt.c,
            color1: "#90BEED",
            color2: "#48F8B6",
            numDx: -fz * 0.28,
            numDy: fz * 0.13,
            numFontSize: 0.32 * fz,
            num: mctr,
            percentDx: fz * 0.20,
            percentDy: -fz * 0.15,
            percentColor: "#fff",
            percentFontSize: fz * 0.14,
            desDx: -fz * 0.25,
            desDy: fz * 0.35,
            desColor: "#fff",
            desFontSize: fz * 0.12,
            des: "大盘CTR",
            outRadius: fz * 0.6,
            inRadius: fz * 0.45,
            endAngle: mctrAngle,
            restRadius: 4,
            restColor: "#1D3569",
        });
    } else {
        jb.ui.cpie({
            dom: "#piecvr" + opt.k + opt.i + opt.c,
            width: 1.3 * fz,
            height: 1.3 * fz,
            linearGradientNum: "b" + opt.k + opt.i + opt.c,
            color1: "#e8c3fd",
            color2: "#9abdeb",
            numDx: -fz * 0.28,
            numDy: fz * 0.13,
            numFontSize: 0.32 * fz,
            num: cvr,
            percentDx: fz * 0.20,
            percentDy: -fz * 0.15,
            percentColor: "#fff",
            percentFontSize: fz * 0.14,
            desDx: -fz * 0.15,
            desDy: fz * 0.35,
            desColor: "#fff",
            desFontSize: fz * 0.12,
            des: "CVR",
            outRadius: fz * 0.6,
            inRadius: fz * 0.45,
            endAngle: cvrAngle,
            restRadius: 4,
            restColor: "#1D3569",
        });
    }


};

// 3 曝光环比增长
jb.ui.bar3 = function (opt) {
    var ins = echarts.getInstanceByDom(opt.dom);
    if (ins && !ins.isDisposed()) {
        ins.dispose();
    }

    var myChart = echarts.init(opt.dom);

    var option = {
        backgroundColor: '#303C69',
        grid: {
            top: '15%',
            left: '1%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },

        // tooltip: {
        //     show: "true",
        //     trigger: 'item',
        //     backgroundColor: 'rgba(0,0,0,0.7)', // 背景
        //     padding: [8, 10], //内边距
        //     extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
        //     formatter: function(params) {
        //         if (params.seriesIndex == "3" || params.seriesIndex == "4" || params.seriesIndex == "5") {
        //             return params.name + '<br>' + params.seriesName + ' ： 第 ' + params.value + ' 名';
        //         }
        //     }
        // },
        yAxis: {
            type: 'value',
            min: opt.vMin,
            max: opt.vMax,

            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                    color: '#44537C',
                }
            },
            axisLabel: {
                color: '#fff',
                formatter: function (v, i) {
                    // if (i === 0) {
                    //     return v;
                    // }
                    return v + "%"
                },
                fontWeight: 'normal',
                fontSize: opt.vYFontSize,

            },
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#44537C',
                }
            },
            axisLabel: {
                inside: false,
                textStyle: {
                    color: '#fff',
                    fontWeight: 'normal',
                    fontSize: opt.labelFontSize,
                },
            },
            data: opt.nameData
        }

        ],
        series: [{
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                padding: 4,
                color: '#fff',
                fontSize: opt.labelFontSize,
                formatter: '{c}%'
            },

            zlevel: 2,
            barWidth: '10%',
            data: [{
                value: opt.data[0],
                itemStyle: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: color2Line[0][0]
                    }, {
                        offset: 1,
                        color: color2Line[0][1]
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0,

                },
            }, {
                value: opt.data[1],
                itemStyle: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: color3Line[1][1]
                    }, {
                        offset: 1,
                        color: color3Line[1][0]
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0,
                },
            }, {
                value: opt.data[2],
                itemStyle: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: color3Line[2][1]
                    }, {
                        offset: 1,
                        color: color3Line[2][0]
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0,
                },
            }]
        }

        ]
    };
    myChart.setOption(option);
};

// 3 曝光趋势(近7日）
jb.ui.trend3 = function (opt) {
    var ins = echarts.getInstanceByDom(opt.dom);
    if (ins && !ins.isDisposed()) {
        ins.dispose();
    }

    var legend = [];
    var gdate = [];
    var series = _.map(opt.data, function (v, i) {
        legend.push({
            name: v.medianame,
            icon: 'image://img/line' + icon3[i] + '.png',
        });
        var glist = [];
        gdate = [];
        _.forEach(v.mediadatelist, function (k, j) {
            k.date = jb.util.unix2dayNoYear(k.date, ".");
            glist.push(k.impressions);
            gdate.push(k.date)
        });

        return {
            name: v.medianame,
            type: 'line',
            symbol: "circle",
            symbolSize: function (value, series) {
                if (series.dataIndex == 0) {
                    return 10
                }

                if (series.value == v.mediadatelist[v.mediadatelist.length - 1].impressions) {
                    return 10
                }

                return 4
            },
            // showSymbol: false,
            // showAllSymbol: true,
            lineStyle: {
                width: 4,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: color3Line[i][0]
                    }, {
                        offset: 1,
                        color: color3Line[i][1] // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }

            },
            areaStyle: {
                // origin: "end",
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: color3Line[i][1] // 0% 处的颜色
                    }, {
                        offset: 0.35,
                        color: color3Line[i][0] // 0% 处的颜色
                    }, {
                        offset: 0.75,
                        color: 'rgba(44,58,107, 0.1)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
                // shadowColor: "rgba(240,58,76, 1)",
                // shadowBlur: 25,
                opacity: 0.1,

            },
            itemStyle: {
                color: function (series) {
                    return echarts.color.lerp(series.dataIndex / 7, color3Line[i], false)
                },
                // borderWidth: 1
            },
            smooth: true,
            data: glist
        }
    });

    var myChart = echarts.init(opt.dom);
    var option = {
        silent: false,
        animationDuration: 2000,
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        legend: {
            left: "center",
            padding: opt.legendPadding,
            itemGap: 30,
            itemWidth: 62,
            itemHeight: 16,
            textStyle: {
                color: "#fff",
                fontSize: 12,
                lineHeight: 30,
            },
            data: legend
        },
        grid: {
            left: '1%',
            right: '1%',
            top: opt.grid.top,
            bottom: '1%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            // boundaryGap: true,
            // boundaryGap: ['20%', '20%'],
            scale: true,
            axisLabel: {
                color: "#fff"
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: xyLineColor
                }

            },
            splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisPointer: {
                lineStyle: {
                    type: "dashed"
                },
            },

            data: gdate
        }],
        yAxis: [{
            name: "单位\n(次)",
            nameTextStyle: {
                color: "#fff"
            },
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisLabel: {
                color: "#fff"
            },
            splitLine: {
                interval: 1,
                lineStyle: {
                    color: xyLineColor
                }
            },
            axisPointer: {
                show: false
            }
        }],
        series: series
    };


    myChart.setOption(option);
};

// 5 按播放列表
jb.ui.playList5 = function (id, callback, vc) {
    // 记录播放数量和位置 secondGamePlayCount， 切分每个游戏下的可播放素材
    var pobj = store.session("fivePlayList");
    if (_.isUndefined(pobj) || _.isNull(pobj)) {
        store.session("fivePlayList", playlist);
        pobj = playlist;
    }

    // 获取播放子列表
    var posGroup = pobj.posGroup;
    // 播放子列表的最后一个序号
    var pls = pobj.pl[posGroup];
    var subLastIndex = pls[pls.length - 1];

    console.log(id, "pobj", pobj)
    console.log("subLastIndex:", subLastIndex)
    // 已播放到子列表的最后最后，记录播放位置，并调到下一个游戏
    if (id === subLastIndex) {
        // 调整子列表位置
        if (posGroup === pobj.posMax) {
            pobj.posGroup = 0;
            pobj.posIndex = 0;
        } else {
            console.log("pl:", pobj.pl[posGroup + 1])
            pobj.posGroup = posGroup + 1;
            pobj.posIndex = pobj.pl[posGroup + 1][0];
        }

        store.session("fivePlayList", pobj);
        console.log("写入后准备跳转：")
        // 执行跳转
        callback();
    } else {
        // pobj.posIndex = pobj.posIndex+1;
        store.session("fivePlayList", pobj);
        if (_.isFunction(vc)) {
            console.log("下一个执行：")
            vc();
        }
    }
};

jb.ui.playTime5 = function (cb) {
    if (config.five_checked === 0 && _.isUndefined(play5Time)) {
        console.log("计时创建", moment().format("h:mm:ss"))
        play5Time = _.delay(function () {
            try {
                if (player) {
                    player.destroy();
                }
            } catch (e) {
            }
            console.log("计时销毁", moment().format("h:mm:ss"))
            cb();

        }, config.five_time * 1000)
    }
};