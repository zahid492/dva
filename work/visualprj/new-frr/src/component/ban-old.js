import {jb} from "../plugs/tbase";
// 求偏移数组，和z轴
function getOffset(opt) {
    let fz = jb.util.getFontSize();

    let midp = opt.midPos;


    let baseWidth = opt.baseIconWidth;
    let baseMargin = fz*0.20;
    let plen = opt.data;
    let itemWidth = baseWidth + baseMargin;
    let rest = _.reduce(opt.data, function(r, v, i){
        let temp = 0;
        let txtlen = jb.util.getTextWidth({txt: v.gamename, fontSize: 0.25 * fz});
        if(plen === 1){
            temp = baseWidth + baseMargin + txtlen;
        }else{
            if(i === midp+1){
                temp = r[r.length-1] + itemWidth + txtlen + baseMargin;
            }else{
                if(r.length>0){
                    if(opt.dx){
                        temp = r[r.length-1] + itemWidth
                    }else{
                        temp = r[r.length-1] + itemWidth-opt.dx
                    }

                }else{
                    if(opt.dx){
                        temp = itemWidth-opt.dx
                    }else{
                        temp = itemWidth
                    }

                }
            }

        }

        r.push(temp);
        return r;
    }, []);

    return rest;
};

// 摆放元素
function setDom(opt) {
    let nextArr = jb.ui.getSeq(opt.data, opt.nextIndex);

    let offsetArr = getOffset({
        data: opt.data,
        curIndex: opt.nextIndex,
        midPos: opt.midPos,
        baseIconWidth: opt.baseIconWidth,
        seq: nextArr[0],
        dx: opt.dx ? opt.dx : false
    });

    let midPos = opt.midPos;

    // console.log(nextArr, offsetArr)

    let opac = d3.scaleLinear()
        .domain([nextArr[1][0], nextArr[1][midPos]])
        .range([0.6, 1])
        .clamp(true);
    let fz = jb.util.getFontSize();

    let iconBox = $("#js-topBullet");
    iconBox.width(offsetArr[opt.data.length - 1] + opt.baseIconWidth * 2);

    opt.ele.each(function (i, v) {
        let elv = $(v);
        elv.removeClass("swiper-nav-slide-active");
        elv.width(opt.baseIconWidth);
        // 下一个位置
        let pi = _.indexOf(nextArr[0], opt.curArr[0][i]);
        let curWidth;

        if (midPos === pi && midPos !== 0 && opt.ele.length > 2) {
            curWidth = offsetArr[midPos + 1] - offsetArr[midPos];
            elv.addClass("swiper-nav-slide-active");
            elv.width(curWidth);
        } else if (opt.ele.length === 1) {
            elv.addClass("swiper-nav-slide-active");
            elv.width(offsetArr[0]);
        } else if (opt.ele.length === 2 && pi === midPos) {
            let txtlen = jb.util.getTextWidth({txt: opt.data[pi].gamename, fontSize: 0.25 * fz});
            curWidth = offsetArr[midPos] * 2 + txtlen;
            elv.addClass("swiper-nav-slide-active");
            elv.width(curWidth);
        }

        let hi = (opt.maxHeight - (2 / (nextArr[1][pi] + 1)) * 10).toFixed(1);
        let per = opac(nextArr[1][pi]);

        if (opt.ele.length > 2) {
            anime({
                targets: elv[0],
                left: offsetArr[pi],
                height: hi + '%',
                opacity: per,
                zIndex: nextArr[1][pi],
                // easing: 'easeInOutQuad'
            });
        } else if (opt.ele.length === 2) {
            anime({
                targets: elv[0],
                left: offsetArr[pi],
                height: hi + '%',
                opacity: per,
                zIndex: nextArr[1][pi],
                // easing: 'easeInOutQuad'
            });
        } else if (opt.ele.length === 1) {
            anime({
                targets: elv[0],
                left: 0,
                height: hi + '%',
                opacity: 1,
                zIndex: nextArr[1][pi],
                // easing: 'easeInOutQuad'
            });
        }

    });

};

// 二屏具体页面头部导航图标轮播
export default function ban2(opt) {
    // 实际数据数组索引构造
    // 中间位置，activeIndex
    let curIndex = opt.index;
    let data = opt.data;
    let tlen = data.length;
    let midPos = Math.floor(tlen / 2);
    let baseIconWidth = opt.baseIconWidth;

    let curArr = jb.ui.getSeq(data, curIndex);

    let iconBox = $("#js-topBullet");
    iconBox.empty();
    let offsetArr = getOffset({
        data: data,
        curIndex: curIndex,
        midPos: midPos,
        baseIconWidth: baseIconWidth,
        seq: curArr[0],
        dx: opt.dx ? opt.dx : false
    });

    iconBox.width(offsetArr[tlen - 1] + baseIconWidth * 2);

    let bulletTpl;

    if(opt.page===2){
        bulletTpl = require("../template/second/topNav.html");
    }

    if(opt.page===4){
        bulletTpl = require("../template/four/topBullet.html");
    }

    let bulletHtml = bulletTpl({list: opt.list, z: curArr[1], host: opt.host});
    iconBox.html(bulletHtml);

    let ele = iconBox.find(".swiper-nav-slide");

    setDom({
        ele: ele,
        data: data,
        curArr: curArr,
        nextIndex: curIndex,
        midPos: midPos,
        baseIconWidth: baseIconWidth,
        dx: opt.dx ? opt.dx : false,
        maxHeight: opt.maxHeight
    });

    iconBox.css({"visibility": "visible"});

    return function (index) {
        setDom({
            ele: ele,
            data: data,
            curArr: curArr,
            nextIndex: index,
            midPos: midPos,
            baseIconWidth: baseIconWidth,
            dx: opt.dx ? opt.dx : false,
            maxHeight: opt.maxHeight
        });
    }

};