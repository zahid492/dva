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
var accountPlatForms = ['百家号', '今日头条'];

layui.use(['layer', 'table', 'form', 'laydate'], function () {
    var table = layui.table,
        form = layui.form,
        //laytpl = layui.laytpl,
        laydate = layui.laydate
    renderdataTypeSelect(accountPlatForms);
    //展示已知数据
    table.render({
        elem: '#table',
        headers: {
            "Authorization": 'Bearer ' + token
        }
        , url: ApiToUrl(Api.hotnews_account_list) //数据接口=======
        , where: {platfrom: '', status: -1}
        , parseData: function (res) { //res 即为原始返回的数据
            var data = res.data.map((d, i) => {
                let Txt = '停用';
                if (d.status == 1) {
                    Txt = '正常';
                }
                let st = d.timeStart;
                let et = d.timeEnd;
                if (st) {
                    let sd = d.timeStart.replace(/Z$/gi, '');
                    let ed = d.timeEnd.replace(/Z$/gi, '');


                    let Timeslot = sd + ' - ' + ed;
                    return {...d, index: i + 1, _status: Txt, Timeslot: Timeslot}
                }

                return {...d, index: i + 1, _status: Txt, Timeslot: '00:00 - 00:00'}

            })
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": data  //解析数据列表
            };
        }
        , loading: true
        , cols: [[ //标题栏
            {field: 'index', title: '序号', align: 'center'}
            , {field: 'platform', title: '平台', align: 'center'}
            , {field: '_status', title: '状态', align: 'center'}
            , {field: 'name', title: '账号', align: 'center'}
            , {field: 'category', title: '分类', align: 'center'}
            , {field: 'publishTypes', title: '可发布的文章分类', align: 'center'}

            , {
                field: 'publishInterval', title: '发布间隔', align: 'center', edit: 'text', templet: function (res) {
                    if (res.publishInterval == 0) {
                        return res.publishInterval;
                    } else if (res.publishInterval == undefined) {
                        return 0;
                    }
                    return res.publishInterval + '小时'
                }
            }
            , {
                field: 'Timeslot', title: '发布时间段', align: 'center', templet: function (res) {
                    return '<span id="T' + res._id + '">' + res.Timeslot + '</span>'
                }
            }
            , {fixed: 'right', title: '操作', width: 250, align: 'center', toolbar: '#barDemo'}
        ]]
        , even: true //隔行不同颜色
        , page: true //是否显示分页
        , limits: [10, 15, 30, 50, 100]
        , limit: 15 //每页默认显示的数量
        , request: {
            limitName: 'size' //每页数据量的参数名，默认：limit
        }
        , response: {
            statusCode: 200 //成功的状态码，默认：0
        }
        , done: function (res, curr, count) {

            if (res.code != 200) {
                layui.layer.msg(res.errmsg);
            } else {
                if (res.data) {
                    res.data.forEach(d => {
                        var select = '#T' + d._id;
                        laydate.render({
                            elem: select
                            , type: 'time'
                            , range: true
                            , format: 'HH:mm'
                            , btns: ['confirm']
                            , done: function (value, date, endDate) {
                                var _that = this;
                                var id = _that.elem[0].id;
                                var _id = id.substring(1);

                                //console.log(_id);
                                //console.log(value); //得到日期生成的值，如：2017-08-18
                                //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                                //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。

                                var start = toNum(date.hours) + ':' + toNum(date.minutes);
                                var end = toNum(endDate.hours) + ':' + toNum(endDate.minutes);
                                updateTimeslot(_id, start, end);

                            }
                        });
                    })
                }
            }


        }
    });
    //监听工具条
    table.on('tool(dataTable)', function (obj) {
        var data = obj.data;
        if (obj.event == 'set') {
            updateStatus(data);
        } else if (obj.event == 'edit') {
            //修改
            edit(data._id);
        } else if (obj.event == 'stopPublish') {
            //停止发布
            updatePublish(data._id, 0);
        } else if (obj.event == 'startPublish') {
            if (data.publishTypes && data.publishTypes.length > 0) {
                //开启自动发布
                updatePublish(data._id, 1);
            } else {
                layer.msg('请设置发布文章分类！');
            }

        }
    });

    table.on('edit(dataTable)', function (obj) {
        if (obj.field == 'publishInterval') {
            //alert(obj.data.interval);
            //alert(obj.data._id);
            var v = parseFloat(obj.value);
            v = Math.abs(v);
            if (isNaN(v)) {
                refresh();
            } else {
                updateInterval(obj.data._id, v);
            }
        }
        //refresh();

    });

    function updateStatus(record) {
        /* let par = {
            id:record._id,
            status : (record.status + 1) % 2       //0跟1互换
        } */
        let status = (record.status + 1) % 2       //0跟1互换
        var url = Api.hotnews_account_putStatus + record._id;

        $.ajax({
            url: url,
            type: 'POST',
            data: status,
            processData: false,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.code == 200) {
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

    function updateTimeslot(id, start, end) {
        let par = {
            startTime: start,
            endTime: end
        }
        var url = Api.hotnews_account_putTimes + id;
        $.ajax({
            url: url,
            type: 'POST',
            processData: false,
            data: JSON.stringify(par),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.code == 200) {
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

    function updateInterval(id, interval) {

        var url = Api.hotnews_account_putInterval + id;
        $.ajax({
            url: url,
            type: 'POST',
            processData: false,
            data: interval,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.code == 200) {
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

    function updatePublish(id, status) {

        var url = Api.hotnews_account_putpublish + id;
        $.ajax({
            url: url,
            type: 'POST',
            processData: false,
            data: status,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.code == 200) {
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

    function toNum(num) {
        if (num < 10) {
            return '0' + num;
        }
        return '' + num;
    }

    //编辑弹窗
    function edit(id) {
        //弹窗
        layer.open({
            type: 2,
            title: "账号",
            offset: '40px',
            area: ['700px', '650px'],
            fixed: false, //不固定
            maxmin: true,
            content: "./account_edit.html?id=" + id,
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
                platfrom: $("select[name=datatype]").val() == "全部" ? '' : $("select[name=datatype]").val(),
                status: -1
            }
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

    function renderdataTypeSelect(datalist) {
        var list = [...datalist];
        $('#datatype').children("option").remove();
        list.unshift("全部");

        list.forEach(d => {
            var option = document.createElement("option");
            option.value = d;
            option.text = d;
            $('#datatype').append(option);
        })

        layui.form.render("select");
    }

    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});