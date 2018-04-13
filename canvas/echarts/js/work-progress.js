$(function() {
    console.log(echarts)
    var myChart = echarts.init($("#main")[0]);

    function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }

        return x1 + x2;
    }

    option = {
        backgroundColor: '#142058',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 140000,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },

        },
        yAxis: [{
                type: 'category',
                name: "媒体 昨日曝光",
                nameTextStyle: {
                    color:"#57EFFE",
                    fontSize: 14,
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    inside: false,
                    padding: [0, 100, 0, 0],

                    textStyle: {
                        color: '#fff',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                },
                data: ['今日头条', '百度', '腾讯新闻']
            }

        ],
        series: [{
                name: '男',
                type: 'bar',
                label: {
                    show: true,
                    position: 'top',
                    padding: 10,
                    formatter: function(p) {
                        var v = addCommas(p.value);
                        return ['{value|' + v + '}', '{unit|(次)}'].join(" ")
                    },
                    rich: {
                        value: {
                            color: "#fff",
                            fontSize: 14,
                        },
                        unit: {
                            color: "#ddd",
                            fontSize: 10
                        }
                    }
                },

                zlevel: 2,
                barWidth: '10%',
                data: [{
                    value: 110210,
                    itemStyle: {

                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#f7734e'
                        }, {
                            offset: 1,
                            color: '#e12945'
                        }]),
                        barBorderRadius: 50,
                        borderWidth: 0,

                    },
                }, {
                    value: 100120,
                    itemStyle: {

                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#f0734e'
                        }, {
                            offset: 1,
                            color: '#e01295'
                        }]),
                        barBorderRadius: 50,
                        borderWidth: 0,

                    },
                }, {
                    value: 111233,
                    itemStyle: {

                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#0f7f4e'
                        }, {
                            offset: 1,
                            color: '#e12f45'
                        }]),
                        barBorderRadius: 50,
                        borderWidth: 0,
                        // 取中间色值即可
                        shadowColor: 'rgba(69,106,76, 0.2)',

                        shadowBlur: 20,
                        shadowOffsetX: 20,
                        shadowOffsetY: -5,
                    },
                }]
            }, {
                type: 'bar',
                label: {
                    show: false
                },

                zlevel: 0,
                barWidth: '10%',
                barGap: '-100%',
                itemStyle: {
                    show: true,
                    color: '#1A2A65',
                    barBorderRadius: 50,
                    borderWidth: 0,

                },
                data: [140000, 140000, 140000]
            }

        ]
    };
    myChart.setOption(option);





})