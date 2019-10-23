import React, {Component} from 'react'
import {Input, message} from 'antd';
import Loading from '@/components/Loading';

import NewsStep from '@/components/Step/NewsStep'
import * as actions from "@/store/actions";
import {connect} from 'react-redux'
import store from "store2";
import _ from "lodash";
import $ from "jquery";
import * as apiUrl from '@/services/ApiUrl';
import Common from '@/components/Common'
import E from 'wangeditor';
var editor;

const Search = Input.Search;


// 输入原新闻稿
class News1 extends Component {
    constructor(props) {
        super(props);
        this.toNextClick = this.toNextClick.bind(this);
        this.titleInput = this.titleInput.bind(this);
        //this.newsInput = this.newsInput.bind(this); 
        //Spin.setDefaultIndicator(Loading);
        this.params = {
            titleMaxSize: 60,
            newsMaxSize: 5000,
        };

        this.state = {
            nid: props.nid,
            titleInput: "",
            newsInput: "",
            titleSize: 0,
            newsSize: 0,           
            loading: false,
            code : 0,
            setContent:false
        }
    }

toNextClick() {
        const token = store.get("accesstoken");

        if (_.isUndefined(token) || _.isNull(token)) {
            message.destroy();
            message.warning("请先登录");
            return;
        }

        if (this.state.titleInput.trim().length > 0 && this.state.newsInput.trim().length > 0) {

            if(editor)
            {
                var noHTMLcontent =  $.trim(editor.txt.text());
                if($.trim(noHTMLcontent.replace(/&nbsp;/img,'')) === '')
                {
                   message.destroy();
                   message.warn('内容不能为空！');
                   return;
                }
            }




            this.setState({
                loading: true
            });

            this.props.dispatch(actions.loadAddArticle({
                "title": this.state.titleInput,
                "content": this.state.newsInput,
                "_id": this.props.match.params.nid||'',
            }));

        } else {
            message.destroy();
            message.warning("请输入正确信息")
            return;
        }
    }

static getDerivedStateFromProps(nextProps, prevState) {      
        if(nextProps.Article)
        {
            return {
                nid: nextProps.nid,
                titleInput:nextProps.Article.title ? nextProps.Article.title:'',
                newsInput : nextProps.Article.content ? nextProps.Article.content : '',
                titleSize:nextProps.Article.title ? nextProps.Article.title.length : 0,
                newsSize:nextProps.Article.content ? nextProps.Article.content.length : 0,
                setContent:nextProps.Article.setContent
            };
        }else{
            return {
                nid: nextProps.nid 
            };

        }
          
    }

titleInput(e) {
        let len =  this.params.titleMaxSize-e.target.value.length;
        if (len>=0) {
            this.props.dispatch(actions.article.update({data:{title:e.target.value}}));
             
        }  
    }

    /* newsInput(e) {
        let cin;
        let p;
        let len = this.params.newsMaxSize - e.target.value.length;

        if (len>=0) {
            p = e.target.value.split("\n");
            cin = e.target.value;
        } else {
            cin = e.target.value.substring(0, this.params.newsMaxSize);
            p = e.target.value.substring(0, this.params.newsMaxSize).split("\n");
        }

        this.props.dispatch(actions.article.update({title:this.state.titleInput,content:cin}));
         
    } */



getSnapshotBeforeUpdate(prevProps, prevState) {       
        return null;
    }

componentDidUpdate(prevProps, prevState, snapshot) {
    if(!editor)
    {
        this.setEdit();
    }
    if(this.state.setContent)
    {
        if(this.state.newsInput === '')
        {
            message.warn('没有采集到数据');
        }
        this.setEditContent();
        this.props.dispatch(actions.article.update({data:{setContent:false}}));
        this.setState({loading:false});
    }
        if(_.has(this.state.nid,'errmsg'))
        {     
            message.destroy();
            message.error(this.state.nid.errmsg);  
            this.setState({loading:false});
            this.props.dispatch(actions.addArticle.clear());
            return;
        }
        else if (this.state.nid && prevProps.nid !== this.state.nid) {
            this.props.history.push("/news2/" + this.state.nid + "/ar");
        }
    }

componentDidMount(prevProps, prevState) {
        // store.session.remove("news2nid");
        //const nid = _.isUndefined(this.props.match.params.nid) ? "" : this.props.match.params.nid;
        this.setEdit();
        this.init();
        
        this.props.history.listen((location, action) => {
           
             if(location.pathname =='/news1')
            {
                this.props.dispatch(actions.article.clear());
            } 
             
        })

    }


componentWillUnmount() {
    editor = null;
}


init =()=>{
        if(this.props.match.params.nid)
        {
            this.props.dispatch(actions.loadArticle({nid:this.props.match.params.nid}));
            this.props.dispatch(actions.addArticle.clear());
        }else{
            this.props.dispatch(actions.article.clear());

        }
    }

//编辑模式，设置富文本编辑框
setEdit = () => {
        const that = this;
        if (!editor) {
            const elem = this.refs.editorElem;
            const elemBar = this.refs.editorElemtoobar;
            if (elem && elemBar) {
                editor = new E(elemBar,elem);
                editor.customConfig.onchangeTimeout = 200;
                editor.customConfig.zIndex = 999;
                editor.customConfig.showLinkImg = false;
                editor.customConfig.uploadImgShowBase64 = true;

                editor.customConfig.pasteFilterStyle = true;
                editor.customConfig.pasteTextHandle = function (content) { 
                    var reg = new RegExp('<head>([\\s\\S]*?)<\/head>');
                    
                    if(reg.test(content))   //从word文档拷贝过来的
                    {
                        //从word拷贝过来的文档带有大量的html标签，长度过大，一次replace不起作用，所以先把head去掉
                        content = content.replace(/<head>([\s\S]*?)<\/head>/g, '');
                        content = content.replace(/<p[\s\S]*?>/g, '<p>');
                        content = content.replace(/<span[\s\S]*?>/g, '<span>');
                        content = content.replace(/<html [\s\S]*?>/, '');
                        content = content.replace(/<body [\s\S]*?>/, '');
                        content = content.replace(/<\/body>/, '');
                        content = content.replace(/<o:p>/g, '');
                        content = content.replace(/<\/o:p>/g, '');
   
                        content = content.replace(/<span>([\s]*)<\/span>/g, '');                        

                    }else 
                    {
                        content = content.replace(/<[^(img)|p]*?>/g, '');
                        content = content.replace(/<html>/g, '');      
                        
                        var reg1 = new RegExp('<img src="\\(?<url>.*?\\)>','g');
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

                    
                                       
                     
                    content = $.trim(content);
                    return content;

                }; 
                editor.customConfig.onchange = function (html) { 
                    let _nc = editor.txt.text();
                    _nc = _nc.replace(/<[\s\S]*?>/g, '');                 
                    _nc = _nc.replace(/&nbsp;/g,'');
                    var  noHtmlCon = _nc.replace(/\s/g,'');
 
                    let wcount = noHtmlCon.length;

                    if(wcount < that.params.newsMaxSize)
                    {
                        that.props.dispatch(actions.article.update({data:{content:html}}));
                    }        
                };
                editor.create();

                $('.w-e-text').css('overflowY', 'auto');
            }
        }

    };

//给富文本编辑框设置内容
setEditContent = (prevProps, prevState) => {       
        if (editor) {            
            if (this.state.newsInput) 
            {               
                var _content = this.state.newsInput ? this.state.newsInput : '';
                editor.txt.html(_content);
            } 
        }
    };

analyzeLink=(value) =>{
        if(Common.CheckUrl($.trim(value)))
        {
            let v = $.trim(value);
           let obj = {
               url:decodeURI(v),
               imgBase64:1
           }
           this.props.dispatch(actions.article.clear());
           this.setState({
               loading: true
           }, () => {
               editor && editor.txt.html('');
               this.props.dispatch(actions.analyzeLink.request(obj))
           });
        }else{
            message.warn('请正确输入文章链接！');
        }
       
   }
render() {
        /* let wcount = _.reduce(_.compact(_.split(this.state.newsInput, '\n')),(c, v)=>{
            return c+v.length;
        }, 0); */

        let _nc = this.state.newsInput;
        _nc = _nc.replace(/<[\s\S]*?>/g, '');                 
        _nc = _nc.replace(/&nbsp;/g,'');
        var  noHtmlCon = _nc.replace(/\s/g,'');
 
        let wcount = noHtmlCon.length;
         
        return (
            <div>
                <Loading loading = {this.state.loading} />

                <NewsStep step={1}></NewsStep>
                
                <div className="content__box">
                    <section className="news-adapt">
                    <div key={"edit"} className="articleOne__box articleOne__box__edit articleOne__box__edit-write" style={{paddingTop:'14px'}}>
                        <div>
                              <Search  placeholder="输入原文链接"  enterButton="采集原文"    onSearch={this.analyzeLink}  />
                       </div>
                        <div className="news-adapt__tit">
                            <h3 className="title">标题</h3>
                            <div className="text-box">
                                <Input placeholder="请输入标题" defaultValue={""} onChange={this.titleInput}
                                       value={this.state.titleInput}/>
                                <span>{this.state.titleSize}/60</span>
                            </div>
                        </div>
                        <div className="news-adapt__con">
                            {/*<ReactLoading type={'spin'} color="#12B3F0" />*/}
                            <h3 className="title">内容</h3>
                            <div>
                               {/*  <TextArea placeholder="请输入内容" rows={10} onChange={this.newsInput}
                                          value={this.state.newsInput}/> */}
                                <div className="uEidt" ref="editorElemtoobar" style={{display:'none'}}></div>
                                <div className="textarea" style={{"backgroundColor": "#fff"}}>
                                    <div ref="editorElem" style={{paddingBottom: '10px', "height": "600px"}}></div>
                                </div> 
                            </div>
                        </div>
                        </div>
                         <div className="news-adapt__statistic">
                            <div>
                                <span>标题字数：{this.state.titleSize}</span>
                                <span>总字数：{wcount}</span> 
                            </div>
                        </div> 
                    </section>
                    <div className="btn-box">
                        <button className="btn" onClick={this.toNextClick}>新闻理解</button>
                    </div>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state, ownProps) {
    const { nid, } = state.Nid;
    const  Article = state.Article;
    return {
        nid: nid,
        Article
    }
}

export default connect(mapStateToProps)(News1)

