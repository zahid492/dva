<template>
    <div class="home">

        <svg width="1200" height="600"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">

            <filter id="i1">
                <feImage x="90" y="0" width="10%" height="10%" result="raster1" xlink:href="/images/logo2.png"/>

                <feImage x="0" y="0" width="50%" height="50%" result="raster2" xlink:href="/images/street.png"/>
                <feMerge>
                    <feMergeNode in="raster2"/>
                    <feMergeNode in="raster1"/>
                </feMerge>
            </filter>
            <g>
                <rect x="0" y="0" width="100%" height="100%" filter="url(#i1)"/>
            </g>

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


</style>
