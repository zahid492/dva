$(function() {
    console.log(echarts)
    var myChart = echarts.init($("#main")[0]);
    option = {
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
                // 渐变图只能用图片 'image://url'
                icon: "path://m 34.773809,146.56548 c 1.262568,-4.28638 2.522487,-8.57011 3.779763,-12.8512 3.530423,-7.31018 7.0582,-14.61772 10.583333,-21.92261 13.357805,4.53306 26.712963,9.06878 40.065476,13.60714 7.814153,-15.1217 15.625659,-30.240743 23.434519,-45.357143 4.79035,-0.506616 9.57805,-1.010584 14.3631,-1.511906 3.02645,3.021163 6.05026,6.044972 9.07143,9.071427 3.02645,4.281086 6.05026,8.564817 9.07143,12.851192",
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
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
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
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
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

    const myoption = myChart.getOption();

    myChart.on('mouseover', function(params) {
        console.log("clear:", params);
        // window.clearInterval(timer);
    });


})