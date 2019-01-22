/*
 * @Author: wsc
 * @Date:   2018-04-09 16:26:39
 * @Last Modified by:   wsc
 * @Last Modified time: 2018-08-27 10:24:25
 */

$(function () {

    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    var params = new function () {
        this.count = 6;
    };

    function render() {
        context.globalAlpha = 1;
        // 重叠图像的覆盖方式
        // context.globalCompositeOperation = "destination-in";

        var gradient = context.createLinearGradient(0,2,420,2);
        gradient.addColorStop(0,'rgba(200,0,0,0.8)');
        gradient.addColorStop(0.5,'rgba(0,200,0,0.7)');
        gradient.addColorStop(1,'rgba(200,0,200,0.9)');

        context.strokeStyle="#99cc33";
        context.lineWidth=10;
        context.strokeRect(20,20,400,100);

        context.fillStyle= gradient;
        context.fillRect(20,20,400,100);
        // requestAnimationFrame(render);
    }

    var gui = new dat.GUI();
    var cc = gui.add(params, "count", 1, 10).step(1);

    cc.onFinishChange(function (v) {
        render();
    });


    render();

});