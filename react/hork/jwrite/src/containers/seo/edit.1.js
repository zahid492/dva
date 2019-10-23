import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Input,AutoComplete ,Popconfirm, Modal, message,Select,Tag,BackTop,notification,Radio,Icon,Tooltip  } from 'antd';
 
import * as apiUrl from '../../services/ApiUrl';
import * as query from "../../services/Utils"
import store from "store2";
import * as actions from "../../store/actions";
import qs from "qs";
import $ from 'jquery';

import EditAssistAddItem from '../../components/EditAssist/EditAssistAddItem'
import EditAssistAddTitleItem from '../../components/EditAssist/EditAssistAddTitleItem'
import EditAssistAddImgItem from '../../components/EditAssist/EditAssistAddImgItem'
import Customer from '../../components/Customers'
import TabTags from '../editComponse/Assisttab'
import AssisttabList from '../editComponse/AssisttabList' 

import Common from '../../components/Common'

import TagsTitle from '../editComponse/editedTitleTag';

import  '../../components/my_scrollbar';

import '../../style/toBottom.css'
import '../../style/article_edit.css'
import '../../style/tab.css'
import '../../style/table.css'
import E from 'wangeditor'

import moment from 'moment' 

import '../../components/jquery.highlight'

const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group; 

var editor;

const newsPageSize = 10;
const titleMaxCount = 60;
const interval = 30; //30秒,自动保存时间
const platforms = [<img key={0} alt='' src="/img/sina.png"/>, <img key={1} alt='' src="/img/wx.png"/>, <img key={2} alt='' src="/img/webnet.png"/>];
 
const scrollLoads = [-1,-2,-3,-5,-6];    //辅助内容列表滚动条到底后加载数据的tab value

const menus = [
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

const SearchEngines = [{value:449,label:'资讯'},{value:499,label:'百科'}]
const SourceMaterialChilren = [{value:6,label:'首段'},{value:11,label:'领导人讲话'},{value:9,label:'企业数据'},{value:10,label:'行业数据'},{value:3,label:'观点'},{value:-7001,label:'名词解释'},{value:7,label:'尾段'}]


var page = 1;
var seted = false; //编辑页，是否已经把文章内容赋值给富文本编辑框
var oMyBar;
var ModifyTime = 0;
var mTimer = null;
var saved = true;
var titleSplit = '$TT$'

//文章编辑
class SeoEdit extends Component {
    constructor(props) {
        super(props);         
        this.state = {  
            OneArticle: {},  
            id: props.match.params.id, 
            tabTag: -3, 
            newsType:null,
            searchEngineId:449,
            addBlockShow: false, 
            customer: '',
            industry: '',
            Titles:[],
            otherTitlesVisible : false,           
            TitleCategorys:[],
            TitleCategory:'',            
            searchKey:'',     //搜索关键词
            searchValue:'',   //搜索框变化的搜索词
            curTitle:'',
            titleSize : 0,
            tabList:{},
            SentenceHandleVisible:false,
            sentenceData:{},
            speWord:[],
            sentenceDataloading: false
             
        };

        this.articleId = store.session('articleId'); 
        
        this.tabChange = this.tabChange.bind(this);
        this.insertHandle = this.insertHandle.bind(this);
        this.modual = this.props.location.pathname.substring(1).split('/')[0];
 
        //var platform = store.session('applyPlatform');

        /* this.props.dispatch(actions.loadNewArticlesWithId({
            nid: this.articleId,
            index: 1,
            size: 1000,
            listtype: 1,
            applyplatform: platform
        })); */
        
        
        this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: this.props.match.params.id,loadMaterial:false}));
        this.loadCustomerDatas();
        message.config({
            top: 200,
            duration: 2,
            maxCount: 1,
        });

        window.scrollTo(0,0);
        
    }

toArticleList = () => {
        var id = this.state.id;
        var NewArticles = this.props.NewArticles;
        const cid = NewArticles.findIndex(_id=>_id=== id) + 1;
        let page = _.ceil(cid / apiUrl.AD_PAGESIZE, 0) || 1;
        this.props.history.push('/seo/list/' + this.articleId + '/' + page);
    };
//保存 
saveNews = (m) => {
        const {id, OneArticle,Grade,Titles} = this.state;      
         var HTMLcontent =  $.trim(editor.txt.html());
         if(this.editorisNull(HTMLcontent))
         {
            message.destroy();
            message.warn('中间段内容不能为空！');
            return;
         }

        var title = $.trim(this.refs.titleRef.input.value);

        if (title.length > titleMaxCount) {
            message.destroy();
            message.warn('标题字数超过' + titleMaxCount + '了！');
            return;
        }
        if (title.length === 0) {
            message.destroy();
            message.warn('标题不能为空！');
            return;
        } 
       
        OneArticle.title = title;
        OneArticle.qType = Grade;
        OneArticle.otherTitles = Titles; 
        OneArticle.content  = $.trim(editor.txt.html());

        this.setState({
            OneArticle
        });
        saved = true; 
  
        var param = {
            nid: this.articleId,
            id: id,
            title: OneArticle.title,       
            content : OneArticle.content,
            otherTitles: Titles,
            qType: Grade, 
            hitRate:OneArticle.hitRate,
            m : m
        }

        this.props.dispatch(actions.editOneArticle.request(param));        
    }

editorisNull = (content)=>{
    if(!content)
    {
        content = '';
    }
    var con = content.replace(/&nbsp;/img,'').replace(/ /g,'').replace(/<p><br><\/p>/g ,'').replace(/<p><\/p>/g,'');
    return con === '';
}
//导出 下载
exportFile = (m) => {
        const token = store.get("accesstoken");
        let ps;
        if (m === 1) {
            ps = {
                articleId: this.articleId
            };

        } else {
            ps = {
                articleId: this.articleId,
                ids: this.state.id
            };
        }

        let pss = qs.stringify(ps);
        window.open(apiUrl.newArticlesUrl + '/export?accesstoken=' + token + "&" + pss);

        this.props.dispatch(actions.calculation.request({articleIds:[this.state.id]}));
        /* _.delay(() => {
            this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: this.props.match.params.id}));
        }, 1000) */

    };

//接收props
static getDerivedStateFromProps(nextProps, prevState) {          
        if (nextProps.OneArticle._id !== prevState.id || nextProps.Article.content) {
        
            seted = false;
        }  
         
        return {
            OneArticle: nextProps.OneArticle,  
            id: nextProps.OneArticle._id,
            OneGo: nextProps.OneGo, 
            customer: prevState.customer ? prevState.customer : nextProps.OneArticle.clientName,
            industry: prevState.industry ? prevState.industry : nextProps.OneArticle.industry,
            TitleCategorys:nextProps.ActileEditTitleCategory.data,
            tabList:nextProps.tabList,
           // AutoOneArticle:nextProps.AutoOneArticle
           TitleCategory:nextProps.ActileEditTitleCategory.defaultID

        };
    }

getSnapshotBeforeUpdate(prevProps, prevState) {

        // 从这里跳转， 修改完后，跳转到下一篇文章或下一步 step4      
        // 当前 id 和 go 中的id 相等则跳转到下一步或文章
         if (!_.isNull(this.state.OneGo)
            && this.state.OneGo.m === 0
            && this.props.match.params.id === this.state.OneGo.id) {
            this.props.dispatch(actions.oneArticle.update({m:null,id:this.props.match.params.id}));
            //this.toArticle();
            message.destroy();
            message.success('保存成功！');

        }  
        if (!_.isNull(this.state.OneGo)
            && this.state.OneGo.m === -1
            && this.props.match.params.id === this.state.OneGo.id) {
            this.props.dispatch(actions.oneArticle.update({m:null,id:this.props.match.params.id}));
             //自动保存提示
            this.openNotification();

        } 
        if (!_.isNull(this.state.OneGo)
            && this.state.OneGo.m === 100
            && this.props.match.params.id === this.state.OneGo.id) {

            this.toNext();
        }
        if (prevState.TitleCategory && prevState.TitleCategory !==  this.state.TitleCategory)
         {
            this.searchList();
         }
        return null;
    }

componentDidUpdate(prevProps, prevState) { 
        var OneArticle = this.state.OneArticle;
        if(this.props.Article.content)
        {
            //恢复原文后，把原始内容赋值给当前文章          
            OneArticle.title = this.props.Article.title;
            OneArticle.content = this.props.Article.content;           

            this.props.dispatch(actions.article.clear());
            seted = false;
            this.setState({
                OneArticle
            });
            
        }
       
        this.setEdit();
        this.setEditContent();
        if(OneArticle.seoKeywords)
        {
            $('.textarea').highlight(OneArticle.seoKeywords);
        }
        if(prevState.industry !== this.state.industry)
        {
            this.loadTitlesCategory();
        }

        if(this.state.SentenceHandleVisible && this.state.sentenceData.changewordIndex > -1)
        {
            let autoComplete = this.refs.refautoComplete;
            autoComplete.focus();
        } 
    }
loadCustomerDatas = ()=>{
    const Account = store.get("Account"); 
    if (Account &&  Account.accesstoken  && this.props.ClientInfo.length === 0)
     { 
        this.props.dispatch(actions.clientInfo.request({accesstoken: Account.accesstoken}));          
     } 
}
componentDidMount() {
        var _this = this;
         
        _this.btnTop();
        _this.setEdit();
        
         
        //辅助模块随滚动条fixed移动
        //var clientWidth = (document.body.clientWidth - 1300) / 2 + 25 + 'px';
        var oDiv = document.getElementById("fixPara"),
            oTextarea = document.getElementById("textarea"), 
            H = 0,
            Y = oDiv,
            totalH = 0,
            contentH = oTextarea.offsetHeight;
            
        while (Y) {
            H += Y.offsetTop;
            Y = Y.offsetParent;
        }
        //滚动条超过辅助模块时，设置辅助模块fixed显示，富文本编辑框工具栏fixed显示
        window.onscroll = function () {
            _this.btnTop();
            var s = document.body.scrollTop || document.documentElement.scrollTop
            totalH = oTextarea.offsetHeight + oTextarea.offsetTop;
            contentH = oTextarea.offsetHeight;
            if (s > H && (s + 700)  < totalH) {
  
                oDiv.style.position = 'absolute';
                //oDiv.style.top = '25px';
                oDiv.style.top =  s - H + 'px';

                //oDiv.style.right = clientWidth;
                oDiv.style.right = '10px';
                oDiv.style.height = '700px';
               
            } else if( (s +  700)  >= totalH){  
                oDiv.style.position = 'absolute';
                oDiv.style.top =  contentH - oDiv.offsetHeight + 'px';
                oDiv.style.right = '10px';
                oDiv.style.height = '700px';
                 
            } else {
                oDiv.style = {};              
            }


        }

        oMyBar = new window.MyScrollBar({
            selId: 'wrapper',
            enterColor: '#999',
            hasX: true,
            hasY: false,
            width: 6
        });
      
        //this.autoSave();
        this.editorContainerEvent();
        this.listExpendEvent();
        this.listScrollEvent();


        //this.SearchSimilarSentence();
        
    }
//辅助列表滚动事件
listScrollEvent = () =>{
    var _this = this;
   //辅助文章滚动条，到底后加载新数据
   $('#fixPara .blsit-list li .hot_list').scroll(function () {            
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(this)[0].scrollHeight;
    var clientHeight = $(this)[0].clientHeight;
    if(_this.state.tabTag != -1 && _this.state.tabTag != -3)   //不计算图片列表 标题列表
    {
        let top = 0;
        let items = $(this).find('.item');
        if(items.length)
        {
            top = items[0].offsetTop; 
        }
        
    var tops = items.map((index,item)=>{
        return item.offsetTop;
        });

        //let sTop = scrollTop + clientHeight *(scrollTop/scrollHeight);
         
        var _temp =[];
        for (let i = 0; i < tops.length; i++) {
            const tp = tops[i];
            if(tp < scrollTop + 35)
            {
                _temp.push(tops[i]);
            }
            
        }
        
        var _index = _temp.length > 0 ?   _temp.length-1 : 0;
        let curItem = items[_index];

         
        $(curItem).siblings().find('.title-bar').css({position:'unset',backgroundColor:'unset',top:0});

        if(scrollTop  > top)
        {           
            if($(curItem).find('.p').hasClass('hotnews_text_zk'))
            {
                //let h = scrollTop > 100 ? sTop - curItem.offsetTop  - 50 : sTop - curItem.offsetTop;
                let h = scrollTop  - curItem.offsetTop;

                $(curItem).find('.title-bar').css({position:'relative',top: h,backgroundColor:'#fff'});
                $(curItem).siblings().find('.title-bar').css({position:'unset',backgroundColor:'unset',top:0});
            } else{
                $(curItem).find('.title-bar').css({position:'unset',backgroundColor:'unset'});
                $(curItem).siblings().find('.title-bar').css({position:'unset',backgroundColor:'unset',top:0});
            }
            
        }else{
            curItem = items[0];
            $(curItem).find('.title-bar').css({position:'unset',backgroundColor:'unset'});
            $(curItem).siblings().find('.title-bar').css({position:'unset',backgroundColor:'unset',top:0});
        }
    }
    
     if(scrollLoads.includes(_this.state.tabTag))
     {
         if (scrollHeight - scrollTop - clientHeight <= 0) {
            page++;
            _this.getList();
         
        }
     }
    
});
}
//辅助列表展开、收起
listExpendEvent = () =>{
    var _this = this;
   //  展开
   $('.hot_list ').on('click', '.toggle', function (e) {
    var extended = false;
    if(e.target.hasAttribute('extend') && e.target.getAttribute('extend') == 1)
    {
        extended = true;
    }            
    if ($(this).hasClass('unfold')) {
        if(!extended && _this.state.tabTag === -6)
        {
            var url = e.target.id;
            var key =   encodeURIComponent(_this.state.searchKey);
             
            var opt = {
                url,
                key,
                newarticleid:_this.state.id,
                tabTag: _this.state.tabTag
            };
            
            _this.props.dispatch(actions.LOADAssisNewsItem(opt));
        }
       
        $(this).html("收起").removeClass("unfold").addClass("shouqi");
        $(this).closest('.item').find('.p').removeClass("hotnews_text").addClass("hotnews_text_zk");
    } else {
        $(this).html("展开").removeClass("shouqi").addClass("unfold");
        $(this).closest('.item').find('.p').removeClass("hotnews_text_zk").addClass("hotnews_text");

        $(this).closest('.item').find('.title-bar').css({position:'unset',backgroundColor:'unset'});
    }

    });
}
//文章内容操作
editorContainerEvent = ()=>{
    var _this = this;
 
    //class为seoarticlesentence的句子，单击后打开弹出窗
    $('.articleOne__box__edit').on('click', '.seoarticlesentence', (e) => {
         let ele = e.target;
         if(ele.className == 'highlight')
         {
            ele = e.target.parentElement;
         }
         let sentence = ele.innerText; 
         let id = ele.getAttribute('data-id');
         
         _this.SearchSimilarSentence(id,sentence);
    });

     
}
//自动保存
autoSave = ()=>{
    var _this = this;
    ModifyTime = moment().format('X');
    clearInterval(mTimer);
    mTimer = setInterval(()=>{      
               
            if(ModifyTime > 0)
            { 
                let now = moment().format('X');            
                if(now - ModifyTime >= interval && !saved)
                {                    
                    _this.saveNews(-1);
                    ModifyTime = now;
               }
            }
        },1000)
}
//自动保存开始计时
reSetAutoSaveTime = () =>{
        if(saved)
        {
            saved = false;
            ModifyTime = moment().format('X');
        }
    }

//自动保存成功提示
 openNotification = () => {
    notification.destroy()
    notification.config({   
        duration:5,     
        placement: 'bottomRight',
      });
    notification.open({
          message: '自动保存提醒！',
          description: '已成功自动保存所修改内容！',
        });
      };
//加载辅助资料标题分类
loadTitlesCategory = () =>{  
        var opt = {page:1,limit:100,key:'',industry: this.state.industry,id:this.state.id}      
        this.props.dispatch(actions.LOADTitleCategory(opt));       
    }
    
componentWillUnmount() {
        editor = null; 
        seted = false;
        clearInterval(mTimer);
        this.props.dispatch(actions.oneArticle.clear());    //清空改变文章
        this.props.dispatch(actions.editAssistget.clear({})); //清空辅助数据
    }

//编辑模式，设置富文本编辑框
setEdit = () => {
    var _this = this;
        if (!editor) {
            const elem = _this.refs.editorElem;
            const elemBar = _this.refs.editorElemtoobar;

            elemBar.innerHTML = '';
            if (elem && elemBar) {
                editor = new E(elemBar, elem);

                var customConfig = {
                    zIndex : 999,
                    showLinkImg:false,
                    uploadImgShowBase64:true,
                    pasteIgnoreImg:false,
                    pasteFilterStyle:true,
                    pasteTextHandle:  (content)=> {
                        _this.reSetAutoSaveTime();
                       //从word拷贝过来的文档带有大量的html标签，长度过大，一次replace不起作用，所以先把head去掉
                       var reg = new RegExp('<head>([\\s\\S]*?)<\\/head>');
                       
                       if(reg.test(content))
                       {
                           content = content.replace(/<head>([\s\S]*?)<\/head>/g, '');
                           content = content.replace(/<[\s\S]*?>/g, '');                       
                       }else 
                       { 
                           content = content.replace(/<[^(img)|p]*?>/g, '');
                           content = content.replace(/<html>/g, '');   
                           var reg1 = new RegExp('<img src="\(?<url>.*?\)>','g');
                           var reg2 = new RegExp(apiUrl.IMAGE_ROOT +'(?<dataid>.*?)(.jpg|.png)');
   
                           var matches = content.match(reg1);
                           if(matches && matches.length > 0)
                           {
                               for (let t = 0; t < matches.length; t++) {
                                   const element = matches[t];
                                   var ms = element.match(reg2);
                                   if(ms && ms.length > 1)
                                   {
                                       var id = ms[1].replace('/','');
                                       var element_temp ='';
                                       if(element.includes('/>'))
                                       {
                                           element_temp = element.replace('/>',' data-id="' + id +'" />');
                                       }else{
                                           element_temp = element.replace('>',' data-id="' + id +'" >');
                                       }
                                       
                                       content = content.replace(element, element_temp); 
                                   }
                                   
                               }
                                
                           }
                            
                       }
                   
                       content = content.replace(/<p class="articleauthor">([\s\S]*?)<\/p>/g, '');
                       
                       content = $.trim(content);
                       
                       return content;
   
                   },
                   onchange: (html) => {  },
                    
                   menus : menus
                }

                editor.customConfig  = Object.assign({},customConfig);
                
                editor.create();
               
                $('.w-e-text').css('overflowY', 'auto');
                editor.$textElem.attr('contenteditable', false)

            }
        }


    }
   
//给富文本编辑框设置内容
setEditContent = () => {
        if (editor && this.state.OneArticle && this.state.OneArticle.content && !seted) {
            editor.txt.html(this.state.OneArticle.content);
            
            let _title = this.state.OneArticle.title;           
            this.setState({ 
                titleSize:this.state.OneArticle.title.length,
                curTitle:_title
            });
            
            if(this.state.OneArticle.qType)
            {                
                var titles = this.state.OneArticle.otherTitles;
                this.setState({Grade: this.state.OneArticle.qType,Titles:titles});
                //this.setState({Grade: this.state.OneArticle.qType});

            }
              
            seted = true; 
        }
    }

gotoSearch = (txt) =>{  
 
    if(!txt && editor)
    {
        txt = editor.selection.getSelectionText();
    }
    if(txt)
    {
      this.setState({
                    searchValue:txt, 
                    searchBtnShow:false,
                    searchBtnTop:0,
                    searchBtnLeft:0},
                    ()=>{
                        this.clear();
                        this.tabChange(-6, 'hotlist_3');
                    });
     }
    
}
    //切换选项卡
tabChange = (_type, id,newsTypes) => {
        var _this = this;
        _this.clear();        
        var _newsType = _this.state.newsType;
        oMyBar.jump({id: id,time: 400 })  
        if(_type === -6)    //全网搜
        { 
            //搜索关键词为空默认文章提供的第一个关键词
            if($.trim(_this.state.searchValue) === '' && _this.state.OneArticle.keywords && _this.state.OneArticle.keywords.length > 0)
            { 
               
                _this.setState({
                    tabTag: _type,
                    addBlockShow: false,
                    searchValue:_this.state.OneArticle.keywords[0],
                    searchKey:_this.state.OneArticle.keywords[0]

                },()=>{ 
                    this.clear();
                    var tabList = _this.props.tabList;
                    var key = _this.state.searchValue; 
                    if(!tabList[_type + key] || (tabList[_type + key] && tabList[_type + key].length === 0))
                    {  
                        this.getList();
                    }
                    }); 
            }else if(!_this.state.OneArticle.keywords || _this.state.OneArticle.keywords.length === 0)
            { 
                this.setState({
                    tabTag: -6,
                    addBlockShow: false
                })
            }
            else{ 
                this.setState({
                    tabTag: -6,
                    addBlockShow: false
                }, () => {            
                    var tabList = _this.props.tabList;
                    var key = _this.state.searchValue;

                    if(!tabList[_type + key] || (tabList[_type + key] && tabList[_type + key].length === 0))
                    { 
                        this.getList();
                    }
                    
                }
            )
                    
            }
      }else{ 
            if(newsTypes && newsTypes.length > 0 && !_newsType)
            {
                _newsType = newsTypes[0]
            }
            this.setState({
                    tabTag: _type,
                    addBlockShow: false,
                    newsType:_newsType,
                    searchValue:'',
                    searchKey:''
                }, () => {            
                    var tabList = _this.props.tabList;
                    var key = _type == -3 ? '' : _this.state.searchValue;

                    if(!tabList[_type + key] || (tabList[_type + key] && tabList[_type + key].length === 0))
                    { 
                        this.getList();
                    }
                    
                }
            )
      }

        
    }

TitleCategoryChange = (id)=>{
    this.props.dispatch(actions.TitleCategoryGet.update({defaultID:id}));
}
    //辅助编辑部分搜索功能
searchList = () => { 
      const {tabTag,searchValue} = this.state;
  
        var key = encodeURIComponent(searchValue);
         
        if(tabTag === -6 && $.trim(key) === ''){
            message.warn('请输入搜索关键词');
            return;
        }
        this.clear();
        
        this.getList();              

    }

//查询辅助资料列表
getList = () => {      
        const {customer,industry,TitleCategory,tabTag,searchValue,searchEngineId,newsType} = this.state;
        var key = encodeURIComponent(searchValue);
         
        if(tabTag === -6 && $.trim(key) === ''){
            return;
        }

        this.setState({searchKey:searchValue},()=>{
            if (tabTag === -1) {
                this.props.dispatch(actions.loadeditAssistImg({
                    index: page,
                    size: newsPageSize,
                    clientName: customer,
                    key: key,
                    tabTag:tabTag
                }));

        } else {
            var size = newsPageSize;
            if(tabTag === -3)  //标题不翻页，不传关键词 一次性返回15
            {
                size = 15;
                key = '';
            } 
            if(tabTag === -7) //素材不翻页，一次性返回50
            {
                size = 50; 
            } 
            var tag =  tabTag;
            if(tag === -7 && newsType && newsType < -7000)
            {
                tag = newsType;
            }
            this.props.dispatch(actions.loadeditAssist({
                id:this.state.id,
                page: page,
                size: size,
                tabTag: tag,
                key: key,
                ArticleType:6,
                clientName: customer,
                industry: industry,
                TitleCategory:TitleCategory,
                engineId : searchEngineId,
                newstype:newsType
            }));
        }
        })
        
        

    }
//清空辅助编辑列表内容数据
clear = () => {
        page = 1;
        var key = '';
        if(this.state.tabTag != -3)
        {
            key = encodeURIComponent(this.state.searchKey);          
        }  
           
        this.props.dispatch(actions.editAssistget.clear({tabTag: this.state.tabTag,key}));
    }
//显示隐藏添加框
setAddBlock = (flag) => {
        this.setState({
            addBlockShow: flag
        });
    }
//添加一条辅助新闻
saveAssistNews = (item) => {
        
        const {tabTag,customer,industry,searchValue,TitleCategory,id} = this.state;
        var Account = store.get('Account');
        if (tabTag === -1) {
            let title = item.title;
            var list = item.list;
            if ($.trim(title) === '') {
                message.destroy();
                message.warn('图片描述不能为空！');
                return;
            }
            if (list.length === 0) {
                message.destroy();
                message.warn('请上传图片！');
                return; 
            }

            let obj = {
                data: {
                    subjectId: item.subjectid,
                    imageName: $.trim(title),
                },
                file: list[0],
                filename: list[0].name,
                clientName: customer,
                industry: industry,
                tabTag: tabTag,
                key: searchValue,
            }
            this.setState({
                searchKey:searchValue
            },this.clear)
            this.setAddBlock(false);
            
            this.props.dispatch(actions.editAssistaddImg.request(obj));
        }
        else if (tabTag === -3) {    //标题
            let title = item.title; 
            if ($.trim(title) === '') {
                message.destroy();
                message.warn('标题内容不能为空！');
                return;
            }
             

            let obj = {
                categoryId: TitleCategory,
                pattern: title,
                page: 1,
                size: 10,
                tabTag: tabTag,
                id:id,
            }

            this.setAddBlock(false);
            this.clear();
            this.props.dispatch(actions.editAssistaddTitle.request(obj));
        }
        else {
            let title = item.title;
            var content = item.content;
            var url = item.url;
            if ($.trim(title) === '' || $.trim(content) === '') {
                message.destroy();
                message.warn('标题、内容不能为空！');
                return;
            }
            if ($.trim(url) && !Common.CheckUrl(url)) {
                message.destroy();
                message.warn('请正确输入链接！');
                return;
            }

            let obj = Object.assign({}, item, {
                tabTag: tabTag,
                addUser: Account.nickname,
                clientName: customer,
                key: searchValue,
                industry
            })
            this.setState({
                searchKey:searchValue
            },this.clear)
            this.setAddBlock(false);
            

            this.props.dispatch(actions.editAssistadd.request(obj));
        }
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
        if(_this.state.tabTag === -3)
        {            
            var Titles = _this.state.Titles;
            var id = content.id;
            var title = content.title;
            var c = id + titleSplit + title + titleSplit + title;
            Titles.push(c); 

            _this.setState({Titles},()=>{
                _this.refs.refsTagsTitle.SetChange(Titles.length-1);
                 _this.setOtherTitles(true);
            });
            
           
        }else{ 
             
            if(content.includes('<p>'))
            {               
                content = content.replace(/<span([\s\S]*?)>/g,'<span>');
                content = content.replace(/<p([\s\S]*?)>/g,'<p class="articleInsert">');
                 
            }else{
                content = '<span class="articleInsert">' + content + '</span>';
            } 
            editor.$textElem.attr('contenteditable', true)
            editor.cmd.do('insertHTML', content);
           
            editor.$textElem.attr('contenteditable', false)
        }
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

//辅助模块搜索框获取焦点后，定义回车事件
searchFocus = () => {
        var _this = this;
        document.onkeydown = (e) => {
            // 兼容FF和IE和Opera
            var theEvent = e || window.event;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code === 13) {
                _this.searchList();
                return false;
            }
            return true;
        }
    }

//辅助模块搜索框获取焦点后，取消回车事件
searchBlur = () => {
        document.onkeydown = () => {
            return true;
        }
    }

//客户选择组件选择回调函数
setIndustry = (customer, industry) => {
        //var _industry = this.state.industry;
        this.setState({
            customer,
            industry,
            addBlockShow: false
        }, () => { 
            if(this.state.tabTag != -3 )
            { 
                this.searchList();
            }
 
            this.props.dispatch(actions.loadmaterial({id : this.state.id,newstype : [6,7],key :'', clientName : customer,industry : industry,size:50,page:1  }));

        });
    }
showOtherTitles = () =>{
        //this.reSetAutoSaveTime();
        var otherTitlesVisible = this.state.otherTitlesVisible;
         
        this.setState({otherTitlesVisible:!otherTitlesVisible});
    }
setOtherTitles = (flag) =>{
        //this.reSetAutoSaveTime();
        this.setState({otherTitlesVisible:flag});
    }
     
TagSave = (Titles)=>{    
    this.reSetAutoSaveTime();
        this.setState({ 
            Titles
        });
}
//修改主标题时，计算标题字数
changeTitle = (e)=>{
        this.reSetAutoSaveTime();
  
        var v = $.trim(e.target.value);
         if(v.length > titleMaxCount)
        {
            message.warn('标题字数已经超过' + titleMaxCount);
            return;
        } 
        
        this.setState({
            titleSize:v.length,
            curTitle : e.target.value
        });
    }

goBottom = () => {
        var _height = document.getElementById('mainBox').clientHeight;
        var h = 0;
        var _timer = null;
        clearInterval(_timer);
        _timer = setInterval(() => {
            if (h < _height) {
                h += _height * 0.125;
                window.scrollTo(0, h);
            } else {
                clearInterval(_timer);
            }
            this.btnTop();
        }, 30)

    };

btnTop = () => {        
        if(!_.isNil(this.refs.submitBtn)){
            var btn = this.refs.submitBtn;
            var offsetTop = btn.offsetTop;
            var scrollTop = window.scrollY;

            var bodyH = document.body.clientHeight;
            var gobtn = this.refs.gotobottom;
            if (offsetTop - scrollTop < bodyH && scrollTop > 100) {
                gobtn.style.display = 'none';
            } else {
                gobtn.style.display = 'block';
            }
        }

    };
     
changeSearch = (e)=>{
        var value = e.target.value;
        this.setState({
            searchValue:value
        });
    }
     
onChangeSearchEnines = (e)=>{
        this.setState({
            searchEngineId: e.target.value,
          },this.searchList);
    }

onChangeNewsType= (e)=>{
        this.setState({
            newsType: e.target.value,
          },this.searchList);
    }

hideModal = ()=>{
        this.setState({
            SentenceHandleVisible:false,
            sentenceData:{}
        })
    }
 
SearchSimilarSentence = (id) =>{
    let _this = this;
    _this.setState({
        SentenceHandleVisible:true,
        sentenceDataloading:true
    });
     let url = apiUrl.apiseoArticleEditGetSentenceDataUrl + '/' + id;
     query.callData(url).then((res)=>{     
         if(res.code == 200 && res.data)
         {
            _this.setState({ 
                sentenceData:{_id:id,sentence:res.data.useSentence,changedSentence:res.data.useSentence,originalSentence:res.data.originalSentence,changewordIndex:-1,logs:[]},
                sentenceDataloading:false
            },()=>{
                let speWord = this.state.speWord;
                if(speWord.length)
                {
                    speWord.map((sWord)=>{
                        $.each($('.changedSentenceModal .initSentence ins'),(index,ele)=>{
                            let _word = $(ele).html();
                            if(sWord == _word)
                            {
                                let _ele = $('.changedSentenceModal .changedSentence ins').eq(index)[0];  
                                _ele.innerText = $.trim(sWord);
                                //sentenceData.changedSentence = $('.changedSentenceModal .changedSentence').html();
                            }
                    
                        })
                    });
                    let sentenceData = _this.state.sentenceData;  
                    sentenceData.changedSentence = $('.changedSentenceModal .changedSentence').html();
                    _this.setState({ 
                        sentenceData
                    },()=>{
                        _this.editWord(0);
                        _this.sentenceHitRate();
                    });

                }else{
                    _this.editWord(0);
                    _this.sentenceHitRate();
                }
                
                document.onkeydown  = function(e){  
                            let sentenceData = _this.state.sentenceData;                          
                    　　　　　let index = sentenceData.changewordIndex; 
                            let recerver = false;                  
                    　　　　if(e.keyCode === 9){    
                                
                                let len = $('.changedSentenceModal .changedSentence ins').length;
                                if(index === len -1)
                                {
                                    index = -1;
                                }
                                index++;
                                recerver = true;
                            }else if(e.keyCode === 37 && index > 0)
                            {                                    
                                index--; 
                                recerver = true;                             
                            }
                            else if(e.keyCode === 13 && index > -1)
                            {                                    
                                _this.replacewordWithinput();
                                let len = $('.changedSentenceModal .changedSentence ins').length;
                                if(index === len -1)
                                {
                                    index = -1;
                                }
                                index++;
                                recerver = true;                             
                            }
                            if(e.shiftKey && e.keyCode == 112)
                            {
                                 _this.sentenceToNext(true);
                            }
                            /* if(e.shiftKey && e.keyCode == 87)
                            {
                                 _this.sentenceSubmit(true);
                            }
                            if(e.shiftKey && e.keyCode == 69)
                            {
                                 _this.hideModal();
                            } */
                            if(recerver == true)
                            {
                                _this.editWord(index);
                            
                            }                                                             　　 
                }
                
                //定义改变词的单击事件，查询出来替换词
        $('.changedSentenceModal .changedSentence').on('click','ins',(e)=>{                   
             let ele = e.target;
             let index = $(ele).index();
              _this.editWord(index);
              
          })
        });  
         }          
       
})
    /* setTimeout(() => {
        let _txt = '<ins>下载</ins><ins>开发者</ins><ins>工具</ins><ins>进行</ins><ins>代码</ins>的<ins>开发</ins>和<ins>上传</ins>'
        _this.setState({ 
            sentenceData:{_id:id,sentence: _txt,changedSentence:_txt,originalSentence:_txt},
            sentenceDataloading:false
        }) 

    }, 500); */
}

//第index个词处于编辑状态，查询替换词
editWord = (index)=>{
    let _this = this;
    let sentenceData = _this.state.sentenceData; 
    
    //let ele = $('.changedSentenceModal .changedSentence ins').eq(index)[0];
    let ele = $('.changedSentenceModal .initSentence ins').eq(index)[0];
    let cEle = $('.changedSentenceModal .changedSentence ins').eq(index)[0];

    if(ele && cEle)
    {
        sentenceData.changewordIndex = index; 
            $('.changedSentenceModal .initSentence ins').removeClass('active');
            $('.changedSentenceModal .initSentence ins').eq(index).addClass('active');
            $('.changedSentenceModal .changedSentence ins').removeClass('active');
            $('.changedSentenceModal .changedSentence ins').eq(index).addClass('active');

            //$(ele).addClass('active');       
            let initWord = ele.innerText;
            
            let _code = cEle.innerText;
             
            sentenceData.initWord = initWord;
            sentenceData.changeword = _code; 
            sentenceData.replaceword = _code; 
            sentenceData.selectWord = _code; 

            let url2 = apiUrl.apiseoArticleEditGetSeoWordsUrl;
            if($.trim(initWord))
            {
                //查询可替换词
                query.callData(url2,{word:initWord}).then((res)=>{   
                let data = res.data;                          
                if(data)
                {
                let _data = data.map(element => {
                        return element.termsTxt;
                });
                _data.push(initWord);
                sentenceData.data = _data;
                _this.setState({ 
                    sentenceData
                },()=>{
                    let input = $('.tihuanlist .ant-select-search__field')[0]; 
                    let value = input.value;;
                    input.selectionStart = 0;
                    input.selectionEnd = value.length;

                    //可替换的词组单击事件，替换掉改编句中对应的词
                    $('.changedSentenceModal .replacewords .tihuanlist').on('click','.item',(ev)=>{
                    let _word = ev.target.innerText;
                    _this.replaceWord(_word,_word);
                    })
                })
                } else{
                sentenceData.data = []; 
                _this.setState({ 
                    sentenceData
                },()=>{
                    let input = $('.tihuanlist .ant-select-search__field')[0]; 
                    let value = input.value;;
                    input.selectionStart = 0;
                    input.selectionEnd = value.length;
                }); 
                }     
            
        }); 
            }
    }
}   

//把编辑后的替换词替换到改编句里去
replaceWord = (word,selectWord)=>{
    let sentenceData = this.state.sentenceData;
    let index = sentenceData.changewordIndex; 
    if(index > -1)
    {   
        let ele = $('.changedSentenceModal .changedSentence ins').eq(index)[0];
        ele.innerText = $.trim(word);
        sentenceData.changedSentence = $('.changedSentenceModal .changedSentence').html();
        sentenceData.changeword = word;
        if(selectWord)
        {
            sentenceData.selectWord = selectWord;
        }       
            let logs = sentenceData.logs;       
            let aLog = logs.filter(log=> log.wordsIndex == index);
            if(aLog.length > 0)
            {
                aLog[0].useWords = word;
                aLog[0].recWords = sentenceData.selectWord;

            }else{
                logs.push({
                    wordsIndex:index,
                    words:sentenceData.initWord,
                    useWords : word,
                    recWords : sentenceData.selectWord,
                });
            }
        
        
       

    this.setState({ 
        sentenceData
    },this.sentenceHitRate)
}
}
//弹出框确认事件，修改句子
sentenceSubmit = (hide,callback) =>{
    let sentenceObj = this.state.sentenceData;
    let id = sentenceObj._id;  //点击的句子的id 
    let changedSentence = sentenceObj.changedSentence;  //替换后的句子
    let sentence = sentenceObj.sentence;  //原始的句子  
    let logs = sentenceObj.logs;  //原始的句子    

            //原本的句子没有改变，不需要处理
        if(sentence == changedSentence)
        {
            if(hide)
            {
                this.hideModal();
            }    
        }else{       
                let logurl = apiUrl.apiseoArticleEditSentencLogeUrl
                let param = {
                    oriSentence:sentenceObj.originalSentence,
                    changeList:logs
                }
                query.setData(logurl,param);
                
                
                let url = apiUrl.apiseoArticleEditEditSentenceUrl + id;
                query.setData(url,changedSentence).then(()=>{
                    let _sentence = changedSentence.replace(/<ins>/g,'').replace(/<ins class="">/g,'').replace(/<ins class>/g,'').replace(/<ins class="active">/g,'').replace(/<\/ins>/g,'');
                    $('.articleOne__box__edit .seoarticlesentence[data-id="'+id+'"]').html(_sentence);
                    this.saveNews(0);
                    if(hide)
                    {
                        this.hideModal();
                    }
                }) 
                


         }               
}
replacewordWithinput = ()=>{
    let sentenceData = this.state.sentenceData;    
    let word = sentenceData.changeword;  
    this.replaceWord(word); 
}
//autoComplete输入变化
inputChangeWord = (word)=>{
    this.replaceWord(word);
}
selectWord = (word) =>{
    let sentenceData = this.state.sentenceData;    
    sentenceData.selectWord = word; 
}


//下一条句子
sentenceToNext = (isSubmit)=>{
    let sentenceObj = this.state.sentenceData;
    let id = sentenceObj._id;  //点击的句子的id 
    if(isSubmit)
    {
        this.sentenceSubmit(false);
    }
    
        
    var aSpan = $("span[data-id]");  
    let ids = [];
    Array.from(aSpan).forEach(ele=>{
        let _id = $(ele).attr('data-id');
        if(_id)
        {
          ids.push(_id);
        }
     })
    for (let index = 0; index < ids.length; index++) {           
            let _id = ids[index];
            if(id === _id)
            {
                if(index + 1 < ids.length)
                {                  
                    let nextId =  ids[index +1];
                    this.SearchSimilarSentence(nextId);
                    break;
                }
                else{
                    message.info('已经修改到最后了');

                }
            }
            
        }
}
sentenceHitRate = ()=>{
    let _this = this;
    let sentenceData = this.state.sentenceData; 
    let changedSentence = sentenceData.changedSentence;  //替换后的句子
    let _sentence = changedSentence ? changedSentence.replace(/<ins>/g,'').replace(/<ins class="">/g,'').replace(/<ins class>/g,'').replace(/<ins class="active">/g,'').replace(/<\/ins>/g,'') : '';
    if($.trim(_sentence))
    {
    let url = apiUrl.apiseoArticleHitRateUrl;
        query.setData(url,_sentence).then((res)=>{
            if(res.code === 200 && res.data)
            {
                let Rate = res.data.hitRate;
                let r = parseInt((Rate * 10000 + 0.5),10)/100 + '%';
                sentenceData.showHitRate = r;
                sentenceData.hitRate = Rate;

                _this.setState({
                    sentenceData
                });
                
            }
        }) 
    }else{
            sentenceData.showHitRate = '0%';
            sentenceData.hitRate = 0;
            _this.setState({
                    sentenceData
                });
    }
    
     
}

//删除该改编句
deleteSentence = ()=>{
    let sentenceObj = this.state.sentenceData;
    let sentence = sentenceObj.sentence;
    let id = sentenceObj._id;
    
      query.setData(apiUrl.apiseoArticleEditSentenceDelUrl,{sentence}).then(()=>{
        let sib = $('.articleOne__box__edit .seoarticlesentence[data-id="'+id+'"]')[0].nextSibling;
        //判断删除的句子后面是否接了一个符号，如果是，删除这个符号
        if(sib && sib.nodeType === 3 && sib.length > 0)
        {
            let nodeValue = sib.nodeValue;
            let v = nodeValue.substring(0,1);
            
            if(v ==',' || v =='.'|| v =='，'|| v =='。'|| v =='！'|| v =='!'|| v =='?'|| v =='？'|| v ==';'|| v =='；')
            {
                let value = nodeValue.substring(1);
                sib.textContent = value;
            }

        }
        this.sentenceToNext(false);
        $('.articleOne__box__edit .seoarticlesentence[data-id="'+id+'"]').remove();
        this.saveNews(0); 
        
    })  
}
remenberSpeWord = ()=>{
    let sentenceData = this.state.sentenceData;    
    let word = sentenceData.initWord;    
    let speWord = this.state.speWord;
    if(!speWord.includes(word))
    {
        speWord.push(word);       
    }
    $.each($('.changedSentenceModal .initSentence ins'),(index,ele)=>{
        let _word = $(ele).html();
        if(word == _word)
        {
            let _ele = $('.changedSentenceModal .changedSentence ins').eq(index)[0];  
            _ele.innerText = $.trim(word);
            sentenceData.changedSentence = $('.changedSentenceModal .changedSentence').html();
        }

    })
    this.replaceWord(word,word);
}
render() {   
        var _this = this;   
        const item = _this.state.OneArticle;
        const {tabTag,newsType,tabList, addBlockShow, Titles, 
              curTitle,titleSize, otherTitlesVisible,customer,industry,
              TitleCategorys,TitleCategory,searchEngineId,searchValue,searchKey,sentenceData} = this.state;
          
        var _platform = [];
        var platformsValue = item.applyPlatform;
        if (platformsValue) {
            platformsValue.forEach(element => {
                _platform.push(platforms[element]);
            });
        }
       
        var list = tabList['-3'] ? [...tabList['-3']] : null;
         if(tabTag !== -3)
        { 
            if(tabTag === -7 && newsType  < -7000)
            {
                list = tabList[newsType + searchKey] ? [...tabList[newsType + searchKey]] : null;
            }else{ 
                list = tabList[tabTag + searchKey] ? [...tabList[tabTag + searchKey]] : null;
            }           
        }   
        //添加框
        var addBlock = '';
        
        if (addBlockShow) {
            if (tabTag === -1) {
                if (this.state.customer) {
                    addBlock = <EditAssistAddImgItem cancel={() => {this.setAddBlock(false)}} save={this.saveAssistNews} client={this.state.customer}/>
                } else {
                    message.warn('请选择个客户！');
                }
            }else if(tabTag === -3)
            {
                addBlock = <EditAssistAddTitleItem cancel={() => {this.setAddBlock(false)}}  save={this.saveAssistNews} />                
            }           
            else {
                addBlock = <EditAssistAddItem cancel={() => {this.setAddBlock(false) }} save={this.saveAssistNews}/>
            }

            
        }
         
        var addBTn = <span className="iconfont icon-dsc-plus"></span>;
        let ele_add = '';
        var Account = store.get("Account");
        if(Account && Account.roleId === window.adminRoleId)
        {
            ele_add = <div className="add-bar" onClick={() => this.setAddBlock(true)}>{addBTn} 自定义添加</div>
            if(tabTag === -3 )
            {
                ele_add = <div style={{display:'inline-block',marginLeft:'30px'}} className="change"  onClick={() => this.setAddBlock(true)}>
                            {addBTn} 自定义添加
                        </div>  
            }
        } 
        var  addButtonEle = <div>
                                {tabTag === -1 && ele_add}
                                   <div style={{textAlign:'left',padding: '0 0 0 20px' }}>
                                    {/* <Input className="search" type="text" value={searchValue}   placeholder="搜索" ref='searchele' onFocus={this.searchFocus} onBlur={this.searchBlur}/> */}
                                    <Search  placeholder="搜索"  style={{ width: '95%'}} value={searchValue}    onChange={this.changeSearch}  onFocus={this.searchFocus} onBlur={this.searchBlur} onSearch={this.searchList}    />
                                    {tabTag === -7 &&  <RadioGroup options={SourceMaterialChilren} onChange={this.onChangeNewsType} value={newsType} />}
                                   
                                    {tabTag === -6 &&  <RadioGroup options={SearchEngines} onChange={this.onChangeSearchEnines} value={searchEngineId} />}
                                    {tabTag === -6 &&  item && item.keywords && item.keywords.length > 0 &&    
                                          
                                            <div>                                              
                                                {item.keywords.map((keyword,i)=>{
                                                    return <Tag color= {apiUrl.tagColors[i % apiUrl.tagColors.length]} closable={false} onClick = {_this.gotoSearch.bind(_this,keyword)}  key={i} value={keyword}  >{keyword}</Tag>
                                                })
                                                } 
                                           </div>
                                    }
                                    
                                </div>
                            </div>
        if(tabTag === -3 )
        {
            addButtonEle = <div className="btlx">               
                            <span className="name">标题类型</span>
                            <Select style={{width:240,marginLeft:'10px'}} value={TitleCategory} onChange = {this.TitleCategoryChange} getPopupContainer={() => document.getElementById('fixPara')}>
                                {TitleCategorys.map((category,index)=>{
                                        return <Option key = {category._id} value={category._id}>{category.name}</Option>
                                })}
                            </Select>                          
                            {ele_add}                           
                        </div>
        }
         
         
        //其它标题
        let titlesEle = '';
        if(item)
        {
            titlesEle = <TagsTitle ref = 'refsTagsTitle' Titles = {Titles}   titleMaxCount = {titleMaxCount} keywords = {item.keywords} 
                            visible = {otherTitlesVisible} changeTitle = {_this.reSetAutoSaveTime}
                            save = {this.TagSave} split = {titleSplit} />
        }
        

        let changedwords_ele = '';
        if(sentenceData.data && sentenceData.data.length > 0)
        {
            changedwords_ele = sentenceData.data.map((ele,i)=>{
                 if(ele === sentenceData.changeword)
                 {
                    return <li  key={i} className="item" style={{backgroundColor: '#c8d0dd'}}>{ele}</li>;
                 }
                 return  <li  key={i} className="item"  >{ele}</li>;
            })
        }
        let  changedwordsInput_ele = <li style={{marginBottom:'10px'}}>
                                        <AutoComplete style={{ width: 200 }} backfill = {true} allowClear
                                                        ref='refautoComplete'
                                                        autoFocus = {true}
                                                        placeholder = {sentenceData.replaceword}
                                                        value = {sentenceData.changeword} 
                                                        onChange = {this.inputChangeWord}  
                                                        onSelect = {this.selectWord}
                                                        dataSource={sentenceData.data}    
                                                        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                        />
                                        {/* <Button type="primary" shape="circle" icon="check" style={{position: 'relative',top: '5px',color:'#1c68d7',fontSize:22,marginLeft:'10px',cursor:'pointer'}} onClick={this.replacewordWithinput} />
 */}
                                         
                                    </li>
        
        let ele_sentenceNext = <button className="btn-fh" style={{marginRight:'30px'}} onClick={()=>this.sentenceToNext(true)}>下一条</button>
        let ele_sentenceSave = <button className="btn-bc" style={{marginRight:'30px'}} onClick={()=>this.sentenceSubmit(true)}>保存</button>
        
         if(this.state.SentenceHandleVisible){
             if(sentenceData.hitRate && sentenceData.hitRate > 0.3)
             {
                ele_sentenceNext =  <Popconfirm placement="topLeft" title={'当前句子的飘红率大于30%，你确定保存并修改下一条么？'} onConfirm={()=>this.sentenceToNext(true)} okText="确定" cancelText="取消">
                                        <button className="btn-fh" style={{marginRight:'30px'}} >下一条</button>
                                    </Popconfirm>
               
                ele_sentenceSave = <Popconfirm placement="topLeft" title={'当前句子的飘红率大于30%，你确定保存么？'} onConfirm={()=>this.sentenceSubmit(true)} okText="确定" cancelText="取消">
                                    <button className="btn-bc" style={{marginRight:'30px'}} >保存</button>
                                  </Popconfirm>
             }
          }
        return (
            <div>
                <div className="content__box">
                    <section className="articleOneBox articleOneEidtBox article articleOneEidt">                       
                        <div className="articleOne">
                            <div className="broadcast" id='mainBox'>
                                <div className="top">
                                    <span className="return" onClick={this.toArticleList}>返回到列表</span>
                                    
                                   
                                    <div  style={{display:'inline-block', float:'right',paddingRight:'50px'}}>
                                        <span>  飘红率：{item && parseInt((item.hitRate + 0.00005) * 10000,10) / 100 + '%' }</span>
                                        <span style={{paddingLeft:'20px'}}>总字数：{item && item.totalCount}</span>
                                        <span style={{paddingLeft:'20px'}}>段落：{item && item.paragraphCount}</span>
                                        <span style={{paddingLeft:'20px'}}>图片：{item && item.imagesCount}</span>
                                    </div>
                                    
                                </div>
                                <div className="articleOne__box" style={{position:'relative'}}>
                                    <div key={"edit"} className="articleOne__box articleOne__box__edit">                                                                           
                                        <div className="text-box" style={{width:'60%',padding:'10px 0'}}>
                                        <Input ref='titleRef' value = {curTitle}  onChange = {this.changeTitle} addonAfter= {titleSize + '/' + titleMaxCount} />                                                                              
                                        <span onClick = {this.showOtherTitles} className= {otherTitlesVisible ? "iconfont bttb-title change icon-title-1" : "iconfont bttb-title change icon-title" }>
                                        </span>
                                         
                                        {titlesEle} 
                                    </div>
                                                                    
                                    <div className="uEidt" ref="editorElemtoobar"  style={{display: 'none'}}></div>                                         
                                    
                                        
                                        <div className="textarea" id="textarea">  
                                            <div ref="editorElem" ></div>
                                        </div>
                                        <div className="add-block" id="fixPara">
                                            <div className="option_xiala_box">
                                                <div className="option_xiala">
                                                <Customer ref='customerref' disabled = {true} selectIndustry={this.setIndustry}  ClientInfo={this.props.ClientInfo} customer={customer } industry={industry }/>
                                                </div>
                                                <div style={{width: 'inherit', overflow: 'hidden', height: '38px',}} id="wrapper">
                                                     <TabTags tabs = {[-3,-5]} tabTag = {tabTag}  fun = {this.tabChange}  />
                                                </div>
                                            </div>
                                            <div className="wrap">
                                                <ul className="blsit-list" style={{overflow: 'hidden'}}   >
                                                    <li>
                                                        {addButtonEle}
                                                        {addBlock}
                                                        <div className="hot_list bt-box">
                                                            
                                                            <AssisttabList tabList = {list}
                                                                            tabTag  = {tabTag}
                                                                            searchList = {this.searchList}
                                                                            insertHandle= {this.insertHandle}
                                                                            insert = {this.insert}
                                                                            customer = {customer}
                                                                            TitleCategory = {TitleCategory}
                                                                            newstype = {newsType}
                                                                            hidInsert = {true}
                                                                            />                                                       
                                                        </div>
                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom"> 
                                    <span>适合媒体： {_platform}  </span>
                                  </div>
                            </div>

                        </div>

                        {/* <div className="page">
                            <Pagination size={"samll"} current={current} pageSize={1}  total={this.props.count} onChange={this.onPageChange}/>
                        </div> */}
                    </section>
                    <div className="btn-box">
                        <button className="btn-bc" style={{  marginRight: "30px", fontSize: "14px" }} onClick={() => this.saveNews(0)}>保存 </button>                                                
                        <button className="btn-fh" ref='submitBtn' onClick={() => this.exportFile(0)}>导出</button>
                         
                    </div>
                    <BackTop/>
                    <div className="ant-back-Bottom" ref='gotobottom' onClick={this.goBottom}>
                        <div className="ant-back-Bottom-content">
                            <div className="ant-back-Bottom-icon"></div>
                        </div>
                    </div> 
                     
                        <Modal  title="改编句" destroyOnClose={true} visible={this.state.SentenceHandleVisible} width ={1000}  footer = {null} onCancel={this.hideModal}>                               
                                <div className="changedSentenceModal">                                
                                <ul className="gaibianlist">
                                    <li className="item item1">
                                       
                                        <span className="initSentence" dangerouslySetInnerHTML={{
                                            __html: sentenceData.originalSentence
                                        }}></span> 
                                        <img src="/img/gaibian2.png" alt="" className="gaibian1" />
                                    </li>
                                    <li className="item item2">
                                       
                                        <span className="changedSentence" dangerouslySetInnerHTML={{
                                            __html: sentenceData.changedSentence
                                        }}></span> 
                                        <img src="/img/gaibian1.png" alt="" className="gaibian1" />
                                    </li>
                                </ul>
                                <div style={{padding:'8px',display:sentenceData.changewordIndex > -1 ? 'block' : 'none'}}>
                                    <div className="yuanci" style={{color:sentenceData.changewordIndex > -1 ? window.Colors[sentenceData.changewordIndex % 6] : '#000'}}>
                                        <span>原　词</span>
                                        { sentenceData.initWord} 
                                          <span className="iconfont icon-uniE90B" onClick={this.remenberSpeWord} style={{marginLeft:'30px',cursor:'pointer',fontSize:16}}></span>                                            
                                        
                                    </div>                                   
                                    <div className="tihuanci replacewords">
                                        <span className='thlabel'>替换词</span>
                                        <ul className="tihuanlist">
                                        {changedwordsInput_ele}
                                        {changedwords_ele}
                                             
                                        </ul>

                                    </div>
                                </div>
                                <div className="btn-box" style={{marginTop:'15px'}}>
                                    {ele_sentenceNext}
                                    {ele_sentenceSave} 
                                    <button className="btn-fh" style={{marginRight:'30px', background: 'linear-gradient(90deg, #6e89b2, #3a537b)'}} onClick={this.hideModal}>放弃修改</button>
                               
                                    <Popconfirm placement="topLeft" title={'确定删除本句么？'} onConfirm={()=>this.deleteSentence()} okText="确定" cancelText="取消">
                                      <button className="btn-bc" style={{marginRight:'30px'}} >删除</button>
                                    </Popconfirm>
                                </div>
                                <div className="piaohong">
                                    <div className="piaohong_title">飘红率</div>
                                    <div className="piaohong_num">{ sentenceData.showHitRate}</div>
                                </div>

                                   {/*  <div style={{padding:'8px'}}>
                                        <span style={{display:'inline-block',width:'60px',textAlign:'right'}}>原句：</span>
                                        <span dangerouslySetInnerHTML={{
                                            __html: sentenceData.originalSentence
                                        }}></span>
                                    </div>
                                    <div  style={{padding:'8px'}} >
                                        <span style={{display:'inline-block',width:'60px',textAlign:'right'}}>改编句：</span>                             
                                         
                                        <span className="changedSentence" dangerouslySetInnerHTML={{
                                            __html: sentenceData.changedSentence
                                        }}></span>
                                         
                                    </div>
                                    <div style={{padding:'8px',display:sentenceData.changeword ? 'block' : 'none'}}>
                                        <div>
                                            <span style={{display:'inline-block',width:'60px',textAlign:'right'}}>原词：</span>   
                                            <span>{ sentenceData.changeword}</span>   

                                        </div>
                                        <div className='replacewords'>
                                        <span style={{display:'inline-block',width:'60px',textAlign:'right'}}>替换词：</span>   
                                            {changedwords_ele}
                                        </div>
                                    </div> */}
                                   
                                </div>
                        </Modal>
                        </div>
                </div>
            
        )
    }
}

function mapStateToProps(state, ownProps) {
    const {NewArticlesWithid, count} = state.ArticleIds
    const OneArticle = state.OneArticle.one;
    // 携带跳转信息 id 和 m （保存是的参数m）
    const OneGo = state.OneArticle.go;
    const ActileEditNews = state.ActileEditNew;
    const ClientInfo = state.ClientInfo;
    const ActileEditTitleCategory = state.ActileEditTitleCategory;
    const Article = state.Article; 
    return {OneArticle,Article, NewArticles: NewArticlesWithid, count, OneGo, tabList:ActileEditNews,ClientInfo,ActileEditTitleCategory}
}

export default connect(mapStateToProps)(SeoEdit)

