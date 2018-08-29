/*
 * @Author: wsc
 * @Date:   2018-04-09 16:26:39
 * @Last Modified by:   wsc
 * @Last Modified time: 2018-08-27 10:24:25
 */
var Rx = rxjs;



$(function () {
    var input = Rx.fromEvent(document.querySelector('input'), 'input');
    console.log(input)
    input.pluck('target', 'value').pairwise()
        .subscribe(value => console.log(value));


});