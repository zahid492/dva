var datetime = '';
$(document).ready(function () {
    //页面方法
    var newsf = new newsi();

    newsf.getIndustry();
    //添加关注词
    $("#btnAddDataSource").click(function () {
        newsf.addIndustry();
    });

    $("#industryTable").delegate(".js-update", "click", function(e){
        newsf.updateIndustry(e);
    });

    $("#industryTable").delegate(".js-del", "click", function(e){
        newsf.deleteIndustry(e);
    });


});

function newsi() {
    var layer;
    var _this = this;

    var ndata = [];

    var tableConfig = {
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        //"sDom": '<""l>t<"F"fp>',
        "oLanguage": { //国际化配置
            "sProcessing": "正在获取数据，请稍后...",
            "sLengthMenu": "显示 _MENU_ 条",
            "sZeroRecords": "没有您要搜索的内容",
            "sInfo": "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
            "sInfoEmpty": "记录数为0",
            "sInfoFiltered": "(全部记录数 _MAX_ 条)",
            "sInfoPostFix": "",
            "sSearch": "搜索",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "第一页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "最后一页"
            }
        }
    };


    layui.use('element', function () {
        var $ = layui.jquery;
        var element = layui.element;
        element.on('tab(keyword)', function (data) {

            if (data.index == 1) {
                if (!_this.categoryTable) {

                }

            }
        });
    });

    layui.use('layer', function () {
        layer = layui.layer;
    });

    this.industryTable = $('#industryTable').dataTable(tableConfig);
}

// 获取列表
newsi.prototype.getIndustry = function () {
    var _this = this;
    $.ajax({
        url: '../API/IndustryDataSourceAPI.ashx?cmd=list',
        success: function (response) {
            if (response.Code == 200) {
                ndata = response.Data;
                var tableData = _.map(ndata, function(v, i){
                    var arr = [];
                    arr.push(v.IndustryName)
                    arr.push(v.DataSourceName)
                    arr.push(v.Url)
                    arr.push(v.SearchID)
                    arr.push('<button class="layui-btn layui-btn-primary layui-btn-small js-update" data-id="'+ v._id +'"><i class="icon-pencil"></i></button><button class="layui-btn layui-btn-danger layui-btn-small js-del"  data-id="'+ v._id +'"><i class="icon-trash"></i></button>');
                    return arr;
                });

                _this.industryTable.fnClearTable(); //将数据清除
                _this.industryTable.fnAddData(tableData); //重新绑定table数据
            }
        }
    });
};


newsi.prototype.addIndustry = function () {
    var _this = this;

    layer.open({
        title: "添加数据源",
        content: $("#industryKeywordUpdateTpl").html(),
        success: function (layero, index) {
            $.ajax({
                url: "../API/IndustryAPI.ashx?cmd=list",
                success: function (response) {
                    if (response.Code == 200) {
                        $("#IndustryName").html("");
                        var data = response.Data;
                        $("#IndustryName").append("<option value='全部'>全部</option>")
                        for (var i = 0; i < data.length; i++) {
                            $("#IndustryName").append("<option value='" + data[i].Name + "'>" + data[i].Name + "</option>")
                        }
                    }
                }
            });
            $("#DataSourceName", layero).val("");
            $("#Url", layero).val("");
            $("#Keyword", layero).val("");
        },
        cancel: function (index, layero) {
            layer.close(index);
            return false;
        },
        yes: function (index, layero) {
            var IndustryName = $("#IndustryName",layero).val();
            var DataSourceName = $("#DataSourceName", layero).val();
            var Url = $("#Url", layero).val();
            var Keyword = $("#Keyword", layero).val();
            var SearchID = $("#SearchID", layero).val();

             if (DataSourceName.length > 0 && Url.length>0 && Keyword.length>0) {
                $.ajax({
                    url: "../API/IndustryDataSourceAPI.ashx",
                    type: 'POST',
                    data: {
                        cmd:"add",
                        IndustryName: IndustryName,
                        DataSourceName:DataSourceName,
                        Url: Url,
                        Keyword: Keyword,
                        SearchID: SearchID,
                    },
                    success: function (response) {
                        if (response.Code == 200) {
                            layer.close(index);
                            _this.getIndustry();
                        } else {
                            layer.msg("操作失败,原因：" + response.ErrMsg);
                        }
                    }
                });
            }else{
                layer.msg("不能有空数据");
            }

            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    });
};

newsi.prototype.updateIndustry = function (e) {
    var _this = this;
    var that = e.currentTarget;
    var id = $(that).attr("data-id");

    var data = _.find(ndata, {_id: id});
    layer.open({
        title: "修改数据源",
        content: $("#industryKeywordUpdateTpl").html(),
        success: function (layero, index) {
            $.ajax({
                url: "../API/IndustryAPI.ashx?cmd=list",
                success: function (response) {
                    if (response.Code == 200) {
                        $("#IndustryName", layero).html("");
                        var edata = response.Data;
                        $("#IndustryName", layero).append("<option value='全部'>全部</option>");

                        for (var i = 0; i < edata.length; i++) {
                            $("#IndustryName").append("<option value='" + edata[i].Name + "'>" + edata[i].Name + "</option>")
                        }

                        $("#IndustryName",layero).val(data.IndustryName);
                        $("#DataSourceName", layero).val(data.DataSourceName);
                        $("#Url", layero).val(data.Url);
                        $("#Keyword", layero).val(data.Keyword);
                        $("#SearchID", layero).val(data.SearchID);
                    }
                }
            });

        },
        cancel: function (index, layero) {
            layer.close(index);
            return false;
        },
        yes: function (index, layero) {
            var IndustryName = $("#IndustryName",layero).val();
            var DataSourceName = $("#DataSourceName", layero).val();
            var Url = $("#Url", layero).val();
            var Keyword = $("#Keyword", layero).val();
            var SearchID = $("#SearchID", layero).val();

            if (DataSourceName.length > 0 && Url.length>0 && Keyword.length>0) {
                $.ajax({
                    url: "../API/IndustryDataSourceAPI.ashx",
                    type: 'POST',
                    data: {
                        cmd:"update",
                        _id: id,
                        IndustryName: IndustryName,
                        DataSourceName:DataSourceName,
                        Url: Url,
                        Keyword: Keyword,
                        SearchID: SearchID,
                    },
                    success: function (response) {
                        if (response.Code == 200) {
                            layer.close(index);
                            _this.getIndustry();
                        } else {
                            layer.msg("操作失败,原因：" + response.ErrMsg);
                        }
                    }
                });
            }

            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    });
};

newsi.prototype.deleteIndustry = function (e) {
    var _this = this;
    var that = e.currentTarget;
    var id = $(that).attr("data-id");

    var data = _.find(ndata, {_id: id});
    layer.confirm('确认要删除吗？', function () {
        $.ajax({
            url: "../API/IndustryDataSourceAPI.ashx",
            type: 'POST',
            data: {
                cmd:"delete",
                _id: id,
            },
            success: function (response) {
                //关闭对话框
                layer.closeAll('dialog');
                if (response.Code == 200) {
                    layer.msg('删除成功', {icon: 1});
                    _this.getIndustry();
                } else {
                    layer.msg("操作失败,原因：" + response.ErrMsg);
                }
            }
        });
    });
}


