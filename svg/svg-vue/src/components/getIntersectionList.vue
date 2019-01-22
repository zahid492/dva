<template>
    <div class="home">
        <input type="text"/>

        <svg width="500" height="400">
            <rect x="10" y="10" width="200" height="100"></rect>
            <rect x="20" y="20" width="200" height="100"></rect>
            <circle cx="20" cy="20" r="50" transform="translate(50,50)"></circle>
        </svg>

    </div>

    </div>
</template>

<script>

    export default {
        name: 'home',
        mounted() {
            var $ = document.querySelector.bind(document);
            var svg = $('svg');
            var rect1 = $('rect:first-of-type');
            var rect2 = $('rect:last-of-type');
            var circle = $('circle');
            var input = $('input');
            var irect = svg.createSVGRect();

            irect.width = irect.height = 10;

            irect.x = 210;
            irect.y = 110;
            // We'd want `length` to be 2 to capture both `rect` nodes,
            // however it's 3 because it also captures the `circle` because
            // its *bounding box* is used in the intersection list.
            debugger
            input.value = svg.getIntersectionList(irect, null).length


        }
    }
</script>

<style>
    svg {
        display: block;
        border: 1px solid #000;
        margin: 20px 0;
        visibility: visible;
    }

    rect, circle {
        fill: rgba(255, 0, 0, 0.2);
        /*this doesn't seem to affect anything, even if `hidden`*/
        visibility: visiblePainted;
    }

    .home {
        position: relative;
    }


</style>
