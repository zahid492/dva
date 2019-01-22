<template>
    <div class="home">
        <svg width="800" height="600" preserveAspectRatio="xMinYMin meet" viewBox="0 0 800 600" version="1.1"
             xmlns="http://www.w3.org/2000/svg">

            <line id="l1" x1="200" y1="100" x2="600" y2="100" stroke="red" stroke-width="8"></line>
            <line id="l2" x1="200" y1="100" x2="600" y2="100" stroke="orange" stroke-width="8" transform="rotate(30)"></line>
            <line id="l3" x1="200" y1="100" x2="600" y2="100" stroke="yellow" stroke-width="8" transform="rotate(60)"></line>
            <line id="l4" x1="200" y1="100" x2="600" y2="100" stroke="green" stroke-width="8" transform="rotate(90)"/>
            <line id="l5" x1="200" y1="100" x2="600" y2="100" stroke="blue" stroke-width="8" transform="rotate(120)"></line>
            <line id="l6" x1="200" y1="100" x2="600" y2="100" stroke="purple" stroke-width="8" transform="rotate(150)"/>

            <g transform="translate(100,100)">
                <line id="l7" x1="200" y1="100" x2="600" y2="100" stroke="purple" stroke-width="20"
                      transform="rotate(30)"/>
            </g>

            <circle id="c1" cx="123" cy="186" r="28" stroke="green" stroke-width="10" fill="none"/>
            <circle id="c2" cx="469.6" cy="386.6" r="28" stroke="green" stroke-width="10" fill="none"/>

        </svg>

    </div>

    </div>
</template>

<script>

    export default {
        name: 'ctm',
        mounted() {

            var root = document.querySelector("svg");
            var ls = document.getElementsByTagName("line");
            var cs = document.getElementsByTagName("circle");

            root.addEventListener('click', showCs, false);

            function showCs(e) {
                var t = e.target;
                if (t.tagName !== 'line') return;
                var ctm = t.getScreenCTM();
                var rootCTM = root.getScreenCTM();
                console.log(ctm, rootCTM)
                showCircle(cs[0], t.x1.baseVal.value, t.y1.baseVal.value, ctm, rootCTM);
                showCircle(cs[1], t.x2.baseVal.value, t.y2.baseVal.value, ctm, rootCTM);
            }

            function showCircle(c, x, y, ctm, rootCTM) {
                var pt1 = root.createSVGPoint();
                pt1.x = x;
                pt1.y = y;
                console.log(pt1)
                var pt2 = pt1.matrixTransform(rootCTM.inverse().multiply(ctm));
                //pt2 = pt1.matrixTransform(ctm).matrixTransform(rootCTM);
                c.cx.baseVal.value = pt2.x;
                c.cy.baseVal.value = pt2.y;
            }

        }
    }
</script>

<style>
    svg {
        margin: 0;
    }

</style>
