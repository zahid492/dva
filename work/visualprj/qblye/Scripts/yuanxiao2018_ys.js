$(function () {
    var name = store.session('dmname');
    var openid = store.session('openid');
    // 发生姓名，返回包含姓名的图片

    $.ajax({
        type: 'post',
        url: 'api/UserActivity/ActivityImg.ashx',
        data: {openid: openid, name: name},
        dataType: 'json',
        success: function (result) {
            if (result.Code == 200) {
                // $(".LastContainer").css({"background": "url("+result.Data+") no-repeat", "background-size": "cover"})
                $("#yspic").attr("src", result.Data)
            }
        }
    });

});
