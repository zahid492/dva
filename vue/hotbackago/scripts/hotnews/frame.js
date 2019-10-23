// 默认开始不调接口，选择和再调
$(function () {
    //刷新函数变量
    var refresh;
    var delFn;


});

var DataTypeName, SubTypeName;
var hasSelect = false;

layui.use(['layer', 'table', 'form'], function () {
    var table = layui.table,
        form = layui.form;
    renderdataTypeSelect();


    //展示已知数据
    function trender(){
        table.render({
            elem: '#table'
            , url: ApiToUrl(Api.hotnews_framework_list)
            , parseData: function (res) {
                var data = res.data.map(d => {
                    var modules = d.modules.map(m => {
                        return m.name
                    })
                    return {...d, module: modules}
                })
                return {
                    "code": res.code, //解析接口状态
                    "count": res.count, //解析数据长度
                    "data": data  //解析数据列表
                };
            }
            , loading: true
            , cols: [[ //标题栏
                {field: 'dataTypeName', title: '类型', align: 'center'}
                , {field: 'subTypeName', title: '细分', align: 'center'}
                , {field: 'templateName', title: '模板名称', align: 'center'}
                , {field: 'keywords', title: '框架关键词', align: 'center'}
                , {field: 'name', title: '框架名称', align: 'center'}
                , {field: 'module', title: '模块', align: 'center'}

                , {fixed: 'right', title: '操作', width: 250, align: 'center', toolbar: '#barDemo'}
            ]]
            , even: true //隔行不同颜色
            , page: false //是否显示分页
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
    }

    form.on('select(datatype)', function (data) {

        DataTypeName = data.value;

        if (DataTypeName == "全部") {
            $('#subdivision').children("option").remove();
            // form.render("select");
        }
        else {
            $.getJson(ApiToUrl(Api.hotnews_subdivision_list), {page: 1, limit: 1000, dataType: DataTypeName}, rep => {
                if (rep.code == 200) {
                    hasSelect = true;
                    var repData = rep.data;

                    var data = repData.map(x => {
                        return {name: x.subTypeName}
                    });

                    $('#subdivision').children("option").remove();
                    data.unshift({_id: "", name: "全部"});

                    data.forEach(d => {
                        var option = document.createElement("option");
                        option.value = d.name;
                        option.text = d.name;
                        $('#subdivision').append(option);
                    })

                    form.render("select");
                } else {
                    layer.msg(rep.errmsg);
                }
            });
        }
    });


    //编辑弹窗
    function edit(id) {
        //弹窗
        layer.open({
            type: 2,
            title: "框架",
            offset: '40px',
            area: ['700px', '650px'],
            fixed: false, //不固定
            maxmin: true,
            content: "./frame_edit.html?id=" + id,
        });
    }

    //刷新
    refresh = function () {
        if(hasSelect && !(_.isNil(DataTypeName) || DataTypeName==="全部")){
            trender();
            //执行重载
            table.reload('table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    dataType: $("select[name=datatype]").val() == "全部" ? '' : $("select[name=datatype]").val(),
                    SubTypeName: $("select[name=subdivision]").val() == "全部" ? '' : $("select[name=subdivision]").val(),
                }
            });
        }

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
            url: ApiToUrl(Api.hotnews_framework_del),
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

    function renderdataTypeSelect() {

        var Url = ApiToUrl(Api.hotnews_dataType_list);
        var layer = layui.layer;

        $.getJson(Url, {page: 1, limit: 1000}, rep => {
            if (rep.code == 200) {
                var repData = rep.data;

                var data = repData.map(x => {
                    return {name: x.name}
                });

                $('#datatype').children("option").remove();
                data.unshift({_id: "", name: "全部"});

                data.forEach(d => {
                    var option = document.createElement("option");
                    option.value = d.name;
                    option.text = d.name;
                    $('#datatype').append(option);
                })

                layui.form.render("select");
            } else {
                layer.msg(rep.errmsg);
            }
        });
    }

    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});