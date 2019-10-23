var datetime = '';

var openIndex;
$(document).ready(function () {
    //页面方法
    var page = window.page = new keywords();
    page.getPosterSubject();
    page.getSubject();
    page.getFeedback();
    page.getCategory();
    page.getIndustry();
    page.getSubjectforOrder({ industry: '互联网' });
    page.getSubjectforRanking({ industry: '互联网' });

    //点击分类
    $("[name='categoryList']").on("click", function (e) {
        e.preventDefault();
        var pel = $(e.currentTarget);
        var al = $(e.target);

        if (pel.attr("id") === "subject") {

            page.getSubject({ industry: al.text() });
            page.getSubjectforOrder({ industry: al.text() });

        }

        if (pel.attr("id") === "order") {

            page.getSubjectforRanking({ industry: al.text() });
            page.getSubjectforOrder({ industry: al.text() });

        }
        if (pel.attr("id") === "poster") {
            page.getPosterSubject({ industry: al.text() });
        }

        //第一个分类加背景色

        pel.find("a").css("background-color", "");

        al.css("background-color", "darkseagreen");

    });


    //添加关注词
    $("#btnAddWorld").click(function () {
        layer.open({
            type: 2,
            area: ['700px', '580px'],
            fixed: false, //不固定
            maxmin: true,
            content: './keywords_add.html'
        });
    });

    $("#btnAddPoster").click(function () {
        layer.open({
            type: 2,
            area: ['700px', '580px'],
            fixed: false, //不固定
            maxmin: true,
            content: './poster_add.html'
        });
    });
});

function keywords() {
    var layer;
    var _this = this;

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
    //关注词关注量排行榜表格的配置信息
    var tableConfigRanking = {
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
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
        },
        "aaSorting": [[0, "desc"]],
    };

    layui.use('element', function () {
        var $ = layui.jquery,
            element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
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

    this.subjectTable = $('#subjectTable').dataTable(tableConfig);
    this.posterTable = $('#posterTable').dataTable(tableConfig);
    // todo: 添加时间范围，dataTable 工具栏测试
    var feedConfig = $.extend({}, tableConfig, {
        // dom: '<"toolbar">frtip',
        fnInitComplete: function () {
            var timeDom = '<div class="layui-inline" style="position: absolute; display: block; top: 37px; left: 150px; line-height: 20px; height: 30px;"><label class="layui-form-label" style="line-height:30px;">时间段：</label> <div class="layui-input-inline" style="margin-top: 8px;"> <input type="text" class="layui-input" id="timerange" placeholder=" - " style="width: 200px; height: 30px; line-height: 30px; padding: 4px 6px;"> </div> </div>';

            $('#feedBackTable_length').after(timeDom);

            // var keyClassDom = '<div class="layui-form keyc" style="position: absolute; display: block; top: 40px; left: 440px; line-height: 20px; height: 30px;"> <div class="layui-form-item" style="line-height:30px;"> <label class="layui-form-label">类别</label> <div class="layui-input-block" style="top:8px;"> <select style="width: 200px; height: 24px; line-height: 24px; padding: 4px 6px;" name="keyc" lay-filter="keyc"><option value="-1">全部</option> <option value="0">吐槽反馈</option> <option value="1">关注词反馈</option> <option value="2">不感兴趣理由</option> </select></div></div></div>';
            //
            // $('#feedBackTable_length').after(keyClassDom);

            var feedOpt = {};

            setTimeout(function () {
                layui.use('laydate', function () {
                    var laydate = layui.laydate;
                    laydate.render({
                        elem: '#timerange',
                        range: true,
                        value: new Date().format("yyyy-MM-dd") + ' - ' + new Date().format("yyyy-MM-dd"),
                        done: function (value, date, endDate) {
                            feedOpt.datetime = value;

                            _this.getFeedback(feedOpt);
                        }
                    });
                });

                // layui.use('form', function(){
                //     var form = layui.form;
                //     form.on('select(keyc)', function(data){
                //         feedOpt.type = data.value;
                //         _this.getFeedback(feedOpt);
                //
                //     });
                // });


            }, 30);

        }
    });

    this.feedBackTable = $('#feedBackTable').dataTable(_.extend(feedConfig, { "aaSorting": [[2, 'desc']] }));

    this.categoryTable = $('#categoryTable').dataTable(tableConfig);
    this.industryTable = $('#industryTable').dataTable(tableConfig);
    //关注词关注量排行榜
    this.subjectRanking = $('#subjectRanking').dataTable(tableConfigRanking);
    //
    var ordersConfig = Object.assign(tableConfig);
    ordersConfig.fnRowCallback = function (tr, args, curIndex, totalIndex) {
        tr.setAttribute('order', args[0]);
        tr.setAttribute('subject', args[1]);
    };
    this.subjectOrders = $('#subjectOrders').dataTable(tableConfig);
}

keywords.prototype.getPosterSubject = function (options) {
    var defaults = { category: "", industry: "" };
    var opts = $.extend(defaults, options || {});
    var _this = this;
    $.ajax({
        url: '../API/ImagesAPI/ActivityImages.ashx?cmd=list',
        success: function (response) {
            if (response.Code == 200) {
                var data = response.Data;
                var tableData = [];
                for (var i = 0; i < data.length; i++) {
                    var array = [];
                    array.push(data[i].Relations[0]);
                    array.push('<img src="' + data[i].Image + '" />');
                    // array.push(data[i].Link);
                    array.push("<button class=\"layui-btn layui-btn-primary layui-btn-small\" onclick=\"page.updatePoster('" + data[i]._id + "')\"><i class=\"icon-pencil\"></i></button>" +
                        "<button class=\"layui-btn layui-btn-danger layui-btn-small\" onclick=\"page.delPoster('" + data[i]._id + "')\"><i class=\"icon-trash\"></i></button>");
                    tableData.push(array);
                }
                _this.posterTable.fnClearTable(); //将数据清除
                _this.posterTable.fnAddData(tableData); //重新绑定table数据
            }
        }
    });
};
keywords.prototype.updatePoster = function (id) {
    openIndex = layer.open({
        type: 2,
        area: ['700px', '580px'],
        fixed: false, //不固定
        maxmin: true,
        content: './poster_add.html?id=' + encodeURI(id)
    });
};

keywords.prototype.delPoster = function (id) {
    var _this = this;
    layer.confirm('确认要删除吗？', function () {
        $.ajax({
            url: '../API/ImagesAPI/ActivityImages.ashx?cmd=delete',
            type: "POST",
            data: "id=" + id,
            success: function (response) {
                //关闭对话框
                layer.closeAll('dialog');
                if (response.Code == 200) {
                    _this.getPosterSubject();
                } else {
                    layer.msg("操作失败,原因：" + response.ErrMsg);
                }
            }
        });
    });
};

keywords.prototype.getSubject = function (options) {
    var defaults = { category: "", industry: "" };
    var opts = $.extend(defaults, options || {});
    var _this = this;
    $.ajax({
        url: '../API/SubjectAPI.ashx?cmd=alllist&category=' + opts.category + "&industry=" + opts.industry,
        success: function (response) {
            if (response.Code == 200) {
                var data = response.Data;
                var tableData = [];
                for (var i = 0; i < data.length; i++) {
                    var array = [];
                    array.push(data[i].Category);
                    array.push(data[i].Industry);
                    array.push(data[i].Name);
                    array.push(data[i].Keywords.join(","));
                    array.push(data[i].ExclusionWords);
                    array.push(data[i].Status);
                    array.push("<button class=\"layui-btn layui-btn-primary layui-btn-small\" onclick=\"page.updateSubject('" + data[i].Name + "')\"><i class=\"icon-pencil\"></i></button>" +
                        "<button class=\"layui-btn layui-btn-danger layui-btn-small\" onclick=\"page.delSubject('" + data[i].Name + "')\"><i class=\"icon-trash\"></i></button>");
                    tableData.push(array);
                }
                _this.subjectTable.fnClearTable(); //将数据清除
                _this.subjectTable.fnAddData(tableData); //重新绑定table数据
            }
        }
    });
};

keywords.prototype.delSubject = function (name) {
    var _this = this;
    layer.confirm('确认要删除吗？', function () {
        $.ajax({
            url: '../API/SubjectAPI.ashx?cmd=delete',
            type: "POST",
            data: "name=" + name,
            success: function (response) {
                //关闭对话框
                layer.closeAll('dialog');
                if (response.Code == 200) {
                    _this.getSubject();
                } else {
                    layer.msg("操作失败,原因：" + response.ErrMsg);
                }
            }
        });
    });
};

keywords.prototype.updateSubject = function (name) {
    openIndex = layer.open({
        type: 2,
        area: ['700px', '580px'],
        fixed: false, //不固定
        maxmin: true,
        content: './keywords_add.html?name=' + encodeURI(name)
    });
};
// 关注词反馈
keywords.prototype.getFeedback = function (options) {

    var _this = this;
    var opt = _.extend({}, options, { type: 1 });


    $.ajax({
        url: "../API/feedback/subjectfeed.ashx",
        data: opt,
        success: function (response) {
            if (response.Code == 200) {
                var data = response.Data;
                var tableData = [];
                for (var i = 0; i < data.length; i++) {
                    var array = [];
                    array.push(data[i].OpenId);
                    array.push(data[i].NickName);
                    data[i].AddDateTime = fecha.format(fecha.parse(data[i].AddDateTime, 'YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm');
                    array.push(data[i].AddDateTime);
                    array.push(data[i].NewSubject);
                    array.push(data[i].Content);

                    tableData.push(array);
                }
                _this.feedBackTable.fnClearTable();
                _this.feedBackTable.fnAddData(tableData);

            }
        }
    });
}

/*start 关注词分类相关操作*/
keywords.prototype.getIndustry = function () {
    var _this = this;
    $.ajax({
        url: '../API/IndustryAPI.ashx?cmd=list',
        success: function (response) {
            if (response.Code == 200) {
                var data = response.Data;
                var tableData = [];
                var eleUL = $("<ul>");
                for (var i = 0; i < data.length; i++) {
                    var array = [];
                    eleUL.append($("<li><a href=\"#\">" + data[i].Name + "</a></li>"));
                    array.push(data[i].Name);
                    array.push(data[i].ExclusionWords);
                    var ex = _.isArray(data[i].ExclusionWords) ? JSON.stringify(data[i].ExclusionWords) : "";
                    array.push('<button class="layui-btn layui-btn-primary layui-btn-small" data-words="' + data[i].NegativeWords + '" data-name="' + data[i].Name + '" data-exclusion="' + ex + '" onclick="page.updateIndustry(event)"><i class="icon-pencil"></i></button>' +
                        "<button class=\"layui-btn layui-btn-danger layui-btn-small\" onclick=\"page.deleteIndustry('" + data[i].Name + "')\"><i class=\"icon-trash\"></i></button>");
                    tableData.push(array);
                }


                $("[name='categoryList']").append($(eleUL).clone());
                // $("[name='categoryList']").append($(eleUL).clone());
                // $("[name='categoryList']").append($(eleUL).clone());
                _this.industryTable.fnClearTable(); //将数据清除
                _this.industryTable.fnAddData(tableData); //重新绑定table数据

                //第一个分类加背景色
                $("[name='categoryList']").find("li:first-child a").css("background-color", "darkseagreen");
            }


        }
    });
}

keywords.prototype.addIndustry = function () {
    var _this = this;

    layer.open({
        title: "添加关注词分类",
        content: $("#industryKeywordUpdateTpl").html(),
        success: function (layero, index) {
            $("#attentionWord", layero).val("");
            $("#sensitiveWords", layero).val("");
            $("#exclusionWords", layero).val("");
        },
        cancel: function (index, layero) {
            layer.close(index);
            return false;
        },
        yes: function (index, layero) {
            var text = $("#attentionWord", layero).val();
            var content = $("#sensitiveWords", layero).val();
            var exclusionWords = $("#exclusionWords", layero).val();

            if (text.length > 0) {
                $.ajax({
                    url: "../API/IndustryAPI.ashx?cmd=add",
                    type: 'POST',
                    data: {
                        name: text,
                        negativeWords: content,
                        exclusionWords: exclusionWords
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
}

keywords.prototype.updateIndustry = function (e) {
    var _this = this;
    var that = e.currentTarget;
    var oldName = $(that).data("name");
    var oldNegativeWords = $(that).data("words");
    var oldExclusion = $(that).data("exclusion");
    layer.open({
        title: "修改关注词分类",
        content: $("#industryKeywordUpdateTpl").html(),
        success: function (layero, index) {
            $("#attentionWord", layero).val(oldName);
            $("#sensitiveWords", layero).val(oldNegativeWords);
            $("#exclusionWords", layero).val(oldExclusion);
        },
        cancel: function (index, layero) {
            layer.close(index);
            return false;
        },
        yes: function (index, layero) {
            var text = $("#attentionWord", layero).val();
            var content = $("#sensitiveWords", layero).val();
            var exclusionWords = $("#exclusionWords", layero).val();


            if (text.length > 0) {
                $.ajax({
                    url: "../API/IndustryAPI.ashx?cmd=updata",
                    type: 'POST',
                    data: {
                        oldName: oldName,
                        newName: text,
                        negativeWords: content,
                        exclusionWords: exclusionWords
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
}

keywords.prototype.deleteIndustry = function (name) {
    var _this = this;
    layer.confirm('确认要删除吗？', function () {
        $.ajax({
            url: "../API/IndustryAPI.ashx?cmd=delete",
            type: 'POST',
            data: "name=" + name,
            success: function (response) {
                //关闭对话框
                layer.closeAll('dialog');
                if (response.Code == 200) {
                    layer.msg('删除成功', { icon: 1 });
                    _this.getIndustry();
                } else {
                    layer.msg("操作失败,原因：" + response.ErrMsg);
                }
            }
        });
    });
}
/*end 关注词分类相关操作*/

/*start 关注词行业相关操作*/
keywords.prototype.getCategory = function () {
    var _this = this;
    $.ajax({
        url: '../API/CategoryAPI.ashx?cmd=list',
        success: function (response) {
            if (response.Code == 200) {

                var data = response.Data;
                var tableData = [];
                for (var i = 0; i < data.length; i++) {


                    var array = [];
                    array.push(data[i].Name);
                    array.push("<button class=\"layui-btn layui-btn-primary layui-btn-small\" onclick=\"page.updateCategory('" + data[i].Name + "')\"><i class=\"icon-pencil\"></i></button>" +
                        "<button class=\"layui-btn layui-btn-danger layui-btn-small\" onclick=\"page.deleteCategory('" + data[i].Name + "')\"><i class=\"icon-trash\"></i></button>");
                    tableData.push(array);
                }

                _this.categoryTable.fnClearTable(); //将数据清除
                _this.categoryTable.fnAddData(tableData); //重新绑定table数据
            }


        }
    });
}

keywords.prototype.addCategory = function () {
    var _this = this;
    layer.prompt({ title: '添加关注词分类', formType: 0 }, function (text, index) {
        if (text) {
            $.ajax({
                url: "../API/CategoryAPI.ashx?cmd=add",
                type: 'POST',
                data: "name=" + text,
                success: function (response) {
                    if (response.Code == 200) {
                        layer.close(index);
                        _this.getCategory();
                    } else {
                        layer.msg("操作失败,原因：" + response.ErrMsg);
                    }
                }
            });
        }

    });

}

keywords.prototype.updateCategory = function (oldName) {
    var _this = this;
    layer.prompt({ title: '修改关注词分类', value: oldName, formType: 0 }, function (text, index) {
        if (text) {
            $.ajax({
                url: "../API/CategoryAPI.ashx?cmd=updata",
                type: 'POST',
                data: "oldName=" + oldName + "&newName=" + text,
                success: function (response) {
                    if (response.Code == 200) {
                        layer.close(index);
                        _this.getCategory();
                    } else {
                        layer.msg("操作失败,原因：" + response.ErrMsg);
                    }
                }
            });
        }

    });
}

keywords.prototype.deleteCategory = function (name) {
    var _this = this;
    layer.confirm('确认要删除吗？', function () {
        $.ajax({
            url: "../API/CategoryAPI.ashx?cmd=delete",
            type: 'POST',
            data: "name=" + name,
            success: function (response) {
                //关闭对话框
                layer.closeAll('dialog');
                if (response.Code == 200) {
                    layer.msg('删除成功', { icon: 1 });
                    _this.getCategory();
                } else {
                    layer.msg("操作失败,原因：" + response.ErrMsg);
                }
            }
        });
    });
}

//置顶
keywords.prototype.SubjectToTop = function (name) {
    var _this = this;
    $.ajax({
        url: "../API/SubjectAPI.ashx?cmd=top",
        type: 'POST',
        data: { "name": name },
        success: function (response) {
            if (response.Code == 200) {
                var indestry = response.Data.Industry;
                //重新加载
                _this.getSubjectforOrder({ industry: indestry });
                _this.getSubjectforRanking({ industry: indestry });
            } else {
                layer.msg("操作失败,原因：" + response.ErrMsg);
            }
        }
    });

}

/*end 关注词行业相关操作*/

//关注词排序
keywords.prototype.getSubjectforOrder = function (options) {
    var defaults = { category: "", industry: "" };
    var opts = $.extend(defaults, options || {});
    var _this = this;
    $.ajax({
        url: '../API/SubjectAPI.ashx?cmd=alllist&category=' + opts.category + "&industry=" + opts.industry,
        success: function (response) {
            if (response.Code == 200) {
                var data = response.Data;
                var tableData = [];
                for (var i = 0; i < data.length; i++) {
                    var array = [];
                    array.push(data[i].Order);

                    array.push(data[i].Name);

                    array.push("<a href='javascript:;'  onclick=\"page.SubjectToTop('" + data[i].Name + "')\">置顶</button>");
                    tableData.push(array);
                }
                _this.subjectOrders.fnClearTable(); //将数据清除
                _this.subjectOrders.fnAddData(tableData); //重新绑定table数据

                $("#subjectOrders tbody").sortable({
                    cursor: "move",
                    helper: fixHelper, //调用fixHelper
                    axis: "y",
                    start: function (e, ui) {
                        ui.helper.css({ "background": "#fff" }) //拖动时的行，要用ui.helper
                        return ui;
                    },
                    sort: function (e, ui) {

                        select_item = ui.item; //当前拖动的元素
                        //select_id = select_item.attr("id");
                        select = select_item.attr("subject"); //当前元素的顺序
                        select_sort = select_item.attr("order"); //当前元素的顺序

                        //alert(select_item);
                        place_item = $(this).find('tr').filter('.ui-sortable-placeholder').next('tr'); //新位置下的下一个元素
                        place = place_item.attr('subject');
                        place_sort = place_item.attr('order');

                        place_sx = parseInt(place_sort);
                        select_sx = parseInt(select_sort);

                        if (select_sx > place_sx) { //说明是 向上移动

                            flag = false;
                        } else { //向下移动
                            place = $(this).find('tr').filter('.ui-sortable-placeholder').prev('tr').attr('subject');

                            flag = true;
                        }
                    },
                    stop: function (e, ui) {
                        //ui.item.removeClass("ui-state-highlight"); //释放鼠标时，要用ui.item才是释放的行
                        //发送请求，对sort字段进行修改
                        //alert(ui.item.attr("id"));//可以拿到id
                        //alert(ui.position.top);//可以拿到id


                        setOrders(opts.industry, select, place)
                        return ui;
                    }
                });
                $("#subjectOrders").disableSelection();


            }
        }
    });
};

//关注词排行榜
keywords.prototype.getSubjectforRanking = function (options) {
    var defaults = { industry: "" };
    var opts = $.extend(defaults, options || {});
    var _this = this;
    $.ajax({
        url: '../API/subject/subjectlistbyAttention.ashx?industry=' + opts.industry,
        success: function (response) {
            if (response.Code == 200) {
                var data = response.Data;
                var tableData = [];
                for (var i = 0; i < data.length; i++) {
                    var array = [];
                    // array.push("");
                    array.push(data[i].SubjectCount);
                    array.push(data[i].Name);
                    array.push(data[i].Order); // 
                    tableData.push(array);
                }
                _this.subjectRanking.fnClearTable();
                _this.subjectRanking.fnAddData(tableData);
                $("#subjectRanking").disableSelection();
            }
        }
    });
};

var fixHelper = function (e, ui) {
    ui.children().each(function () {
        $(this).width($(this).width()); //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
    });
    return ui;
};

function setOrders(industry, src, target) {
    $.ajax({
        url: '../API/SubjectAPI.ashx',
        type: 'POST',
        data: { cmd: 'order', industry: industry, src: src, target: target },
        success: function (response) {
            if (response.Code == 200) {
                var data = response.Data;
                page.getSubjectforOrder({ industry: industry });
                page.getSubjectforRanking({ industry: industry });
            }
        }
    });
}