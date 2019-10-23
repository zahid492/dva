import {api, themes, configs} from "../config/config";


let config = store.session("config");

if(_.isNil(config)){
    config = configs;
}

export function rem() {
    function change() {
        document.documentElement.style.fontSize = 100 * (document.documentElement.clientWidth / 1920) + 'px';
    }

    change();
    window.onresize = change;
}

export var jb = {};

export var request = window.superagent;

jb.ajx = {};
jb.ui = {};
jb.util = {};
jb.config = {};


if (!config.debug) {
    console.log = _.identity;
}

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

jb.util.getFontSize = function () {
    var fs = document.documentElement.style.fontSize;
    return fs.substring(0, fs.indexOf("p"));
};
// 需要 fecha 年月日
jb.util.formatTime = function (date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return moment(date).format('YYYY' + sep + 'MM' + sep + 'DD' + " HH:mm");
};

jb.util.formatDate = function (date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return moment(date).format('YYYY' + sep + 'MM' + sep + 'DD');
};

// 年月
jb.util.formatMonth = function (date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return moment(date).format('YYYY' + sep + 'MM');
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

// 求初始化拣选索引数组，为了构造dom
jb.ui.getSeq = function getSeq(list, startIndex) {

    var len = list.length;
    //中间位置
    var midPos = Math.floor(len / 2);
    var ran = _.range(0, len);
    var ii = midPos - startIndex;
    var n;

    if (0 != ii) {
        if (ii > 0) {
            n = ran.splice(len - ii);
            ran = _.concat(n, ran);
        }

        if (ii < 0) {
            n = ran.splice(0, -ii);
            ran = _.concat(ran, n)
        }
    }
    var z = _.map(ran, function (v, i) {
        if (i < midPos) {
            return i;
        } else if (i === midPos) {
            return midPos;
        } else {
            return len - i - midPos+1;
        }
    });

    return [ran, z];
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
                color: themes[config.theme].legend21TextColor,
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
                    color: themes[config.theme].xyLineColor
                },
                align: "center"
                // showMinLabel: true,
                // showMaxLabel: true,

            },
            axisLabel: {
                color: themes[config.theme].legend21TextColor,
                interval: 'auto',
            },
            splitLine: {
                show: true,
                interval: 'auto',
                // interval: function (i, v) {
                //     return 1
                // },
                lineStyle: {
                    color: themes[config.theme].xyLineColor
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
                    color: themes[config.theme].xyLineColor
                }
            },
            axisLabel: {
                color: themes[config.theme].legend21TextColor,
                margin: 10,
            },
            splitLine: {
                interval: 0,
                lineStyle: {
                    color: themes[config.theme].xyLineColor
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
                color: themes[config.theme].legend21TextColor,
            },
            axisLine: {
                lineStyle: {
                    color: themes[config.theme].xyLineColor
                }
            },
            splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                    color: themes[config.theme].xyLineColor
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
                color: themes[config.theme].legend21TextColor,
            },
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: themes[config.theme].xyLineColor
                }
            },
            axisLabel: {
                color: themes[config.theme].legend21TextColor,
            },
            splitLine: {
                interval: 0,
                lineStyle: {
                    color: themes[config.theme].xyLineColor
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
                shadowColor: themes[config.theme].shadowColorArea2,
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
                'color': themes[config.theme].legend21TextColor,
            },
            smooth: true,
            data: opt.data
        }]
    };


    myChart.setOption(option);

};

// 模板
jb.ui.tpl = function (opt) {
    var dom = _.template(opt.tpl)(opt.data);
    opt.dom.html($(dom).html());
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
        color1: themes[config.theme].cycleCtrColor1,
        color2: themes[config.theme].cycleCtrColor2,
        numDx: -fz * 0.28,
        // numDx: -fz * 0.14,
        numDy: fz * 0.13,
        numFontSize: 0.32 * fz,
        num: ctrNum,
        percentDx: fz * 0.20,
        percentDy: -fz * 0.15,
        percentColor: themes[config.theme].cyclePercent,
        percentFontSize: fz * 0.14,
        desDx: -fz * 0.13,
        desDy: fz * 0.35,
        desColor: themes[config.theme].cyclePercent,
        desFontSize: fz * 0.12,
        des: "CTR",
        outRadius: fz * 0.6,
        inRadius: fz * 0.45,
        endAngle: ctrAngle,
        restRadius: 4,
        restColor: themes[config.theme].cycleRest,

    });

    jb.ui.cpie({
        dom: "#piecvr" + opt.i + opt.c,
        width: 1.3 * fz,
        height: 1.3 * fz,
        linearGradientNum: "b" + opt.i + opt.c,
        color1: themes[config.theme].cycleCvrColor1,
        color2: themes[config.theme].cycleCvrColor2,
        numDx: -fz * 0.28,
        numDy: fz * 0.13,
        numFontSize: 0.32 * fz,
        num: cvrNum,
        percentDx: fz * 0.20,
        percentDy: -fz * 0.15,
        percentColor: themes[config.theme].cyclePercent,
        percentFontSize: fz * 0.14,
        desDx: -fz * 0.25,
        desDy: fz * 0.35,
        desColor: themes[config.theme].cyclePercent,
        desFontSize: fz * 0.12,
        des: "大盘CTR",
        outRadius: fz * 0.6,
        inRadius: fz * 0.45,
        endAngle: cvrAngle,
        restRadius: 4,
        restColor: themes[config.theme].cycleRest,
    });
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
            color1: themes[config.theme].cycleCtrColor1,
            color2: themes[config.theme].cycleCtrColor2,
            numDx: -fz * 0.26,
            numDy: fz * 0.13,
            numFontSize: 0.32 * fz,
            num: ctr,
            percentDx: fz * 0.20,
            percentDy: -fz * 0.15,
            percentColor: themes[config.theme].cyclePercent,
            percentFontSize: fz * 0.14,
            desDx: -fz * 0.13,
            desDy: fz * 0.35,
            desColor: themes[config.theme].cyclePercent,
            desFontSize: fz * 0.12,
            des: "CTR",
            outRadius: fz * 0.6,
            inRadius: fz * 0.45,
            endAngle: ctrAngle,
            restRadius: 4,
            restColor: themes[config.theme].cycleRest,
        });

        jb.ui.cpie({
            dom: "#piemctr" + opt.k + opt.i + opt.c,
            width: 1.3 * fz,
            height: 1.3 * fz,
            linearGradientNum: "b" + opt.k + opt.i + opt.c,
            color1: themes[config.theme].cycleCvrColor1,
            color2: themes[config.theme].cycleCvrColor1,
            numDx: -fz * 0.28,
            numDy: fz * 0.13,
            numFontSize: 0.32 * fz,
            num: mctr,
            percentDx: fz * 0.20,
            percentDy: -fz * 0.15,
            percentColor: themes[config.theme].cyclePercent,
            percentFontSize: fz * 0.14,
            desDx: -fz * 0.25,
            desDy: fz * 0.35,
            desColor: themes[config.theme].cyclePercent,
            desFontSize: fz * 0.12,
            des: "大盘CTR",
            outRadius: fz * 0.6,
            inRadius: fz * 0.45,
            endAngle: mctrAngle,
            restRadius: 4,
            restColor: themes[config.theme].cycleRest,
        });
    } else {
        jb.ui.cpie({
            dom: "#piecvr" + opt.k + opt.i + opt.c,
            width: 1.3 * fz,
            height: 1.3 * fz,
            linearGradientNum: "b" + opt.k + opt.i + opt.c,
            color1: themes[config.theme].cycleCvr4Color1,
            color2: themes[config.theme].cycleCvr4Color2,
            numDx: -fz * 0.28,
            numDy: fz * 0.13,
            numFontSize: 0.32 * fz,
            num: cvr,
            percentDx: fz * 0.20,
            percentDy: -fz * 0.15,
            percentColor: themes[config.theme].cyclePercent,
            percentFontSize: fz * 0.14,
            desDx: -fz * 0.15,
            desDy: fz * 0.35,
            desColor: themes[config.theme].cyclePercent,
            desFontSize: fz * 0.12,
            des: "CVR",
            outRadius: fz * 0.6,
            inRadius: fz * 0.45,
            endAngle: cvrAngle,
            restRadius: 4,
            restColor: themes[config.theme].cycleRest,
        });
    }


};


// 媒体类型判断
export function mediaType(path) {
    let mtype;

    if (/\.jpg$|\.png$/.test(path)) {
        mtype = "image"
    }
    ;

    if (/\.mp4$/.test(path)) {
        mtype = "video"
    }
    return mtype;
};
