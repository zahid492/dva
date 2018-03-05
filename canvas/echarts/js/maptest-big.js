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
var max = 480,
    min = 9; // todo
var maxSize4Pin = 100,
    minSize4Pin = 20;

var data = [{
    name: "北京",
    value: 38
}, {
    name: "南京",
    value: 147
}, {
    name: "吉林",
    value: 74
}, {
    name: "上海",
    value: 33
}, {
    name: "成都",
    value: 192
}, {
    name: "哈尔滨",
    value: 35
}, {
    name: "沈阳",
    value: 0
}, {
    name: "武汉",
    value: 36
}, {
    name: "石家庄",
    value: 32
}, {
    name: "天津",
    value: 7
}, {
    name: "太原",
    value: 1
}, {
    name: "西安",
    value: 63
}, {
    name: "南宁",
    value: 29
}, {
    name: "南昌",
    value: 48
}, {
    name: "济南",
    value: 61
}];

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
// console.log(convertData(data))
// 降序
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
                value: gv
            };
        }
    })
};

console.log(pinData(data))
var convertedData = [
    convertData(data),
    convertData(data.sort(function(a, b) {
        return b.value - a.value;
    }).slice(0, 6))
];
data.sort(function(a, b) {
    return a.value - b.value;
})

var selectedItems = [];
var categoryData = [];
var barData = [];
//   var maxBar = 30;
var sum = 0;
var count = data.length;
for (var i = 0; i < data.length; i++) {
    categoryData.push(data[i].name);
    barData.push(data[i].value);
    sum += data[i].value;
}
console.log(categoryData);
console.log(sum + "   " + count)
option = {
    backgroundColor: '#404a59',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',
    title: [{
        text: '全国主要城市 业务量',
        subtext: '内部数据请勿外传',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    }],
    brush: {
        outOfBrush: {
            color: '#abc'
        },
        brushStyle: {
            borderWidth: 2,
            color: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(0,0,0,0.5)',
        },
        seriesIndex: [0, 1],
        throttleType: 'debounce',
        throttleDelay: 300,
        geoIndex: 0
    },
    geo: {
        map: 'china',
        left: '10',
        // right: '35%',
        center: [76.18561551896913, 35.205000490896193],
        zoom: 1,
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    tooltip: {
        trigger: 'item'
    },
    grid: {
        // right: 0,
        top: 30,
        bottom: 0,
        width: '30%'
    },
    series: [{
            // name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertedData[0],
            symbolSize: function(val) {
                return Math.max(val[2] / 10, 8);
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#ddb926',
                    position: 'right',
                    show: true
                }
            }
        },
        {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: function(val) {
                return 50;
                // return 40+50/(val[2]+val[2]*0.3);
            },
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: 9,
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#F62157', //标志颜色
                }
            },
            zlevel: 6,
            data: pinData(data),
        },
        {
            //  name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertedData[0],
            symbolSize: function(val) {
                return Math.max(val[2] / 10, 4);
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#f4e925',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }
    ]
};

// 重绘影响缩放，固定大小等于。
var myChart = echarts.init(document.getElementById('main'));
myChart.setOption(option);

var zrd = myChart.getZr()
// var zr = zrender.init(document.getElementById('main'));
console.log(myChart, zrd)

var txt = new zrender.Text({
    position:[100, 100],
    style: {
        text: "xxxx",
        fontSize: '50',
        color: 'red'
    }
});

zrd.add(txt);
// setInterval(function() {
//     option.title[0].text = new Date();
//     option.title[0].subtext = "sub " + new Date();
//     myChart.setOption(option);
// }, 1000)