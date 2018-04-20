option = {
    backgroundColor: '#404a59',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',

    geo: {
        map: '海南',
        left: 'center',
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
};

// 重绘影响缩放，固定大小等于。
var myChart = echarts.init(document.getElementById('main'));
myChart.setOption(option);

console.log( JSON.stringify(echarts.getMap("china")) )

