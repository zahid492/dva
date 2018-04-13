var cloud = d3.layout.cloud;

var fill = _.concat(d3.schemeCategory10, d3.schemeDark2, d3.schemeSet1);

var KeywordsList = [{ "Frequency": 0.31380455868089231, "Word": "小米" }, { "Frequency": 0.15363738010561481, "Word": "手机" }, { "Frequency": 0.10969366311024895, "Word": "雷军" }, { "Frequency": 0.0806303211552969, "Word": "MIUI" }, { "Frequency": 0.078468180838452417, "Word": "小米电视" }, { "Frequency": 0.070729415885332464, "Word": "米家" }, { "Frequency": 0.0702915993102705, "Word": "全面屏" },

    // { "Frequency": 0.0659038150662787, "Word": "华为" }, { "Frequency": 0.060159284405647162, "Word": "MIX" }, { "Frequency": 0.050404892768617308, "Word": "红米" }, { "Frequency": 0.04573757948054747, "Word": "小米之家" }, { "Frequency": 0.04620112619894385, "Word": "印度" }, { "Frequency": 0.03000891798685203, "Word": "Note" }, { "Frequency": 0.028880940834141611, "Word": "性价比" }, { "Frequency": 0.027840526996443581, "Word": "生态" }, { "Frequency": 0.025321882745985558, "Word": "销量" }, { "Frequency": 0.02398173294536049, "Word": "配置" }, { "Frequency": 0.021840284513417393, "Word": "山寨" }, { "Frequency": 0.015614640586270072, "Word": "手环" }, { "Frequency": 0.014584330207996552, "Word": "价格" }, { "Frequency": 0.013473192154326975, "Word": "出货量" }, { "Frequency": 0.0094496174156697924, "Word": "占有率" }, { "Frequency": 0.0094327783166289463, "Word": "全球" }, { "Frequency": 0.0093788931996982433, "Word": "市场" }
];
// 显示数量控制直接过滤数据

var words = _.map(KeywordsList, function(v) {
    return { text: v.Word, size: v.Frequency * 450 }
});
var spirals = {
    archimedean: "archimedeanSpiral",
    rectangular: "rectangularSpiral"
};

var layout = cloud()
    .size([500, 500])
    .words(words)
    .padding(5)
    .rotate(function(word, i) {
        return 0
        // return ~~(Math.random() * 2) * 90;
    })
    .fontSize(function(d) { return d.size; })
    .text(function(d) {
        if (d.text === "小米") {
            d.text = d.text + "!"
        }
        return d.text
    })
    .spiral("archimedean")
    .on("word", function(word) {
        // 这里不要干扰旋转等，会扰乱布局
        if (word.text === "小米") {}
        return word
    })
    .on("end", function() {
        d3.select(".box").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill[i]; })
            .attr("class", "cword")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) {
                return d.text;
            });


        var cwords = d3.selectAll(".cword");
        var len = cwords.nodes().length;

        function sweep() {
            cwords.each(function(d, i, nodes) {
                anime({
                    targets: nodes[i],
                    opacity: [0.3, 1, 0.3],
                    easing: 'easeOutQuad',
                    duration: 2000,
                    delay: function(el) {
                        return i * 1000;
                    }
                });
            });
        }

        sweep();
        d3.interval(function() {
            sweep();
        }, len * 1000);
    });

layout.start();