/*
 * @Author: wsc
 * @Date:   2018-04-09 16:26:39
 * @Last Modified by:   wsc
 * @Last Modified time: 2018-04-10 10:39:50
 */

'use strict';

$(function() {
    var list = [{

        txt: "a"
    }, {

        txt: "b"
    }, {

        txt: "c"
    }, {

        txt: "d"
    }, {

        txt: "e"
    }];

    setInterval(function() {
        var nums = _.shuffle(_.range(0, 5));

        list = _.map(list, function(v, i) {
            v.num = nums[i]
            return v;
        });

        list = _.sortBy(list, function(v) {
            return v.num;
        });

        build(list);
    }, 3000);



    function build(list) {
        var compiled = _.template($("#tpl").html());
        var slist = compiled({ "lists": list });
        var tpl = $("<div></div>");
        tpl.html(slist);

        var $list = $(".list")
        $list.empty();

        $list.append(tpl.html());

        var ani = anime({
            targets: 'li',
            opacity: 1,
            height: {
                value: "30px",
                duration: 500,
                easing: 'easeInOutSine'
            },
            translateX: [300, 0],
            easing: 'easeInOutQuad',
            duration: function(el, i, l) {
                return 300 + (i * 300);
            },
            delay: function(target, index) {
                // console.log(target)
                // 100ms delay multiplied by every div index, in ascending order
                return index * 100;
            },
            // direction: 'alternate',

        });

        ani.complete = function() {

            console.log('completed:');
        };
    }

})