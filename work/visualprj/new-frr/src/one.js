import $ from "jquery";
import _ from "lodash";

$(function () {
    jb.ajx.request({
        url: api.excellentAdSources,
    }).then(function (res) {
        var rdata = res.body.data;
        // var curArr = jb.ui.getSeq(rdata.list, 0);
        var len = rdata.list.length;
        //中间位置
        var midPos = Math.floor(len / 2);
        var baseIconWidth = 60;

        console.log(midPos, rdata.list)

        var fz = jb.util.getFontSize();
        var txtlen = jb.util.getTextWidth({txt: rdata.list[midPos].name, fontSize: 0.25 * fz});
        console.log(txtlen)

        var navTpl = require("./template/four/test.html");
        var navDom = navTpl({
            list:  rdata.list,
            host: imghost,
            midPos: midPos,
            midWidth: (baseIconWidth + txtlen)
        });

        $("#js-topBullet").html(navDom);

    });

})