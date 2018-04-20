$(function() {

    var data = _.range(0, 15);
    var dls = [];

    if (data.length >= 5) {
        dls = _.chunk(data, 5)
    }

    _.forEach(dls, function(v, i) {
        build($(".swiper-wrapper"), v, i)
    });

    function build(dom, list, i) {
        var compiled = _.template($("#tpl").html());
        var slist = compiled({ "lists": list });
        var tpl = $("<div></div>");
        tpl.html(slist);
        tpl.find(".swiper-slide").attr("id", "slide" + i);
        dom.append(tpl.html());
    }

    var aniIn = _.map(dls, function(v, i) {
        return anime({
            autoplay: false,
            targets: '#slide' + i + ' li',
            opacity: 1,
            top: function(el, i) {
                return (i + 1) * 30;
            },
            height: {
                value: [0, 30],
                duration: 300,
                easing: 'easeInOutSine'
            },
            // translateX: [300, 0],
            easing: 'easeInOutQuad',
            duration: function(el, i, l) {
                return 100 + (i * 100);
            },
            delay: function(target, index) {
                // console.log(target)
                // 100ms delay multiplied by every div index, in ascending order
                return index * 100;
            },
            // direction: 'alternate',

        });
    });

    var sw = new Swiper(".swiper-container", {
        autoplay: {
            duration: 5000,
        },
        speed: 1000,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        // effect: "fade",
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function(index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
        on: {
            slideChangeTransitionStart: function() {
                var el = $('#slide' + this.activeIndex + ' li')
                el.each(function(i, v) {
                    $(v).height(0)
                    $(v).css("top", 0);
                    $(v).css("opacity", 0)
                })
            },
            slideChangeTransitionEnd: function() {
                // console.log(this.activeIndex, this.slides[this.activeIndex])
                var curSlide = $(this.slides[this.activeIndex])
                aniIn[this.activeIndex].restart();

                if (sw.isEnd && !sw.animating) {

                }

            }
        }
    });

    aniIn[0].play();

});