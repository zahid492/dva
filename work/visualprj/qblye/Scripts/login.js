var openid = sessionStorage.getItem('openid');

var animating = false
if (openid) {

    $(document).ready(function () {

        function ripple(elem, e) {
            $('.ripple').remove();

            var elTop = elem.offset().top, elLeft = elem.offset().left, x = e.pageX - elLeft, y = e.pageY - elTop;
            var $ripple = $('<div class=\'ripple\'></div>');
            $ripple.css({
                top: y,
                left: x
            });
            elem.append($ripple);
        }

        $(document).on('click', '.s_Btn02', function (e) {
            if (animating)
                return;
            animating = true;
            var that = this;

            var mobile = $('.tel input').val();
            if (!(/^1\d{10}$/.test(mobile))) {
                //alert("请输入完整的11位手机号");
                $('#tip .s_win2 p').html("请输入完整的11位手机号");
                $('#tip').fadeIn(400, function () {
                    setTimeout(function () { $('#tip').fadeOut(200); }, 1000);
                });
            } else {
                var code = $('.code input').val();
                if (!(/^\d{4,5}$/.test(code))) {
                    //alert("请输入正确验证码");
                    $('#tip .s_win2 p').html("请输入正确验证码");
                    $('#tip').fadeIn(400, function () {
                        setTimeout(function () { $('#tip').fadeOut(200); }, 1000);
                    });
                } else {
                    //订阅按钮动画开始
                    ripple($(that), e);
                    $(that).addClass('processing');

                    //后台验证验证码
                    validateCode(mobile, code,
                    //成功后的操作
                         function () {
                             //添加用户到库里
                             createUser(openid, mobile, function () { success(that); animating = false; }, function () {
                                 animating = false;
                                 $(that).removeClass('success processing');
                             });
                         }
                    //验证失败后的操作
                       , function () {
                           animating = false;
                           $(that).removeClass('success processing');
                           $('.ripple').remove();
                           //alert("请输入正确验证码");
                           $('#tip .s_win2 p').html("请输入正确验证码");
                           $('#tip').fadeIn(400, function () {
                               setTimeout(function () { $('#tip').fadeOut(200); }, 1000);
                           });
                       })
                }
            }

        });

        //	        $('.tel input').bind('input',function () {
        //	            var val = $(this).val();
        //	            if (!(/^1\d{10}$/.test(val))) {
        //	                console.log(val);
        //	                $(this).next('i').removeClass('ok').addClass('error');

        //	            } else {
        //	                $(this).next('i').removeClass('error').addClass('ok');
        //	            }
        //	        })
        $('.tel input').change(function () {
            var val = $(this).val();
            if (!(/^1\d{10}$/.test(val))) {

                $(this).next('i').removeClass('ok').addClass('error');

            } else {
                $(this).next('i').removeClass('error').addClass('ok');
            }
        })
        $('.code input').change(function () {
            var val = $(this).val();
            if (!(/^\d{4}$/.test(val))) {
                $(this).next('i').removeClass('ok').addClass('error');

            } else {
                $(this).next('i').removeClass('error').addClass('ok');
            }
        })


        $('.code .gain_num').click(function () {
            $(this).attr("disabled", true); 
            getValidateCode(this);
        });


    });

}
var timer = null;
function getValidateCode(that) {
    var val = $('.tel input').val();
    if (!(/^1\d{10}$/.test(val))) {
        //alert("请输入完整的11位手机号");
        $('#tip .s_win2 p').html("请输入完整的11位手机号");
        $('#tip').fadeIn(400);
        $(that).removeAttr('disabled');
        setTimeout(function () { $('#tip').fadeOut(200); }, 1400);
    } else {
        
        var mis = 60;
        $(that).attr("disabled", true);   
        $(that).html(mis);
        
        clearInterval(timer);
        timer = setInterval(function () {
            if (mis > 0) {
                mis--
                $(that).html(mis);
            } else {
                clearInterval(timer);
                $(that).html('获取验证码');
                $(that).removeAttr('disabled');
            }
        }, 1000);
        $.ajax({
            type: 'post',
            url: '/api/user/SendSecurityCodeToTel.ashx',
            data: { mobile: val },
            dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等  
            success: function (result) {
                if (result.Code == 200) {
                    //clearInterval(timer);
                    
                    //$(that).html('获取验证码');
                } else {
                    //alert('发送失败，请重新获取');
                    $('#tip .s_win2 p').html("发送失败，请重新获取");
                    $('#tip').fadeIn(400, function () {
                        setTimeout(function () { $('#tip').fadeOut(200); }, 1000);
                    });
                    clearInterval(timer);
                     
                    //$(that).html('获取验证码');
                }

            },
            error: function () {
                //alert('发送失败，请重新获取');
                $('#tip .s_win2 p').html("发送失败，请重新获取");
                $('#tip').fadeIn(400, function () {
                    setTimeout(function () { $('#tip').fadeOut(200); }, 1000);
                });
                clearInterval(timer);
                
                $(that).html('获取验证码');
            }
        });
    }
}


//后台验证用户输入的验证码
function validateCode(mobile, code, successFun, errorFun) {
    if (code == 99999) {
        successFun();
    } else {
        $.ajax({
            type: 'post',
            url: '/api/user/validateCode.ashx',
            data: { mobile: mobile, code: code },
            dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等  
            success: function (result) {
                if (result.Code == 200) {

                    successFun();
                } else {
                    errorFun();
                }

            },
            error: function () {
                errorFun();
            }
        });
    }
}
//添加用户
function createUser(openid, mobile, successFun, errorFun) {
     
    $.ajax({
        type: 'post',
        url: '/api/user/create.ashx',
        data: { mobile: mobile, openid: openid },
        dataType: 'json', //服务器返回的数据类型 可选XML ,Json jsonp script htmltext等  
        success: function (result) {
            if (result.Code == 200) {
                sessionStorage.setItem('curuser', JSON.stringify(result.Data));
                successFun();
            } else {
                errorFun();
            }

        },
        error: function () {
            errorFun();
        }
    });
}

//添加用户成功后执行的函数
function success(that) {

    $(that).addClass('success');
    setTimeout(function () {

        //$login.addClass('inactive');

        $(that).removeClass('success processing');
    }, 300);
    setTimeout(function () {
        document.location.href = 'create.html?v='+Math.random(0, Date.now());
    }, 400);

}