import * as React from "react";
import {connect} from 'react-redux'
import {Select, Input,Icon,Modal, message} from 'antd'
import $ from 'jquery';
import ModualEdit from '@/containers/compose/moduleEdit'  
import E from 'wangeditor'
import * as query from "@/services/Utils"
import * as apiUrl from '@/services/ApiUrl'; 

import '@/style/modual.css' 

const Option = Select.Option;
var editors = []; 
const SearchEngines = [{value:530,label:'网页'},{value:583,label:'资讯'},{value:499,label:'百科'},{value:74,label:'知道'}]

class Compose extends React.Component {
  constructor(params) {
      super(params);
      message.config({
        top: 200,
        duration: 2,
        maxCount: 1,
      });
  }
  state = {
     customers :[],
     moduals :[],     //模板集合
     editModual :{},   //当前编辑的模板
     usedModual:[],    //当前使用的模块
     tags:[],          //模块编辑中供选择的标签
     customer:'',       //客户
     subdivision:'',    //细分
     ManuscriptTypes : [], //稿件类型数据 
     ManuscriptType:'',  //稿件类型
     ModualType : '',    //模板类型
     searchValue :'',  //搜索关键词
     channel: SearchEngines[0]  ,     //搜索频道
     news:null ,           //搜索的新闻集合
     activeEditorIndex:0,
     templateId : '',       //当前使用的模板ID
     editModualVisible: false
  }

//setState
  changeState = (propertie,value,callback) =>{ 
      this.setState({
         [propertie] : value
      },()=>{
        callback && callback();
      })
       
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


//选择稿件类型后，设置默认模板类型,如果没有模板数据，去查询
setModualType = () =>{
  let ManuscriptType = this.state.ManuscriptType;
  let ManuscriptTypes = this.state.ManuscriptTypes;

  let _type =  ManuscriptTypes.filter(c=>c._id == ManuscriptType)[0];
  let tabs = _type.tabs;
  if(tabs && tabs.length > 0)
  {
    this.setState({
      ModualType : tabs[0]._id
   },this.queryModuals)
  }else{
     query.callData(apiUrl.apimoduleTypeGetUrl,{sarticleId:ManuscriptType}).then((res)=>{
        if(res.code ==200)
        {
           let data = res.data;

            _type.tabs = data;
            if(data && data.length)
            {
              this.setState({
                ManuscriptTypes,
                ModualType : _type.tabs[0]._id
              },this.queryModuals)
            }
            
        }
     });
  }
}
 
//根据模板类型查询模板数据
queryModuals =()=>{
   let ManuscriptTypes = this.state.ManuscriptTypes;
   let ManuscriptType = this.state.ManuscriptType;
   let ModualType = this.state.ModualType;

   let _type =  ManuscriptTypes.filter(c=>c._id == ManuscriptType)[0];

   let tabs = _type.tabs;  //当前稿件类型下的模板类型列表
   
      let _templateType =  tabs.filter(c=>c._id == ModualType)[0];
      if(_templateType.templates)
      {
        this.changeState('moduals',_templateType.templates,this.setMoveEvent);
      }
      else{       
            let param ={
              page: 1,
              size: 100,
              sArticleType: ManuscriptType,
              templateType: ModualType
            }
            query.setData(apiUrl.apimoduleDatasGetUrl,param).then(res=>{
                if(res.code ==200)
                {
                    let moduals = res.data; 
                    _templateType.templates = moduals;
                    this.changeState('moduals',moduals,this.setMoveEvent);
                }else{ 
                    this.changeState('moduals',[],this.setMoveEvent);
                }
            })

      }
   
  

   
   
}
  //构建下拉列表选项
  buildOptions = (aData,id,txt)=>{ 
    if(aData && Array.isArray(aData))
    {
      let options = aData.map(ele=>{
            if(id)
            return <Option key = {ele[id]} value={ele[id]}>{ele[txt]}</Option>

            return <Option key = {ele} value={ele}>{ele}</Option>
            })
          return options;
    }
    return [];
  }
   
 
  Search = (v) =>{   
      
        const {searchValue,channel} = this.state;
        let value = v ? v : searchValue;
        if(value)
        {
          //调接口采集数据
          let url = apiUrl.apinewsGet160Url;
          query.callData(url,{key : value,  page : 1,  engineId:channel.value}).then(res=>{
              if(res.code == 200)
              {
                let news = res.data;
                this.changeState('news',news);
              }else{
                this.changeState('news',[]);
              }
              this.changeState('searchValue',value);
          })        
        }     
    
  }
//构建新闻
  buildNews = ()=>{
    const {news} = this.state;
    if(news && news.length > 0)
    {
        let eles = [];       
        let _news = news.filter(n=>n.title != null && n.title != '');                                            
        if(_news.length > 0)
        {
          
          eles = _news.map((n,index)=>{
            let summary = <p className="p mk-zixun" 
                              dangerouslySetInnerHTML={{
                                  __html: n.content
                              }}>
                          </p>
            if(index == _news.length -1 )
            {
              summary =   <p  className="p"  style={{textAlign:'left',overflow: 'hidden',fontSize: '12px',color: '#3c3c3c',width: '100%',lineHeight: '20px'}}
                              dangerouslySetInnerHTML={{
                                  __html: n.content
                              }}
                          ></p>
              
            }
            return <div className="p-item item" key = {index}>
                        <div className="title-bar" style={{textAlign: 'left'}}>
                            <h2  style={{cursor:'pointer',margin:'0 0 0 0'}} onClick={()=>{window.open(n.url)}}> 
                              <span className="mk-shuzi">{index + 1}</span> 
                              <p dangerouslySetInnerHTML={{   __html: n.title  }} style={{margin:'0 0 0 0'}} ></p>
                            </h2>                        
                        </div>
                        { summary  }
                    </div>
          })
        }else{
          eles = [<div className="p-item item" key = {1}>
                      <div className="title-bar">
                          <h2  style={{cursor:'pointer'}}>  
                            <p>{'没有查询到数据'}</p>
                          </h2>                        
                      </div> 
                  </div>]
        }
        return eles;
    }
    return []
    
  }
  //构建模板
  buildTemplates = ()=>{
    let _this = this;
    let moduals = this.state.moduals;
    let eles = [];
    if(moduals.length > 0)
    {          
      eles = moduals.map((item,index)=>{
          let _style =  'item';
          if(this.state.editModual._id == item._id)
          {
            _style =  'item active'
          } 
          let collectEle = '';
          let set = false;
          if(item.likes)
          { 
            collectEle = <Icon className="mk-tap-shoucang" theme="filled" type="star" style={{color:'#f7916b'}} /> ;
            set = false;
          }else{
            collectEle = <Icon className="mk-tap-shoucang" type="star"   /> ;
            set = true;
          }
          return  <li key={index} className= {_style} >
                    <div className="mk-tap-name" onDoubleClick = {this.useCurTemplate.bind(_this,item,false)}>{item.name}</div>
                    <div className="mk-tap-item"  onDoubleClick = {this.useCurTemplate.bind(_this,item,false)}>
                            {item.modules.slice(0,10).map((m,k)=>{
                                let name = m.name;
                                if(name.length > 5)
                                {
                                  return <span key={k} title={name}>{k+1}. {m.name.substring(0,5) + '..'}</span>
                                }
                                return <span key={k}>{k+1}. {name}</span>
                            })}                            
                    </div>
                    <div className="mk-tap-btn">
                        <button onClick = {this.setCollect.bind(_this,index,set)} >
                         {collectEle} 
                            收藏
                        </button>
                        <button onClick = {this.editTemplate.bind(_this,item)}>编辑</button>
                       
                         {item.source === 1 && <button className="mk-tap-btn1" onClick = {_this.DelTemplate.bind(_this,item)}>删除</button>}
                        
                        
                    </div>
                </li>
      })

      //$('.mk-tap-list2').css('width',(329 * moduals.length) + 'px')
    }

    return eles;
  }
  //设置收藏
  setCollect = (index,flag)=>{
    let moduals = this.state.moduals;
    let item = moduals[index];
      item.likes = flag;
      let param = 
        {
          id: item._id,
          likes: flag
        }
      let url = apiUrl.apimoduleDataSetLikesUrl;
      query.setData(url,param).then(res=>{
           if(res.code == 200)
           {
              this.changeState('moduals',moduals)
           }
      })
  }
  //删除模板
  DelTemplate = (item)=>{ 
    query.setData(apiUrl.apimoduleDataDelUrl,item._id).then(res=>{
         if(res.code == 200)
         {
          let moduals = this.state.moduals;
          let _index =  moduals.findIndex(m=>m._id === item._id);
          if(_index > -1)
          {
            moduals.splice(_index,1);
            this.changeState('moduals',moduals);
          }
         }
    });
 
  }
  //编辑模板
  editTemplate = (item)=>{    
     let template = {...item};
     item.isCommon = 0;

     let modules = item.modules;
    let param = modules.map(m=> {return m._id});
    query.__request('post',apiUrl.apimoduleDatasByidsGetUrl,param,(res)=>{
         
          template.modules = res.data;
               this.setState({
                  editModualVisible:true,
                  editModual:template
              });
    })
      
  }

  //添加模板,暂时不用自定义添加
  addTemplate = ()=>{   
     this.setState({
         editModualVisible:true,
         editModual:{
          _id : "",
          name : "",
          sArticleType : this.state.ManuscriptType, 
          templateType : this.state.ModualType,
          modules: [],
          source: 1

         }
     });
 }
  closeEditModal = ()=>{
    this.setState({
      editModualVisible:false
    });
  }
  cancelEditModal = ()=>{
    this.setState({
      editModualVisible:false,
      editModual:{}
    });
  }
static getDerivedStateFromProps(nextProps, prevState) {           
      return null;
    
}

getSnapshotBeforeUpdate(prevProps, prevState) {
   
    return null;
}

componentDidUpdate(prevProps, prevState, snapshot) {       
}
 
  componentDidMount() { 
            this.fetchClients();
            this.fetchManuscriptTypes();    
  }

  fetchClients(){
    var _this = this;        
    query.__request('get',apiUrl.apiClientsGetUrl,null,(res)=>{
        var data = res.data;
        if(data && data.length > 0)
        {
          var client = data[0];
          var customer = client.name;
          var classfies = client.classify;
          var subdivision = '';
          if(classfies && classfies.length > 0)
          {
            subdivision = classfies[0];
          }
          _this.setState({
            customer,subdivision
          });
        }
        
       
   })
  }
  fetchManuscriptTypes(){
    var _this = this;        
    query.__request('get',apiUrl.apiManuscriptTypeGetUrl,null,(res)=>{
        var data = res.data;
        if(data && data.length > 0)
        {
           _this.setState({
            ManuscriptTypes : data
           });
        }
        
       
   })
  }


  //设置富文本编辑框
  setEdit = ()=>{
      let _this = this;
      const usedModual = this.state.usedModual;
      const count = usedModual.length;
      let toolbox = this.refs.toolbox;
      let editArea = this.refs.editTextarea;
      toolbox.innerHTML = '';
      editArea.innerHTML = '';
      editors = [];
      if(count > 0)
      {
        /* let lineDiv = document.createElement('div');
        lineDiv.className = 'mk-shuxian';
        editArea.appendChild(lineDiv);
 */
        usedModual.forEach((element,index)=>{           
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

           editor.customConfig.onfocus =   () => { 
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
//模板列表无缝滚动事件
  setMoveEvent = () => {  
    var itemWidth = 329; 
    let c = this.state.moduals.length;
    $('.mk-tap-list2').animate({ 'left': 0},10,()=>{
      if(c > 4)
      {
        $('.mk-tap-list2').css({'width':c * itemWidth + 'px'});
      }else{
        $('.mk-tap-list2').css({'width': '1300px'});      
      } 
      $('.mk-t-left').css('color','#d6d9d9'); 
    });
    

    //向左按钮
    $('.mk-t-right').click(() => {     
        var count = $(' .mk-tap-list2 .item').length;
         if (count > 4) { //一屏显示4条，不到4条滚动没有意义
                  
            var left = $('.mk-tap-list2').css('left');
            left = parseInt(left, 10);
            var leftCount = parseInt(left * -1 / itemWidth + 0.5, 10);
            left = leftCount * itemWidth * -1;
            var _left = left;
            //总的数量减去已经滚到左边看不见的数量，还要大于当前展示的数量4，才继续去滚动
            if (count - leftCount > 4) {
                
                //右侧还有大于3条数据没有展示，向左移动4条的宽度
                if (count - leftCount > 8) {
                    _left = left - (itemWidth * 4);
                    $('.mk-t-left').css('color','#b2b2b2');   
                    $('.mk-t-right').css('color','#b2b2b2'); 
                } else {
                    //右侧还有不到3条数据没有展示，向左移动剩余几条的宽度
                    _left = left - (itemWidth * (count - leftCount - 4));
                    $('.mk-t-right').css('color','#d6d9d9');     
                    $('.mk-t-left').css('color','#b2b2b2');     

                }

            }
            $(' .mk-tap-list2').animate({
                left: _left
            }, 700)
        }

    });

    $('.mk-t-left').click(() => {
        
        var count = $('.mk-tap-list2 .item').length;
         if (count > 4) {
          var left = $('.mk-tap-list2').css('left');
            left = parseInt(left, 10);
            if (left < 0) {
                var itemWidth = 329;      
                var leftCount = parseInt(left * -1 / itemWidth + 0.5, 10);
                left = leftCount * itemWidth * -1;
                var _left = left;
                if (leftCount > 4) {
                    _left = left + (itemWidth * 4 );
                } else {
                    _left = left + (itemWidth * leftCount);
                }
                $('.mk-t-left').css('color','#b2b2b2');   
                $('.mk-t-right').css('color','#b2b2b2');    
            } else {
                _left = 0;                
                $('.mk-t-left').css('color','#d6d9d9');   
                $('.mk-t-right').css('color','#b2b2b2');     

            }
            $('.mk-tap-list2').animate({
                left: _left
            }, 700)
      }
    });
   // this.seted = true;
 

}

//弹框确认
setUsedTemplate = (template)=>{
   let editModual = this.state.editModual; 
   let moduals = this.state.moduals;
   let diff = false;

   if(editModual.modules.length == template.modules.length)
   {      
      for (let i = 0; i < editModual.modules.length; i++) {
        const element1 = editModual.modules[i];
        const element2 = template.modules[i];
        if(element1._id != element2._id)
        {
          diff = true;
        }
        
      }
       
   }else{
    diff = true;
   }
   let _template = Object.assign({},editModual,template);
   if(_template.isCommon == 1 && $.trim(editModual.name) == '')
   {
      message.warn('请输入模板名称！');
      return;
   }
   this.useCurTemplate(_template,diff);
  if(_template.isCommon == 1)
  {    
    let url = apiUrl.apimoduleDataAddUrl; 
    _template.source = 1;
    query.setData(url,_template).then(res=>{
      if(res.code ==200)
      {
       _template._id = res.data; 
       moduals.unshift(_template);
       this.setState({  
           moduals,
           templateId:res.data,
           editModual:_template
         });
      }else{
         message.warn('添加失败！');
      }
     });  
    
  }
  this.closeEditModal();   
}
useCurTemplate =(_item,diff) =>{ 
  let item = {..._item};
  let templateId = ''
  if(!diff)
  {
    templateId = item._id
  }
  let modules = item.modules;
  let param = modules.map(m=> {return m._id});
  query.__request('post',apiUrl.apimoduleDatasByidsGetUrl,param,(res)=>{
       this.setState({
            editModual:item,
            usedModual : res.data,
            templateId

          },this.setEdit)
  },()=>{
    this.setState({
      editModual:item,
      usedModual : item.moduals,
      templateId

    },this.setEdit)
  })
  
}
changeTemplateTitle = (e)=>{
   let v = e.target.value;
   let editModual = this.state.editModual;
   editModual.name = v;
   this.changeState('editModual',editModual);
}
submitArticle = ()=>{
   //editors
   let usedModual = this.state.usedModual;
   usedModual.forEach((template,index)=>{
        let editor = editors[index];
        let content = editor.txt.html();
        template.content = content;
   });

  let param = {
    client: this.state.customer?this.state.customer : '碧桂园',
    topic: this.state.subdivision,
    sArticleType: this.state.ManuscriptType,
    templateType:this.state.ModualType,
    templateId: this.state.templateId,
    title: '',
    content: usedModual,
    modules:usedModual ,
    finishScore: 0,
    parentStructArticleId: '',
    changeType: ''
  }
  /* if(!param.client)
  {
    message.warn('请选择客户！')
    return;
  }
  if(!param.topic)
  {
    message.warn('请选择细分！')
    return;
  } */
  if(!param.sArticleType)
  {
    message.warn('请选择稿件类型！')
    return;
  }
  if(!param.modules || param.modules.length  == 0)
  {
    message.warn('请选择一个模板！')
    return;
  }
  let url = apiUrl.apiStructAddUrl;
  query.setData(url,param).then(res=>{
     if(res.code == 200)
     {
         let id = res.data;
         this.props.history.push('/compose/edit/' + id) 
     }
  })
}

setCommon= () =>{
  let editModual = this.state.editModual;
  if(editModual.isCommon == 1)
  {   
      if(editModual.name == '')
      {
        message.info('请在弹框顶部输入模板名称');
        return false;
      }
      return true;
  }else{
     let neweditModual = {...editModual};
      neweditModual.name = '';
      neweditModual.isCommon = 1;
      neweditModual._id = '';
      neweditModual.source = 1;

      this.changeState('editModual',neweditModual,()=>{
        message.info('请在弹框顶部输入模板名称');
        window.scrollTo(0,0);
      });
      return false;
  }
   
}

  render () {
    const {ManuscriptTypes,ManuscriptType,ModualType,channel,searchValue,editModualVisible,editModual,moduals} = this.state;
    //客户细分稿件
    //let CustomerEles = this.buildOptions(customers,'name','name');
   
    /*let subdivisionEles = [];
     if(customer)
     {
      let curCustomer =  customers.filter(c=>c.name == customer)[0];
      let subdivisions = curCustomer.classify;
      if(subdivisions)
      {
        subdivisionEles = this.buildOptions(subdivisions)
      }
      
     }
     */
    let ManuscriptTypeEles = this.buildOptions(ManuscriptTypes,'_id','name');
    let ModualTypeEles = [];

    //搜搜频道(资讯、网页、百科、知道)
    let channelsEle = SearchEngines.map((c)=>{
        if(c === channel)
        {
          return <li key={c.value} className="active">
                    <span>{c.label}</span>
                </li>
        }else{
          return <li  key={c.value}  onClick={()=>this.changeState('channel',c,this.Search)}>
                    <span>{c.label}</span>
                </li>
        }
    });
    //新闻列表
    let newsEles = this.buildNews();
    
    //let selfMakeModualEle = '';
    let ModualTypesEle = '';

    if(ManuscriptType  && ModualType)
    {
      let _type =  ManuscriptTypes.filter(c=>c._id == ManuscriptType)[0];

      let tabs = _type.tabs;
      if(tabs && tabs.length > 0)
      {
        //模板类型
        ModualTypeEles = tabs.map((_t,index)=>{
              if(ModualType === _t._id)
              {
                return <li key={index} className="item active" >{_t.name}</li>
              }
            
              return <li key={index} className="item" onClick={()=>{this.changeState('ModualType',_t._id,this.queryModuals)}}>{_t.name}</li>      
            
            })
        if(moduals.length > 0)
        {
          let modualsEles = this.buildTemplates();
          //模板类型 模板列表
          ModualTypesEle =   <div className="mk-tap-box">
                                    <div className="mk-tap-title">
                                        <ul className="mk-tap-list1">
                                            {ModualTypeEles}
                                        </ul>
                                    </div>
                                    <Icon type="left-square" className='tsquare mk-t-left'  />
                                    <div className="mk-tap-content">
                                        
                                        <ul className="mk-tap-list2">
                                            {modualsEles}                                       
                                        </ul>                                   
                                    </div>
                                    {/*selfMakeModualEle*/}
                                    <Icon type="right-square"  className='tsquare mk-t-right'/>
                                </div>
        } 
        
      }      
    }
    return (
           <div className="content__box w_1300">
              <section className="articleOneBox"> 
                        <div className="mk-xl">                         
                          <Select   placeholder="请选择稿件类型" style={{ width: 200 }} onChange={(value)=>{this.changeState('ManuscriptType',value,this.setModualType)}}>
                                    {ManuscriptTypeEles}
                          </Select>
                        </div>
                        {moduals.length > 0 && <h3 className="mk-title">文章模板</h3>}
                        <div className="moban-box"> 
                             {ModualTypesEle}
                        </div>
                      
              </section>
              <div>
                 <section className="articleOneBox article articleOneEidt">
                        <h3 className="mk-title">文章提纲</h3>
                        <div className="articleOne mk-articleOne">
                             
                            <div className="broadcast">
                                <div className="articleOne__box mk-articleOne__box">
                                    <div className="uEidt" style={{width: '60%', backgroundColor:'#fff'}} ref='toolbox'>
                                        
                                    </div>
                                    <div className="textarea mk-textarea-box" style={{borderRadius:0,borderColor:'#ddd'}} ref='editTextarea'>                                       
                                        
                                    </div>
                                    <div className="mk-num-btn">                                        
                                        <div className="btn-box mk-btn-box">
                                            <button className="btn-fh mk-btn-fh" onClick={this.submitArticle}>提交</button>
                                        </div>

                                    </div>
                                    <div className="mk-add-block" id="fixPara">
                                        <div className="option_xiala_box" style={{height:'88px'}}>
                                            <div className="option_xiala">
                                                  <div className="sousuo mk-sousuo">
                                                      <Input className="search" value = {searchValue} style={{border:'none',marginRight:'8px'}} onPressEnter = {()=>{this.Search('')}} onChange = {(e)=>{this.changeState('searchValue',e.target.value)}}   placeholder="搜索" />
                                                      <span className="iconfont icon-search" style={{cursor:'pointer'}} onClick={()=>{this.Search('')}}></span>
                                                  </div>
                                            </div>
                                            <ul className="blist clearfix">
                                                 {channelsEle}                                               
                                            </ul>
                                        </div>
                                        <div className="wrap">
                                            <ul className="blsit-list"> 
                                                <li>
                                                    <div className="hot_list" style={{marginTop: 0}}>
                                                         {newsEles}                                                       
                                                    </div>
                                                </li>                                                                                                                                      
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                  </section>
              </div>
              <Modal visible={editModualVisible} title= {editModual.isCommon ? <span>模板名称: <Input style={{width:'80%'}} onChange = {this.changeTemplateTitle} value = {editModual.name} /></span> : editModual.name} destroyOnClose={true} maskClosable = {false}  width = '1000px'  onCancel={this.cancelEditModal} footer={null} >
                  <ModualEdit data = {editModual} ManuscriptType={ManuscriptType} setTemplate={this.setUsedTemplate} setCommon = {this.setCommon} cancel = {this.cancelEditModal}/>
              </Modal>
          </div>)

  } 
};

function mapStateToProps(state, ownProps) {
 
  return {  
      
  }
}

export default connect(mapStateToProps)(Compose)

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

  