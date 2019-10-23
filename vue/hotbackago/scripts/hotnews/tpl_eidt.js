/*
createby:刘建强
date:20190522
des:框架添加/编辑
*/
var PropertiesData = [];
$(function () {

    var id = queryString("id") && decodeURI(queryString("id"));
    var form;

    layui.use(['form', 'layer', 'table'], function () {
        form = layui.form;
        layer = layui.layer;
        table = layui.table;
        //页面首次加载数据(必须放在前面)
        var load = function () {

            if (id && id != '0') {
                getModel(0);
            } else {
                renderTable();
            }


        }
        //加载表单数据
        var getModel = function () {
            //编辑赋值
            return $.ajax({
                url: ApiToUrl(Api.hotnews_tpl_get),//接口地址
                method: 'get',
                data: {id},
                success: function (response) {
                    if (response.code == 200) {
                        var data = response.data;

                        $("input[name=name]").val(data.name);
                        $("textarea[name=content]").val(data.content);
                        if (data.tlProperties) {
                            PropertiesData = data.tlProperties;
                        }

                        renderTable();
                        form.render();  //更新渲染

                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
        //页面加载

        $.when(load()).done(function () {
            //异步加载完再渲染
            form.render();
        });

        function parseData() {
            return PropertiesData.map((t, index) => {
                var _type = t.pType;
                if (_type == 1) {
                    return {...t, pTypeText: '固定值', pMix: '-', pMax: '-', index}
                } else if (_type == 2) {
                    return {...t, pTypeText: '范围值', pValue: '-', index}
                }

                return t;
            })

        }

        function renderTable() {
            var _datas = parseData();
            table.render({
                elem: '#propertieData'
                , cols: [[ //标题栏
                    {field: 'name', edit: 'text', title: '名称', align: 'center'}
                    , {field: 'pTypeText', title: '类型', width: 100, align: 'center'}
                    , {field: 'pValue', edit: 'text', width: 100, title: '属性值'}
                    , {field: 'pMix', edit: 'text', edit: 'text', width: 100, title: '最小值'}
                    , {field: 'pMax', edit: 'text', edit: 'text', width: 100, title: '最大值'}
                    , {fixed: 'right', width: 100, align: 'center', toolbar: '#barDemo'}
                ]]
                , data: _datas
                , even: true //隔行不同颜色
                , page: false //是否显示分页

            });
        }

        table.on('edit(propertieData)', function (obj) { //注：edit是固定事件名，propertieData是table原始容器的属性 lay-filter="对应的值"
            var index = obj.data.index;

            if (obj.field == 'name') {
                PropertiesData[index][obj.field] = obj.value;
            } else {
                if (PropertiesData[index][obj.field] != -1) {
                    var v = parseFloat(obj.value);
                    if (isNaN(v) || v < 0) {
                        layer.msg('输入不小于0的数字！');
                    } else {
                        PropertiesData[index][obj.field] = v;
                    }
                }

            }
            refresh();

        });
        //监听工具条
        table.on('tool(propertieData)', function (obj) {
            var data = obj.data;
            if (obj.event == 'del') {
                PropertiesData.splice(data.index, 1);
                refresh();

            }
        });
        addPropertie = function () {
            var name = $.trim($("input[name=propertiename]").val());
            var v1 = parseFloat($.trim($("input[name=price_min]").val()));
            var v2 = $.trim($("input[name=price_max]").val());
            if (name == '') {
                layer.msg('名称不能为空！');
                return;
            }
            var len = PropertiesData.filter(p => p.name == name).length;
            if (len > 0) {
                layer.msg('该属性已存在！');
                return;
            }
            if (isNaN(v1) || v1 < 0) {
                layer.msg('值不能为空且必须是不小于0的数字');
                return;
            }

            if (v2 == '') {
                var item = {
                    name: name,
                    pType: 1,
                    pValue: v1,
                    pMix: -1,
                    pMax: -1
                }
                PropertiesData.push(item);
                refresh();
            } else {
                var max = parseFloat(v2);
                if (isNaN(max) || max < 0) {
                    layer.msg('最大值必须是不小于0的数字');
                    return;
                }
                if (max <= v1) {
                    layer.msg('最大值必须大于最小值！');
                    return;
                }
                var item = {
                    name: name,
                    pType: 2,
                    pValue: '-',
                    pMix: parseFloat(v1),
                    pMax: max
                }
                PropertiesData.push(item);
                refresh();
            }
            $("input[name=propertiename]").val('');
            $("input[name=price_min]").val('');
            $("input[name=price_max]").val('');

        }
        //刷新
        refresh = function () {
            var _datas = parseData();
            //执行重载
            table.reload('propertieData', {data: _datas});
        }
        //添加，编辑
        var add = function () {
            var index = parent.layer.getFrameIndex(window.name);
            var apiUri = Api.hotnews_tpl_put;
            if (id == "0")
                apiUri = Api.hotnews_tpl_add;


            var name = $.trim($("input[name=name]").val());


            var content = $.trim($("textarea[name=content]").val());

            if (name == '' || content == '') {
                layer.msg('名称不能为空！');
                return;
            }
            var par = {
                _id: id,
                name: name,
                content: content,
                tlProperties: PropertiesData

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

        $('.layui-btn-add').on('click', function () {
            addPropertie();
        });


    });
    //关闭弹窗
    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

});







