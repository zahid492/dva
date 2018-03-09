var KeywordsList = [{ "Frequency": 0.39380455868089231, "Word": "小米" }, { "Frequency": 0.15363738010561481, "Word": "手机" }, { "Frequency": 0.10969366311024895, "Word": "雷军" }, { "Frequency": 0.0806303211552969, "Word": "MIUI" }, { "Frequency": 0.078468180838452417, "Word": "小米电视" }, { "Frequency": 0.070729415885332464, "Word": "米家" }, { "Frequency": 0.0702915993102705, "Word": "全面屏" }, { "Frequency": 0.0659038150662787, "Word": "华为" }, { "Frequency": 0.060159284405647162, "Word": "MIX" }, { "Frequency": 0.050404892768617308, "Word": "红米" }, { "Frequency": 0.04573757948054747, "Word": "小米之家" }, { "Frequency": 0.04620112619894385, "Word": "印度" }, { "Frequency": 0.03000891798685203, "Word": "Note" }, { "Frequency": 0.028880940834141611, "Word": "性价比" }, { "Frequency": 0.027840526996443581, "Word": "生态" }, { "Frequency": 0.025321882745985558, "Word": "销量" }, { "Frequency": 0.02398173294536049, "Word": "配置" }, { "Frequency": 0.021840284513417393, "Word": "山寨" }, { "Frequency": 0.015614640586270072, "Word": "手环" }, { "Frequency": 0.014584330207996552, "Word": "价格" }, { "Frequency": 0.013473192154326975, "Word": "出货量" }, { "Frequency": 0.0094496174156697924, "Word": "占有率" }, { "Frequency": 0.0094327783166289463, "Word": "全球" }, { "Frequency": 0.0093788931996982433, "Word": "市场" }
, { "Frequency": 0.0023788931996982433, "Word": "市场11" }, { "Frequency": 0.0093788931996982433, "Word": "市场44" }
, { "Frequency": 0.0043788931996982433, "Word": "市场2222" }, { "Frequency": 0.0293788931996982433, "Word": "市场444" }
, { "Frequency": 0.0195788931996982433, "Word": "市场333" }, { "Frequency": 0.0053788931996982433, "Word": "市场555" }
, { "Frequency": 0.0193788931996982433, "Word": "市场44555" }, { "Frequency": 0.0063788931996982433, "Word": "市场5555" }
];

// 词云
var kwords = _.map(KeywordsList, function(v, i) {
    v.value = v.Frequency * 1400;
    v.name = v.Word;
    if (i === 0) {
        v.textStyle = {
            normal: {
                color: '#C1232B'
            }
        };
    }

    return v;
});
var ww = $("#main");
var kww = ww.width();

var chart = echarts.init(ww[0]);

var option = {
    grid: {
        top: 40,
        bottom: 40
    },
    tooltip: {
        show: false,
    },
    series: [{
        type: 'wordCloud',
        gridSize: 8,
        shape: "rect",

        sizeRange: [14, 62],
        rotationRange: [-90, 90],
        rotationStep: 45,
        width: kww,
        height: kww,
        drawOutOfBound: false,
        textStyle: {
            normal: {
                color: function() {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: kwords,
    }]
};

chart.setOption(option);
setTimeout(function(){
    var cv = $("#main").find("canvas")
    cv.on("wordcloudstart", function(e){
        console.log("wordcloudstart", e)
    })


    console.log(cv)
    console.log(chart.getDom())
}, 30)
