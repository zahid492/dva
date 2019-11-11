import {configs, themes} from "../config/config";
import {jb} from "../plugs/tbase";


var config = configs;
// 3 曝光环比增长
export function bar3(opt) {
    var ins = echarts.getInstanceByDom(opt.dom);
    if (ins && !ins.isDisposed()) {
        ins.dispose();
    }

    var myChart = echarts.init(opt.dom);

    var option = {
        // backgroundColor: '#303C69',
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
                    color: themes[config.theme].bar3SplitLineColor,
                }
            },
            axisLabel: {
                color: themes[config.theme].legend21TextColor,
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
                    color: themes[config.theme].bar3SplitLineColor,
                }
            },
            axisLabel: {
                inside: false,
                textStyle: {
                    color: themes[config.theme].legend21TextColor,
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
                color: themes[config.theme].legend21TextColor,
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
                        color: themes[config.theme].color2Line3[0][0]
                    }, {
                        offset: 1,
                        color: themes[config.theme].color2Line3[0][1]
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
                        color: themes[config.theme].color3Line[1][1]
                    }, {
                        offset: 1,
                        color: themes[config.theme].color3Line[1][0]
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
                        color: themes[config.theme].color3Line[2][1]
                    }, {
                        offset: 1,
                        color: themes[config.theme].color3Line[2][0]
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
export function trend3(opt) {
    var ins = echarts.getInstanceByDom(opt.dom);
    if (ins && !ins.isDisposed()) {
        ins.dispose();
    }

    var legend = [];
    var gdate = [];
    var series = _.map(opt.data, function (v, i) {
        legend.push({
            name: v.medianame,
            icon: 'image://' + themes[config.theme].legend21Img[i],
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
                        color: themes[config.theme].color3Line[i][0]
                    }, {
                        offset: 1,
                        color: themes[config.theme].color3Line[i][1] // 100% 处的颜色
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
                        color: themes[config.theme].color3Line[i][1] // 0% 处的颜色
                    }, {
                        offset: 0.35,
                        color: themes[config.theme].color3Line[i][0] // 0% 处的颜色
                    }, {
                        offset: 0.75,
                        color: themes[config.theme].trend3StopColor// 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
                // shadowColor: "rgba(240,58,76, 1)",
                // shadowBlur: 25,
                opacity: 0.1,

            },
            itemStyle: {
                color: function (series) {
                    return echarts.color.lerp(series.dataIndex / 7, themes[config.theme].color3Line[i], false)
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
                color: themes[config.theme].legend21TextColor,
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
                color: themes[config.theme].legend21TextColor,
            },
            axisLine: {
                show: true,
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

            data: gdate
        }],
        yAxis: [{
            name: "单位\n(次)",
            nameTextStyle: {
                color: themes[config.theme].legend21TextColor,
            },
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: themes[config.theme].xyLineColor
                }
            },
            axisLabel: {
                color: themes[config.theme].legend21TextColor,
            },
            splitLine: {
                interval: 1,
                lineStyle: {
                    color: themes[config.theme].xyLineColor
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