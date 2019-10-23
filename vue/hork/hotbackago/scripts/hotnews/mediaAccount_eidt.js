/*
createby:刘建强
date:20190522
des:模板添加/编辑
*/
var accountPlatForms = ['新浪微博'];
var categorys = ['娱乐','体育','财经','人文','科技','互联网','数码','社会','汽车','房产','旅游','时尚','星座','美食','生活','育儿','影视','音乐','动漫','搞笑','教育','文化','宠物','游戏','家居','摄影','健康','养生','科学','综合','其它'];

$(function () {

    var id = queryString("id") && decodeURI(queryString("id"));
    var form;

    layui.use(['form', 'layer', 'layedit'], function () {
        form = layui.form;
        layer = layui.layer;
        layedit = layui.layedit;
        renderPlatforms();
        renderCategorys();
        //页面首次加载数据(必须放在前面)
        var load = function () {
                return getModel()              
        }
        //加载表单数据
        var getModel = function () {           
            //编辑赋值
            return $.ajax({
                url: ApiToUrl(Api.hotnews_MediaAccount_get),//接口地址
                method: 'get',
                data:{id},
                success: function (response) {
                    if (response.code == 200) {
                        var data = response.data;
                        $("select[name=platform]").val(data.platform);
                        $("select[name=category]").val(data.category);
                        $("input[name=name]").val(data.name);
                        $("input[name=link]").val(data.link);                        
                        $("input[name=weiboid]").val(data.weiboID);                        
 
                         
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        } 
        //页面加载
        if (id && id != 0) {
            $.when(load(id)).done(function () {
                //异步加载完再渲染
                form.render();
            });
        }
        function renderPlatforms()
        {            
            $('#platform').children("option").remove();            
            accountPlatForms.forEach(d=>{
                            var option = document.createElement("option");
                            option.value = d;
                            option.text = d;                   
                            $('#platform').append(option);
                })
                        
            form.render("select"); 
             
                    
        }
        function renderCategorys()
        {            
            $('#category').children("option").remove();            
            categorys.forEach(d=>{
                            var option = document.createElement("option");
                            option.value = d;
                            option.text = d;                   
                            $('#category').append(option);
                })
                        
            form.render("select"); 
             
                    
        }
        //添加，编辑
        var add = function () {
            var index = parent.layer.getFrameIndex(window.name);
            var apiUri = Api.hotnews_MediaAccount_put;
            if (id == "0")
                apiUri = Api.hotnews_MediaAccount_add; 


            var platform = $("select[name=platform]").val();
            var category = $("select[name=category]").val();
            var name = $.trim($("input[name=name]").val());
            var link = $.trim($("input[name=link]").val());                       
            var weiboid = $.trim($("input[name=weiboid]").val());            
 
            
            if(name == '' || link == '')
            {
                layer.msg('名称和链接都不能为空！');
                  return;
            }

            var par = {
                _id: id, 
                name: name,
                category: category,
                platform:platform,
                link: link,
                weiboID: weiboid

            };
            $.ajax({
                url: ApiToUrl(apiUri),
                data: JSON.stringify(par),
                type: 'POST',
                processData: false,
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    if (response.code == 200) {
                        layui.layer.msg("保存成功！");
                        setTimeout(function () {
                            parent.layer.close(index);
                        }, 1000);
                        //刷新列表
                        parent.refresh();
                    } else {
                        layui.layer.msg(response.errmsg);
                    }
                }
                , error: function (data) {
                    layui.layer.msg(data);
                },
            })
        }
        
        //监听提交
        form.on('submit', function (data) { 
            var ele = data.elem;
              if(ele.name == 'test')
              {
                test(); 
              }
               
             else{
                 //执行提交，异步到后台
                // _this.add(_this.id);
                add();
                //执行完后台后清除下表单数据(防止数据重复)
                formData = new FormData();
                //阻止表单跳转。如果需要表单跳转，去掉这段即可。
             }
            
            return false;
        });

    });
    //关闭弹窗
    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

});







