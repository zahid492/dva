/*
createby:刘建强
date:20190522
des:模板添加/编辑
*/

$(function () {

    var id = queryString("id") && decodeURI(queryString("id"));
    var form;

    layui.use(['form', 'layer', 'layedit'], function () {
        form = layui.form;
        layer = layui.layer;
        layedit = layui.layedit;

        //页面首次加载数据(必须放在前面)
        var load = function () {
                return getModel()              
        }
        //加载表单数据
        var getModel = function () {           
            //编辑赋值
            return $.ajax({
                url: ApiToUrl(Api.hotnews_module_get),//接口地址
                method: 'get',
                data:{id},
                success: function (response) {
                    if (response.code == 200) {
                        var data = response.data;
                        $("input[name=name]").val(data.moduleName);
                         
                        $("textarea[name=keywords]").val(data.keywords);
                         
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

        //添加，编辑
        var add = function () {
            var index = parent.layer.getFrameIndex(window.name);
            var apiUri = Api.hotnews_module_put;
            if (id == "0")
                apiUri = Api.hotnews_module_add; 
            var name = $.trim($("input[name=name]").val());
            var keywords = $.trim($("textarea[name=keywords]").val()); 
            keywords = keywords.replace(/，/g,',').replace(/,$/gi,''); 
            if(name == '' || keywords == '')
            {
                layer.msg('名称和关键词不能为空！');
                  return;
            }
            var ks = keywords.split(',');
            var par = {
                _id: id,
                moduleName: name,               
                keywords:ks

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
            //执行提交，异步到后台
            // _this.add(_this.id);
            add();
            //执行完后台后清除下表单数据(防止数据重复)
            formData = new FormData();
            //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            return false;
        });

    });
    //关闭弹窗
    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

});







