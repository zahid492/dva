import {
    themes,
    nanhai
} from "../config/config";

var config = store.session("config");

//WeakSet 存储变化的Dom 节点，垃圾回收没问题
export function mapFilter(svga) {
    "use strict";
    let ft = svga.append("defs")
        .append("filter")
        .attr("id", "mapBlur");

    ft.append("feOffset")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offset1");

    ft.append("feGaussianBlur")
        .attr("stdDeviation", 6)
        .attr("in", "offset1")
        .attr("result", "blurOut1");

    ft.append("feColorMatrix")
        // .attr("values", "0 0 0 0 0.266666667   0 0 0 0 0.694117647   0 0 0 0 0.607843137  0 0 0 0.7 0")
        .attr("values", "0 0 0 0 0.266666667   0 0 0 0 0.694117647   0 0 0 0 0.607843137  0 0 0 0.4 0")
        .attr("in", "blurOut1")
        .attr("type", "matrix")
        .attr("result", "shadow-color1");


    let fm = ft.append("feMerge");
    fm.append("feMergeNode")
        .attr("in", "shadow-color1");

    fm.append("feMergeNode")
        .attr("in", "SourceGraphic");

}

// 地图
export function cmap(svg, path, width, height) {
    "use strict";
    return new Promise(function (resolve, reject) {
        d3.json("/static/lib/china-na.geojson", function (error, georoot) {
            if (error) {
                return console.error(error);
            }

            svg.append("g").attr("class", "cbg")
                .selectAll("path")
                .data(georoot.features)
                .enter()
                .append("path")
                .attr("class", function (d) {
                    if (d.properties.name === "南海诸岛") {
                        return "nan";
                    }
                    return "province"
                })
                .style("fill", function (d) {
                    if (d.properties.name === "南海诸岛") {
                        return "none";
                    }
                    return themes[config.theme].mapFill
                })
                .attr("d", path)
                .attr("filter", function (d) {
                    if (d.properties.name === "南海诸岛") {
                        return "none";
                    }

                    return "url(#mapBlur)"
                });

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
                .attr("xlink:href", "/static/img/mapMan1.png")
                .attr("width", 25)
                .attr("height", 32);

            rIndicator.append("image")
                .attr("x", 50)
                .attr("y", 250)
                .attr("xlink:href", "/static/img/mapMan2.png")
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
                .attr("stop-color", themes[config.theme].mapIndicatorStop1);


            gradientIndicator.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", themes[config.theme].mapIndicatorStop2);

            resolve();

        });
    })

}

// 闪烁未使用暂时
function curRepeat(cl, top5, mean, xi) {
    "use strict";
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
}

// 城市闪烁
function curEnup(xi, enup, enmg, top5, curRadial, projection, projection1, s, mean, ensize, exitsize) {
    "use strict";
    if (ensize === exitsize) {
        return;
    }

    $(".curRadial").empty();
    let cityEnter = enup.append("g")
        .attr("class", "current")
        .attr("transform", function (d) {
            //计算标注点的位置
            var coor;

            if (_.includes(config.nanhai, d.name)) {
                coor = projection1([d.value[0], d.value[1]]);
            } else {
                coor = projection([d.value[0], d.value[1]]);
            }

            return "translate(" + coor[0] + "," + coor[1] + ")";
        });

    cityEnter.append("circle")
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
        // todo 可以通过 animation sml 代替创建过多的 radial, 可以集中创建销毁 radial
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
                .attr("stop-color", themes[config.theme].mapCurrentRadialStop2);

            return "url(#gradient" + i + ")";
        })
        .style("fill-opacity", 0.6);

    cityEnter.merge(enup).select("circle")
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


}

// 城市圆圈
function eup(xi, enup, enmg, top5, projection, projection1, s, capitals) {
    "use strict";
    var eu = enup.append("g")
        .attr("class", "location")
    //  两圈合并，圆圈边框透明度有影响改用 fill-opacity。合并 2019-01-31
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
        })
        .style("fill-opacity", function (d) {
            var td = $(this).parent().attr("intop5");

            return (td > -1) ? 1 : 0.7;
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
                return themes[config.theme].mapCityNameTop5;
            } else {
                return themes[config.theme].mapCityName;
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
        .attr("fill", themes[config.theme].mapCityCircleNum)
        .text(function (d, i) {
            if (d.value[2] != 0) {
                var tindex = _.findIndex(top5, {
                    name: d.name
                });
                if (tindex > -1) {
                    return tindex + 1;
                } else {
                    return ""
                }
            }

        });



    eu.merge(enmg).attr("na", function (d) {
            return d.name + d.value[2];
        })
        .attr("intop5", function (d) {
            return _.findIndex(top5, function (w, j) {
                return w.name === d.name;
            });
        })
        .attr("transform", function (d) {
            var coor;

            if (_.includes(config.nanhai, d.name)) {
                coor = projection1([d.value[0], d.value[1]]);
            } else {
                coor = projection([d.value[0], d.value[1]]);
            }
            return "translate(" + coor[0] + "," + coor[1] + ")";
        });
}

// 数据转换，all 不返回数据
export function mapData(res) {
    "use strict";
    // 接口无有效数据时候，调用本地数据
    if (_.isUndefined(res) || _.isUndefined(res.body.data) || _.isUndefined(res.body.data.current)) {
        res.body.data.current = store.get("current")
    }

    store.set("current", res.body.data.current);

    // 省会及直辖市数据
    var capitals = store.session("capitals");

    var nanArr = [{
        "name": "南沙群岛",
        "coordinates": "112.019144,15.8"
    }];

    // 有效坐标数据，all 字段已无数据。过滤空数据。
    var cdc = _.filter(res.body.data.current, function (v) {
        return !_.isNull(v.coordinates) && !_.includes(nanhai, v.city) && v.city !== "未知";
    });
    // only 包含南海相关的数据(三沙，南沙群岛)
    // var nandc = _.filter(cdc, function (v, i) {
    //     return _.includes(nanhai, v.city)
    // });
    // 最小数量的数据
    var minCount = _.minBy(cdc, function (v) {
        "use strict";
        return v.count;
    }) || {
        count: 0
    };

    // 构造坐标数据
    var cityAll = _.map(cdc, function (v) {
        var l = _.map(v.coordinates.split(","), function (w) {
            return parseFloat(_.trim(w));
        });

        return {
            name: v.city,
            value: _.concat(l, [v.count])
        };
    });

    // 构造南沙群岛的坐标数据，如果没有统计数据，那么以最小数据赋值
    var nanData = _.map(nanArr, function (v, i) {
        var l = _.map(v.coordinates.split(","), function (w) {
            return parseFloat(_.trim(w));
        });

        return {
            name: v.name,
            value: _.concat(l, [minCount.count])
        }
    });

    //
    // var nanCurData = _.map(nandc, function (v, i) {
    //     var l = _.map(v.coordinates.split(","), function (w, k) {
    //         return parseFloat(_.trim(w));
    //     });
    //
    //     return {name: v.city, value: _.concat(l, [minCount.count])}
    // });

    // 从省会城市中去除南海的数据
    // capitals = _.filter(capitals, function (w, j) {
    //     return !_.includes(nanhai, w.name)
    // });

    // 构造省会城市的坐标数据，无统计的以最小数据赋值
    var cityCapitals = _.map(capitals, function (v) {
        var l = _.map(v.coordinates.split(","), function (w) {
            return parseFloat(_.trim(w));
        });

        return {
            name: v.name,
            value: _.concat(l, [0])
        }
    });

    cityCapitals = _.concat(nanData, cityCapitals);
    var cityData = [];
    var topCounts = [];

    // 显示全部省会城市
    if (config.capitals) {
        cityData = _.take(cityAll, config.mapCount);
        // 数据补全
        topCounts = _.unionBy(cityData, cityCapitals, 'name');
    } else {
        // 不显示全部
        cityData = _.unionBy(cityAll, cityCapitals, 'name');
        topCounts = _.take(cityData, config.mapCount);
    }

    topCounts = _.reverse(_.sortBy(topCounts, function (v) {
        return v.value[2];
    }));

    return {
        // nanData: nanData,
        // nanCurrent: nanCurData,
        cityCurrent: topCounts,
        cityCapitals: cityCapitals
    }
}

// 数据映射
export function xis(data) {
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
}

// 中国地图
export function tmap(opt, res) {
    "use strict";

    var capitals = store.session("capitals");
    var data = mapData(res, capitals);
    var s = d3.interpolate(d3.rgb(themes[config.theme].mapIndicatorStop2), d3.rgb(themes[config.theme].mapIndicatorStop1));

    var cur = data.cityCurrent;
    var xi = xis(cur);
    var top5 = _.take(cur, 5);

    var svg = opt.svg;
    var curRadial = opt.curRadial;
    var projection = opt.projection;
    var projection1 = opt.projection1;
    // var t = d3.transition().duration(750);
    var mean = _.floor(d3.mean(cur, function (v) {
        return v.value[2];
    }), 0);

    // 闪烁的圆圈
    var curUpdate = svg.selectAll(".current")
        .data(cur, function (d) {
            return d.name + d.value[2];
        });


    var curEnter = curUpdate.enter();

    curEnup(xi, curEnter, curUpdate, top5, curRadial, projection, projection1, s, mean, curExit.size(), curEnter.size());

    var curExit = curUpdate.exit()
        .attr("class", "exit")
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();


    var locUpdate = svg.selectAll(".location")
        .data(_.reverse(cur), function (d) {
            return d.name + d.value[2];
        });

    var locEnter = locUpdate.enter();

    eup(xi, locEnter, locUpdate, top5, projection, projection1, s, capitals);

    locUpdate.exit()
        .attr("class", "exit")
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();
}