$(function() {
    // 曝光量变化趋势
    console.log(echarts)
    var myChart = echarts.init($("#main")[0]);
    option = {
        // title: {
        //     text: '堆叠区域图'
        // },
        silent: false,
        animationDuration: 2000,
        // tooltip: {
        //     trigger: 'axis',
        //     alwaysShowContent: true,
        //     backgroundColor: 'rgba(255,255,255, 0.6)',
        //     textStyle: {
        //         color: "000"
        //     },
        //     axisPointer: {
        //         type: 'cross',
        //         label: {
        //             backgroundColor: '#6a7985',
        //         }
        //     },
        //     padding: [5, 10],

        //     formatter: function(param) {
        //         return param[0].axisValue + "<br/>" + param[0].seriesName + ": " + param[0].value + "<br/>" + param[1].seriesName + ": " + param[1].value
        //     }
        // },
        legend: {
            left: "center",
            itemGap: 30,
            textStyle: {
                color: "#fff",
                lineHeight: 30,

            },
            data: [{
                name: '直接访问',
                textStyle: {
                    color: "#fff",
                    padding: 10,
                    width: 200,
                    height: 30,
                }
            }, {
                name: '搜索引擎',
                // 渐变图只能用图片
                icon: "path://M 103 144 C 107.1667 145.3333 119.8333 154.8333 128 152 C 136.1667 149.1667 145.5 136.3333 152 127 C 158.5 117.6667 162.6667 96.83333 167 96 C 182.4999 129 187.5 139.8333 194 138",
                textStyle: {
                    color: "green",
                    padding: 10,
                    width: 200,
                    height: 30,
                }
            }]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            // boundaryGap: true,
            boundaryGap: ['20%', '20%'],
            scale: true,
            axisLabel: {
                color: "#fff"
            },
            splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                    color: '#445478'
                }
            },
            axisPointer: {
                lineStyle: {
                    type: "dashed"
                },
            },

            data: ['2018.01.01', '2018.01.02', '2018.01.03', '2018.01.04', '2018.01.05', '2018.01.06', '2018.01.07']
        }],
        yAxis: [{
            name: "单位(次)",
            nameTextStyle: {
                color: "#fff"
            },
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: "#445478"
                }
            },
            axisLabel: {
                color: "#fff"
            },
            splitLine: {
                interval: 0,
                lineStyle: {
                    color: '#445478'
                }
            },
            axisPointer: {
                show: false
            }
        }],
        series: [{
                name: '直接访问',
                type: 'line',
                symbol: "circle",
                symbolSize: function(value, series) {
                    // console.log(value, series)
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
                    shadowColor: "#FE313E",
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
                            color: '#FE313E' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#FE8CFE' // 100% 处的颜色
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
                            color: '#FE8CFE' // 0% 处的颜色
                        }, {
                            offset: 0.35,
                            color: '#FE313E' // 0% 处的颜色
                        }, {
                            offset: 0.75,
                            color: 'rgba(44,58,107, 0.1)' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    shadowColor: "rgba(240,58,76, 1)",
                    shadowBlur: 25,
                    opacity: 0.1,

                },
                itemStyle: {
                    color: function(series) {

                        return echarts.color.lerp(series.dataIndex / 7, ["#FE313E", '#FE8CFE'], false)
                    },
                    // borderWidth: 1
                },
                smooth: true,

                data: [520, 632, 701, 834, 790, 630, 520]
            },
            {
                name: '搜索引擎',
                type: 'line',
                symbol: "circle",
                symbolSize: function(value, series) {
                    // console.log(value, series)
                    if (series.dataIndex == 0) {
                        return 10
                    }

                    if (series.value == 790) {
                        return 10
                    }

                    return 4
                },
                // showSymbol: false,
                // showAllSymbol: true,
                lineStyle: {
                    width: 4,
                    shadowColor: "#92BCEE",
                    shadowBlur: 45,
                    shadowOffsetX: 5,
                    shadowOffsetY: 5,
                    opacity: 1,

                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0,
                            color: '#92BCEE',
                            offset: 1,
                            color: '#40FCB0' // 100% 处的颜色
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
                            color: '#40FCB0' // 0% 处的颜色
                        }, {
                            offset: 0.35,
                            color: '#92BCEE' // 0% 处的颜色
                        }, {
                            offset: 0.75,
                            color: 'rgba(44,58,107, 0.1)' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    shadowColor: "rgba(67,250,180, 1)",
                    shadowBlur: 45,
                    opacity: 0.1,

                },

                itemStyle: {
                    color: function(series) {

                        return echarts.color.lerp(series.dataIndex / 7, ["#92BCEE", '#40FCB0'], false)
                    },
                    borderWidth: 1
                },
                smooth: true,
                data: [{
                        value: 1320
                    },
                    932, 901, 934, 990, 830, 790
                ]
            }
        ]
    };


    myChart.setOption(option);
})