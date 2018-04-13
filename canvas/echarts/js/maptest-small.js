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
var data = [{ name: "北京", value: 138 }, { name: "南京", value: 147 }, { name: "吉林", value: 74 }, { name: "上海", value: 133 }, { name: "成都", value: 192 }, { name: "哈尔滨", value: 35 }, { name: "沈阳", value: 0 }, { name: "武汉", value: 36 }, { name: "石家庄", value: 32 }, { name: "天津", value: 7 }, { name: "太原", value: 1 }, { name: "西安", value: 163 }, { name: "南宁", value: 29 }, { name: "南昌", value: 48 }, { name: "济南", value: 61 }];


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

var topData = pinData(data)

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

var rsData = _.reverse(_.sortBy(convertData(data), function(v, i) {
    return v.value[2]
}));

var top5 = _.take(rsData, 5);

var xi = d3.extent(_.map(data, "value"));

var fontSize = d3.scaleLinear()
    .domain(xi)
    .range([8, 18]);

var circleRadius = d3.scaleLinear()
    .domain(xi)
    .range([5, 30]);


var xdomain = d3.scaleLinear()
    .domain(xi)
    .range([0, 1])

var s = d3.interpolate(d3.rgb(249, 214, 0), d3.rgb(250, 81, 0))

// 获取区域宽高，作为祖先
var gWidth = $("#main").width();
var gHeight = $("#main").height();

var xi = d3.extent(_.map(data, "value"))

var xdomain = d3.scaleLinear()
    .domain(xi)
    .range([0, 1])

var s = d3.interpolate(d3.rgb(249, 214, 0), d3.rgb(250, 81, 0))

option = {
    backgroundColor: '#2E3A6A',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',

    xAxis: [{
        gridIndex: 0,
        show: false,
    }],
    yAxis: [{
        gridIndex: 0,
        show: false,
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
            borderColor: '#5A77D3',
            borderWidth: 2,
            shadowBlur: 50,
            shadowColor: 'rgba(79,109,219,0.2)'
        }
    },
    grid: [{
        // 城市
        top: gHeight * 0.05,
        bottom: 0,
        tooltip: {
            trigger: 'item'
        },
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
            name: 'Top 5',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'circle',
            symbolSize: function(d) {
                return circleRadius(d[2]);
            },
            label: {
                show: true,
                color: '#fff',
                fontSize: 12,
                fontWeight: "bold",
                formatter: function(d) {
                    if (_.findIndex(top5, function(v) {
                            return v.name === d.name
                        }) > -1) {
                        return d.dataIndex + 1
                    }
                    return ""
                }
            },
            itemStyle: {
                color: function(params) {
                    return s(xdomain(params.value[2])).toString()
                },
            },
            zlevel: 6,
            data: rsData,
        }, {
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: '城市',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: rsData,
            symbolSize: function(d) {
                return circleRadius(d[2]);
            },
            label: {
                color: "#fff",
                position: 'bottom',
                fontWeight: "bold",
                shadowColor: "rgba(0,0,0, 0.5)",
                shadowBlur: 4,
                fontFamily:"黑体",
                fontSize: function(d) {
                    console.log(d)
                    return fontSize(d[2]);
                },
                formatter: function(p) {
                    return p.name
                },
                show: true
            },
            itemStyle: {
                color: function(params) {
                    return s(xdomain(params.value[2])).toString()
                },
                position: 'bottom',
                show: true
            },
            emphasis: {
                label: {
                    show: true
                }
            },
            // zlevel:10

        },

        // {
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //     name: '城市水滴',
        //     type: 'scatter',
        //     coordinateSystem: 'geo',
        //     symbol: 'pin',
        //     symbolSize: function(val) {

        //         return gWidth * 0.025;
        //         // return 40+50/(val[2]+val[2]*0.3);
        //     },
        //     label: {
        //         show: true,
        //         color: '#fff',
        //         fontSize: gWidth * 0.006,
        //         formatter: function(params) {
        //             return params.data.value[2]
        //         }
        //     },
        //     itemStyle: {
        //         color: '#F62157', //标志颜色
        //     },
        //     zlevel: 6,
        //     data: cvData.pinCityData,
        // },
        // {
        //     // 这里需要通过轮询，动态展示
        //     name: "lian",
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //     name: "涟漪标记",
        //     type: 'effectScatter',
        //     coordinateSystem: 'geo',

        //     data: cvData.pinCityData,
        //     // symbol: "path://M 100 100 L 300 100 L 200 300 z",
        //     symbolSize: function(val) {
        //         return Math.max(gWidth*0.02/val[2], gWidth*0.008);
        //     },
        //     showEffectOn: 'render',
        //     rippleEffect: {
        //         brushType: 'stroke'
        //     },
        //     hoverAnimation: true,
        //     label: {
        //         show: false
        //     },
        //     itemStyle: {
        //         color: '#f4e925',
        //         shadowBlur: 10,
        //         shadowColor: '#333'
        //     },
        //     zlevel: 1
        // },

    ]
};

// 重绘影响缩放，固定大小等于。
var myChart = echarts.init(document.getElementById('main'));
myChart.setOption(option);
console.log(echarts, myChart)
// setInterval(function() {
//     option.title[0].text = new Date();
//     option.title[0].subtext = "sub " + new Date();
//     myChart.setOption(option);
// }, 1000)