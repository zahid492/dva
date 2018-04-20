$(function() {
    // 搜索指数30日变化
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
                    shadowColor: "#51A1FE",
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
                            color: '#51A1FE' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#59FEFE' // 100% 处的颜色
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
                            color: '#59FEFE' // 0% 处的颜色
                        }, {
                            offset: 0.35,
                            color: '#51A1FE' // 0% 处的颜色
                        }, {
                            offset: 0.75,
                            color: 'rgba(44,58,107, 0.1)' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    shadowColor: "rgba(86,227,253, 1)",
                    shadowBlur: 25,
                    opacity: 0.1,

                },
                itemStyle: {
                    color: function(series) {

                        return echarts.color.lerp(series.dataIndex / 7, ["#51A1FE", '#59FEFE'], false)
                    },
                    // borderWidth: 1
                },
                smooth: true,

                data: [520, 632, 701, 834, 790, 630, 520]
            }
        ]
    };


    myChart.setOption(option);

})