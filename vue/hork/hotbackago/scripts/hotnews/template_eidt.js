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
                url: ApiToUrl(Api.hotnews_template_get),//接口地址
                method: 'get',
                data:{id},
                success: function (response) {
                    if (response.code == 200) {
                        var data = response.data;
                        $("input[name=name]").val(data.name);
                         
                        $("textarea[name=content]").val(data.content);
                         
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
        }else{
            var c = '<!DOCTYPE html> \n' +
                        '<html lang="en"> \n' +
                        '<head> \n'+
                            '<meta charset="UTF-8"> \n'+
                            '<title></title> \n'+
                        '</head> \n'+
                        '<body> \n \n \n'+
                            
                        '</body> \n'+
                        '</html> \n';
                        $("textarea[name=content]").val(c);
        }  

        //添加，编辑
        var add = function () {
            var index = parent.layer.getFrameIndex(window.name);
            var apiUri = Api.hotnews_template_put;
            if (id == "0")
                apiUri = Api.hotnews_template_add; 
            var name = $.trim($("input[name=name]").val());
            var content = $.trim($("textarea[name=content]").val());
            
            if(name == '' || content == '')
            {
                layer.msg('名称和内容都不能为空！');
                  return;
            }

            var par = {
                _id: id,
                name: name,               
                content:content

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
        var test = function(){
            
            var apiUri = Api.hotnews_template_test;  
            var content = $.trim($("textarea[name=content]").val());
            
            if(content == '')
            {
                layer.msg('内容不能为空！');
                  return;
            }
            //content = content.replace(/"/g,'\\"');
             
            $.ajax({
                url: ApiToUrl(apiUri), 
                data: JSON.stringify(content),
                type: 'POST',
                //processData: false,
                dataType: 'json',
                //contentType: 'application/json',
                contentType: 'application/json',
                success: function (response) {
                    if (response.code == 200) {
                        layui.layer.msg(response.data);
                         
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







