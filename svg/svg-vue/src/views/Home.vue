<template>
    <div class="home">

    </div>

    </div>
</template>

<script>


    export default {
        name: 'home',
        mounted() {
            var t = d3.timer(function(elapsed) {
                console.log(elapsed);
                if (elapsed > 200) t.stop();
            }, 150);

        }
    }
</script>

<style>
    svg {
        border: 1px solid #000;
    }

    .home {
        position: relative;
    }

    body {
        font: 10px sans-serif;
    }

    .axis path,
    .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }

    .area {
        fill: lightsteelblue;
    }

    .line {
        fill: none;
        stroke: steelblue;
        stroke-width: 1.5px;
    }

    .dot {
        fill: white;
        stroke: steelblue;
        stroke-width: 1.5px;
    }

</style>
