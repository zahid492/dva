import React, {Component} from 'react'
import {connect} from 'react-redux'
import store from "store2";
import _ from "lodash";
import E from 'wangeditor';
import $ from "jquery";

import {Input, message, Upload, Button, Icon, Select,InputNumber } from 'antd';
//import {Input, message,  Button,  Select,InputNumber } from 'antd';

import Loading from '@/components/Loading';
//import Customer from '@/components/Customers'
import * as apiUrl from '@/services/ApiUrl';
import * as query from "@/services/Utils"
import * as actions from "@/store/actions";
import Common from '@/components/Common' 
import '@/style/article_edit.css'


const Search = Input.Search;
var editor;


// 输入原新闻稿
class WriteInput extends Component {
    constructor(props) {
        super(props);
        //this.toNextClick = this.toNextClick.bind(this);
        this.titleInput = this.titleInput.bind(this);
        this.params = {
            titleMaxSize: 60,
            newsMaxSize: 5000,
        };
        this.state = {
            nid: "",
            titleInput: "",
            newsInput: "",
            titleSize: 0,
            count: 1,
            loading: false, 
            customer: "",
            industry: "",
            fileList: [], 
            wordFileList: [],
            errmsg:''
        };  
        //this.specleHandler();
        this.props.dispatch(actions.createNews.clear())
        this.props.dispatch(actions.newArticles.clear()); 
        this.props.dispatch(actions.writeClear.clear())
        this.props.dispatch(actions.uploadWord.clear({}));

        this.loadSelectDatas();

        message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
    }

 toNextClick(tag) {
        var _this = this; 
        if ($.trim(_this.state.titleInput).length > 0) { 
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

            if ($.trim(_this.state.titleInput).length > _this.params.titleMaxSize) {
                message.destroy();
                message.warn('标题字数超过' + _this.params.titleMaxSize + '了！');
                return;
            }

            /* let customer = this.state.customer;
            if (!customer) {
                message.destroy();
                message.warn('请选择客户！');
                return;
            } */
 
            _this.setState({
                loading: true
            });
 
            var content = editor.txt.html(); 
            if(tag == 'write')
            {
                let param = {
                    ArticleId: '',
                    Title: _this.state.titleInput,
                    Content: content,
                    ClientName: _this.state.customer,
                    Industry: _this.state.industry,
                    Count: _this.state.count,
                    TaskId:_this.state.taskId,
                    articleType: 5
                }
                query.setData(apiUrl.newArticlesUrl + 'createnewsbuild',param).then((res)=>{ 
                    if(res.code == 200)
                    {
                        var _id =  res.data;   
                        query.callData(apiUrl.newArticlesUrl + 'GetPage',{ArticleId: _id,
                                            index: 1,
                                            listtype: 1,
                                            applyplatform: -1}).then((_res)=>{
                                                    if(_res.data && _res.data.length > 0)
                                                    {
                                                         var article = _res.data[0];
                                                         var aid = article._id;
                                                         store.session('articleId',_id); 
                                                         _this.props.history.push("/write/edit/" + aid); 
                                                    }else{
                                                        _this.props.history.push("/write/list/" + _id); 
                                                    }
                                            }).catch(()=>{
                                                _this.props.history.push("/write/list/" + _id); 
                                            });

                        
                    }else{
                        message.warn(res.errmsg);
                        _this.setState({
                            loading: false
                        });
                    }
                    
                }).catch((res)=>{
                    message.warn(res.errmsg);
                    _this.setState({
                        loading: false
                    });
                }); 

            }else if(tag == 'seo')
            {
                let param = { 
                    Title: _this.state.titleInput,
                    Content: content,
                    ClientName: _this.state.customer,
                    Industry: _this.state.industry,
                    Count: 1, 
                    seoKeywords:[],
                    articleType: 6
                } 
    
                query.setData(apiUrl.newArticlesUrl + 'createnewsbuild',param).then((res)=>{
                    if(res.code == 200)
                    {
                        var _id =  res.data;
                        query.setData(apiUrl.newArticlesUrl + 'createseo',_id);                         
                        _this.props.history.push("/seo/list/" + _id); 
                    }else{
                        message.warn(res.errmsg);
                        _this.setState({
                            loading: false
                        });
                    }
                    
                }).catch(()=>{
                    message.warn('生成失败！');
                    _this.setState({
                        loading: false
                    });
                }); 
            }
            

        } else {
            message.destroy();
            message.warning("请输入正确信息")
            return;
        }
    }

static getDerivedStateFromProps(nextProps, prevState) {             
        if(nextProps.ArticleWord.errmsg)
        {
            return{
                errmsg:nextProps.ArticleWord.errmsg
            }
        }      
        if(nextProps.nid.errmsg)
        {
            return{
                errmsg:nextProps.nid.errmsg
            }
        }    

        return {
            errmsg:''
        };
    }

titleInput(e) {
        var title = $.trim(e.target.value);
        let len = this.params.titleMaxSize - title.length;
        if (len >= 0) {
        
            this.setState({
                titleInput:title,
                titleSize: title.length,
            });
        }
    }

getSnapshotBeforeUpdate(prevProps, prevState) {
        return null;
    }

componentDidUpdate(prevProps, prevState, snapshot) {  
        if (this.state.errmsg) { 
            message.destroy();
            message.error(this.state.errmsg);
            this.setState({ 
                loading: false,
                errmsg:''
            }, () => { 
                this.props.dispatch(actions.createNews.clear());    
                this.props.dispatch(actions.uploadWord.clear());                   
            });

            return;
        }
               
        this.setEdit();
        this.setEditContent(prevProps, prevState);

        let delList = _.intersectionBy(this.state.fileList, this.props.WriteImagesDel, 'uid');
        if (delList.length > 0) {
            let temp = _.concat([], this.state.fileList);
            let newfl = _.differenceBy(temp, this.props.WriteImagesDel, 'uid');
            this.setState({
                fileList: newfl
            }, () => {
                this.props.dispatch(actions.imageDel.clear())
            })
        }
         
    }

loadSelectDatas = ()=>{              
         var _this =this;

         query.__request('get',apiUrl.apiClientsWithIndustryGetUrl,{page : 1,limit:10, key : '' },(res)=>{ 
                var data = res.data;
                if(data && data.length > 0)
                { 
                  var client = data[0];
                  var customer = client.name;
                  var industry = client.industry;
                   
                  _this.setState({
                    customer,industry
                  });
                }
                
               
           })    
    }

componentDidMount(prevProps, prevState) {
        this.setEdit();            
    }

componentWillUnmount() {
        editor = null;
        this.props.dispatch(actions.taskArticle.clear());
    }

//编辑模式，设置富文本编辑框
setEdit = () => {
        var _this = this;
        if (!editor) {
            const elem = this.refs.editorElem;
            const elemBar = this.refs.editorElemtoobar;
            if (elem && elemBar) {
                editor = new E(elemBar, elem);
                editor.customConfig.onchangeTimeout = 200;
                editor.customConfig.zIndex = 1;
                editor.customConfig.showLinkImg = false;
                editor.customConfig.uploadImgShowBase64 = true;

                editor.customConfig.pasteFilterStyle = true;
                editor.customConfig.pasteTextHandle = function (content) {  
                var reg = new RegExp('<head>([\\s\\S]*?)</head>');
                    
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
                     
                    content = $.trim(content);
                    return content;
                    

                };

                editor.customConfig.onchange = function (html) { 
                     _this.setState({
                          titleSize: _this.state.titleInput.length
                     });   
                };

                editor.customConfig.menus = [
                    //'head', // 标题
                    'bold', // 粗体
                    'fontSize', // 字号
                    'fontName', // 字体
                    'italic', // 斜体
                    'underline', // 下划线
                    'strikeThrough', // 删除线
                    'foreColor', // 文字颜色
                    'backColor', // 背景颜色
                    'list', // 列表
                    'justify', // 对齐方式 
                    //'image', // 插入图片
                ]

                /* editor.customConfig.colors = [
                    '#ff0000'                    
                ] */
                
                editor.create();

                $('.w-e-text').css('overflowY', 'auto');

                //editor.$textElem.attr('contenteditable', false)
            }
        }

    };
//给富文本编辑框设置内容
setEditContent = (prevProps, prevState) => {
         
        if (editor) {            
            if (this.props.ArticleWord && this.props.ArticleWord.upload) 
            {               
                var _content = this.props.ArticleWord.content ? this.props.ArticleWord.content : '';
                editor.txt.html(_content); 

                this.setState({ 
                    loading:false,
                    titleSize: this.props.ArticleWord.title ? this.props.ArticleWord.title.length : 0,
                    titleInput: this.props.ArticleWord.title,
                    newsInput: _content,  
                }, () => {
                    this.props.dispatch(actions.uploadWord.clear());                                   
                })

            } 


        }
    };

 
handleSuccess = (data, file) => {
        let tempList = _.concat([], this.state.fileList);
        let tempIndex = _.findIndex(tempList, {uid: file.uid});
        tempList[tempIndex].fileId = data;
        this.setState({
            fileList: tempList
        })
    };

handleRemove = (item) => {
        let temp = this.props.WriteImageUpload;
        let i = _.findIndex(temp, {uid: item.uid});
        if (i !== -1) {
            this.props.dispatch(actions.imageDel.request({uid: item.uid, id: temp[i].id}));
        }
    };

 
    // word
handleWordBefore = (e) => {
        this.props.dispatch(actions.createNews.clear())
        if (this.state.customer === "") {
            message.warning("请先选择客户和行业")
            e.preventDefault();
            e.stopPropagation();
        }
    };

handleWordChange = (info) => {
        let {fileList, file} = info;
        _.last(fileList).status = "done";
        this.setState({ 
            wordFileList: [_.last(fileList)]
        });
    };

uploadWordRequest = (opt) => {
        let obj = _.assign({
            file: opt.originFileObj,
            filename: opt.name,
        }, opt);

        let data = {
            articleId: this.props.ArticleWord.articleId || "", 
            articleType: 5,
        };
        obj.data = data;
        
        this.setState({
            loading: true,
            titleInput:'',
            newsInput:''
        }, () => {
            editor && editor.txt.html('');
            this.props.dispatch(actions.uploadWord.request(obj))
        });

    };

 
onCountChange = (value) => {
         var v = parseInt(value,10);
         if(isNaN(v))
         {
            v = '';
         }
        this.setState({
            count: v
        })
    };
 

 
//分析链接内容
analyzeLink = (value) =>{
    if(Common.CheckUrl($.trim(value)))
    {
        let v = $.trim(value);
        let obj = {
                url:encodeURI(v),
                imgBase64:1
            }
        this.setState({
                loading: true,
                titleInput:'',
                newsInput:''
            }, () => {
                editor && editor.txt.html('');
                this.props.dispatch(actions.analyzeLink.request(obj))
            });
    }else{
            message.warn('请正确输入文章链接！');
        }
        
    }
render() { 
        //let wcount = editor && editor.txt.text().length || 0;
        var noHtmlCon = '';
        if(editor)
        {
           let _nc = editor.txt.text();
           _nc = _nc.replace(/<[\s\S]*?>/g, '');
           //let reg = new RegExp(' ','g');
           _nc = _nc.replace(/&nbsp;/g,'');
           noHtmlCon = _nc.replace(/\s/g,'');

           //noHtmlCon = _nc.replace(/' '/g,'');
        }
        let wcount = noHtmlCon.length;
        return (
            <div>
                <Loading loading={this.state.loading}/>
                <div className="content__box">
                    <section className="news-adapt" style={{"width": "71%", "margin": "0 auto"}}>
                     
                          <div style={{"position": "relative", "marginBottom": "40px"}}>
                            
                           <div style={{"display": "inline-block", "width": "70%"}}>
                              <Search  placeholder="输入原文链接"  enterButton="采集原文"    onSearch={this.analyzeLink}  />
                           </div>
                            <div style={{"display": "inline-block", "width": "20%",paddingRight:'20px',textAlign: 'right',position:'absolute'}}>                          
                                <Upload
                                    accept=".doc,.docx" 
                                    listType="text"
                                    fileList={this.state.wordFileList}
                                    // beforeUpload={this.handleWordBefore}
                                    onChange={this.handleWordChange}
                                    // onSuccess={this.handleWordSuccess}
                                    onRemove = {(file) => {
                                        this.setState(({ fileList }) => {
                                          const index = fileList.indexOf(file);
                                          const newFileList = fileList.slice();
                                          newFileList.splice(index, 1);
                                          return {
                                            wordFileList: newFileList
                                          };
                                        });
                                      }}
                                    customRequest={this.uploadWordRequest}>
                                    <Button >
                                        <Icon type="upload"/> 上传原文
                                    </Button>
                                </Upload>
                            </div> 
                        </div> 

                        <div key={"edit"} className="articleOne__box articleOne__box__edit articleOne__box__edit-write">
                            <div className="news-adapt__tit">
                                <h3 className="title">标题</h3>
                                <div className="text-box">
                                    <Input placeholder="请输入标题"  defaultValue={""} onChange={this.titleInput}
                                           value={this.state.titleInput}  />
                                    <span>{this.state.titleSize}/60</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="title">内容</h3>
                                <div className="uEidt" ref="editorElemtoobar" style={{display:'inline-flex'}}></div>
                                <div style={{display:'inline-block',paddingLeft:'30px'}}> {/* <Button icon="highlight" onClick={this.signKeyWords}>标注关键句</Button> */} </div>
                                <div className="textarea" style={{"backgroundColor": "#fff"}}>
                                    <div ref="editorElem" style={{paddingBottom: '10px', "height": "600px"}}></div>
                                </div>
                            </div>
                            <div className="news-adapt__statistic news-adapt__statistic-write">
                            <div>
                                <span>标题字数：{this.state.titleSize}</span>
                                <span>总字数：{wcount + this.state.titleSize}</span>
                                {/* <span>{wcount}/5000</span> */}
                            </div>
                         </div>
                        </div>                   

                         
                    </section>
                     
                    <div className="btn-box">
                        <button className="btn-bc" onClick={this.toNextClick.bind(this,'write')} style={{zIndex: 1000,position: 'relative'}}>素材改编</button>
                        <button className="btn-fh" onClick={this.toNextClick.bind(this,'seo')} style={{zIndex: 1000,position: 'relative'}}>机器改编</button>

                    </div>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state, ownProps) {
    // 生成的文章id
    const {nid} = state.CreateNews;
    // 用来保存上传 word 返回的原文
    const ArticleWord = state.UploadWord;
    // 返回时用来存放文章
    //const Article = state.Article;
    const WriteImagesDel = state.WriteImagesDel;
    const WriteImageUpload = state.WriteImageUpload; 

    const {
        NewArticles
    } = state.Articles3;

    return {
        nid: nid,
        //Article,
        ArticleWord, 
        WriteImagesDel,
        WriteImageUpload,
         
        NewArticles
    }
}

export default connect(mapStateToProps)(WriteInput)

