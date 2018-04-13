$(function() {
    console.log(echarts)
    var myChart = echarts.init($("#main")[0]);

    option = {
        backgroundColor: '#142058',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },

        tooltip: {
            show: "true",
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.7)', // 背景
            padding: [8, 10], //内边距
            extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
            formatter: function(params) {
                if (params.seriesIndex == "3" || params.seriesIndex == "4" || params.seriesIndex == "5") {
                    return params.name + '<br>' + params.seriesName + ' ： 第 ' + params.value + ' 名';
                }
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 30,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#363e83 ',
                }
            },
            axisLabel: {
                color: 'rgb(170,170,170)',
                formatter: function(v, i){
                    if(i === 0){
                        return v;
                    }
                    return v + "%"
                },
                fontWeight: 'normal',
                fontSize: '12',

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
                        color: '#363e83',
                    }
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#fff',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                },
                data: ['11', '22', '33']
            }

        ],
        series: [{
                name: '男',
                type: 'bar',
                label: {
                    show: true,
                    position: 'top',
                    padding: 10,
                    color: '#2979ff',
                    fontSize: 14,
                    formatter: '{c}%'
                },

                zlevel: 2,
                barWidth: '10%',
                data: [{
                    value: 10,
                    itemStyle: {

                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#f7734e'
                        }, {
                            offset: 1,
                            color: '#e12945'
                        }]),
                        barBorderRadius: 50,
                        borderWidth: 0,

                    },
                },{
                    value: 10,
                    itemStyle: {

                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#f0734e'
                        }, {
                            offset: 1,
                            color: '#e01295'
                        }]),
                        barBorderRadius: 50,
                        borderWidth: 0,

                    },
                },{
                    value: 10,
                    itemStyle: {

                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
            }

        ]
    };
    myChart.setOption(option);





})