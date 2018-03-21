var fs = require("fs"),
    d3 = require("d3-geo"),
    topojson = require("topojson-client"),
    Canvas = require("canvas"),
    us = require("./node_modules/us-atlas/us/10m.json");

var canvas = new Canvas(960, 600),
    context = canvas.getContext("2d"),
    path = d3.geoPath().context(context);

context.beginPath();
path(topojson.mesh(us));
context.stroke();

canvas.pngStream().pipe(fs.createWriteStream("preview.png"));
// https://bl.ocks.org/mbostock/885fffe88d72b2a25c090e0bbbef382f
// {
//   "name": "d3-geoPath-canvas-example",
//   "version": "0.0.1",
//   "license": "GPL-3.0",
//   "scripts": {
//     "prepublish": "./rasterize"
//   },
//   "devDependencies": {
//     "canvas": "1",
//     "d3-geo": "1",
//     "topojson-client": "2",
//     "us-atlas": "1"
//   }
// }