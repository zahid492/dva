var KeywordsList = [{ "Frequency": 0.34380455868089231, "Word": "小米" }, { "Frequency": 0.15363738010561481, "Word": "手机" }, { "Frequency": 0.10969366311024895, "Word": "雷军" }, { "Frequency": 0.0806303211552969, "Word": "MIUI" }, { "Frequency": 0.078468180838452417, "Word": "小米电视" }, { "Frequency": 0.070729415885332464, "Word": "米家" }, { "Frequency": 0.0702915993102705, "Word": "全面屏" }, { "Frequency": 0.0659038150662787, "Word": "华为" }, { "Frequency": 0.060159284405647162, "Word": "MIX" }, { "Frequency": 0.050404892768617308, "Word": "红米" }, { "Frequency": 0.04573757948054747, "Word": "小米之家" }, { "Frequency": 0.04620112619894385, "Word": "印度" }, { "Frequency": 0.03000891798685203, "Word": "Note" }, { "Frequency": 0.028880940834141611, "Word": "性价比" }, { "Frequency": 0.027840526996443581, "Word": "生态" }, { "Frequency": 0.025321882745985558, "Word": "销量" }, { "Frequency": 0.02398173294536049, "Word": "配置" }, { "Frequency": 0.021840284513417393, "Word": "山寨" }, { "Frequency": 0.015614640586270072, "Word": "手环" }, { "Frequency": 0.014584330207996552, "Word": "价格" }, { "Frequency": 0.013473192154326975, "Word": "出货量" }, { "Frequency": 0.0094496174156697924, "Word": "占有率" }, { "Frequency": 0.0094327783166289463, "Word": "全球" }, { "Frequency": 0.0093788931996982433, "Word": "市场" }];

function random_hsl_color(min, max) {
    return 'hsl(' +
        (Math.random() * 360).toFixed() + ',' +
        (Math.random() * 30 + 70).toFixed() + '%,' +
        (Math.random() * (max - min) + min).toFixed() + '%)';
}

function getRandomDarkColor() {
    return random_hsl_color(10, 50);
};

function getRandomLightColor() {
    return random_hsl_color(50, 90);
};


$(function() {
    var $canvasContainer = $('#canvas-container');
    var $box = $('<div id="box" hidden />');
    $canvasContainer.append($box);

    var $canvas = $('#canvas');

    var width = $('#canvas-container').width();
    var height = Math.floor(width * 0.65);
    var pixelWidth = width;
    var pixelHeight = height;
    var devicePixelRatio = 1;

    if (('devicePixelRatio' in window) && window.devicePixelRatio !== 1) {
        devicePixelRatio = window.devicePixelRatio;
    }

    if (devicePixelRatio !== 1) {
        $canvas.css({ 'width': width + 'px', 'height': height + 'px' });

        pixelWidth *= devicePixelRatio;
        pixelHeight *= devicePixelRatio;
    } else {
        $canvas.css({ 'width': '', 'height': '' });
    }

    $canvas.attr('width', pixelWidth);
    $canvas.attr('height', pixelHeight);

     var list = _.map(KeywordsList, function(v) {
        return [v.Word, v.Frequency * 450]
    });

    var options = {
        list: list,
        gridSize: 10,
        drawOutOfBound: false,
        // 控制文字大小

        weightFactor: function weightFactor(weight) {
            return weight * 1 > 60 ? 60 : (weight * 1 < 10 ? 10 : weight * 1);
        },
        // 小于minSize 都不显示，过滤器
        minSize: 2,
        fontFamily: '黑体',
        // color: 'random-dark',
        color: function(word, weight, fontSize, distance, theta) {

            if (word === "小米") {
                return "#f00"
            }
            return getRandomDarkColor()
        },
        rotateRatio: 0,
         rotationRange: [0, 0],
        rotationSteps: 0,

        shape: 'square',
        ellipticity: 1,
        shuffle: false,
        backgroundColor: '#fafafa'
    }

    WordCloud($canvas[0], options);

});