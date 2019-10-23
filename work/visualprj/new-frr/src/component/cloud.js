// 词云
import {themes} from "../config/config";
const config = store.session("config");

export default function wordCloud(opt) {

    var cloud = d3.layout.cloud;
    var fill = opt.color;
    var wordEl = $(opt.dom);

    var xi = d3.extent(_.map(opt.data, opt.size));
    var fontSize = d3.scaleLinear()
        .domain(xi)
        .range([10, 36]);

    var words = _.map(opt.data, function (v) {
        return {text: v[opt.text], size: fontSize(v[opt.size])}
    });
    var cw = wordEl.width();
    var ch = wordEl.height();

    var layout = cloud()
        .size([cw, ch])
        .words(words)
        .padding(opt.padding)
        .rotate(0)
        .fontSize(function (d) {
            return d.size;
        })
        .text(function (d) {
            return d.text
        })
        .spiral("archimedean")
        .on("end", function () {
            d3.select(opt.dom).append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("font-family", opt.fontFamily)
                .style("fill", themes[config.theme].tagFillColor)
                .attr("class", "cword")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                });


            var cwords = d3.selectAll(".cword");
            var len = cwords.nodes().length;
            var ani = [];

            cwords.each(function (d, i, nodes) {
                ani[i] = anime({
                    autoplay: false,
                    targets: nodes[i],
                    fill: [themes[config.theme].tagFillColor, fill[i % 6], themes[config.theme].tagFillColor],
                    fontWeight: [800, 1500],
                    easing: 'easeOutQuad',
                    duration: opt.duration,
                    delay: function (el) {
                        return i * opt.delay;
                    },
                    // loop: true
                });
            });

            function sweep() {
                cwords.each(function (d, i) {
                    ani[i].restart();
                })
            }

            sweep();
            d3.interval(function () {
                sweep();
            }, len * opt.delay);
        });

    layout.start();

};