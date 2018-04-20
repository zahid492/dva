$(function() {
    function showSlide() {
        _.delay(function() {
            $(".swiper-head").fadeOut(500)
            $(".swiper-container").fadeIn(500)
            sw.slideTo(0);
            sw.autoplay.start();
        }, 2000);
    }

    function showHead() {
        sw.autoplay.stop();
        $(".swiper-container").fadeOut(500)
        $(".swiper-head").fadeIn(500)
        showSlide()
    }
    showSlide()
    var sw = new Swiper(".swiper-container", {
        autoplay: false,
        speed: 1000,
        observer: true,
        observeParents: true,
        effect: "fade",
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function(index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
        on: {
            slideChangeTransitionEnd: function() {
                // console.log(this.activeIndex, this.slides[this.activeIndex])
                var curSlide = $(this.slides[this.activeIndex])
                console.log(sw)

                if (sw.isEnd && !sw.animating) {
                    showHead()
                }

            }
        }
    });

});