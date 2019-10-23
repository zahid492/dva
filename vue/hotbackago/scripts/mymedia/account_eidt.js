/*
createby:刘建强
date:20190522
des:框架添加/编辑
*/
//var accountPlatForms = ['百家号','今日头条','微信公众号','妙笔官网'];
var accountPlatForms = ['百家号', '今日头条'];

var accountPlatformCategorys = {
    '百家号': ['娱乐', '体育', '财经', '人文', '科技', '互联网', '数码', '社会', '汽车', '房产', '旅游', '时尚', '星座', '美食', '生活', '育儿', '影视', '音乐', '动漫', '搞笑', '教育', '文化', '宠物', '游戏', '家居', '摄影', '健康', '养生', '科学', '综合', '其它'],
    '今日头条': ['娱乐', '体育', '财经', '人文', '科技', '互联网', '数码', '社会', '汽车', '房产', '旅游', '时尚', '星座', '美食', '生活', '育儿', '影视', '音乐', '动漫', '搞笑', '教育', '文化', '宠物', '游戏', '家居', '摄影', '健康', '养生', '科学', '综合', '其它'],
    '微信公众号': [],
    '妙笔官网': [],
}
var labels = {
    '百家号': ['appID', 'appToken'],
    '今日头条': ['账号', '密码'],

}
var _platform = '百家号'

$(function () {

    var id = queryString("id") && decodeURI(queryString("id"));
    var form;

    layui.use(['form', 'layer', 'layedit'], function () {
        form = layui.form;
        layer = layui.layer;
        layedit = layui.layedit;


        //页面首次加载数据(必须放在前面)
        var load = function () {
            renderPlatforms();
            var p = renderTopicCategorys();

            if (id && id != '0') {
                p.then(() => {
                    getModel();
                });
            }

        }
        //加载表单数据
        var getModel = function () {
            //编辑赋值
            return $.ajax({
                url: ApiToUrl(Api.hotnews_account_get),//接口地址
                method: 'get',
                data: {id},
                success: function (response) {
                    if (response.code == 200) {
                        var data = response.data;
                        $("select[name=platform]").val(data.platform);
                        _platform = data.platform;
                        setlabels();
                        var datas = accountPlatformCategorys[_platform];
                        if (datas.length) {
                            renderCategorys(datas);
                        }
                        var publishTypes = data.publishTypes;
                        if (publishTypes && publishTypes.length) {
                            publishTypes.forEach(t => {
                                var el = $('.fs-option[data-value=' + t + ']')[0];
                                var $wrap = $(el).closest('.fs-wrap');
                                var selected = [];

                                $(el).toggleClass('selected');
                                $wrap.find('.fs-option.selected').each(function (i, el) {
                                    selected.push($(el).attr('data-value'));
                                });

                                $wrap.find('select').val(selected);
                                $wrap.find('select').ySelect('reloadDropdownLabel');
                                $wrap.find('select').ySelect('setwrap');
                            })
                        }
                        $("select[name=category]").val(data.category);
                        $("input[name=name]").val(data.name);
                        $("input[name=appid]").val(data.appId);
                        $("input[name=apptoken]").val(data.appToken);
                        $("textarea[name=cookie]").val(data.cookie);

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


        //添加，编辑
        var add = function () {
            var index = parent.layer.getFrameIndex(window.name);
            var apiUri = Api.hotnews_account_put + '?id=' + id;

            if (id == "0"){
                apiUri = Api.hotnews_account_post;
            }

            var platform = $("select[name=platform]").val();
            var category = $("select[name=category]").val();
            var name = $("input[name=name]").val();
            var appid = $("input[name=appid]").val();
            var appToken = $("input[name=apptoken]").val();
            var cookie = $("textarea[name=cookie]").val();
            var topiccategory = $("#topiccategory").ySelectedValues(",");
            let publishTypes = [];

            if (topiccategory) {
                publishTypes = topiccategory.split(',');
            }

            if (name == '') {
                layer.msg('名称不能为空！');
                return;
            }

            var par = {
                name: name,
                category: category,
                publishTypes: publishTypes,
                platform: platform,
                appId: appid,
                appToken: appToken,
                cookie: cookie
            };

            $.ajax({
                url: apiUri,
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

        form.on('select(platform)', function (data) {
            _platform = data.value;
            setlabels();
            var data = accountPlatformCategorys[_platform];
            if (data.length) {
                renderCategorys(data);
            }
        });

        function setlabels() {
            var label1 = labels[_platform][0];
            var label2 = labels[_platform][1];

            $('#applabel').html(label1);
            $('#tokenlabel').html(label2);
        }

        function renderPlatforms() {
            $('#platform').children("option").remove();

            accountPlatForms.forEach(d => {
                var option = document.createElement("option");
                option.value = d;
                option.text = d;
                $('#platform').append(option);
            })

            form.render("select");
            var platform = accountPlatForms[0];
            var data = accountPlatformCategorys[platform];
            if (data.length) {
                renderCategorys(data);
            }

        }

        function renderCategorys(datas) {
            $('#category').children("option").remove();

            datas.forEach(d => {
                var option = document.createElement("option");
                option.value = d;
                option.text = d;
                $('#category').append(option);
            })

            form.render("select");

        }

        function renderTopicCategorys() {
            var Url = ApiToUrl(Api.hotnews_hotnews_categorylist);
            var layer = layui.layer;
            var p = new Promise(function (resolve, reject) {
                $.getJson(Url, {page: 1, limit: 1000}, rep => {


                    $('#topiccategory').children("option").remove();
                    if (rep.code == 200) {
                        rep.data.forEach(d => {
                            var option = document.createElement("option");
                            option.value = d.name;
                            option.text = d.name;

                            $('#topiccategory').append(option);
                        })
                        $('#topiccategory').attr('multiple', 'multiple');
                        $('#topiccategory').ySelect(
                            {
                                placeholder: '请选择',
                                showSearch: false,
                                numDisplayed: 10,
                                overflowText: '已选中 {n}项',
                                isCheck: false
                            }
                        );
                    }

                    resolve('');
                });
            })
            return p;
        }


    });
    //关闭弹窗
    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });

});







