// 显示的文字数字等大小都要通过屏幕比率来动态计算
// http://www.echartsjs.com/gallery/editor.html?c=map-usa 着色通过 visualMap

// 当日新进用户数量
var tip = [3, 2, 1, 5, 6];
// 各城市 geo 坐标
var geoCoordMap = {
    "北京": [116.46, 39.92],
    "南京": [118.78, 32.04],
    "吉林": [126.57, 43.87],
    "上海": [121.48, 31.22],
    "成都": [104.06, 30.67],
    "哈尔滨": [126.63, 45.75],
    "沈阳": [123.38, 41.8],
    // "合肥":[117.27,31.86],
    "武汉": [114.31, 30.52],
    "石家庄": [114.48, 38.03],
    "天津": [117.2, 39.13],
    "太原": [112.53, 37.87],
    "西安": [108.95, 34.27],
    "南宁": [108.33, 22.84],
    "南昌": [115.89, 28.68],
    "济南": [117, 36.65],
};
// 各城市新进用户数
var data = [{ name: "北京", value: 38 }, { name: "南京", value: 147 }, { name: "吉林", value: 74 }, { name: "上海", value: 33 }, { name: "成都", value: 192 }, { name: "哈尔滨", value: 35 }, { name: "沈阳", value: 0 }, { name: "武汉", value: 36 }, { name: "石家庄", value: 32 }, { name: "天津", value: 7 }, { name: "太原", value: 1 }, { name: "西安", value: 63 }, { name: "南宁", value: 29 }, { name: "南昌", value: 48 }, { name: "济南", value: 61 }];
// 新进城市坐标数据
var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};
// 降序5个水滴坐标数据
var pinData = function(data) {
    var ndata = _.concat([], data);
    var bdata = _.take(_.sortBy(data, function(v) {
        return -v.value;
    }), 5);

    return _.map(bdata, function(v, i) {
        var geoCoord = geoCoordMap[v.name];
        var gv = geoCoord.concat(v.value);
        gv[2] = i + 1;

        if (geoCoord) {

            return {
                name: v.name,
                value: gv,
            };
        }
    })
};
// 左侧5个最多新进城市柱状图数据
var leftBarData = _.reverse(_.map(pinData(data), function(v) {
    var p = _.find(data, { name: v.name });
    return {
        name: v.name,
        value: p.value
    }
}));
// 柱状图最大数据
var leftBarMaxValue = _.find(data, { name: pinData(data)[0].name }).value * 1.10;

// 左侧5个最多新进城市柱状图最大数据
var leftBarBgData = _.reverse(_.map(pinData(data), function(v) {
    var p = _.find(data, { name: v.name });
    return {
        name: v.name,
        value: leftBarMaxValue,
        labelValue: p.value
    }
}));
// 左侧5个最多新进城市柱状图Y轴坐标数据
var leftBarYAxisData = _.reverse(_.map(pinData(data), function(v) {
    return v.name
}));
// 数据汇总
var cvData = {
    njCityData: convertData(data),
    pinCityData: pinData(data),
    leftBarData: leftBarData,
    leftBarBgData: leftBarBgData,
    leftBarYAxisData: leftBarYAxisData,
};
// 获取区域宽高，作为祖先
var gWidth = $("#main").width();
var gHeight = $("#main").height();
option = {
    backgroundColor: '#404a59',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',
    title: [{

    }, {
        text: '全国主要城市 业务量',
        left: 'center',
        top: gHeight * 0.12,
        textStyle: {
            fontSize: gWidth / 100,
            color: '#fff'
        }
    }],
    xAxis: [{
        gridIndex: 0,
        show: false,
    }, {
        gridIndex: 1,
        show: false,
        type: 'category',
        // type: 'value',
        // scale: true,
        // position: 'top',
        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
    }, {
        gridIndex: 3,
        show: false,
        type: 'value',
        splitLine: {
            show: false
        },
    }],
    yAxis: [{
        gridIndex: 0,
        show: false,
    }, {
        gridIndex: 1,
        show: false,
    }, {
        show: true,
        gridIndex: 3,
        type: 'category',
        boundaryGap: true,
        axisLine: false,
        axisLabel: {
            color: "#fff"
        },
        splitLine: {
            show: false
        },
        data: leftBarYAxisData
    }, {
        show: false,
        gridIndex: 3,
        type: 'category',
        boundaryGap: true,
        axisLine: false,
        axisLabel: {
            fontSize: gWidth * 0.008,
            color: "#fff"
        },
        splitLine: {
            show: false
        },
        data: leftBarYAxisData
    }],
    geo: {
        map: 'china',
        left: 'center',
        zoom: 1,
        emphasis: {
            label: {
                show: false
            },
            itemStyle: {
                areaColor: '#2a333d'
            }
        },
        roam: false,
        itemStyle: {
            areaColor: '#323c48',
            borderColor: '#111'
        }
    },
    grid: [{
        // 城市
        top: gHeight * 0.05,
        bottom: 0,
        tooltip: {
            trigger: 'item'
        },
    }, {
        // 顶部正中数字柱状图
        borderWidth: 0,
        left: "center",
        top: gHeight * 0.05,
        width: gWidth * 0.1,
        height: gHeight * 0.06,
        textStyle: {
            color: "#fff"
        },
        tooltip: {
            show: false
        },
    }, {
        // 顶部正中数字下白线
        show: true,
        borderWidth: gHeight * 0.001,
        borderColor: "#fff",
        left: "center",
        top: gHeight * 0.12,
        width: gWidth * 0.12,
        height: gHeight * 0.001,
        textStyle: {
            color: "#fff"
        },
        tooltip: {
            show: false
        },
    }, {
        // 左侧柱状图
        show: true,
        borderWidth: 0,
        // borderColor: "#f00",
        x: '5%',
        y: '10%',
        width: '20%',
        height: '80%'
    }],
    graphic: [{
        type: 'group',
        left: '10%',
        bottom: 20,
        children: [{
                type: 'image',
                id: 'logo',
                left: gWidth * 0.01,
                top: 0,
                z: 0,
                bounding: 'all',
                style: {
                    image: 'http://echarts.baidu.com/images/favicon.png',
                    width: gWidth * 0.02,
                    height: gWidth * 0.02,
                    opacity: 0.8
                }
            },
            {
                type: 'text',
                z: 100,
                left: gWidth * 0.035,
                top: gWidth * 0.005,
                style: {
                    fill: '#fff',
                    text: '闪星代表用户注册的位置，闪星大小代表注册人数多少',
                    fontSize: gWidth * 0.008,
                    fontFamily: 'Microsoft YaHei'
                }
            }
        ]
    }],
    series: [{
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: '城市',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: cvData.njCityData,
            symbolSize: function(val) {
                return Math.max(val[2] / 10, 8);
            },
            label: {
                formatter: '{b}',
                position: 'right',
                color:"#fff",
                fontSize: gWidth*0.005,
                show: true
            },
            itemStyle: {
                color: '#ff6600',
                position: 'right',
                show: true
            },
            emphasis: {
                label: {
                    show: true
                }
            }
        },
        {
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: '城市水滴',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: function(val) {
                return gWidth * 0.025;
                // return 40+50/(val[2]+val[2]*0.3);
            },
            label: {
                show: true,
                color: '#fff',
                fontSize: gWidth * 0.006,
                formatter: function(params) {
                    return params.data.value[2]
                }
            },
            itemStyle: {
                color: '#F62157', //标志颜色
            },
            zlevel: 6,
            data: cvData.pinCityData,
        },
        {
            // 这里需要通过轮询，动态展示
            name: "lian",
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: "涟漪标记",
            type: 'effectScatter',
            coordinateSystem: 'geo',

            data: cvData.pinCityData,
            symbol: "path://M 100 100 L 300 100 L 200 300 z",
            symbolSize: function(val) {
                return Math.max(gWidth*0.02/val[2], gWidth*0.008);
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                show: false
            },
            itemStyle: {
                color: '#f4e925',
                shadowBlur: 10,
                shadowColor: '#333'
            },
            zlevel: 1
        },
        {
            name: "数字",
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: "bar",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
                color: "#fff",
            },
            label: {
                show: true,
                color: "#000",
                fontSize: gWidth * 0.015,
                position: "inside",
                formatter: function(p) {
                    return tip[p.dataIndex];
                }
            },
            data: [
                1, 1, 1, 1, 1
            ],
        },
        {
            name: 'bar 显示各城市新进',
            type: 'bar',
            smooth: true,
            barCategoryGap: 25,
            xAxisIndex: 2,
            yAxisIndex: 2,
            barWidth: '35%',
            itemStyle: {
                color: '#86c9f4'
            },
            label: {
                show: false,
            },
            data: cvData.leftBarData,
            zlevel: 1
        },
        {
            name: 'bar 显示各城市新进背景',
            type: 'bar',
            smooth: true,
            barCategoryGap: 25,
            xAxisIndex: 2,
            yAxisIndex: 3,
            barWidth: '35%',
            itemStyle: {
                color: '#ff5504'
            },
            label: {
                show: true,
                position: "right",
                fontSize: gWidth * 0.008,
                color: "#fff",
                formatter: function(params) {
                    console.log(params)
                    return params.data.labelValue;
                }
            },
            data: cvData.leftBarBgData,
            zlevel: 0
        },
    ]
};

// 重绘影响缩放，固定大小等于。
var myChart = echarts.init(document.getElementById('main'));
myChart.setOption(option);

// setInterval(function() {
//     option.title[0].text = new Date();
//     option.title[0].subtext = "sub " + new Date();
//     myChart.setOption(option);
// }, 1000)