 function save() {
     var param = {};
     param.name = $.trim($('#txtname').val());
     param.email = $.trim($('#txtemail').val());
     param.tel = $.trim($('#txttel').val());
     param.bussinessGroup = $.trim($('#txtteam').val());
     param.serviceClient = $.trim($('#txtbrand').val());
     param.requests = [];
     $('.option-list .option').each(function(index, item) {
         var tag = $(item).attr('tag');
         if (tag < 5) {
             param.requests.push(tag);
         } else {
             var other = $.trim($('#mask textarea').val());
             if (other) {
                 param.requests.push(other);
             } else {
                 $(item).removeClass('option');
             }


         }
     })
     if (!param.name) {
         $('.errlabelname').removeClass('none');
         return;
     }
     var isEmail = checkEmail(param.email)
     if (!param.email || !isEmail) {
         $('.errlabelemail').removeClass('none');
         return;
     }
     if (!param.serviceClient) {
         $('.errlabelbrand').removeClass('none');
         return;
     }
     if (param.requests.length === 0) {
         alert('请选择服务内容！');
         fullpage_api.moveSectionUp();

         return;
     }
     var url = API_ROOTS + 'api/IntentionUser';
     $.ajax({
         url: url,
         data: JSON.stringify(param),
         type: "post",
         dataType: "json",
         contentType: 'application/json',
         success: function(Response) {

         }
     })
     fullpage_api.moveSectionDown();
 }


 function checkEmail(str) {
     var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
     if (re.test(str)) {
         return true;
     } else {
         return false;
     }
 }

 //选择发送内容
 function SetChecked() {
     $('.option-list').on('click', '.list', function() {
         var _this = this;
         var _tag = $(this).attr('tag');
         //处理前四个选项
         if (_tag < 5) {
             if ($(this).hasClass('option')) {
                 $(this).removeClass('option');
                 $(this).find('.icon-tick').removeClass('icon-tick').addClass('icon-check');
             } else {
                 $(this).addClass('option');
                 $(this).find('.check').removeClass('icon-check').addClass('icon-tick');
             }
         } else {
             //处理其它选项
             if ($(this).hasClass('option')) {
                 $(this).removeClass('option');
                 $(this).find('.icon-tick').removeClass('icon-tick').addClass('icon-check');
                 $('#mask textarea').val('');
             } else {
                 $('#mask').show();

                 $('#mask .btn1').click(function() {
                     var content = $.trim($('#mask textarea').val());
                     if (content) {
                         $('#mask').hide();
                         $(_this).addClass('option');
                         $(_this).find('.check').removeClass('icon-check').addClass('icon-tick');
                         setServiceContent();
                     } else {
                         alert('请输入内容！');
                     }
                 });

                 $('#mask .btn2').click(function() {
                     $('#mask').hide();
                     $('#mask textarea').val('');
                     setServiceContent();
                 });
             }
         }

         setServiceContent();
     })
 }



 $(function() {
     $('body').height($('body')[0].clientHeight);
     setFullPage();

     //第二屏复选框
     SetChecked();
     //设置分享时的网址及图片
     setShare();
     //设置发布内容到第四屏
     setServiceContent();


     //第三屏保存数据
     $('.thiBtn').click(function() {
         save();
     });
     //显示对外分享平台
     $('.fouBtn').click(function() {
         fullpage_api.moveTo(1, 0)
         _system._guide(true);
     });


     $('#txtname').click(function() {
         $('.errlabelname').addClass('none');
     })

     $('#txtemail').click(function() {
         $('.errlabelemail').addClass('none');
     })
     $('#txtbrand').click(function() {
         $('.errlabelbrand').addClass('none');
     })

 })

 function setFullPage() {
     $('#fullpage').fullpage({
         navigation: false,
         licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
         loop: false,
         drag: false,
         anchors: ['page1', 'page2', 'page3', 'page4'],
         afterRender: function() {
             $('.btnDown').click(function() {

                 fullpage_api.moveSectionDown(); //向下移动一屏
             });
         },
         afterLoad: function(prev, cur) {

             //fullpage_api.setAllowScrolling(false, 'up');    //禁止向上滑动
             //fullpage_api.setAllowScrolling(false, 'down');  //禁止向下滑动

             if (cur.index == 2) {
                 fullpage_api.setAllowScrolling(true, 'up');
                 fullpage_api.setAllowScrolling(false, 'down');

             } else {
                 fullpage_api.setAllowScrolling(true, 'down');

             }

             if (cur.index == 3) {
                 fullpage_api.setAllowScrolling(false, 'up'); //禁止向上滑动
                 $('.zhi').css({
                     "animation": "zhi 1.5s linear forwards alternate"
                 })
             }

         }
     });
 }


 function setServiceContent() {
     var serviceContent = '';
     $('.option-list .option').each(function(index, item) {
         var tag = $(item).attr('tag');
         if (tag < 5) {
             serviceContent += $.trim($(item).text()) + ' ';
         } else {
             serviceContent += '其它...'
         }
     });

     $('#serviceContent').html($.trim(serviceContent));
 }

 function setShare() {
     var wxUrl = 'http://wribot.ijiebao.com/';
     var appid = "wxd39d11722edb9afa";
     var wxShare = function(ed) {
         var wxImg = '<img id="wxlogo" src="" alt="" style="display: none; left: -1000px; top:0;">';
         $("body").prepend($(wxImg));

         $("#wxlogo").attr("src", wxUrl + ed.PicUrl);
         $.ajax({
             type: "get",
             url: 'http://api.ijiebao.com/wechat/jsapi/signature',
             dataType: "json",
             data: {
                 //url: wxUrl + 'collection.html',
                 url: encodeURI(location.href),

                 appid: appid
             },
             success: function(data) {
                 var _data = data.data;
                 _data.appid =
                     wx.config({
                         debug: false,
                         appId: appid,
                         timestamp: _data.timestamp,
                         nonceStr: _data.noncestr,
                         signature: _data.signature,
                         jsApiList: [
                             'onMenuShareTimeline', 'onMenuShareAppMessage'
                         ]
                     });

                 wx.ready(function() {
                     //var link = location.href.split('#').toString();
                     var link = location.href;

                     wx.onMenuShareTimeline({
                         title: ed.Title,
                         link: link,
                         // imgUrl: 'http://ai.bluefocus.com/wap/' + ed.PicUrl,
                         imgUrl: wxUrl + ed.PicUrl,

                         success: function(res) {
                             //alert("1:" + JSON.stringify(res))
                         },
                         fail: function(err) {
                             //alert("2:" + JSON.stringify(err))
                         }
                     });

                     wx.onMenuShareAppMessage({
                         title: ed.Title,
                         desc: "妙笔，您聪明、可靠、成本低的撰稿神助手",
                         link: link,
                         imgUrl: wxUrl + ed.PicUrl,
                         success: function(res) {
                             //alert("11:" + JSON.stringify(res))
                         },
                         fail: function(err) {
                             //alert("22:" + JSON.stringify(err))
                         }
                     });

                 });

             },
             error: function(xhr, status, error) {
                 //alert(status);
                 //alert(xhr.responseText);
             }
         });
     };

     // wx
     wxShare({
         Title: "妙笔撰稿机器人，了解一下",
         PicUrl: "img/wribotLogo.jpg"
     });
 }