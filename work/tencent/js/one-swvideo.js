$(function() {


    var Chimee = window.Chimee;

    var sw = [];
    var childSlide = $(".swiper-slide");
    var childLen = childSlide.length;
    // ÐèÒª½¨Á¢Ã¿¸öslide µÄÊÓÆµÁÐ±í£¬²¢È·¶¨ÄÇ¸öÕýÔÚ²¥·Å
    var playerList = [];

    $(".video").each(function(i, v) {
        $(v).attr("id", "v" + i)

        playerList[i] = new Chimee({
            src: $(v).attr("vpath"),
            wrapper: "#v" + i,
            // width: 60,
            // height: 90,
            volume: 1,
            autoplay: false,
            controls: true,
        });
    });


    function pstop() {
        _.forEach(playerList, function(v, i) {
            v.pause();
        })
    }


    sw = new Swiper(".swiper-container", {
        autoplay: true,
        speed: 2000,
        observer: true,
        observeParents: true,
        loop:true,
        // effect: 'flip',
        // flipEffect: {
        //     slideShadows: true,
        //     limitRotation: true,
        // },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function(index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
        on: {
            slideChangeTransitionEnd: function() {
                console.log(this.activeIndex, this.slides[this.activeIndex])

                console.log(this.activeIndex)
                var curSlide = $(this.slides[this.activeIndex])

                var hasVideo = curSlide.hasClass("video");

                pstop();

                if (hasVideo) {

                    sw.autoplay.stop();

                    var vid = curSlide.attr("id").slice(1)

                    playerList[vid].play();


                    console.log(this.activeIndex )
                    playerList[vid].on('ended', function() {

                        sw.autoplay.start();

                    });

                }

            }
        }
    });

})