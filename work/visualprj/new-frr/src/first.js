import $ from "jquery";
import {headRun, headTime} from "./component/head";
import {api, configs, themes} from "./config/config";
import {jb, rem} from "./plugs/tbase";
import * as map from "./component/map";
import wordCloud from "./component/cloud";


// 考虑 d3 todo 引入模块
function updateMap(opt) {

    jb.ajx.request({
        url: api.tencentCitys,
    }).then(function (res) {
        "use strict";
        map.tmap({
            curRadial: opt.curRadial,
            svg: opt.svga,
            projection: opt.projection,
            projection1: opt.projection1,
        }, res);

    });
}

// 广告点击与曝光
function reqAdClicks(config) {

    jb.ajx.request({
        url: api.adImpressionsClicks,
    }).then(function (res) {
        res = res.body.data;
        $("#js-adClick").empty();

        var one = res[0];
        var two = res[1];

        one.enddate = jb.util.unix2day(one.enddate, ".");
        one.impressions = jb.util.numSplit(one.impressions);
        one.clicks = jb.util.numSplit(one.clicks);

        two.sedate = jb.util.weekDay(two.startdate, two.enddate);

        two.impressions = jb.util.numSplit(two.impressions);
        two.clicks = jb.util.numSplit(two.clicks);

        let exposureTpl = require("./template/first/exposure.html");
        let exposureDom = exposureTpl({one: one, two: two})

        $("#js-adClick").append(exposureDom);
        $("#js-getDate").text(jb.util.unix2day(res[0].enddate + 3600 * 24));
        //
        var lit = d3.selectAll(".litt").append("svg")
            .attr("width", 28)
            .attr("height", 15)
            .append("g")
            .attr("transform", "translate(0,10)")
            .append("text")
            .attr("font-size", 10)
            .attr("fill", "#fff")
            .text("环比");

        jb.util.animeFontScale({dom: '.number strong'});
    });
}

// 词云 广告曝光之媒体分布，
function reqWordCloud(config) {

    jb.ajx.request({
        url: api.mediaImpressionsList,
        data: {
            topNumber: config.wordcloud_size,
            thanImpressions: config.wordcloud_gt_exposures,
        },
    }).then(function (res) {
        res = res.body.data;
        config = store.session("config");
        // 词云
        try {
            $("#js-wordc").empty();

            wordCloud({
                dom: "#js-wordc",
                data: res.medialist,
                text: "medianame",
                size: "impressions",
                padding: 3,
                fontFamily: "Microsoft YaHei",
                duration: 2500,
                delay: 1500,
                opacity: 1,
                color: themes[config.theme].tagColor
            });
        } catch (e) {
            console.log(e)
        }

        $(".js-week").text("(" + jb.util.weekDay(res.start, res.end) + ")");
        // 获取后更新获取数据时间

    });
}

// 地图
function runMap(res, config) {

    try {
        $("#js-map").empty();

        var mapBox = $("#js-map");
        var width = mapBox.width(),
            height = mapBox.height();

        var svga = d3.select("#js-map").append("svg")
            .attr("class", "z-map")
            .attr("width", width)
            .attr("height", height);

        // 地图放大比例
        var mapSize = d3.scaleLinear()
            .domain([1020, 1860])
            .range([735, 1540]);
        // 地图中心纬度
        var mapTop = d3.scaleLinear()
            .domain([1020, 1920])
            .range([37.3, 38]);
        // 地图中心经度
        var projection = d3.geoMercator()
            .center([104.8, mapTop(width)])
            .scale(mapSize(width))
            .translate([width / 2, height / 2]);
            // .fitExtent([[20, 20], [mapSize(width), mapSize(width)*2/3]]);

        var projection1 = d3.geoMercator()
            // .center([107, 37])
            .center([88, 32])
            .scale(mapSize(width))
            .translate([width * 1 / 2, height * 1 / 2]);

        var path = d3.geoPath()
            .projection(projection);

        var curRadial = svga.append("g").attr("class", "curRadial");
        map.mapFilter(svga);

        map.cmap(svga, path, width, height).then(function () {
            map.tmap({
                curRadial: curRadial,
                svg: svga,
                projection: projection,
                projection1: projection1,
            }, res);
        });

        // 定时更新地图数据
        jb.util.interval({
            time: config.mapChangeTime,
            cb: function () {
                "use strict";
                updateMap({
                    curRadial: curRadial,
                    svg: svga,
                    projection: projection,
                    projection1: projection1,
                })
            }
        });

    } catch (e) {
        console.log(e)
    }

}

// 地图空数据处理包含
function reqMap(config) {
    "use strict";
    jb.ajx.request({
        url: api.tencentCitys,
    }).then(function (res) {
        "use strict";
        runMap(res, config);

    }, function (err) {
        runMap({
            body: {
                data: []
            }
        })
    });
}

// 与保存的配置比较，有更新则调用对应的函数
function updateOnConfigRefresh(config) {
    reqWordCloud(config);
    reqAdClicks(config);
    reqMap(config);
}

$(function () {
    var config = configs;
    rem();
    var skip = Boolean(window.url("?skip"));
    headRun();

    // 1 屏所有
    function run() {
        jb.ajx.config({
            cb: function (con) {
                "use strict";
                config = _.assignIn(configs, con);
                store.session("config", config);
                var capitals = store.session("capitals");
                d3.timeout(function () {
                    headTime(config.headtime);
                }, 600)

                // 缓存省会城市数据
                if (capitals) {
                    updateOnConfigRefresh(config);
                } else {
                    jb.ajx.request({
                        url: api.capitals,
                    }).then(function (capitalsRes) {
                        capitals = capitalsRes.body.data;
                        store.session("capitals", capitals);
                        updateOnConfigRefresh(config);
                    });
                }

                // 跳转到下一页
                if (skip === true) {
                    jb.util.time2Url({
                        url: '/second.html?skip=true',
                        time: config.first_time * 1000
                    })
                }


            }
        });

    }

    run();

    // 配置变动，更新词云
    jb.util.interval({
        time: config.updateConfig,
        cb: function () {
            "use strict";
            jb.ajx.config({

                cb: function (con) {
                    config = _.assignIn(config, con);
                    var hasNew = jb.util.isNewConfig(config, ["first_time", "wordcloud_size", "wordcloud_gt_exposures"]);

                    d3.timeout(function () {
                        headTime(config.headtime);
                    }, 600);

                    // 根据配置更新广告曝光之媒体分布
                    if (hasNew) {
                        store.session("config", config);
                        reqWordCloud(config);
                    }

                }
            })
        }
    });

// 定时更新词云、和曝光点击
    jb.util.interval({
        time: config.updateMinute,
        cb: function () {
            "use strict";
            reqAdClicks(config);
            reqWordCloud(config);
        }
    });


// 定时刷新页面
    jb.util.interval({
        time: config.mapReloadTime,
        cb: function () {
            store.remove("map");
            var smap = store.get("map");
            var reload = _.isNull(smap) ? 0 : smap.reload;

            store.set("map", _.extend(smap, {
                reload: reload + 1,
                reloadtime: jb.util.formatTime(new Date())
            }));
            location.replace(location.href)
        }
    });
});
