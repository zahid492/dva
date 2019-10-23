var skip = Boolean(url("?skip"));
 // --single-process -sc=desktopshortcut -fixlaunch=0

$(function () {
    var curRadial;
    var svga;
    var projection;
    var projection1;
    // clearInterval(upadTimer);
    // clearInterval(upmapTimer);
    // clearInterval(reloadMapTimer);
    // clearInterval(upconfigTimer);
    // jb.util.console();
    jb.ui.headRun();
    run();

    // 更新词云配置

    var upconfigTimer = jb.util.interval({
        time: config.updateConfig,
        cb: function () {
            "use strict";
            jb.ajx.config({

                cb: function (con) {
                    config = _.assignIn(config, con);
                    var hasNew = jb.util.isNewConfig(config, ["first_time", "wordcloud_size", "wordcloud_gt_exposures"]);

                    _.delay(function(){
                        jb.ui.headTime(config.headtime);
                    }, 600);

                    // 根据配置更新广告曝光之媒体分布
                    if (hasNew) {
                        store.session("config", config);
                        reqWordCloud();
                    }

                }
            })
        }
    });

    //api.tencentCitys,
    var upadTimer = jb.util.interval({
        time: config.updateMinute,
        cb: function () {
            "use strict";
            reqAdClicks();
            reqWordCloud();
        }
    });

    var upmapTimer = jb.util.interval({
        time: config.mapChangeTime,
        cb: function () {
            "use strict";
            updateMap()
        }
    });
    // shsss
    var reloadMapTimer = jb.util.interval({
        time: config.mapReloadTime,
        cb: function () {
            store.remove("map")
            var smap = store.get("map");
            var reload =  _.isNull(smap) ? 0 : smap.reload;

            store.set("map", _.extend(smap, {
                reload: reload + 1,
                reloadtime: jb.util.formatTime(new Date())
            }));
            location.replace(location.href)
        }
    });

    // 1 屏所有
    function run() {
        jb.ajx.config({
            cb: function (con) {
                "use strict";
                config = _.assignIn(config, con);
                store.session("config", config);
                var capitals = store.session("capitals");
                _.delay(function(){
                    jb.ui.headTime(config.headtime);
                }, 600)

                // 缓存省会城市数据
                if (capitals) {
                    updateOnConfigRefresh();
                } else {
                    jb.ajx.request({
                        url: api.capitals,
                    }).then(function (capitalsRes) {
                        capitals = capitalsRes.body.data;
                        store.session("capitals", capitals);
                        updateOnConfigRefresh();
                    });
                }

                // 跳转到下一页
                if (skip === true) {
                    jb.util.time2Url({
                        url: '/second.html?skip=true',
                        time: config.first_time*1000
                    })
                }


            }
        });

    }

    function updateMap() {

        jb.ajx.request({
            url: api.tencentCitys,
        }).then(function (res) {
            "use strict";
            console.log(res)
              jb.ui.tmap({
                curRadial:curRadial,
                svg: svga,
                projection: projection,
                projection1: projection1,
            }, res);

        });
    }

    // 数据转换，原始 all 返回数据。
    // function mapData(res) {
    //
    //     var cdr = _.filter(res.body.data.all, function (v) {
    //         return !_.isNull(v.coordinates)
    //     });
    //
    //     var nanArr = _.filter(cdr, function (w) {
    //         return _.includes(nanhai, w.name)
    //     });
    //     var ndd = {"name":"南沙群岛","coordinates":"112.019144,16.330884"};
    //     var ni = _.findIndex(nanArr, {name: ndd.name});
    //
    //     if(ni===-1){
    //         nanArr.push(ndd)
    //     }
    //
    //     cdr = _.filter(cdr, function (w) {
    //         return !_.includes(nanhai, w.name)
    //     });
    //
    //     var cdc = _.filter(res.body.data.current, function (v, i) {
    //         return !_.isNull(v.coordinates) && !_.includes(nanhai, v.name)
    //     });
    //
    //     var nandc = _.filter(res.body.data.current, function (v, i) {
    //         return _.includes(nanhai, v.name)
    //     });
    //
    //     var minCount = _.minBy(res.body.data.all, function (v, i) {
    //         "use strict";
    //         return v.count;
    //     }) || {count: 0};
    //
    //     // 更新数据后，需要重新排序 根据 count
    //     var cityAll = _.map(cdr, function (v, i) {
    //
    //         var l = _.map(v.coordinates.split(","), function (w, k) {
    //             return parseFloat(_.trim(w));
    //         });
    //
    //         // 合并数据，用 current 代替 all 的数值
    //
    //         var cindex = _.findIndex(cdc, function (w, j) {
    //             "use strict";
    //             return w.city === v.city;
    //         });
    //
    //         if (cindex > 0) {
    //             return {name: v.city, value: _.concat(l, [cdc[cindex].count])}
    //         } else {
    //             return {name: v.city, value: _.concat(l, [v.count])}
    //         }
    //     });
    //
    //     //---------
    //
    //     var nanData = _.map(nanArr, function (v, i) {
    //         var l = _.map(v.coordinates.split(","), function (w, k) {
    //             return parseFloat(_.trim(w));
    //         });
    //
    //         return {name: v.name, value: _.concat(l, [minCount.count])}
    //     });
    //
    //     var nanCurData = _.map(nandc, function (v, i) {
    //         var l = _.map(v.coordinates.split(","), function (w, k) {
    //             return parseFloat(_.trim(w));
    //         });
    //
    //         return {name: v.name, value: _.concat(l, [minCount.count])}
    //     });
    //
    //     capitals = _.filter(capitals, function(w, j){
    //         return !_.includes(nanhai, w.name)
    //     });
    //     //----------
    //
    //     var cityCapitals = _.map(capitals, function (v, i) {
    //
    //         var l = _.map(v.coordinates.split(","), function (w, k) {
    //             return parseFloat(_.trim(w));
    //         });
    //
    //         return {name: v.name, value: _.concat(l, [0])}
    //     });
    //
    //     var cityData = [];
    //     var topCounts = [];
    //
    //     if (config.capitals) {
    //         cityAll = _.reverse(_.sortBy(cityAll, function (v, i) {
    //             return v.value[2];
    //         }));
    //
    //         cityData = _.take(cityAll, config.mapCount);
    //
    //         topCounts = _.unionBy(cityData, cityCapitals, 'name');
    //         // topCounts = cityData;
    //     } else {
    //         cityAll = _.unionBy(cityAll, cityCapitals, 'name');
    //
    //         cityData = _.reverse(_.sortBy(cityAll, function (v, i) {
    //             return v.value[2];
    //         }));
    //
    //         topCounts = _.take(cityData, config.mapCount);
    //     }
    //
    //     var cityCurrent = _.compact(_.map(cdc, function (v, i) {
    //
    //         var l = _.map(v.coordinates.split(","), function (w, k) {
    //             return parseFloat(_.trim(w));
    //         });
    //         // 限制数量的 闪烁更新点
    //         // var topIndex = _.findIndex(topCounts, function(w, k){
    //         //     return w.name === v.city;
    //         // });
    //
    //         return {name: v.city, value: _.concat(l, v.count)}
    //         // if(topIndex > -1){
    //         //     return {name: topCounts[topIndex].name, value: topCounts[topIndex].value}
    //         // }
    //
    //     }));
    //
    //     topCounts = _.unionBy(cityCurrent, topCounts, 'name');
    //     // console.log(topCounts)
    //
    //     topCounts = _.reverse(_.sortBy(topCounts, function (v) {
    //         return v.value[2];
    //     }));
    //
    //     return {
    //         nanData: nanData,
    //         nanCurrent: nanCurData,
    //         cityData: topCounts,
    //         cityCurrent: cityCurrent,
    //         cityCapitals: cityCapitals
    //     }
    // }

    // 地图
    function reqMap() {
        "use strict";
        jb.ajx.request({
            url: api.tencentCitys,
        }).then(function (res) {
            "use strict";
            try{
                console.log(res)
                $("#js-map").empty();

                var mapBox = $("#js-map");
                var width = mapBox.width(),
                    height = mapBox.height();

               svga= d3.select("#js-map").append("svg")
                    .attr("class", "z-map")
                    .attr("width", width)
                    .attr("height", height);

                // 地图放大比例
                var mapSize = d3.scaleLinear()
                    .domain([1020, 1920])
                    .range([735, 1540]);
                // 地图中心纬度
                var mapTop = d3.scaleLinear()
                    .domain([1020, 1920])
                    .range([37.3, 38]);
                // 地图中心经度
                projection = d3.geoMercator()
                    .center([104.8, mapTop(width)])
                    .scale(mapSize(width))
                    .translate([width / 2, height / 2]);

                var path = d3.geoPath()
                    .projection(projection);

                projection1 = d3.geoMercator()
                    .center([107, 37])
                    .scale(mapSize(width))
                    .translate([width * 1 / 2, height * 1 / 2]);

                var path1 = d3.geoPath()
                    .projection(projection1);

                curRadial = svga.append("g").attr("class", "curRadial");
                jb.ui.mapFilter(svga);

                jb.ui.cmap(svga, path, path1, width, height).then(function(){
                    jb.ui.tmap({
                        curRadial:curRadial,
                        svg: svga,
                        projection: projection,
                        projection1: projection1,
                    }, res);
                });


            }catch (e) {
                console.log(e)
            }


        });
    }

    // 词云 广告曝光之媒体分布，
    function reqWordCloud() {
        jb.ajx.request({
            url: api.mediaImpressionsList,
            data: {
                topNumber: config.wordcloud_size,
                thanImpressions: config.wordcloud_gt_exposures,
            },
        }).then(function (res) {
            res = res.body.data;
            // 词云
            var xi = d3.extent(_.map(res.medialist, "impressions"));
            var fontSize = d3.scaleLinear()
                .domain(xi)
                .range([10, 38]);

            res.medialist = _.map(res.medialist, function (v, i) {
                v.size = _.floor(fontSize(v.impressions), 0);
                v.color = tagColor[i % 4];
                return v;
            });

            try {

                $("#js-wordc").empty();

                // jb.ui.word3d({
                //     dom: 'tagCanvas',
                //     tags: "tags",
                // });

                jb.ui.wordCloud({
                    dom: "#js-wordc",
                    data: res.medialist,
                    text: "medianame",
                    size: "impressions",
                    padding: 3,
                    fontFamily: "Microsoft YaHei",
                    duration: 2500,
                    delay: 1500,
                    opacity: 1,
                    // color: _.concat(d3.schemeCategory20, d3.schemeCategory10,)
                    color: tagColor
                });
            } catch (e) {
                console.log(e)
            }


            $(".js-week").text("(" + jb.util.weekDay(res.start, res.end) + ")");
            // 获取后更新获取数据时间

        });
    }

    // 广告点击与曝光
    function reqAdClicks() {

        jb.ajx.request({
            url: api.adImpressionsClicks,
        }).then(function (res) {
            res = res.body.data;
            $("#js-adClick").empty();

            var compiled = _.template($("#adClickTpl").html());
            var dom = compiled({one: res[0], two: res[1]});
            $("#js-adClick").append($(dom).html());
            $("#js-getDate").text(jb.util.unix2day(res[0].enddate + 3600 * 24));

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

    // 与保存的配置比较，有更新则调用对应的函数
    function updateOnConfigRefresh() {
        reqWordCloud();
        reqAdClicks();
        reqMap();
    }

});