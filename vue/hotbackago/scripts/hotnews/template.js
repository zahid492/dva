/*
createby:刘建强
date:20190522
des:模板管理
*/
$(function () {
    //刷新函数变量
    var refresh;
    var delFn;
});
layui.use('table', function () {
    var table = layui.table;
    //展示已知数据
    table.render({
        elem: '#table'
        , url: ApiToUrl(Api.hotnews_template_list) //数据接口=======
        ,toolbar: '#toolbarDemo' 
        ,defaultToolbar:[]
        ,loading:true
        ,cols: [[ //标题栏 
             { field: 'name', title: '名称', width: 400, align: 'center' }
            
            , { fixed: 'right', title: '操作', width: 250, align: 'center', toolbar: '#barDemo' }
        ]]
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
//工具栏事件
table.on('toolbar(dataTable)', function(obj){ 
    switch(obj.event){
      case 'add':
      edit(0);
      break;
      
    };
  });
   
    //编辑弹窗
    function edit(id) {
        //弹窗
        var index = layer.open({
            type: 2,
            title: "模板",
            offset: '40px',
            area: ['800px', '780px'],
            fixed: false, //不固定
            maxmin: true,
            content: "./template_edit.html?id=" + id,
        });
        layer.full(index);
    }
    //刷新
    refresh = function () {
        //执行重载
        table.reload('table', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {
                key: $("#key").val()
            }
        });
    }
    //删除
    delFn = function (id) {
        $.ajax({
            url: ApiToUrl(Api.hotnews_template_del),
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

    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
});