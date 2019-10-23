// 二屏1
import {themes, configs} from "../config/config";
import {jb} from "../plugs/tbase";
import {delayer, playStep, pageTo2} from "./page22";

let config = store.session("config");
if(_.isNil(config)){
    config = configs;
}
let lineIns;

export function page21dom(opt){
    // build
    let top5dom = $("#js-top5");
    top5dom.empty();

    let fiveTpl = require("../template/second/five.html");
    let five21 = _.map(opt.topData, function (v) {
        v.impressions = jb.util.numSplit(v.impressions);
        v.consume = jb.util.fixed(v.consume, 2);
        return v;
    });

    let fiveDom = fiveTpl({
        list: five21,
        logos: opt.logos,
        en2num: themes[config.theme].en2num,
        colorSeq: themes[config.theme].colorSeq,
        medalImg: themes[config.theme].medalImg
    });

    top5dom.html(fiveDom);
    // 清除实例
    if (lineIns && !lineIns.isDisposed()) {
        lineIns.dispose();
    }

    lineIns = page21(opt);

}

export function page21(opt) {
    let legend = [];
    let gdate = [];

    let p1line5dom = $("#js-main2line");
    p1line5dom.empty();

    let series = _.map(opt.topData, function (v, i) {
        legend.push({
            name: v.gamename,
            icon: 'image://static/' + themes[config.theme].legend21Img[i + 1],
        });

        let glist = [];
        gdate = [];
        _.forEach(v.gamelist, function (k, j) {
            k.dateNoYear = jb.util.unix2dayNoYear(k.date, ".");
            glist.push(k.impressions);
            gdate.push(k.dateNoYear);
        });

        return {
            name: v.gamename,
            type: 'line',
            symbol: "circle",
            symbolSize: function (value, series) {

                if (series.dataIndex == 0 || series.dataIndex === gdate.length - 1) {
                    return 10
                }

                return 4;
            },
            lineStyle: {
                width: 4,
                // shadowColor: echarts.color.lerp(0.5, color2Line[i], false),
                // shadowBlur: 45,
                // shadowOffsetX: 10,
                // shadowOffsetY: 10,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: themes[config.theme].color2Line2[i][0]
                    }, {
                        offset: 1,
                        color: themes[config.theme].color2Line2[i][1]
                    }],
                    globalCoord: false,
                }

            },
            areaStyle: {
                // origin: "end",
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: themes[config.theme].color2Line2[i][1]
                    }, {
                        offset: 0.35,
                        color: themes[config.theme].color2Line2[i][0]
                    }, {
                        offset: 0.85,
                        color: themes[config.theme].color21AreaStopColor
                    }],
                    globalCoord: false // 缺省为 false
                },
                // shadowColor: "rgba(84,199,252, 1)",
                // shadowBlur: 25,
                opacity: 0.1,

            },
            itemStyle: {
                color: function (series) {
                    return echarts.color.lerp(series.dataIndex / 7, themes[config.theme].color2Line2[i], false)
                },
            },
            smooth: true,
            data: glist
        }
    });

    return jb.ui.line5({
        dom: p1line5dom[0],
        legend: legend,
        legendFontSize: 11,
        itemGap: 10,
        gdate: gdate,
        series: series,
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        legendPadding: [20, 5, 10, 5],
        legendWidth: 50,
        legendHeight: 16,
        grid: {
            top: '8%',
            right: '5.5%'
        }
    });

};