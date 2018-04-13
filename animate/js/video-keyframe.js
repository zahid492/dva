$(function() {

    // var processor = {
    //     doLoad: function() {
    //         this.video = document.getElementById("video");
    //         this.c1 = document.getElementById("c1");
    //         this.ctx1 = this.c1.getContext("2d");
    //         this.c2 = document.getElementById("c2");
    //         this.ctx2 = this.c2.getContext("2d");
    //         let self = this;
    //         this.video.addEventListener("play", function() {
    //             self.width = self.video.videoWidth / 2;
    //             self.height = self.video.videoHeight / 2;
    //             self.timerCallback();
    //         }, false);
    //     },

    //     timerCallback: function() {
    //         if (this.video.paused || this.video.ended) {
    //             return;
    //         }
    //         this.computeFrame();

    //         let self = this;
    //         setTimeout(function() {
    //             self.timerCallback();
    //         }, 0);
    //     },
    //     computeFrame: function() {
    //         // console.log("t")
    //         this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    //         let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    //         let l = frame.data.length / 4;

    //         for (let i = 0; i < l; i++) {
    //             let r = frame.data[i * 4 + 0];
    //             let g = frame.data[i * 4 + 1];
    //             let b = frame.data[i * 4 + 2];
    //             if (g > 100 && r > 100 && b < 43)
    //                 frame.data[i * 4 + 3] = 0;
    //         }


    //         this.ctx2.putImageData(frame, 0, 0);
    //         return;
    //     }
    // };

    // processor.doLoad();

    // $("#videoimg").on("click", function() {
    //     $(this).fadeOut(1000);
    //     $(".clicktips").hide();
    //     $("#vidoid").show();
    //     $("#vidoid")[0].play();
    //     $("#vidoid").bind('ended', function() {
    //         $("#vidoid").hide();
    //         $("#videoimg").show();
    //     })
    // });

    function VideoToCanvas(videoElement, fn) {
        if (!videoElement) {
            return;
        }
        var fn = fn || "";
        var canvas = document.createElement('canvas');
        canvas.width = videoElement.offsetWidth;
        canvas.height = videoElement.offsetHeight;

        var ctx = canvas.getContext('2d');
        var newVideo = videoElement.cloneNode(false);
        var timer = null;

        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

        function drawCanvas() {
            ctx.drawImage(newVideo, 0, 0, canvas.width, canvas.height);
            timer = requestAnimationFrame(drawCanvas);
        }

        function stopDrawing() {
            cancelAnimationFrame(timer);
        }

        function endedCallBack() {
            cancelAnimationFrame(timer);
            fn && fn()
        }

        newVideo.addEventListener('play', function() {
            drawCanvas();
        }, false);

        newVideo.addEventListener('pause', stopDrawing, false);
        newVideo.addEventListener('ended', endedCallBack, false);

        videoElement.parentNode.replaceChild(canvas, videoElement);

        this.play = function() {
            newVideo.play();
        };

        this.pause = function() {
            newVideo.pause();
        };

        this.playPause = function() {
            if (newVideo.paused) {
                this.play();
            } else {
                this.pause();
            }
        };

        this.change = function(src) {
            if (!src) {
                return;
            }
            newVideo.src = src;
        };

        this.drawFrame = drawCanvas;

        this.show = function() {
            canvas.style.display = "block";
        }

        this.hide = function() {
            canvas.style.display = "none";
        }
    }

    var canvasvedio = new VideoToCanvas(document.getElementById("vidoid"), function() {
        canvasvedio.hide();
        $("#videoimg").show();
    });
    canvasvedio.play();
});