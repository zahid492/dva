/*
 * @Author: wsc
 * @Date:   2018-03-12 09:02:42
 * @Last Modified by:   wsc
 * @Last Modified time: 2018-03-14 09:32:46
 */

'use strict';

var t = d3.transition()
    .duration(1550)
    .ease(d3.easeLinear);
// 下落渐变方格流
d3.select(".box")
    .style("color", "green")
    .transition(t)
    .style("color", "red");

var n = 4002;

var whiteblue = d3.interpolateRgb("#eee", "steelblue"),
    blueorange = d3.interpolateRgb("steelblue", "orange"),
    orangewhite = d3.interpolateRgb("orange", "#eee");

d3.select("body").selectAll("div")
    .data(d3.range(n))
    .enter().append("div")
    .transition()
    .delay(function(d, i) { return i + Math.random() * n / 4; })
    .ease(d3.easeLinear)
    .on("start", function repeat() {
        d3.active(this)
            .styleTween("background-color", function() { return whiteblue; })
            .transition()
            .delay(500)
            .styleTween("background-color", function() { return blueorange; })
            .transition()
            .delay(500)
            .styleTween("background-color", function() { return orangewhite; })
            .transition()
            .delay(n)
            .on("start", repeat);
    });