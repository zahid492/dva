var jb = {};
var request = window.superagent;

jb.ajx = {};
jb.ui = {};
jb.util = {};
jb.config = {};
// get 请求
jb.ajx.request = function(opt) {
    return request.get(opt.url)
        .query(opt.data)
        .timeout({
            response: 1000,
            deadline: 10000,
        })
        .retry(3)
        .on("error", function(err) {
            console.log("err: ", err);
        })
        .then(function(result) {
            opt.cb(result);

            if (result.body.Code !== 200) {
                console.log(result.body.ErrMsg)
            }

            if (opt.defer) {
                opt.defer[1](result.body.ErrMsg)
            }
        });
};

// 需要 fecha 年月日
jb.util.formatTime = function(date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return fecha.format(date, 'YYYY' + sep + 'MM' + sep + 'DD' + " HH:mm:ss");
};

jb.util.formatDate = function(date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return fecha.format(date, 'YYYY' + sep + 'MM' + sep + 'DD');
};

// 年月
jb.util.formatMonth = function(date) {
    var arg1 = _.toArray(arguments)[1];
    var sep = _.isUndefined(arg1) ? "-" : arg1;
    return fecha.format(date, 'YYYY' + sep + 'MM');
};

// 数字拆分加逗号
jb.util.numSplit = function(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
};

jb.util.getTextWidth = function(obj) {
    var span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.style.font = 'bold ' + fontSize + 'px "microsoft yahei", sans-serif';
    span.innerText = obj.value;
    span.textContent = obj.value;
    document.body.appendChild(span);
    // 求得文字内容宽度
    var width = span.clientWidth;
    // 移除dom元素
    document.body.removeChild(span);

    return width;
}

// 环状饼图
jb.ui.cpie = function(opt) {
    var width = opt.width,
        height = opt.height;

    var svg = d3.select(opt.dom).append("svg")
        .attr("width", width)
        .attr("height", height)

    var gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        // 这里能控制方向
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", opt.color1)
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", opt.color2)
        .attr("stop-opacity", 1);

    var blurId = "blur" + _.now();

    var filter = svg.append("defs")
        .append("filter")
        .attr("id", blurId);

    filter
        .append("feGaussianBlur")
        .attr("result", "blurOut")
        .attr("in", "offOut")
        .attr("stdDeviation", 10);

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offset")

    var g2 = svg.append("g");

    g2.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dx", opt.numDx)
        .attr("dy", opt.numDy)
        .attr("fill", "url(#gradient)")
        .attr("font-size", opt.numFontSize)
        .text(opt.num)

    g2.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dx", opt.percentDx)
        .attr("dy", opt.percentDy)
        .attr("fill", opt.percentColor)
        .attr("font-size", opt.percentFontSize)
        .text("%")

    g2.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dx", opt.desDx)
        .attr("dy", opt.desDy)
        .attr("fill", opt.desColor)
        .attr("font-size", opt.desFontSize)
        .text(opt.des)

    var g1 = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var bgpath = d3.arc()
        .outerRadius(opt.outRadius - opt.restRadius)
        .innerRadius(opt.inRadius + opt.restRadius)
        .startAngle(opt.endAngle)
        .endAngle(Math.PI * 2);

    var path = d3.arc()
        .outerRadius(opt.outRadius)
        .innerRadius(opt.inRadius)
        .startAngle(0)
        .endAngle(opt.endAngle);

    var pathShadow = d3.arc()
        .outerRadius(opt.outRadius)
        .innerRadius(opt.inRadius)
        .startAngle(0)
        .endAngle(opt.endAngle);

    g1.append("path")
        .attr("class", "bg")
        .attr("d", bgpath)
        .attr("fill", opt.restColor);

    g1.append("path")
        .attr("class", "fb")
        .attr("d", path)
        .attr("fill", "url(#gradient)");

    g1.append("path")
        .attr("class", "fbs")
        .attr("d", pathShadow)
        .attr("opacity", 0.6)
        .attr("fill", "url(#gradient)")
        .attr("filter", "url(#" + blurId + ")");
}