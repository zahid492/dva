import * as React from "react";
import {connect} from 'react-redux';
import {Select, Input,Radio,Modal, message,Spin,Tag} from 'antd'
import $ from 'jquery';  
import E from 'wangeditor'
import * as query from "@/services/Utils"
import * as apiUrl from '@/services/ApiUrl';
import TabTags from '@/containers/compose/tabs'
import TabList from '@/containers/compose/tabList'
import ModualEdit from '@/containers/compose/editAssistModule' 
import '@/style/modual.css' 

const Option = Select.Option;
const RadioGroup = Radio.Group;
var editors = [];
const Search = Input.Search;
const { TextArea } = Input;
const SearchEngines = [{value:530,label:'网页'},{value:583,label:'资讯'},{value:499,label:'百科'},{value:74,label:'知道'}]
//最初设计包含素材，2019.4.2改版，将素材提至一级tab
const _SourceMaterialChilren = []
//{value:6,label:'素材'}
class ComposeEdit extends React.Component {
  constructor(params) {
      super(params);
      message.config({
        top: 200,
        duration: 2,
        maxCount: 1,
      });
  }
  state = {    
     searchValue :'',  //搜索关键词    
     ModualVisible: false,
     editTemplates : {},
     templates :[],   //切换模板时用的模板数据列表
     activeEditorIndex:0,
     ManuscriptTypes : [], //稿件类型数据 
     article :{},
     tabTag:2,
     newsType:'',
     tabListDatas:null,
     activeTemplateId:'',
     SourceMaterialChilren:[],
     TitleCategorys:[],
     TitleCategory : '',
     num : 3,
     NWSentenceVisible:false,
     NWSentenceData : {},
     sentenceDataloading:false
  }

//setState
  changeState = (propertie,value,callback) =>{
      this.setState({
         [propertie] : value
      },()=>{
        callback && callback();
      })
       this.forceUpdate();
  }
   //构建下拉列表选项
   buildOptions = (aData,id,txt)=>{
    let options = aData.map(ele=>{
      if(id)
      return <Option key = {ele[id]} value={ele[id]}>{ele[txt]}</Option>

      return <Option key = {ele} value={ele}>{ele}</Option>
      })
    return options;
  }
  componentDidMount(){
    this.fetchManuscriptType();
    this.fetchEntity();
  }
  //查询稿件类型列表
  fetchManuscriptType = ()=>{
    let url = apiUrl.apiManuscriptTypeGetUrl;
    query.callData(url).then(res=>{
       if(res.code == 200)
       {
          let data = res.data;
          this.changeState('ManuscriptTypes',data);
       }else{
        this.changeState('ManuscriptTypes',[]);
       }
    }).catch(()=>{

    })
  }
  fetchEntity = () =>{ 
      let id = this.props.match.params.id;
      let url = apiUrl.apiStructArticleGetUrl.replace('{id}',id);
      query.callData(url).then(res=>{
          if(res.code == 200)
          {
             if(res.data.client == '')
             {
                res.data.client = '碧桂园';
             }
             this.changeState('article',{...res.data,_id:id},()=>{  this.setEdit();                     //富文本编辑框
                                                        this.setNWNewsType();                 //内文选项
                                                        let tid = res.data.templateId;
                                                        if(!tid)
                                                        {
                                                            tid = '999';
                                                        }
                                                        this.queryTemplates();   //该文章稿件类型下的模板列表
                                                        
                                                        this.fetchTitleCategorys();           //查询标题分类                                                        
                                                        this.tabChange(this.state.tabTag);  //设置默认Tab,并查询

                                                    });
          }
      });
  }
  fetchTitleCategorys = ()=>{
      let article = this.state.article;
      let url = apiUrl.apiTitleRulesCategorys;
      let param =  {
                    page :1,
                    limit:100,
                    key:'', 
                    industry:'', 
                    clientName:article.client 
                 }
       query.__request('get',url,param,(res)=>{
            this.changeState('TitleCategorys',res.data);
            if(res.data.length > 0)
            {
                let cate = res.data[0]._id;
                this.changeState('TitleCategory',cate);

            }
       })
  }
  setNWNewsType = ()=>{  
      let article = this.state.article;
      //let SourceMaterialChilren = this.state.SourceMaterialChilren;
      let content = article.content;
      let arr =[];
    content.forEach((m)=>{
         //排重
          if(arr.findIndex(a=>a.value == m.id) > -1)
          {
                return;
          }
            arr.push( {
              value:m._id,
              label:m.name
          });

      })
      let SourceMaterialChilren = [...arr,..._SourceMaterialChilren];

       

      this.changeState('SourceMaterialChilren',SourceMaterialChilren);
      this.changeState('newsType',SourceMaterialChilren[0].value);

  }

  setTemplates = (id,modules) =>{ 
        let editTemplates = this.state.editTemplates;
        let templates = this.state.templates; 
        let _index = templates.findIndex(m=>m._id == id);
        if(_index == -1)
        {
             id = '';
        }

        editTemplates.id = id;
        if(modules)
        {
            editTemplates.modules = modules;
        }else{
            let index = templates.findIndex(m=>m._id == id);
            if(index > -1)
            {
                let mm = templates[index].modules;
                editTemplates.modules = mm;
            }
        }
        
        let emodules = editTemplates.modules;
                if(emodules.filter(m=>m.content == '' || m.content == null).length > 0)
                {
                    let param = emodules.map(m=> {return m._id});
                    query.__request('post',apiUrl.apimoduleDatasByidsGetUrl,param,(res)=>{                       
                        editTemplates.modules = res.data;
                        this.setState({
                            activeTemplateId:id,
                            editTemplates
                        },()=>{
                            let drag =  this.refs.refDrags;
                            if(drag)
                            { 
                                
                                drag.updateData(editTemplates.modules);               
                            }
                        }); 
                        
                   });
                }else{

                    this.setState({
                        activeTemplateId:id,
                        editTemplates
                    },()=>{
                        let drag =  this.refs.refDrags;
                        if(drag)
                        { 
                            
                            drag.updateData(editTemplates.modules);               
                        }
                    }); 
                }

        
  }
 
  //根据模板类型查询模板数据
queryTemplates =()=>{
    let article = this.state.article;

    let ManuscriptType = article.sArticleType;
    //没有数据，与接口确认后修改 模拟数据
    let ModualType = article.templateType;
    let param ={
     page: 1,
     size: 10,
     sArticleType: ManuscriptType,
     templateType: ModualType
   }
   let selfTemplate = { 
            likes: true,
            modules: article.modules,
            name: '当前文章模板',
            sArticleType: article.sArticleType,
            source: 1,
            templateType: article.templateType,
            _id: "999"
        }
   
   query.__request('post',apiUrl.apimoduleDatasGetUrl,param,(res)=>{
         let templates = [...res.data]; 
         if(!article.templateId)
            {
                templates.unshift(selfTemplate)
            }
         this.changeState('templates',templates,()=>{
            let tid = article.templateId;
            if(!tid)
            {
                tid = '999';
            }
            this.setTemplates(tid,article.modules)}); //设置辅助模块内容;
       
   },()=>{
       this.changeState('templates',[]);
    }
   )
 
    
    
 }
  //设置富文本编辑框
setEdit = ()=>{
    let _this = this;
    const article = this.state.article;
    const count = article.content.length;
    let toolbox = this.refs.toolbox;
    let editArea = this.refs.editTextarea;
    toolbox.innerHTML = '';
    editArea.innerHTML = '';
    editors = [];
    if(count > 0)
    {
      /* let lineDiv = document.createElement('div');
      lineDiv.className = 'mk-shuxian';
      editArea.appendChild(lineDiv); */

      article.content.forEach((element,index)=>{           
         let toolDiv = document.createElement('div');
         toolbox.appendChild(toolDiv);
         if(_this.state.activeEditorIndex == index)
         {
           toolDiv.style.display = 'inline-flex';
         }else{
          toolDiv.style.display = 'none';
         }

         let editDiv = document.createElement('div');
         
         editDiv.className = 'mk-text';

         let editPanel =  document.createElement('div');
         //editPanel.className = 'mk-textarea';

         if(_this.state.activeEditorIndex == index)
           {
            editPanel.className = 'mk-textarea active';
           }else{
            editPanel.className = 'mk-textarea';
           }

         let editName =  document.createElement('div');
         editName.className = 'mk-name';

         let indexspan =  document.createElement('span');
         indexspan.className = 'mk-shuzi'
         indexspan.innerHTML = index + 1;
         let namespan =  document.createElement('span');
         let name = element.name;
            if(name.length > 5)
            {
              namespan.innerHTML = element.name.substring(0,5) + '...';

            }else{
              namespan.innerHTML = element.name;
            }
         namespan.title = element.name;

         editName.appendChild(indexspan);
         editName.appendChild(namespan);

         editPanel.appendChild(editName);
         editPanel.appendChild(editDiv);
         editArea.appendChild(editPanel);

         let editor = new E(toolDiv, editDiv);
         editor.customConfig  = Object.assign({},customConfig);

         editor.customConfig.onfocus =   (t) => { 
              this.setState({
                  activeEditorIndex:index
              },()=>{
                  $('.uEidt .w-e-toolbar').css({display:'none'});
                  $('.uEidt .w-e-toolbar').eq(index).css({display:'inline-flex'});
                  $('.mk-textarea-box .mk-textarea').removeClass('active');
                  $('.mk-textarea-box .mk-textarea').eq(index).addClass('active');
              });
            }
          editor.create();
          let content = element.content ? element.content : '';
          editor.txt.html('<p>' + content + '</p>');      

          editors.push(editor);

          
       })
       if(editors.length > 0)
       {
          editors[0].txt.append('<p></p>');
       }
       $('.w-e-text').css('overflowY', 'auto');
    }
}
   //切换选项卡
tabChange = (tabTag, id,newsTypes) => {
        
    //var _newsType = _this.state.newsType;
    //oMyBar.jump({id: id,time: 400 })  
    this.setState({
        tabTag,
        searchValue:''
    },()=>{
        if(tabTag === 1)  //模块
        {
            return;
        }else if(tabTag == 2){
            let SourceMaterialChilren = this.state.SourceMaterialChilren;
            let newsType = this.state.newsType;
            if(SourceMaterialChilren.filter(s=>s.value == newsType) > 0)
            {
                 this.getList();
            }else{
                this.onChangeNewsType(SourceMaterialChilren[0].value)
            }
            
        }else if(tabTag == -5){  //全网搜
            let newsType = this.state.newsType;
            if(this.state.searchValue)
            {
                if(SearchEngines.filter(s=>s.value == newsType) > 0)
                {
                    this.getList();
                }else{
                    this.changeState('newsType',SearchEngines[0].value,this.getList)
                }
            }else{
                if(this.state.article.keywords && this.state.article.keywords.length)
                {
                    this.changeState('searchValue',this.state.article.keywords[0],()=>{
                        if(SearchEngines.filter(s=>s.value == newsType) > 0)
                            {
                                this.getList();
                            }else{
                                this.changeState('newsType',SearchEngines[0].value,this.getList)
                            }
                    })
                }
            }
            
            
        }else if(tabTag == 6){  //素材
            if(this.state.searchValue)
            {
                this.getList();
                
            }else{
                if(this.state.article.keywords && this.state.article.keywords.length)
                {
                    this.changeState('searchValue',this.state.article.keywords[0], this.getList);
                }
            }
            
            
        }
        else{
           this.getList();
        } 
    });

    
}
//查询
getList = ()=>{
    let _this = this;
    _this.changeState('tabListDatas',null);
    const {tabTag,newsType,searchValue,article,SourceMaterialChilren,TitleCategory} = this.state;
    if(tabTag == 2)    //内文
    {
       let index = SourceMaterialChilren.findIndex(s=>s.value == newsType);
        let customName = '';
        if(index > -1)
        {
            let tb = SourceMaterialChilren[index];
            customName = tb.label;
            
        }
        let content = '';
        let index2 = article.content.findIndex(s=>s._id == newsType);
        if(index2 > -1)
        {
            let editor = editors[index2];
            if(editor)
            {
                content = editor.txt.text();
            }
            
        }

        let url = apiUrl.apiArticleNWListUrl;
        let param = {
                        page: 1,
                        size: 100,
                        searchAll: false,   
                        classify:article.topic,
                        clientName: article.client,
                        sArticleType: article.sArticleType,
                        templateType: article.templateType,
                        module: newsType,
                        key: searchValue,
                        customName,
                        content: content
                    }
            /* if(newsType == 6)//如果是素材(素材id是6)
            {
                param.searchAll = true;
                if(!searchValue)
                {
                    param.key = article.topic;
                     
                } 
                
            }*/
        query.__request('post',url,param,(res)=>{ 
            let data = res.data;
            if(tabTag == this.state.tabTag)
            {
                _this.changeState('tabListDatas',data);
            }
            
        })
    }else if(tabTag == -3)//标题
    {
       let url = apiUrl.apiTitleRulesNoSuggestion;
       let param = {
        page : 1, 
        limit : 100, 
        key : searchValue, 
        category:TitleCategory
       }
       query.__request('get',url,param,(res)=>{ 
        let data = res.data;
        if(tabTag == this.state.tabTag)
        {
            _this.changeState('tabListDatas',data);
        }
    })
    }else if(tabTag == -5)
    {
            if(searchValue)
            {
                let url = apiUrl.apinewsGet160Url;
                let param = {key : searchValue,  page : 1,  engineId:newsType}
                query.__request('get',url,param,(res)=>{ 
                    let data = res.data;
                    if(tabTag == this.state.tabTag)
                    {
                        _this.changeState('tabListDatas',data);
                    }
                })
            }else{
                _this.changeState('tabListDatas',[] );
            }   
    }else if(tabTag == -6)
    {
       let url = apiUrl.apinewsImgGetUrl;
       let client = article.client;
       if(!client)
       {
        client = '碧桂园';   
       }
       let param = {
                    clientName : client,
                    key :searchValue,
                    index 	: 1,
                    size : 100
                }
       query.__request('get',url,param,(res)=>{ 
        let data = res.data;
        if(tabTag == this.state.tabTag)
        {
            _this.changeState('tabListDatas',data);
        }
    })
    }else if(tabTag == 6)    //素材
    {
        if(searchValue)
        {
            let url = apiUrl.apiArticleMaterialListUrl;
            let param = {  
                            page: 1,
                            size: 100,                       
                            classify:article.topic,                       
                            key: searchValue                      
                        }
                
            query.__request('post',url,param,(res)=>{ 
                let data = res.data;
                if(tabTag == this.state.tabTag)
                {
                    _this.changeState('tabListDatas',data);
                }
            })
        }else{
            _this.changeState('tabListDatas',[] );
        } 
        
    }

}
onChangeNewsType = (newstype)=>{ 
   this.changeState('newsType',newstype,this.getList)
}

//改换模块
setUsedTemplate = (template)=>{
    let editTemplates = this.state.editTemplates;  
    let article = this.state.article;

    let _template = Object.assign({},editTemplates,template);

    let url = apiUrl.apiArticleToNewModuleUrl;

    let _modules = article.content.map((r,index)=>{
        let con = editors[index].txt.html();
        let _r = {...r,content:con};
        return _r;
    }) 

    let param = {
        oriMoules: _modules,
        newMoules: _template.modules
    }
    query.__request('post',url,param,(res)=>{
         article.content = res.data;
         article.modules = res.data; 
         let drag =  this.refs.refDrags;
        if(drag)
        {
            drag.updateData(res.data);
        }

         this.setState({article},()=>{
             this.setEdit();                     //富文本编辑框
            this.setNWNewsType();                 //内文选项
         })
         
    });
     
 }
 //标题列表添加标题至文章
 addTitle = (item,index)=>{
    let article = this.state.article;
    let title = item.title;
    article.title = title;
    this.changeState('article',article);
 }
 //修改标题
 changeTitle = (e)=>{
    let article = this.state.article;
    let title = e.target.value;
    article.title = title;
    this.changeState('article',article);
 }
 //保存
 saveArticle = (callback)=>{
     let article = this.state.article;
     if($.trim(article.title) == '')
     {
        message.warn('请输入标题！');
        return;
     }
     let url = apiUrl.apiStructArticleSaveUrl.replace('{id}',article._id);
     let _modules = article.content.map((r,index)=>{
        let con = editors[index].txt.html();
        let _r = {...r,content:con};
        return _r;
    })
    article.content = _modules;
    query.__request('post',url,article,()=>{
        
        if(callback)
        {
            callback();
        }else{
            message.success('保存成功！');
        }   
    })
 }
//关闭弹窗
 closeEditModal = ()=>{
    this.changeState('ModualVisible',false);
    this.changeState('NWSentenceVisible',false);

 }
 openEditModal = ()=>{
    this.changeState('ModualVisible',true);
 }
//seo改稿
 CreateSeo = ()=>{
    let article = this.state.article; 
    if($.trim(article.title) == '')
     {
        message.warn('请输入标题！');
        return;
     }
     this.saveArticle(()=>{
         let addurl = apiUrl.apiStructsAddUrl.replace('{count}',this.state.num);
            let seoUrl = apiUrl.apiStructArticleToSeoUrl;
            let _modules = article.content.map((r,index)=>{
                let con = editors[index].txt.html();
                let _r = {...r,content:con};
                return _r;
            })
            article.content = _modules;
            article.changeType = 'seo';
            article.parentStructArticleId = article._id;

            query.__request('post',addurl,article,(res)=>{
                let newIds = res.data;
                if(newIds.length > 0)
                {
                    newIds.forEach((newId,index)=>{
                        let url = seoUrl.replace('{order}',index +1)
                        query.__request('post',url,newId);
                    });
                }
                
                this.props.history.push('/compose/list/' + article._id);
            })
     });
    
 }

 CreateNewStruct = ()=>{
    let article = this.state.article; 
    if($.trim(article.title) == '')
     {
        message.warn('请输入标题！');
        return;
     }

     this.saveArticle(()=>{         
         let sUrl = apiUrl.apiStructArticleToStructUrl.replace('{id}',article._id);
         query.__request('post',sUrl,this.state.num,(res)=>{
                
                this.props.history.push('/compose/list/' + article._id);
            })
     })
    
 }
 //将辅助内容或选中的辅助内容插入文章
insert = (content, index) => { 
    var con = this.getSelectedContents();
    //var reg = new RegExp( '<br>' , "g" );
    if (con.txt) { 
        var parent = con.ele; 
        if(!parent.hasAttribute('tag'))
        {
            parent = parent.closest('.item');
            if(!parent.hasAttribute('tag'))
            {
                this.insertHandle(content);
                return;
            }
            
        }
        var tag = parent.getAttribute('tag');
        
        if (index == tag) {
            //editor.cmd.do('insertHTML', con.txt);
           this.insertHandle(con.txt);
        } else {
            message.warn('请点击相对应的插入按钮操作！');
        }

    } else {
        //var newstr = content.replace( reg , '' );
        this.insertHandle(content);

    }

}

insertHandle = (content)=>{
    var _this = this;
    
        if(content.includes('<p>'))
        {               
            content = content.replace(/<span([\s\S]*?)>/g,'<span>');
            content = content.replace(/<p([\s\S]*?)>/g,'<p class="articleInsert">');
             
        }else{
            content = '<span class="articleInsert">' + content + '</span>';
        } 
        var index = _this.state.activeEditorIndex;
        var _editor = editors[index];
        _editor.cmd.do('insertHTML', content);   
}
//选取内容   
getSelectedContents = () => {  //带html标签的内容 
    if (window.getSelection) { //chrome,firefox,opera
        let range = window.getSelection().getRangeAt(0);
        let parentEle = range.startContainer.parentElement.parentElement;

        let container = document.createElement('div');
        container.appendChild(range.cloneContents());
        return {txt: container.innerHTML, ele: parentEle};
        //return window.getSelection(); //只复制文本
    }
    else if (document.getSelection) { //其他
        let range = document.getSelection().getRangeAt(0);
        let parentEle = range.startContainer.parentElement.parentElement;
        let container = document.createElement('div');
        container.appendChild(range.cloneContents());
        return {txt: container.innerHTML, ele: parentEle};
        //return document.getSelection(); //只复制文本
    }
    return {txt: '', ele: null};
}

 //机器改编
 Machineadaptation = (content, index) => { 
    let _this = this;
    if(content)
    {
        _this.setState({
            NWSentenceVisible:true,
            sentenceDataloading:true
        });
        let url = apiUrl.apiseoArticleEditGetRPSentenceUrl;
        query.__request('post',url,content,(res)=>{
            let data = res.data;
            _this.setState({ 
                NWSentenceData:{sentence:data,changedSentence:data,originalSentence:content},
                sentenceDataloading:false
            })
        })
         
    }
   

}
changeChedSentence= (e)=>{
    let value = e.target.value;
    let NWSentenceData =  this.state.NWSentenceData;
    NWSentenceData.changedSentence = value;
    this.setState({
        NWSentenceData
    })
}

insertChangedSentence = ()=>{
    let NWSentenceData =  this.state.NWSentenceData;
    if(NWSentenceData.changedSentence)
    {
        this.insertHandle(NWSentenceData.changedSentence);
    }
    this.closeEditModal();
}


  render () {
    const { article,ManuscriptTypes,newsType,SourceMaterialChilren,activeTemplateId,searchValue,TitleCategorys,TitleCategory,templates,editTemplates,tabTag,tabListDatas,ModualVisible,NWSentenceData,NWSentenceVisible,sentenceDataloading} = this.state;
    let ManuscriptTypeEles = this.buildOptions(ManuscriptTypes,'_id','name');
    var  secondGroup = '';
    let searchEle = <div className="mk-sousuo">
                        <Search onChange = {(e)=>{this.changeState('searchValue',e.target.value)}} 
                            onSearch={this.getList}
                            style={{ width: '99%',fontSize:18 }}
                            value = {searchValue}
                            />
                            
                    </div>
    let listEle = [];
    let modulesEle = [];
    let listStyle = 'blsit-list mk-blsit-list'
    if(tabTag == 1)
    {
        /* secondGroup = <ul className="mk-name-list">
                        {templates.map(m=>{
                            if(activeTemplateId == m._id)
                            {
                                return <li key={m._id} className ="item active">{m.name}</li>
                            }
                            return <li key={m._id} className ="item" style = {{cursor:'pointer'}} onClick = {()=>{this.setTemplates(m._id,m.modules)}}>{m.name}</li>
                        })}
                         
                    </ul> */
         secondGroup = <div style={{textAlign :'center',marginTop:'10px'}}>
                           模板： <Select value= {activeTemplateId} style={{ width: 240 }} onChange={(v)=>{this.setTemplates(v)}} >
                               {this.buildOptions(templates,'_id','name')}                          
                            </Select>
                        </div>           
        listStyle = 'mk-blsit-list'
        modulesEle = <ModualEdit ref = 'refDrags' data = {editTemplates} ManuscriptType={article.sArticleType} setTemplate={this.setUsedTemplate} setCommon = {this.setCommon} />
    }
    else if(tabTag == 2)
    {
        secondGroup =    <div>
                            {/* searchEle */}
                            <div style={{textAlign:'left',padding: '0 0 0 20px' }}>
                               { SourceMaterialChilren.length < 8
                                 ? <RadioGroup options={SourceMaterialChilren} onChange={(e)=>{this.onChangeNewsType(e.target.value)}} value={newsType} />  
                                : <div  style={{textAlign:'center',marginTop:'10px'}}>模块： <Select value= {newsType} style={{ width: 240 }} onChange={(v)=>{this.onChangeNewsType(v)}} >
                                    {SourceMaterialChilren.map(c => <Option key={c.value + Math.random()} value = {c.value}>{c.label}</Option>)}                          
                                </Select></div>
                                }
                                                                                                  
                            </div>
                        </div>
        listEle = <div className="hot_list bt-box" style={{marginTop:'50px'}}>
                                <TabList    tabList = {tabListDatas}
                                            tabTag  = {tabTag} 
                                            newstype = {newsType}
                                            insertHandle = {this.insert}
                                            changeEvent = {this.Machineadaptation}
                                            />      
                    </div>      
    }else if(tabTag == -3)
    {
        secondGroup =   <div>
                            {searchEle}
                            <div className="btlx" style = {{    textAlign: 'center'}}>               
                                <span className="name">标题类型</span>
                                <Select style={{width:240,marginLeft:'10px'}} value={TitleCategory} onChange = {(id)=>{this.changeState('TitleCategory',id,this.getList)}} getPopupContainer={() => document.getElementById('fixPara')}>
                                    {TitleCategorys.map((category,index)=>{
                                            return <Option key = {category._id} value={category._id}>{category.name}</Option>
                                    })}
                                </Select>                          
                            </div >
                        </div>
        listEle = <div className="hot_list bt-box" style={{marginTop:'80px'}}><TabList    tabList = {tabListDatas}
                                tabTag  = {tabTag} 
                                newstype = {newsType}
                                insertHandle = {this.addTitle}
                                />  </div>          
    }
    else if(tabTag == -5)  //全网搜
    {
        secondGroup = <div>
                        {searchEle}
                            <div style={{textAlign:'left',padding: '0 0 0 20px' }}>
                                <RadioGroup options={SearchEngines} onChange={(e)=>{this.onChangeNewsType(e.target.value)}} value={newsType} />                                                                    
                            </div>
                            {article && article.keywords && article.keywords.length > 0 &&    
                                          
                                          <div  style = {{textAlign:'left',paddingLeft:'20px'}}>                                              
                                              {article.keywords.map((keyword,i)=>{
                                                  return <Tag color= {apiUrl.tagColors[i % apiUrl.tagColors.length]} closable={false} onClick = {()=>{this.changeState('searchValue',keyword,this.getList)}} key={i} value={keyword}  >{keyword}</Tag>
                                              })
                                              } 
                                         </div>
                                  }
                        </div>
        listEle = <div className="hot_list bt-box" style={{marginTop:'100px'}}><TabList    tabList = {tabListDatas}
                        tabTag  = {tabTag} 
                        newstype = {newsType} 
                        /> </div>
    }  else if(tabTag == 6)  //素材
    {
        secondGroup = <div>
                        {searchEle}                           
                        {article && article.keywords && article.keywords.length > 0 &&    
                                          
                            <div style = {{textAlign:'left',paddingLeft:'20px'}}>                                              
                                {article.keywords.map((keyword,i)=>{
                                        return <Tag color= {apiUrl.tagColors[i % apiUrl.tagColors.length]} closable={false} onClick = {()=>{this.changeState('searchValue',keyword,this.getList)}} key={i} value={keyword}  >{keyword}</Tag>
                                    })
                                } 
                            </div>
                                  }
                        </div>
        listEle = <div className="hot_list bt-box" style={{marginTop:'80px'}}>
                        <TabList    
                            tabList = {tabListDatas}
                            tabTag  = {tabTag} 
                            insertHandle = {this.insert}
                            changeEvent = {this.Machineadaptation}   />      
                    </div>
    } 
    else{
        secondGroup =  searchEle;
        listEle = <div className="hot_list bt-box" style={{marginTop:'40px'}}>
                    <TabList    
                        tabList = {tabListDatas}
                        tabTag  = {tabTag} 
                        insertHandle = {this.insert}
                        changeEvent = {this.Machineadaptation}   />      
                  </div>
    }
       
    let changeButEle = [];
    /* if(!article.changeType)
    {
       changeButEle = [<button className="btn-fh mk-btn-fh" key={'btn1'} onClick={this.CreateNewStruct}>结构改稿</button>,
                       <button className="btn-fh mk-btn-fh" key={'btn2'}onClick={this.CreateSeo}>SEO改稿</button>]
    } */
    return (
           <div className="content__box">
              <section className="articleOneBox"> 
                        <div className="mk-xl">                         
                          <Select value= {article.sArticleType} style={{ width: 200}}  disabled>
                                    {ManuscriptTypeEles}
                          </Select>
                        </div>                     
              </section>
              <div>
                 <section className="articleOneBox article articleOneEidt">
                        <h3 className="mk-title">文章改编</h3>
                        <div className="articleOne mk-articleOne">
                             
                            <div className="broadcast">
                                <div className="articleOne__box mk-articleOne__box">
                                    <div className="text-box" style={{width:'60%',padding:'0 0 10px 0'}}>
                                        <Input ref='titleRef' value = {article.title}  onChange = {this.changeTitle} style={{width:'100%'}} />                                                                              
                                         
                                    </div>  
                                    <div className="uEidt" style={{width: '60%', backgroundColor:'#fff'}} ref='toolbox'>
                                        
                                    </div>
                                    <div className="textarea mk-textarea-box" style={{borderRadius:0,borderColor:'#ddd'}} ref='editTextarea'>                                       
                                        
                                    </div>
                                    <div className="mk-num-btn">                                        
                                        <div className="btn-box mk-btn-box">
                                            <button className="btn-fh mk-btn-fh" onClick={()=>{this.saveArticle()}}>保存</button>
                                            {changeButEle}

                                            
                                            <button className="btn-fh mk-btn-fh" onClick={()=>{message.info('功能正在开发中。。。')}}>导出</button>

                                        </div>

                                    </div>
                                    <div className="mk-add-block" id="fixPara">
                                            <div className="option_xiala_box" style={{height: '58px',}}>                                               
                                                <div style={{width: 'inherit', overflow: 'hidden', height: '38px',}} id="wrapper">
                                                     <TabTags tabTag = {tabTag}  fun = {this.tabChange}  />
                                                </div>
                                            </div>
                                            <div className="wrap">
                                                <ul className= {listStyle}  >
                                                    <li>
                                                       <div className="option_xiala">                                                       
                                                            {secondGroup} 
                                                            {modulesEle}
                                                        </div>                                                                                                              
                                                         {listEle}                                                                                                               
                                                         
                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                     
                                </div>
                            </div>
                        </div>
                        
                  </section>
              </div>
              <Modal visible={ModualVisible} title= {'选择改稿类型'} destroyOnClose={true} maskClosable = {false}  width = '460px'  onCancel={this.closeEditModal} footer={null} >
              {/*  未完成，改其他方式，暂时保留烂尾工程  */}
              <div className="mokuai_box mokuai_box2">                    
                    <div className="mkt-change-box">
                        <div className="mkt-change fl">
                            <input type="radio"/> &nbsp;结构改稿
                        </div>
                        <div className="mkt-change fr">
                            <input type="radio"  value="SEO改稿" /> &nbsp;SEO改稿
                        </div>
                        <div className="mkt-select">
                            改稿篇数
                            <Select value= {this.state.num} style={{ width: 160 }}  onChange = {(v)=>{this.changeState('num',v)}} >
                                <Option key={3} value = {3}>3</Option>
                            </Select>
                        </div>
                        
                    </div>

                    <div className="mkt-btn-box mkt-btn-box2">
                        <button className="btn-fh mkt-btn-fh ">确定</button>
                        <button className="btn-bc mkt-btn-bc ">取消</button>
                    </div>
                </div>

              </Modal>
              <Modal  title="机器改编" destroyOnClose={true} visible={this.state.NWSentenceVisible} width ={1000}  footer = {null} onCancel={this.closeEditModal}>                               
                                <div className="changedSentenceModal" style={{ textAlign:'center'}}> 
                                <Spin size="large" spinning = {sentenceDataloading} />                               
                                {!sentenceDataloading && <ul className="compose gaibianlist">
                                    <li className="item item1">
                                       
                                        <span className="initSentence" dangerouslySetInnerHTML={{
                                            __html: NWSentenceData.originalSentence
                                        }}></span> 
                                        
                                        <img src="/img/gaibian2.png" alt="" className="gaibian1" />
                                    </li>
                                    <li className="item item2"> 
                                        
                                        <TextArea  value= {NWSentenceData.changedSentence} onChange = {this.changeChedSentence} style={{height:150,marginLeft:'5px',position:'relative',bottom:'20px',zIndex: 1, borderWidth: 0}}  />

                                        <img src="/img/gaibian1.png" alt="" className="gaibian1" />
                                    </li>
                                </ul>
                                }
                                <div className="btn-box" style={{marginTop:'15px'}}>
                                    <button className="btn-bc" style={{marginRight:'30px'}} onClick={()=>this.insertChangedSentence()}>插入</button>
                                    <button className="btn-fh" style={{marginRight:'30px', background: 'linear-gradient(90deg, #6e89b2, #3a537b)'}} onClick={this.closeEditModal}>关闭</button>                              
                                </div>                               
                                   
                                </div>
                        </Modal>
          </div>)

  } 
};

function mapStateToProps(state, ownProps) {
    
    return {}
}

export default connect(mapStateToProps)(ComposeEdit)


const _menus = [
  //'head', // 标题
  'bold', // 粗体
  'fontSize', // 字号
  'fontName', // 字体
  'italic', // 斜体
  'underline', // 下划线
  'strikeThrough', // 删除线
  'foreColor', // 文字颜色
  'backColor', // 背景颜色
  'link', // 插入链接
  'list', // 列表
  'justify', // 对齐方式 
  'image', // 插入图片
]
var customConfig = {
          zIndex : 999,
          showLinkImg:false,
          uploadImgShowBase64:true,
          pasteIgnoreImg:false,
          pasteFilterStyle:true,
          pasteTextHandle:  (content)=> { 
            //从word拷贝过来的文档带有大量的html标签，长度过大，一次replace不起作用，所以先把head去掉
            var reg = new RegExp('<head>([\\s\\S]*?)<\\/head>');
            
            if(reg.test(content))
            {
                content = content.replace(/<head>([\s\S]*?)<\/head>/g, '');
                content = content.replace(/<[\s\S]*?>/g, '');                       
            } 
        
            content = content.replace(/<p class="articleauthor">([\s\S]*?)<\/p>/g, '');
            
            content = $.trim(content);
            
            return content;

        },
            menus : _menus
}
 