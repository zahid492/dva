/*
createby:刘建强
date:20190619
des:媒体账户
*/

var accountPlatForms = ['新浪微博'];
$(function () {
    //刷新函数变量
    var refresh;
    var delFn;
});
layui.use(['table','form'], function () {
    var table = layui.table;
    form = layui.form;

    renderPlatforms();
    //展示已知数据
    table.render({
        elem: '#table'
        , url: ApiToUrl(Api.hotnews_MediaAccount_list)  
        ,defaultToolbar:[]
        ,parseData: function(res){ //res 即为原始返回的数据 
            var data = res.data.map((d,i)=>{             
             return {...d, index : i+1}               
          })  
         return {
           "code": res.code, //解析接口状态 
           "count": res.count, //解析数据长度
           "data": data  //解析数据列表
         };
        }
        ,loading:true
        ,cols: [[ //标题栏 
              { field: 'index', title: '序号', width: 400, align: 'center' }
            , { field: 'category', title: '分类', width: 400, align: 'center' }
            , { field: 'name', title: '名称', width: 400, align: 'center' }
            
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
    form.on('select(platform)', function(data){ 
        refresh();
    }); 
  var  active = {
    //添加实体语料
    add: function () {
        edit(0);
    } 
};
    //编辑弹窗
    function edit(id) {
        //弹窗
        var index = layer.open({
            type: 2,
            title: "新闻源",
            offset: '40px',
            area: ['600px', '480px'],
            fixed: false, //不固定
            maxmin: true,
            content: "./mediaAccount_edit.html?id=" + id,
        });
         
    }
    function renderPlatforms()
        {            
            $('#platform').children("option").remove();
            var option = document.createElement("option");
            option.value = '';
            option.text = '全部';                   
            $('#platform').append(option);

            accountPlatForms.forEach(d=>{
                            var option = document.createElement("option");
                            option.value = d;
                            option.text = d;                   
                            $('#platform').append(option);
                })
                        
            form.render("select"); 
             
                    
        }
    //刷新
    refresh = function () {
        //执行重载
        table.reload('table', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {
                platform: $("select[name=platform]").val()
            }
        });
    }
    //删除
    delFn = function (id) {
        $.ajax({
            url: ApiToUrl(Api.hotnews_MediaAccount_del),
            type: 'POST',
            processData: false,
            data:  JSON.stringify(id),
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