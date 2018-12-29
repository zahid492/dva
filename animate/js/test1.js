/*
 * @Author: wsc
 * @Date:   2018-04-09 16:26:39
 * @Last Modified by:   wsc
 * @Last Modified time: 2018-08-27 10:24:25
 */

$(function () {

    var path = anime.path('#tvbox path');

    var motionPath = anime({
        targets: '.el',
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'linear',
        duration: 2000,
    });

    var lineDrawing = anime({
        targets: '#tvbox path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        duration: 2000,
        // direction: 'alternate',
    });
});