/*
createby:刘建强
date:20190522
des:框架添加/编辑
*/
var selectModulars = [];
//var templateId = '';
//var templateName = '';

$(function () {

    var id = queryString("id") && decodeURI(queryString("id"));
    var form;

    layui.use(['form', 'layer', 'layedit'], function () {
        form = layui.form;
        layer = layui.layer;
        layedit = layui.layedit;

        //页面首次加载数据(必须放在前面)
        var load = function () {
            var p1 = renderModularCheckboxs(); 
            var p2 =renderTemplateSelect();

            Promise.all([p1,p2]).then(() =>{ 
                var callback = null;
                if(id && id != '0')
                {
                    callback = getModel;
                }
                renderdataTypeSelect(callback);
            })
            
                         
        }
        //加载表单数据
        var getModel = function () {           
            //编辑赋值
            return $.ajax({
                url: ApiToUrl(Api.hotnews_framework_get),//接口地址
                method: 'get',
                data:{id},
                success: function (response) {
                    if (response.code == 200) {
                        var data = response.data;                        
                        $("select[name=datatype]").val(data.dataTypeName);
                        renderSubdivisionSelect(data.dataTypeName).then(()=>{ 
                            $("select[name=subdivision]").val(data.subTypeName);
                            form.render('select');
                        })
                        
                        $("input[name=name]").val(data.name);
                        $("select[name=template]").val(data.templateId);
                         
                        $("input[name=keywords]").val(data.keywords); 
                        setLabels(data.keywords.toString());
                        selectModulars = data.modules;
                        selectModulars.forEach((m)=>{
                            $('input[name =modular][title='+m.name+']').attr('checked',true);
                        })
                        setModulars(selectModulars);
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
            var apiUri = Api.hotnews_framework_put;
            if (id == "0")
                apiUri = Api.hotnews_framework_add; 

            var subdivision = $("select[name=subdivision]").val();
            var datatype = $("select[name=datatype]").val(); 
            var name = $("input[name=name]").val();
             
            var keywords =  $("input[name=keywords]").val(); 
             
            var keys = keywords.replace(/，/gi,',').replace(/,$/gi,'').split(',');

            if(keys.length > 10)
            {
                keys = keys.slice(0,9);
            }
            var datatype = $("select[name=template]")[0];
            var sdOption = datatype[0].options[datatype[0].selectedIndex]
            var templateId = sdOption.value;
            var templateName = sdOption.value;

            if(name == '')
            {
                layer.msg('名称不能为空！');
                  return;
            }
            var par = {
                _id: id, 
                dataTypeName: datatype,
                subTypeName: subdivision,
                templateId: templateId,
                templateName: templateName,
                name: name,
                keywords: keys,
                modules:  selectModulars

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
        form.on('select(datatype)', function(data){
         
            var dt = data.value;
            renderSubdivisionSelect(dt);
            
        }); 
       
        form.on('checkbox(modular)', function(data){
            var elem = data.elem;
            var checked = data.elem.checked;
            var id = elem.value;
            var name = elem.title;
            var item = {
                id,name
            }
            if(checked)
            {
                selectModulars.push(item);
            }else{
                var index = selectModulars.findIndex((m)=>m.id == id);
                selectModulars = [...selectModulars.slice(0,index),...selectModulars.slice(index+1)]
            } 
            setModulars(selectModulars);

          });
        $("#keywords").on("input",function(e){
            //获取input输入的值
            var key = e.delegateTarget.value.replace(/，/gi,',');
            setLabels(key);
            var aKeys = key.split(',');
            if(aKeys.length > 10)
            {
                layer.msg('您输入的关键词大于10个，超出部分将不会被保存');
            }

          });
          
function setLabels(keywords){
    var aKeys = keywords.split(',');
    var aScore = [10,9,8,7,6,5,4,3,3,1];
    $('#keywordslabel').html('');
    for (let i = 0; i < aKeys.length; i++) {
        var k = $.trim(aKeys[i]);
        if(i < 10 && k != '')
        {
           
           var score = aScore[i];
           var slabel = k + '(' + score + '分)';
           var span = document.createElement("span");
           span.innerHTML = slabel;   
           span.style.display = 'inline-block';
           span.style.padding = '9px 20px 9px 0';
           span.style.lineHeight = '20px';
           $('#keywordslabel').append(span);
        }
         
        
    }
}
function setModulars(modulars){
 
    $('#modularslabel').html('');
    for (let i = 0; i < modulars.length; i++) {
        var k = modulars[i].name;        
             
           var span = document.createElement("span");
           span.innerHTML = k;   
           span.style.display = 'inline-block';
           span.style.padding = '9px 20px 9px 0';
           span.style.lineHeight = '20px';
           $('#modularslabel').append(span);
        
    }
}

        function renderSubdivisionSelect(dt)
        {
            var p = new Promise((resolve,reject)=>{
                    $.getJson(ApiToUrl(Api.hotnews_subdivision_list), { page: 1, limit: 1000,dataType:dt }, rep => {
                    if (rep.code == 200) {
                        var repData = rep.data;
            
                        var data = repData.map(x => { return { name: x.subTypeName } });
            
                        $('#subdivision').children("option").remove();
                         
                        data.forEach(d=>{
                            var option = document.createElement("option");
                            option.value = d.name;
                            option.text = d.name;                   
                            $('#subdivision').append(option);
                        })
                        
                         form.render("select"); 
                    }
                    else {
                        layer.msg(rep.errmsg);
                    }
                    resolve('');
                });
            })
           
            return p;
        }
        function  renderdataTypeSelect(callback){
         
            var Url = ApiToUrl(Api.hotnews_dataType_list);
            var layer = layui.layer;
        
            $.getJson(Url, { page: 1, limit: 1000 }, rep => {
                if (rep.code == 200) {
                    var repData = rep.data;
        
                    var data = repData.map(x => { return { name: x.name } });
        
                    $('#datatype').children("option").remove();
                    
                    data.forEach(d=>{
                        var option = document.createElement("option");
                        option.value = d.name;
                        option.text = d.name;                   
                        $('#datatype').append(option);
                    })
                    
                    layui.form.render("select");
                    if(id === '0' && data.length > 0)
                    {
                        var dt = data[0].name;
                        renderSubdivisionSelect(dt);
                    }
                    if(callback) {return  callback();}
                }
                else {
                    layer.msg(rep.errmsg);
                } 
            });
        }
        function  renderModularCheckboxs(){
         
            var Url = ApiToUrl(Api.hotnews_module_list);
            var layer = layui.layer;
        var p = new Promise(function(resolve,reject){
            $.getJson(Url, { page: 1, limit: 1000 }, rep => {
                if (rep.code == 200) {
                    var repData = rep.data;
        
                    var data = repData.map(x => { return {id:x._id, name: x.moduleName } });
        
                    $('#modularform').html('');
                    {/* <input type="checkbox" name="modular" lay-skin="primary" title="写作" /> */}
                    data.forEach(d=>{
                        var input = document.createElement("input");
                        input.type = 'checkbox';
                        input.name = 'modular';
                        input.value = d.id;

                        input.setAttribute('lay-skin','primary');
                        input.setAttribute('lay-filter','modular');
 
                        input.title = d.name;                   
                        $('#modularform').append(input);
                    })
                    form.render();
                     
                }
                else {
                    layer.msg(rep.errmsg);
                }
                resolve('');
            });
        })
          return p;  
        }
        function  renderTemplateSelect(){
         
            var Url = ApiToUrl(Api.hotnews_template_list);
            var layer = layui.layer;
            var p = new Promise(function(resolve,reject){
            $.getJson(Url, { page: 1, limit: 1000 }, rep => {
                if (rep.code == 200) {
                    var repData = rep.data;
        
                    var data = repData.map(x => { return {id:x._id, name: x.name } });
        
                    $('#template').children("option").remove();
                    
                    data.forEach(d=>{
                        var option = document.createElement("option");
                        option.value = d.id;
                        option.text = d.name;                   
                        $('#template').append(option);
                    })
                    
                    layui.form.render("select"); 
                    
                }
                else {
                    layer.msg(rep.errmsg);
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







