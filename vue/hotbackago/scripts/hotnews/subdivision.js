/*
createby:xiangmh
date:20180809
des:用户管理
*/
$(function () {
    //刷新函数变量
    var refresh;
    var delFn;
});
layui.use('table', function () {
    var table = layui.table;
    renderdataTypeSelect();
    //展示已知数据
    table.render({
        elem: '#table'
        , url: ApiToUrl(Api.hotnews_subdivision_list) //数据接口=======
        ,cols: [[ //标题栏 
              { field: 'dataTypeName', title: '类型', width: 400, align: 'center' }
            ,  { field: 'subTypeName', title: '细分', width: 400, align: 'center' }

            
            , { fixed: 'right', title: '操作', width: 250, align: 'center', toolbar: '#barDemo' }
        ]]
        ,loading:true
        , even: true //隔行不同颜色
        , page: true //是否显示分页
        , limits: [10, 15, 30, 50, 100]
        , limit: 15 //每页默认显示的数量
        , response: {
            statusCode: 200 //成功的状态码，默认：0
        }
        , done: function (res, curr, count) {
            if (res.code != 200) {
                layui.layer.msg(res.errmsg);
            }
        }
    });
    //监听工具条
    table.on('tool(dataTable)', function (obj) {
        var data = obj.data;
        if (obj.event == 'del') {
            layer.confirm('确认删除行吗？', function (index) {
                //删除函数
                delFn(data._id);
                layer.close(index);
                refresh();
            });
        } else if (obj.event == 'edit') {
            //修改
            edit(data._id);
        }  
    });
    var  active = {
        //添加实体语料
        add: function () {
            edit(0);
        }
        , search: function () {
            //执行重载
            table.reload('table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {  dataType: $("select[name=datatype]").val() == "全部"  ? '' :  $("select[name=datatype]").val()
                }
            });
        }
    };
    //编辑弹窗
    function edit(id) {
        //弹窗
        layer.open({
            type: 2,
            title: "细分",
            offset: '40px',
            area: ['500px', '480px'],
            fixed: false, //不固定
            maxmin: true,
            content: "./subdivision_edit.html?id=" + id,
        });
    }
    //刷新
    refresh = function () {
        //执行重载
        table.reload('table', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {
                dataType:  $("select[name=datatype]").val() == "全部"  ? '' :  $("select[name=datatype]").val()
            }
        });
    }
    //删除
    delFn = function (id) {
        $.ajax({
            url: ApiToUrl(Api.hotnews_subdivision_del),
            type: 'POST',
            processData: false,
            data: '"' + id + '"',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.code == 200) {
                    layui.layer.msg("删除成功！");
                    //刷新列表
                    refresh();
                } else {
                    layui.layer.msg(response.errmsg);
                }
            }
            , error: function (data) {
                layui.layer.msg(data);
            },
        });
    }

    function  renderdataTypeSelect(){
         
        var Url = ApiToUrl(Api.hotnews_dataType_list);
        var layer = layui.layer;
    
        $.getJson(Url, { page: 1, limit: 1000 }, rep => {
            if (rep.code == 200) {
                var repData = rep.data;
    
                var data = repData.map(x => { return { name: x.name } });
    
                $('#datatype').children("option").remove();
                data.unshift({ _id: "", name: "全部" });

                data.forEach(d=>{
                    var option = document.createElement("option");
                    option.value = d.name;
                    option.text = d.name;                   
                    $('#datatype').append(option);
                })
                
                layui.form.render("select");
            }
            else {
                layer.msg(rep.errmsg);
            }
        });
    }

    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});