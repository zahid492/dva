/*
createby:刘建强
date:20190522
des:框架
*/
$(function () {
    //刷新函数变量
    var refresh;
    var delFn;
});

layui.use(['layer', 'table', 'form'], function () {
    var table = layui.table,
        form = layui.form;
    //展示已知数据
    table.render({
        elem: '#table'
        , url: ApiToUrl(Api.hotnews_tpl_list) //数据接口=======
        , parseData: function (res) { //res 即为原始返回的数据
            var data = res.data.map(d => {
                if (d.tlProperties && Array.isArray(d.tlProperties)) {
                    var tlProperties = d.tlProperties.map(t => {
                        var _type = t.pType;
                        if (_type == 1) {
                            var v = t.pValue;
                            return t.name + ' : ' + v;
                        } else if (_type == 2) {
                            var v1 = t.pMix;
                            var v2 = t.pMax;

                            return t.name + ' : (' + v1 + ' , ' + v2 + ')';
                        }
                        return t.name
                    })
                    return {...d, tlProperties: tlProperties.join('<br \/>')}
                } else {
                    return {...d, tlProperties: ''}
                }

            })
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": data  //解析数据列表
            };
        }
        , loading: true
        , cols: [[ //标题栏
            {field: 'name', title: '名称', align: 'center'}
            , {field: 'content', title: '简介', align: 'center'}
            , {field: 'tlProperties', title: '属性',}
            , {fixed: 'right', title: '操作', width: 250, align: 'center', toolbar: '#barDemo'}
        ]]
        , even: true //隔行不同颜色
        , page: true //是否显示分页
        , limits: [10, 15, 30, 50, 100]
        , limit: 10 //每页默认显示的数量
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


    //编辑弹窗
    function edit(id) {
        //弹窗
        layer.open({
            type: 2,
            title: "模板语言",
            offset: '40px',
            area: ['800px', '750px'],
            fixed: false, //不固定
            maxmin: true,
            content: "./tplng_edit.html?id=" + id,
        });
    }

//刷新
    refresh = function () {
        //执行重载
        table.reload('table', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {}
        });
    }

    var active = {
        //添加实体语料
        add: function () {
            edit(0);
        }
        , search: refresh
    };

    //删除
    delFn = function (id) {
        $.ajax({
            url: ApiToUrl(Api.hotnews_tpl_del),
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