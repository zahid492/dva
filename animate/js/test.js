var myTimeline = anime.timeline({
    direction: 'alternate',
    loop: 1,
    autoplay: true
});

var updateLogEl2 = document.querySelector('.update-log');
var beganLogEl2 = document.querySelector('.began-log');
var completedLogEl2 = document.querySelector('.completed-log');

myTimeline
    .add({
        targets: '.box:first-child',
        opacity: .5,
        translateX: function(el) {
            return el.getAttribute('data-x')
        },
        translateY: function(el, i) {
            return 20 + (-20 * i)
        },
        scale: function(el, i, l) {
            console.log(l)
            return (l - i) + .25
        },
        rotate: function() {
            return anime.random(-360, 360)
        },
        duration: function() {
            return anime.random(800, 1600)
        },
        delay: function() {
            return anime.random(0, 1000)
        },
        offset: 1000
    }).add({
        targets: '.box:nth-child(3)',
        translateX: [
            { value: 250, duration: 1000, delay: 500, elasticity: 0 },
            { value: 0, duration: 1000, delay: 500, elasticity: 0 }
        ],
        translateY: [
            { value: -40, duration: 500, elasticity: 100 },
            { value: 40, duration: 500, delay: 1000, elasticity: 100 },
            { value: 0, duration: 500, delay: 1000, elasticity: 100 }
        ],
        scaleX: [
            { value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
            { value: 1, duration: 900, elasticity: 3000 },
            { value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
            { value: 1, duration: 900, elasticity: 300 }
        ],
        scaleY: [
            { value: [1.75, 1], duration: 500 },
            { value: 2, duration: 50, delay: 1000, easing: 'easeOutExpo' },
            { value: 1, duration: 450 },
            { value: 1.75, duration: 50, delay: 1000, easing: 'easeOutExpo' },
            { value: 1, duration: 450 }
        ],
        offset: 1000,
        update: function(anim) {

            if (!anim.began) {
                updateLogEl2.value = 'begins in ' + Math.round(anim.delay - anim.currentTime) + 'ms';
                beganLogEl2.value = '';
            } else {
                updateLogEl2.value = 'begins in 0ms';
            }
            if (anim.completed) {
                completedLogEl2.value = 'xx';
            }
        }
    }).add({
        targets: 'polygon',
        points: '64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96',
        duration: 3000,
        offet: 1000
    });

var path = anime.path('.svg path');

var motionPath = anime({
    targets: '.box:nth-child(2)',
    translateX: path('x'),
    translateY: path('y'),
    rotate: path('angle'),
    easing: 'linear',
    duration: 2000,
    loop: true
});