import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Input,Button, Pagination, message,Select,Tag,Popconfirm,BackTop,notification,Radio  } from 'antd';
 
import * as apiUrl from '@/services/ApiUrl';
import store from "store2";
import * as actions from "@/store/actions";
import qs from "qs";
import $ from 'jquery';

import EditAssistAddItem from '@/components/EditAssist/EditAssistAddItem'
import EditAssistAddTitleItem from '@/components/EditAssist/EditAssistAddTitleItem'
import EditAssistAddImgItem from '@/components/EditAssist/EditAssistAddImgItem'
import Customer from '@/components/Customers'
import TabTags from '../editComponse/Assisttab'
import AssisttabList from '../editComponse/AssisttabList'

import Common from '@/components/Common'

import TagsTitle from '../editComponse/editedTitleTag';

import  '@/components/my_scrollbar';

import '@/style/toBottom.css'
import '@/style/article_edit.css'
import '@/style/tab.css'
import E from 'wangeditor'

import moment from 'moment'
import SearchBtn from '../editComponse/searchBtn'

const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var editor;

const newsPageSize = 5;
const titleMaxCount = 60;
const Grades = ['A+','A','B','C'];
const interval = 30; //30秒,自动保存时间
const platforms = [<img key={0} alt='' src="/img/sina.png"/>, <img key={1} alt='' src="/img/wx.png"/>, <img key={2} alt='' src="/img/webnet.png"/>];
const getMousePos = (event) => {
    var e = event || window.event;
    return {'x':e.screenX,'y':e.screenY}
}
const scrollLoads = [-1,-2,-5,-6];

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
const SourceMaterialChilren = [{value:6,label:'首段'},{value:7,label:'尾段'}]


var page = 1;
var seted = false; //编辑页，是否已经把文章内容赋值给富文本编辑框
var oMyBar;
var ModifyTime = 0;
var mTimer = null;
var saved = true;

//文章编辑
class ArticleEdit extends Component {
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
            Grade: 2,
            Titles:[],
            otherTitlesVisible : false,           
            TitleCategorys:[],
            TitleCategory:'',
            searchBtnShow : false,
            searchBtnTop:0,
            searchBtnLeft:0,
            searchKey:'',     //搜索关键词
            searchValue:'',   //搜索框变化的搜索词

            curTitle:'',
            titleSize : 0,
            tabList:{}
        };

        this.articleId = store.session('articleId'); 
        
        this.tabChange = this.tabChange.bind(this);
        this.insertHandle = this.insertHandle.bind(this);
        this.modual = this.props.location.pathname.substring(1).split('/')[0];
 
        var platform = store.session('applyPlatform');

        this.props.dispatch(actions.loadNewArticlesWithId({
            nid: this.articleId,
            index: 1,
            size: 1000,
            listtype: 1,
            applyplatform: platform
        }));
        //}
        
        this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: this.props.match.params.id}));
        this.loadCustomerDatas();
        message.config({
            top: 200,
            duration: 2,
            maxCount: 1,
        });
    }

onPageChange = (page) => { 
        const aid = this.props.NewArticles[page - 1];
        store.session("news3Rcurrent", page);
        this.props.history.push(`/${this.modual}/articleedit/${aid}`);

        this.setState({
            current: page,
        }, () => {
            this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: aid}));
        });
    };
//返回到预览页
toArticle = () => {
        editor = null;
        seted = false;
        this.clear();
        //this.setState({customer:'',industry:''})
        //this.refs.customerref.setCurValue('','');
        this.props.history.push('/' + this.modual + "/articleview/" + this.state.id );

    };
toArticleList = () => {
 
        var id = this.state.id;
        var NewArticles = this.props.NewArticles;
        const cid = NewArticles.findIndex(_id=>_id=== id) + 1;
        let page = _.ceil(cid / apiUrl.AD_PAGESIZE, 0) || 1;
        this.props.history.push('/write/writelist/' + this.articleId + '/' + page);
    };
//显示下一篇文章
toNext = () => {
        var current = store.session("news3Rcurrent");
        const {NewArticles} = this.props;

        if (current < NewArticles.length) {
            current++;
            this.onPageChange(current);
        } else {
            message.info('保存成功，当前已经是最后一篇');
            this.toArticle();
        }
    };

//保存 
saveNews = (m) => {
        const {id, OneArticle,Grade,Titles} = this.state;
        var content = editor.txt.html();
        var noHTMLcontent =  $.trim(editor.txt.text());
         if($.trim(noHTMLcontent.replace(/&nbsp;/img,'')) === '')
         {
            message.destroy();
            message.warn('内容不能为空！');
            return;
         }
        var title = this.refs.titleRef.input.value;

        if ($.trim(title).length > titleMaxCount) {
            message.destroy();
            message.warn('标题字数超过' + titleMaxCount + '了！');
            return;
        }
        if ($.trim(title).length == 0) {
            message.destroy();
            message.warn('标题不能为空！');
            return;
        }

        OneArticle.title = $.trim(title);
        OneArticle.content = content;
        OneArticle.qType = Grade;
        OneArticle.otherTitles = Titles;

        this.setState({
            OneArticle
        });
        saved = true; 
        if(m ===-1)
        {
            
            this.props.dispatch(actions.editOneArticle.request({
                nid: this.articleId,
                id: id,
                title: OneArticle.title,
                content: OneArticle.content,
                otherTitles: Titles,
                qType: Grade,
                m:m
            }));

        }else{
            this.props.dispatch(actions.editOneArticle.request({
            nid: this.articleId,
            id: id,
            title: OneArticle.title,
            content: OneArticle.content,
            otherTitles: Titles,
            qType: Grade,
            m:m
        }));
        }
        

         
    };

     
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

        _.delay(() => {
            this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: this.props.match.params.id}));
        }, 1000)

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
            && this.state.OneGo.m == 0
            && this.props.match.params.id === this.state.OneGo.id) {
            this.props.dispatch(actions.oneArticle.update({m:null,id:this.props.match.params.id}));
            //this.toArticle();
            message.destroy();
            message.success('保存成功！');

        }  
        if (!_.isNull(this.state.OneGo)
            && this.state.OneGo.m == -1
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
        if (prevState.TitleCategory !==  this.state.TitleCategory)
         {
            this.searchList();
         }
        return null;

    }

componentDidUpdate(prevProps, prevState) { 
        if(this.props.Article.content)
        {
            //恢复原文后，把原始内容赋值给当前文章
            var OneArticle = this.state.OneArticle;
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
         
        if(prevState.industry != this.state.industry)
        {
            this.loadTitlesCategory();
        }

         /* if(prevState.TitleCategory != this.state.TitleCategory)
        { 
            this.searchList();
        }   */ 
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
            toolBar = _this.refs.editorToobarContainer,
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

                toolBar.style.position = 'fixed';
                toolBar.style.top = '0';
                toolBar.style.background = '#fff';
                toolBar.style.zIndex = 99999;
                toolBar.style.width = '58%';

                editor && $('#' + editor.imgMenuId).click(() => {

                    $('.w-e-text-container .w-e-panel-container').css('position', 'fixed');

                    $('.w-e-text-container .w-e-panel-container').css('top', '40px');
                });

            } else if( (s +  700)  >= totalH){  
                oDiv.style.position = 'absolute';
                oDiv.style.top =  contentH - oDiv.offsetHeight + 'px';
                oDiv.style.right = '10px';
                oDiv.style.height = '700px';
                 
            } else {
                oDiv.style = {};
                toolBar.style = {};
                editor && $('#' + editor.imgMenuId).click(() => {

                    $('.w-e-text-container .w-e-panel-container').css('position', 'absolute');

                    $('.w-e-text-container .w-e-panel-container').css('top', '0');
                });
            }


        }

        oMyBar = new window.MyScrollBar({
            selId: 'wrapper',
            enterColor: '#999',
            hasX: true,
            hasY: false,
            width: 6
        });
      
        this.autoSave();
        this.editorContainerEvent();
        this.listExpendEvent();
        this.listScrollEvent();



        
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
            var key =   decodeURI(_this.state.searchKey);
             
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
   //恢复已删除内容
   $('.articleOne__box__edit').on('click', '.articledeletecontent', (e) => {
        $(e.target).removeClass('articledeletecontent');
        _this.reSetAutoSaveTime(); 
    });

    //系统添加内容，单击后变为删除内容
    $('.articleOne__box__edit').on('click', '.articleaddcontent', (e) => {
        $(e.target).removeClass('articleaddcontent').addClass('articledeletecontent');
        _this.reSetAutoSaveTime(); 
    });

    //删除标记内容
    $('.articleOne__box__edit').on('click', '.articlekeysentence', (e) => {
        $(e.target).removeClass('articlekeysentence');
        _this.reSetAutoSaveTime();
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
    }

//编辑模式，设置富文本编辑框
setEdit = () => {
    var _this = this;
        if (!editor) {
            const elem = this.refs.editorElem;
            const elemBar = this.refs.editorElemtoobar
            elemBar.innerHTML = '';
            if (elem && elemBar) {
                editor = new E(elemBar, elem)

                editor.customConfig.zIndex = 999;
                editor.customConfig.showLinkImg = false;
                editor.customConfig.uploadImgShowBase64 = true;
                editor.customConfig.pasteIgnoreImg = false;
                editor.customConfig.pasteFilterStyle = true;
                editor.customConfig.pasteTextHandle = function (content) {
                     _this.reSetAutoSaveTime();
                    //从word拷贝过来的文档带有大量的html标签，长度过大，一次replace不起作用，所以先把head去掉
                    var reg = new RegExp('<head>([\\s\\S]*?)<\/head>');
                    
                    if(reg.test(content))
                    {
                        content = content.replace(/<head>([\s\S]*?)<\/head>/g, '');
                        content = content.replace(/<[\s\S]*?>/g, '');                       
                    }else 
                    { 
                        content = content.replace(/<[^(img)|p]*?>/g, '');
                        content = content.replace(/<html>/g, '');   
                        var reg1 = new RegExp('<img src="(?<url>.*?)>','g');
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

                }
                editor.customConfig.onchange = function (html) {
                    _this.reSetAutoSaveTime();                  
                };

                 editor.customConfig.onblur = function (html) {
                    _this.setState({
                        searchBtnShow:false,
                        searchBtnTop:0,
                        searchBtnLeft:0
                    }); 

                } 
                                 
                $(document).on('click', (e) => {                      
                        if(editor)
                        {               
                            var $toolbarElem = editor.$toolbarElem;        
                            var $textElem = editor.$textElem;
                            //判断当前点击元素是否在编辑器内
                            const isChild = $textElem.isContain($(e.target))
                        
                            //判断当前点击元素是否为工具栏
                            const isToolbar = $toolbarElem.isContain($(e.target))
                            const isMenu = $toolbarElem[0] == e.target ? true : false
            
                            if (isChild) {
                                //若为选择工具栏中的功能，则不视为成blur操作
                                if(isToolbar && !isMenu){
                                    return
                                }
            
                                const $selectionELem = editor.selection.getSelectionContainerElem()
                                if (!$selectionELem) {
                                    return
                                }
                                const selectionText = editor.selection.getSelectionText()
                        
                                if(selectionText)
                                {   
                                    let s = document.body.scrollTop || document.documentElement.scrollTop;
                                    let top = getMousePos(e).y + s - 180 + 'px';
                                    let left = getMousePos(e).x + 'px';
                                    _this.setState({
                                        searchBtnShow:true,
                                        searchBtnTop:top,
                                        searchBtnLeft:left

                                    });

                                } 
                            } 
                        
                       } 
                 
                    })
                editor.customConfig.menus = menus;

                editor.create();

                $('.w-e-text').css('overflowY', 'auto');


            }
        }


    }
   
//给富文本编辑框设置内容
setEditContent = () => {
        if (editor && this.state.OneArticle && this.state.OneArticle.content && !seted) {

            editor.txt.html(this.state.OneArticle.content);
 
            this.setState({ 
                titleSize:this.state.OneArticle.title.length,
                curTitle:this.state.OneArticle.title
            });
            
            if(this.state.OneArticle.qType)
            {                
                this.setState({Grade: this.state.OneArticle.qType,Titles:this.state.OneArticle.otherTitles});
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
        var _newsType = _this.state.newsType;
        oMyBar.jump({id: id,time: 400 })  
        if(_type === -6)
        { 
            if(_type === -6 && $.trim(_this.state.searchValue) === '' && _this.state.OneArticle.keywords && _this.state.OneArticle.keywords.length > 0)
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
            }else if(!_this.state.OneArticle.keywords || _this.state.OneArticle.keywords.length == 0)
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
                    newsType:_newsType
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
      
        this.clear();
        
        this.getList();              

    }

//查询辅助资料列表
getList = () => {      
        const {customer,industry,TitleCategory,tabTag,searchValue,searchEngineId,newsType} = this.state;
  
        var key = decodeURI(searchValue);
         
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
            this.props.dispatch(actions.loadeditAssist({
                id:this.state.id,
                page: page,
                size: size,
                tabTag: tabTag,
                key: key,
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
            key = decodeURI(this.state.searchKey);
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


//删除一条辅助新闻(已废弃)
DelAssistNews = (id) => {
        this.props.dispatch(actions.editAssistdel.request({id: id}));
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
            Titles.push(content);             
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
            editor.cmd.do('insertHTML', content);
            
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
            
        });
    }

//收藏
/* Collect = (collect) => {
        const {id} = this.state;
        this.props.dispatch(actions.collectOneArticle.request({
            nid: this.articleId,
            id: id,
            isCollected: collect,
            m: null
        }));
    }; */

//恢复原文
reStoreArticle = ()=>{ 
    this.reSetAutoSaveTime();
        this.props.dispatch(actions.loadArticle({
            nid : this.articleId
        }));

    }

//修改级别
changeGrade = (Grade)=>{
    this.reSetAutoSaveTime();
        this.setState({Grade});
    }
 
showOtherTitles = () =>{
        this.reSetAutoSaveTime();
        var otherTitlesVisible = this.state.otherTitlesVisible;
         
        this.setState({otherTitlesVisible:!otherTitlesVisible});
    }
setOtherTitles = (flag) =>{
        this.reSetAutoSaveTime();
        this.setState({otherTitlesVisible:flag});
    }
     
TagSave = (Titles)=>{    
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

    //标注关键词
    signKeyWords = () =>{
        if(editor)  
        { 
            const $selectionELem = editor.selection.getSelectionContainerElem()
            if (!$selectionELem || editor.selection.isSelectionEmpty()) {
                return
            } 
            var range = editor.selection.getRange();
            var srart = this.getContainerWith_p(range.startContainer);
            var end = this.getContainerWith_p(range.endContainer);

            if(srart.textContent != end.textContent)
            {
                message.destroy();
                message.warn('请不要跨段落操作！');
                editor.selection._currentRange  = null;
                window.getSelection().removeAllRanges();
                return;
            }
            
            
            const selectionText = editor.selection.getSelectionText();
            if(selectionText)
            {
                
                editor.cmd.do('insertHTML', `<span class="articlekeysentence">${selectionText}</span>`);            
            }
        }
       
    }

    getContainerWith_p = (container) =>{
            if(container.nodeName === 'P')
             {
                return container
             }else{
                 return this.getContainerWith_p(container.parentElement);
             }
    }
 
        
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
    render() {   
        var _this = this;   
        const item = _this.state.OneArticle;
        const {tabTag,newsType,tabList, addBlockShow, Grade,Titles, curTitle,titleSize, otherTitlesVisible,customer,industry,TitleCategorys,TitleCategory,searchEngineId,searchBtnShow,searchBtnTop,searchBtnLeft,searchValue,searchKey} = this.state;
        const current = store.session("news3Rcurrent") || 1;
         
        var _platform = [];
        var platformsValue = item.applyPlatform;
        if (platformsValue) {
            platformsValue.forEach(element => {
                _platform.push(platforms[element]);
            });
        }
       
        var list = tabList['-3']
        if(tabTag != -3)
        { 
            list = tabList[tabTag + searchKey];
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
        var  addButtonEle = <div>
                                {tabTag === -1 && <div className="add-bar" onClick={() => this.setAddBlock(true)}>
                                    {addBTn} 自定义添加
                                </div>}
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
                            
                            <div style={{display:'inline-block',marginLeft:'30px'}} className="change"  onClick={() => this.setAddBlock(true)}>
                                    {addBTn} 自定义添加
                                </div>
                            
                        </div >
        }
         
        //级别
        var GradeEle = [];
        Grades.forEach((g,index)=>{
            GradeEle.push(<Option key={index} value= {index + 1} >{g}</Option>);
        });
        
        //其它标题
        let titlesEle = '';
        if(item)
        {
            titlesEle = <TagsTitle ref = 'refsTagsTitle' Titles = {Titles}   titleMaxCount = {titleMaxCount} keywords = {item.keywords} 
                            visible = {otherTitlesVisible} changeTitle = {_this.reSetAutoSaveTime}
                            save = {this.TagSave}  />
        }
        
        //编辑框内容选中后，弹出按钮全网搜
        var searchBtnEle = '';
        if(searchBtnShow)
        {
            searchBtnEle = SearchBtn(searchBtnTop,searchBtnLeft,this.gotoSearch)
        }
        return (
            <div>
                <div className="content__box">
                    <section className="articleOneBox articleOneEidtBox article articleOneEidt">                       
                        <div className="articleOne">
                            <div className="broadcast" id='mainBox'>
                                <div className="top">
                                    <span className="return" onClick={this.toArticleList}>返回到列表</span>
                                    
                                    <span >
                                        <label>级别 : </label>
                                        <Select style={{width:100,marginLeft:'10px'}} value={Grade} onChange = {this.changeGrade}>
                                           {GradeEle}
                                        </Select>    
                                    </span>
                                    <Popconfirm title="确认恢复为原始稿件？" onConfirm={this.reStoreArticle} onCancel={()=>{return false}} okText="恢复" cancelText="取消">
                                       <span className="iconfont icon-yuan change" title= '恢复原文'  ></span>
                                    </Popconfirm>
                                   
                                </div>
                                <div className="articleOne__box" style={{position:'relative'}}>
                                    <div key={"edit"} className="articleOne__box articleOne__box__edit">                                                                           
                                        <div className="text-box" style={{width:'60%',padding:'10px 0'}}>
                                        <Input ref='titleRef' value = {curTitle}  onChange = {this.changeTitle} addonAfter= {titleSize + '/' + titleMaxCount} />                                                                              
                                        <span onClick = {this.showOtherTitles} className= {otherTitlesVisible ? "iconfont bttb-title change icon-title-1" : "iconfont bttb-title change icon-title" }>
                                        </span>
                                        {titlesEle} 
                                    </div>
                                    <div ref="editorToobarContainer" >
                                        <div className="uEidt" ref="editorElemtoobar"  style={{display:'inline-flex'}}></div>
                                        <div style={{display:'inline-block',paddingLeft:'10px'}}><Button icon="highlight" onClick={this.signKeyWords}>标注关键句</Button></div>
                                        <div  style={{display:'inline-block',paddingLeft:'10px'}}>
                                        <span style={{paddingLeft:'10px'}}>总字数：{item && item.totalCount}</span>
                                        <span style={{paddingLeft:'10px'}}>段落：{item && item.paragraphCount}</span>
                                        <span style={{paddingLeft:'10px'}}>图片：{item && item.imagesCount}</span>
                                        </div>
                                    </div>
                                        
                                        <div className="textarea" id="textarea">
                                            <div ref="editorElem" style={{paddingBottom: '40px'}}></div>
                                        </div>
                                        <div className="add-block" id="fixPara">
                                            <div className="option_xiala_box">
                                                <div className="option_xiala">
                                                <Customer ref='customerref' selectIndustry={this.setIndustry}  ClientInfo={this.props.ClientInfo} customer={customer } industry={industry }/>
                                                </div>
                                                <div style={{width: 'inherit', overflow: 'hidden', height: '38px',}} id="wrapper">
                                                     <TabTags tabTag = {tabTag}  fun = {this.tabChange}  />
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
                                                                            customer = {customer}/>                                                       
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

                        <div className="page">
                            <Pagination size={"samll"} current={current} pageSize={1}  total={this.props.count} onChange={this.onPageChange}/>
                        </div>
                    </section>
                    <div className="btn-box">
                        <button className="btn-bc" style={{  marginRight: "30px", fontSize: "14px" }} onClick={() => this.saveNews(0)}>保存 </button>                        
                        <button className="btn-fh"  style={{  marginRight: "30px", fontSize: "14px" }} onClick={() => this.saveNews(100)}>保存并修改下一篇 </button>
                        <button className="btn-bc" ref='submitBtn' onClick={() => this.exportFile(0)}>导出</button>
                         
                    </div>
                    <BackTop/>
                    <div className="ant-back-Bottom" ref='gotobottom' onClick={this.goBottom}>
                        <div className="ant-back-Bottom-content">
                            <div className="ant-back-Bottom-icon"></div>
                        </div>
                    </div>
                    {searchBtnEle}

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

export default connect(mapStateToProps)(ArticleEdit)

