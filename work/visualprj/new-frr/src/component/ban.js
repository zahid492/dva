import {jb} from "../plugs/tbase";

let iconBox = $("#js-topBullet");
// 求偏移数组，和z轴
function getOffset(optf) {
    let posInfo = store.session("posInfo");
    let fz = jb.util.getFontSize();
    let baseWidth = optf.baseIconWidth;
    // let baseMargin = fz * 0.05;
    let itemWidth = baseWidth;
    let midTxtLen = jb.util.getTextWidth({txt: optf.data[posInfo.index].gamename, fontSize: 0.25 * fz});

    let temp = _.reduce(posInfo.curSeq[0], (r, v, i) => {
        if (v === posInfo.index) {
            return _.concat(r, [midTxtLen + r[r.length - 1] + itemWidth]);
        } else {
            if (r.length === 0) {
                return [itemWidth];
            }
            return _.concat(r, [r[r.length - 1] + itemWidth]);
        }
    }, []);

    if (optf.dx) {
        let temp0 = _.initial(_.concat([0], temp));
        if(temp0.length>3){
            let temp1 =  _.map(temp0, (v, k)=>{
                if(k<optf.midPos-1){
                    v = v+ (optf.dx*(optf.midPos-1-k));
                    return v;
                }

                if(k>optf.midPos+1){
                    v = v- (optf.dx*(k-optf.midPos-1));
                    return v;
                }

                return v;
            });

            return temp1;
        }
    } else {
        return _.concat([0], temp);
    }
};

// 摆放元素
export function setDom(opt) {

    let ele = iconBox.find(".swiper-nav-slide");
    let fz = jb.util.getFontSize();
    let nextArr = jb.ui.getSeq(opt.data, opt.nextIndex);
    let tlen = opt.data.length;
    let midPos = Math.floor(tlen / 2);
    // 图标透明度
    let opac = d3.scaleLinear()
        .domain([nextArr[1][0], nextArr[1][midPos]])
        .range([0.6, 1])
        .clamp(true);

    let posInfo = store.session("posInfo");
    posInfo.prevIndex = posInfo.index;
    posInfo.index = opt.nextIndex;
    posInfo.prevSeq = posInfo.curSeq;
    posInfo.curSeq = nextArr;
    store.session("posInfo", posInfo);

    let offsetArr = getOffset({
        data: opt.data,
        index: opt.nextIndex,
        midPos: midPos,
        baseIconWidth: opt.baseIconWidth,
        dx: opt.dx ? opt.dx : false
    });

    posInfo.prevOffset = posInfo.curOffset;
    posInfo.curOffset = offsetArr;
    store.session("posInfo", posInfo);

    if (posInfo.prevIndex !== posInfo.index) {
        iconBox.width(offsetArr[opt.data.length - 1] + opt.baseIconWidth * 2);
    }

    let promiseArr =_.map(ele, function (v, i) {
        let elv = $(v);
        let bid = parseInt(elv.attr("bid"), 10);
        elv.removeClass("swiper-nav-slide-active");
        elv.width(opt.baseIconWidth);
        // 下一个位置
        let curWidth;
        // 元素在当前序列中的索引位置
        let pi = _.indexOf(posInfo.curSeq[0], bid);

        if (midPos === pi && midPos !== 0 && ele.length > 2) {
            curWidth = posInfo.curOffset[midPos + 1] - posInfo.curOffset[midPos];
            elv.addClass("swiper-nav-slide-active");
            elv.width(curWidth);
        } else if (ele.length === 1) {
            elv.addClass("swiper-nav-slide-active");
            elv.width(posInfo.curOffset[0]);
        } else if (ele.length === 2 && pi === midPos) {
            let txtlen = jb.util.getTextWidth({txt: opt.data[bid].gamename, fontSize: 0.25 * fz});
            curWidth = posInfo.curOffset[midPos] * 2 + txtlen;
            elv.addClass("swiper-nav-slide-active");
            elv.width(curWidth);
        }

        let hi = (opt.maxHeight - (2 / (posInfo.curSeq[1][pi] + 1)) * 10).toFixed(1);
        let per = opac(posInfo.curSeq[1][pi]);

        if (ele.length >= 2) {
            let ai = anime({
                targets: elv[0],
                left: posInfo.curOffset[pi],
                height: hi + '%',
                opacity: per,
                zIndex: posInfo.curSeq[1][pi],
                // duration:100,
                // easing: 'easeInOutQuad'
            });
            return new Promise((resolve, reject)=>{
                ai.finished.then(function(){
                    resolve(true);
                });
            })


        } else if (ele.length === 1) {
            let ai = anime({
                targets: elv[0],
                left: 0,
                height: hi + '%',
                opacity: 1,
                zIndex: posInfo.curSeq[1][pi],
                // duration:100,
                // easing: 'easeInOutQuad'
            });

            return new Promise((resolve, reject)=>{
                ai.finished.then(function(){
                    resolve(true);
                });
            })
        }

    });
    return promiseArr;

};

// 二屏具体页面头部导航图标轮播
export function ban2(opt) {
    // 实际数据数组索引构造
    // 中间位置，activeIndex
    let tlen = opt.data.length;
    let midPos = Math.floor(tlen / 2);

    let curArr = jb.ui.getSeq(opt.data, opt.index);

    let posInfo = {};
    posInfo.prevIndex = posInfo.index;
    posInfo.index = opt.index;
    posInfo.prevSeq = posInfo.curSeq;
    posInfo.curSeq = curArr;
    store.session("posInfo", posInfo);

    let offsetArr = getOffset({
        data: opt.data,
        index: opt.index,
        midPos: midPos,
        baseIconWidth: opt.baseIconWidth,
        dx: opt.dx ? opt.dx : false
    });

    posInfo.prevOffset = posInfo.curOffset;
    posInfo.curOffset = offsetArr;
    store.session("posInfo", posInfo);

    iconBox.empty();
    iconBox.width(offsetArr[opt.data.length - 2] + opt.baseIconWidth * 2);

    let bulletTpl;

    if (opt.page === 2) {
        bulletTpl = require("../template/second/topNav.html");
    }

    if (opt.page === 4) {
        bulletTpl = require("../template/four/topBullet.html");
    }

    let bulletHtml = bulletTpl({list: opt.list, z: curArr[1], host: opt.host});
    iconBox.html(bulletHtml);
    iconBox.css({"visibility": "visible"});
};