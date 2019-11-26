import React, {Component} from 'react'
import {connect} from 'react-redux'
import store from "store2";
import _ from "lodash";
import E from 'wangeditor';
import $ from "jquery";

import {Input, message, Upload,  Button, Icon,Tag } from 'antd';
//import {Input, message,  Button,  Select,InputNumber } from 'antd';

import Loading from '@/components/Loading';

import Customer from '@/components/Customers'
import * as query from "@/services/Utils"
import * as apiUrl from '@/services/ApiUrl';
import * as actions from "@/store/actions";
import Common from '@/components/Common'
import {customRequest} from "@/services/Utils";
import '@/style/article_edit.css' 
 
var editor;
const Search = Input.Search;

// SEO改稿
class SeoInput extends Component {
    constructor(props) {
        super(props);
        this.toNextClick = this.toNextClick.bind(this);
        this.titleInput = this.titleInput.bind(this);
        this.params = {
            titleMaxSize: 60,
            newsMaxSize: 5000,
        };

        this.Account = store.get("Account");
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
            errmsg:'',  
            customerDisabled:false,
            titleDisabled:false,
            keys:[] ,  //eg:{v:'标签',t:0}

        };
        // this.props.match.params.nid
        this.clientCount = 0;
        this.props.dispatch(actions.createNews.clear())
        this.props.dispatch(actions.newArticles.clear());

        if(_.isNil(this.props.match.params.nid)){
            this.props.dispatch(actions.writeClear.clear())
        }

        this.props.dispatch(actions.uploadWord.clear({}));
        this.loadSelectDatas();

        message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
    }

toNextClick() {
        const token = store.get("accesstoken");

        if (_.isUndefined(token) || _.isNull(token)) {
            message.destroy();
            message.warning("请先登录");
            return;
        }

        if ($.trim(this.state.titleInput).length > 0 && $.trim(this.state.newsInput).length > 0) { 
            if(editor)
            {
                let noHTMLcontent =  $.trim(editor.txt.text());
                if($.trim(noHTMLcontent.replace(/&nbsp;/img,'')) === '')
                {
                   message.destroy();
                   message.warn('内容不能为空！');
                   return;
                }
            }

            if ($.trim(this.state.titleInput).length > this.params.titleMaxSize) {
                message.destroy();
                message.warn('标题字数超过' + this.params.titleMaxSize + '了！');
                return;
            }

            let customer = this.state.customer;
            if (!customer) {
                message.destroy();
                message.warn('请选择客户！');
                return;
            }

            if (this.state.count === 0 || this.state.count === '') {
                message.destroy();
                message.warn('请选择生成文章数量！');
                return;
            }

            let keys = this.state.keys;
            let _keys = keys.filter(k=> k.t === 0 && $.trim(k.v) === '');
            if(_keys.length)
            {
                message.warn('您输入的关键词有空数据，请正确填写');
                return;
            }


            this.setState({
                loading: true
            });            

            let content = editor.txt.html();
            let param = { 
                Title: this.state.titleInput,
                Content: content,
                ClientName: this.state.customer,
                Industry: this.state.industry,
                Count: 1, 
                seoKeywords:keys.filter(k=>k.t === 0).map(k=> {return $.trim(k.v)}),
                articleType: 6
            } 

            query.setData(apiUrl.newArticlesUrl + 'createnewsbuild',param).then((res)=>{
                if(res.code == 200)
                {
                    var _id =  res.data;
                    query.setData(apiUrl.newArticlesUrl + 'createseo',_id);                         
                    this.props.history.push("/seo/list/" + _id); 
                }else{
                    message.warn(res.errmsg);
                    this.setState({
                        loading: false
                    });
                }
                
            }).catch(()=>{
                message.warn('生成失败！');
                this.setState({
                    loading: false
                });
            }); 
            
            
               
            

            // 根据内容生成
            //this.props.dispatch(actions.createNews.request(param));

        } else {
            message.destroy();
            message.warning("请输入正确信息")
            return;
        }
    }

static getDerivedStateFromProps(nextProps, prevState) {     
        const Account = store.get("Account");
        //未登陆时，账号为空，清空页面内容
        if(!Account)
            {
                editor && editor.txt.html("");
               return {
                    fileList: [],
                    wordFileList: [],
                    titleInput: "",
                    newsInput: "",
                    titleSize: 0,
                    //hasArticle: false,
                    customer:'',
                    industry: "",
                    errmsg:''
                }

                 
            }
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
            nid: nextProps.nid,            
            errmsg:''

        }
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
                loading: false
            }, () => { 
                this.props.dispatch(actions.createNews.clear());    
                this.props.dispatch(actions.uploadWord.clear());    
                
                
            });

            return;
        }
                
        this.setEdit();
        this.setEditContent(prevProps, prevState); 
        $('.textarea .articlekeysentence').removeClass('articlekeysentence');
         
         
    }

loadSelectDatas = ()=>{
        const Account = store.get("Account"); 
            if (Account &&  Account.accesstoken  && this.props.ClientInfo.length === 0)
            { 
                this.props.dispatch(actions.clientInfo.request({accesstoken: Account.accesstoken}));               
            } 
                         
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
        const that = this;
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
                editor.customConfig.onchange = function (html) { 
                    
                    // html 即变化之后的内容
                     that.setState({
                        newsInput: html
                    }) 
                };
                editor.create();

                $('.w-e-text').css('overflowY', 'auto'); 
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
                //let _count = this.props.ArticleWord.count > 0 ?this.props.ArticleWord.count : this.state.count;
                this.setState({ 
                    loading:false,
                    titleSize: this.props.ArticleWord.title ? this.props.ArticleWord.title.length : 0,
                    titleInput: this.props.ArticleWord.title,
                    newsInput: _content,
                    //taskArticleCount:this.props.ArticleWord.count,
                    //count:_count
                }, () => {
                    this.props.dispatch(actions.uploadWord.clear());
                    if(this.props.ArticleWord.clientName)
                    {
                        this.setIndustry(this.props.ArticleWord.clientName,this.props.ArticleWord.industry);
                    }
                      
                })

            } 


        }
    };

setIndustry = (customer, industry) => {
        this.setState({
            customer: customer,
            industry: industry
        });
    };

previewFile = (file, callback) => {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

handleChange = (info) => {
        // 要记录上传成功的和不成功的，可重新上传 s;
        let {fileList, file} = info;

        this.setState({fileList}, () => {
            this.previewFile(file.originFileObj, (previewDataUrl) => {
                _.last(fileList).status = "done";
                _.last(fileList).thumb = previewDataUrl;
                this.forceUpdate();
            });
        });
    };

    //取消预览
handleCancel = () => this.setState({previewVisible: false});

handleBefore = (file, fileList) => {

        const file_max = 20;
        return new Promise((resolve, reject) => {

            if (file.size > 1024 * 1024) {
                message.warning("上传图片不能大于 1M");
                reject(false);
            }

            let len = _.size(this.state.fileList);

            if ((len + _.size(fileList)) > file_max) {
                let tempIndex = _.findIndex(fileList, {uid: file.uid});
                if (tempIndex > file_max - 1 || len >= file_max) {
                    message.warning("最多上传20张图");
                    reject(false);
                }
            }

            let tempIndex = _.findIndex(this.state.fileList, {name: file.name});
            if (tempIndex > -1) {
                message.warning("不要重复上传同名图片");
                reject(false);
            }

            resolve()
        })

    };
    //上传图片
uploadRequest = (opt) => {
        const subObj = _.find(this.props.ClientInfo, {clientName: this.state.customer});

        let obj = _.assign({
            file: opt.originFileObj,
            filename: opt.name,
        }, opt);

        let data = {
            subjectId: subObj.subjectId,
            imageName: "",
            clientName: this.state.customer,
            industry: this.state.industry,
            key: "",
        };

        obj.data = data;
        obj.dispatch = this.props.dispatch;
        obj.actions = actions.imageUpload;

        customRequest(apiUrl.apinewsImgAddUrl, obj)
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

handlePreview = (e) => {
        this.setState({
            previewImage: $(e.currentTarget).attr("href"),
            previewVisible: true
        });
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

// 更新本地状态
    /* handleWordSuccess = (data, file) => {
        file.status = "done"
        this.setState({
            wordFileList: [{...file}],
            Article: data
        })
    }; */

//分析链接内容
analyzeLink = (value) =>{
    if(Common.CheckUrl($.trim(value)))
    {
        let v = $.trim(value);
        let obj = {
                url:decodeURI(v),
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
    changeKeys = (index,e)=>{ 
        var keys = this.state.keys;
        keys[index].v = e.target.value;
        this.setState({keys});

    }
    changeKeysState = (index,t)=>{
        var keys = this.state.keys;   
        if($.trim(keys[index].v) === '' && t === 0)
        {
            message.warn('请输入关键词！');
            return;
        }     
        keys[index].t = t;
        this.setState({keys});
        
        
    }
    closeKeys = (e,index)=>{
        e.stopPropagation();
        var keys = this.state.keys;
        keys.splice(index,1);
        this.setState({keys});
    }
    addKeys = () =>{
        var keys = this.state.keys;
        keys.push({v:'',t:1});
        this.setState({keys});
    }
render() { 
        //let wcount = editor && editor.txt.text().length || 0;
        var noHtmlCon = '';
        if(editor)
        {
           let _nc = editor.txt.text();
           _nc = _nc.replace(/<[\s\S]*?>/g, '');
           _nc = _nc.replace(/&nbsp;/g,'');
           noHtmlCon = _nc.replace(/\s/g,'');
        }
        let wcount = noHtmlCon.length;

        var Account = store.get("Account");
        var customerEle = '';

        if (Account) {
            var customer = this.state.customer;
            var industry = this.state.industry;

            customerEle = <Customer ref='customerref'
                                    selectIndustry={this.setIndustry}
                                    ClientInfo={this.props.ClientInfo}
                                    customer={customer} industry={industry} disabled = {this.state.customerDisabled}/>
        }
        let  ele_keys =[];
            this.state.keys.forEach((k,index) =>{
             if(k.t == 1)
                {
                    ele_keys.push(<span key={index} style={{display:'inline-block', marginRight:'20px'}}>
                              <Input  value={k.v} style={{width:140,paddingRight:'20px'}} onChange={e=>{this.changeKeys(index,e)}} />
                              <Icon type="check" style={{position:'relative',left:'-19px',color:'green',cursor:'pointer'}} onClick={(e)=>{this.changeKeysState(index,0)}}/>
                            </span>)
                }else{
                   return ele_keys.push(<Tag key={index} closable visible style={{height:'32px',lineHeight:'32px'}} onClose = {(e)=>{this.closeKeys(e,index)}} onClick={(e)=>{this.changeKeysState(index,1)}}> {k.v}</Tag>)
                } 
            });
        if(ele_keys.length < 5)
        {
            ele_keys.push(<Icon key={5} type="plus" onClick={this.addKeys}  style={{cursor:'pointer',marginLeft:'5px',fontSize:20}}/>)
        }
        return (
            <div>
                <Loading loading={this.state.loading}/>
                <div className="content__box">
                    <section className="news-adapt" style={{"width": "71%", "margin": "0 auto"}}>
                     <div style={{"position": "relative", "marginBottom": "40px"}}>
                           <div style={{"display": "inline-block", "width": "40%"}}>
                            {customerEle}
                           </div>
                           <div style={{"display": "inline-block", "width": "40%",paddingLeft:'30px'}}>
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
                        <div style={{"position": "relative", "marginBottom": "40px"}}>
                            优化关键词：{ele_keys}
                              
                        </div>
                        <div key={"edit"} className="articleOne__box articleOne__box__edit articleOne__box__edit-seo ">
                            <div className="news-adapt__tit">
                                <h3 className="title">标题</h3>
                                <div className="text-box">
                                    <Input placeholder="请输入标题" defaultValue={""} onChange={this.titleInput}
                                           value={this.state.titleInput} disabled = {this.state.titleDisabled}/>
                                    <span>{this.state.titleSize}/60</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="title">内容</h3>
                                <div className="uEidt" ref="editorElemtoobar" style={{display:'none'}}></div> 
                                <div className="textarea" style={{"backgroundColor": "#fff"}}>
                                    <div ref="editorElem" style={{paddingBottom: '10px', "height": "600px"}}></div>
                                </div>
                            </div>
                            <div className="news-adapt__statistic news-adapt__statistic-write">
                            <div>
                                <span>标题字数：{this.state.titleSize}</span>
                                <span>总字数：{wcount + this.state.titleSize}</span>
                            </div>
                        </div>
                        </div>

                        
                     
                    </section>
                    

                    <div className="btn-box">
                        <button className="btn-bc" onClick={this.toNextClick} style={{zIndex: 1000,position: 'relative'}}>生成</button>
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
    const WriteImageUpload = state.WriteImageUpload;
    // 客户信息
    const ClientInfo = state.ClientInfo; 

    const {
        NewArticles
    } = state.Articles3;

    return {
        nid: nid,
        //Article,
        ArticleWord,
        ClientInfo, 
        WriteImageUpload,
        NewArticles
    }
}

export default connect(mapStateToProps)(SeoInput)

