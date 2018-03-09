$(function() {

        HTMLImageElement.prototype.play = function() {
            // if (this.storeCanvas) {
            //     // 移除存储的canvas
            //     this.storeCanvas.parentElement.removeChild(this.storeCanvas);
            //     this.storeCanvas = null;
            //     // 透明度还原
            //     image.style.opacity = '';
            // }
            if (this.storeUrl) {
                this.src = this.storeUrl;
            }
        };
        HTMLImageElement.prototype.stop = function() {
            var canvas = document.createElement('canvas');
            // 尺寸
            var width = this.width,
                height = this.height;
            if (width && height) {
                // 存储之前的地址
                if (!this.storeUrl) {
                    this.storeUrl = this.src;
                }
                // canvas大小
                canvas.width = width;
                canvas.height = height;
                // 绘制图片帧（第一帧）
                canvas.getContext('2d').drawImage(this, 0, 0, width, height);
                // 重置当前图片
                try {
                    this.src = canvas.toDataURL("image/gif");
                } catch (e) {
                    console.log(this)
                    // 跨域
                    this.removeAttribute('src');
                    // 载入canvas元素
                    canvas.style.position = 'absolute';
                    // 前面插入图片
                    this.parentElement.insertBefore(canvas, this);
                    // 隐藏原图
                    this.style.opacity = '0';
                    // 存储canvas
                    this.storeCanvas = canvas;
                }
            }
        };


    var image = document.getElementById("testImg"),
        button = document.getElementById("testBtn");

    if (image && button) {
        button.onclick = function() {
            if (this.value == '停止') {
                image.stop();
                this.value = '播放';
            } else {
                image.play();
                this.value = '停止';
            }
        };
    }

})