import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Input, Pagination, message} from 'antd';
import NewsStep from '@/components/Step/NewsStep'; 
import * as apiUrl from '@/services/ApiUrl';
import store from "store2";
import * as actions from "@/store/actions";
import qs from "qs";
import $ from 'jquery';


import E from 'wangeditor'

var editor;

// 前后id
class News3R extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            editVisible: store.session('News3editVisible') || false,
            checked: false,
            count: this.props.count,
            //OneArticle: Object.assign({}, this.props.OneArticle),
            OneArticle: {},
            NewArticles: [],
            id: this.props.match.params.id,
            type: this.props.match.params.tin,
        };
        this.seted=false; //编辑页，是否已经把文章内容赋值给富文本编辑框
        store.session('News3editVisible', this.state.editVisible);
        this.signed = 0; //预览页是否已经对文章添加对比 0 = 没有 1= 有
        this.articleId = store.session('articleId');
        this.titleRef = React.createRef();
        this.contentRef = React.createRef(); 

        this.toEdit = this.toEdit.bind(this);
        //if (_.size(this.props.NewArticles.length) <= apiUrl.NEWS_PAGESIZE) {
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
    }

    onChange = (e) => {
        this.setState({checked: e.target.checked});
    };

    onPageChange = (page) => {
        //const aid = this.state.NewArticles[page - 1]._id;
        const aid = this.state.NewArticles[page - 1];

        this.props.history.push(`/news/news3r/${aid}`);
        this.signed = 0;

        
        this.setState({
            id: aid,
            current: page,
            signed: 0,

        },   () => {
            this.signed = 0;
            this.seted=false;
            this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: aid}));
            // 传页数到编辑
            store.session("news3Rcurrent", page)
        });
    };

    toNext = (id) => {  
        //var current = store.session("news3Rcurrent");
        const {NewArticles, history} = this.props;
        //const cindex = _.findIndex(NewArticles, {_id: id});
        //const cindex = _.findIndex(NewArticles, id);
        const cindex = NewArticles.findIndex(_id=>_id==id);
        let nextId;
        if (cindex == NewArticles.length - 1) {
            nextId = 0;
        } else {
            nextId = cindex + 1;
        }
        //const toId = NewArticles[nextId]._id;
        const toId = NewArticles[nextId];
        history.push(`/news/news3r/${toId}`);
        
        this.setState({
            id: toId,
        },   () => {
            this.signed = 0;
            this.seted=false;
            this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: toId}));
            store.session("news3Rcurrent", nextId + 1)
        })
    };

    toPrev = (id) => {
        const {NewArticles, history} = this.props; 
        const cindex = NewArticles.findIndex(_id=>_id==id);
        let nextId;
        if (cindex == 0) {
            nextId = NewArticles.length - 1;
        } else {
            nextId = cindex - 1;
        } 
        const toId = NewArticles[nextId];

        history.push(`/news/news3r/${toId}`)
        
        this.setState({
            id: toId,
            // seted: false
        },  () => {
            this.signed = 0;
            this.seted=false;
            this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: toId}));
            store.session("news3Rcurrent", nextId + 1)
        })
    };

    toEdit = () => { 
        store.session('News3editVisible', true);
        this.signed = 0;
        this.seted = false;
        editor = null;
        this.setEdit();
        this.setEditContent();
        this.setState({editVisible: true,OneGo:null})
    };

    toArticle = () => {
        store.session('News3editVisible', false);
        editor = null;
        this.signed = 0;
        this.seted = false;

        this.setState({editVisible: false});
    };

    toNewArticles = () => {
        editor = null;
        this.signed = 0;
        this.seted = false;  
        var id = this.state.id;
        var NewArticles = this.props.NewArticles;
        const cid = NewArticles.findIndex(_id=>_id== id) + 1;
        let page = _.ceil(cid / apiUrl.AD_PAGESIZE, 0) || 1;
        this.props.history.push("/news/news3/" + this.articleId  + '/' + page);
    };

    //保存  step1
    saveNews = (m) => {
        const {id, OneArticle} = this.state;
        var content = editor.txt.html();
        var title = this.refs.titleRef.input.value;
        OneArticle.title = title;
        OneArticle.content = content;
         
        this.setState({ 
            OneArticle
        });

        // 修改完后，跳转到下一篇文章或下一步

        // if (m === 0) {
        //     this.toArticle();
        // }
        //
        // if (m === 1) {
        //     this.toNext(id);
        // }

        // 先到下一文章
        this.props.dispatch(actions.editOneArticle.request({
            nid: this.articleId,
            id: id,
            title: OneArticle.title,
            content: OneArticle.content,
            m: m
        }));


    };

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
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        //const ev = store.session('News3editVisible');
        if (_.size(prevState.NewArticles) === 0 || _.isUndefined(prevState.OneArticle) || (prevState.OneArticle._id !== prevState.id) || prevState.id != nextProps.id) {
            return {              
                checked: false,
                count: nextProps.count,
                OneArticle: nextProps.OneArticle,
                NewArticles: nextProps.NewArticles,
                id: prevState.id,
                OneGo:nextProps.OneGo
            };

        }
        return null;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
         
        // 从这里跳转， 修改完后，跳转到下一篇文章或下一步 step4      
        // 当前 id 和 go 中的id 相等则跳转到下一步或文章
       if(this.state.editVisible)
       { 
            if (!_.isNull(this.state.OneGo)
                && this.state.OneGo.m === 0
                && this.props.match.params.id === this.state.OneGo.id) {
                this.props.dispatch(actions.oneArticle.clear({clearM:1}));
                this.toArticle();
            }

            if (!_.isNull(this.state.OneGo)
                && this.state.OneGo.m === 1
                && this.props.match.params.id === this.state.OneGo.id) {
                
                this.toNext(this.props.match.params.id);
            }
       }
        

        return null;
    }
 

    componentDidMount() {
        this.setEdit();
    }

    componentDidUpdate() {
        //this.signDiff();
        this.setEdit();
        this.setEditContent();
 
    }

    componentWillUnmount(){ 
        editor = null;
        this.signed = 0;
        this.seted = false;
        this.props.dispatch(actions.oneArticle.clear());
    }
    //预览模式文章右侧加标注
    signDiff = () => {      
        if (this.state.editVisible == false && this.signed == 0) {
            var addEle = $('.articleaddcontent');
            if (addEle && addEle.length > 0) {
               
                var oi = document.createElement('i');
                var oem = document.createElement('em');
                oem.innerHTML = '添加内容';
                oi.appendChild(oem);
                $(addEle).prepend(oi);
                this.signed = 1;
            }
            var delEle = $('.articledeletecontent');
            if (delEle && delEle.length > 0) {
                $.each(delEle, (i, element) => {

                    var oSdel = document.createElement('s');
                    oSdel.innerHTML = $(element).text();
                    $(element).html(oSdel);

                    var oidel = document.createElement('i');
                    var oemdel = document.createElement('em');
                    oemdel.innerHTML = '删除内容';
                    oidel.appendChild(oemdel);
                    $(element).prepend(oidel);
                })
                this.signed = 1;

                /* var oSdel = document.createElement('s');
                    oSdel.innerHTML = $(delEle).text();
                    $(delEle).html(oSdel);

                    var oidel = document.createElement('i');
                    var oemdel = document.createElement('em');
                    oemdel.innerHTML = '删除内容';
                    oidel.appendChild(oemdel);
                    $(delEle).prepend(oidel); */


            }
            var titleEle = $('.articleOne__box__read .title');
            if (titleEle && titleEle.length > 0) {
                
                var oititle = document.createElement('i');
                var oemtitle = document.createElement('em');
                oemtitle.innerHTML = this.state.OneArticle.oriTitle.length > 20 ? this.state.OneArticle.oriTitle.substring(0,18) + '...' : this.state.OneArticle.oriTitle;
                oemtitle.title = this.state.OneArticle.oriTitle;
                oititle.appendChild(oemtitle);
                $(titleEle).prepend(oititle);
                this.signed = 1;
            }

            /* if($('.articleOne__box__read .title') && $('#Style').length == 0)
            {
               if(this.state.OneArticle.oriTitle)
               {
                var style = document.createElement('Style');
                style.id = 'Style';
                style.innerHTML += '.articleOne__box__read  .title::after {content: "'+this.state.OneArticle.oriTitle+'";}';
                document.body.appendChild(style);
                this.signed =1;
               }


           }  */
        }
    }
    
    //编辑模式，设置富文本编辑框
    setEdit = () => { 
        if (this.state.editVisible && !editor) {
            const elem = this.refs.editorElem;
            const elemBar = this.refs.editorElemtoobar
            if (elem && elemBar) {
                editor = new E(elemBar, elem)
                // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
                /* editor.customConfig.onchange = html => {
                    const item = this.state.OneArticle;
                    item.content = html;
                    this.setState({OneArticle: item})
                } */
                editor.customConfig.zIndex = 999;
                editor.customConfig.showLinkImg = false;
                editor.customConfig.uploadImgShowBase64 = true;
                //editor.customConfig.overflowY = 'none';
                editor.customConfig.menus = [
                    'head', // 标题
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
                    'quote', // 引用
                    'image', // 插入图片

                ] 
                editor.create();
                $('.w-e-text').css('overflowY','auto');
                
            }
        }


    }

    //给富文本编辑框设置内容
    setEditContent = () => {
        if (this.state.editVisible && editor && this.state.OneArticle && this.state.OneArticle.content && !this.seted) {
            
            editor.txt.html(this.state.OneArticle.content);
            this.refs.titleRef.input.value = this.state.OneArticle.title;
            // this.setState({seted: true})
            this.seted=true;
        }
    }

    render() { 
        const {NewArticles} = this.props;
        const item = this.state.OneArticle;
        let eclass = this.state.editVisible
            ? ' articleOneEidt articleOneBox article'
            : 'articleOneBox article';
        const {id} = this.state;
        const current = store.session("news3Rcurrent") || 1;
        //const icons = this.getIcons(); const plugins = this.getPlugins();
        var platforms = [<img key={0} src="img/sina.png"/>,
            <img key={1} src="img/wx.png"/>,
            <img key={2} src="img/webnet.png"/>
        ];
        var _platform = [];
        var platformsValue = item.applyPlatform;
        if (platformsValue) {
            platformsValue.forEach(element => {
                _platform.push(platforms[element]);
            });
        } 
        var ContentEle = '';
        if (this.state.editVisible) {

            ContentEle = <div
                key={"edit"}
                className="articleOne__box articleOne__box__edit"    >
                    <div className="text-box" style={{padding: '10px 0'}}>
                      <Input  ref='titleRef'  />
                    </div>
                    <div className="uEidt" ref="editorElemtoobar" style={{lineHeight:'33px'}} >
                                        
                    </div>
                    <div className="textarea" style={{marginTop:0}}>
                        <div  ref="editorElem" style={{  paddingBottom: '40px' }}></div>

                    </div>
                </div>

                 
            
        } else {
            var allContent = '';
            if (item && item.title) {
                allContent = '<p class="title edit">' + item.title + '</p>' + item.content
            }
            ContentEle = <div  key={"read"} className="articleOne__box articleOne__box__read"  >
                <div
                    className="button"
                    onClick={this.toEdit}
                    style={{
                        position: 'relative',
                        zIndex: 999,
                        cursor:'pointer'
                    }}>
                    <span className="iconfont icon-edit"></span>
                </div>

                <div
                    className="article_content"
                    style={{
                        margin: '0 8px',
                        height:'auto'
                    }}>

                    <div
                        className="news3content left"
                        style={{float:'none'}}
                        dangerouslySetInnerHTML={{
                            __html: allContent
                        }}></div>
                </div>

            </div>
        }

        return (
            <div>
                
                    <NewsStep step={3} count={this.state.NewArticles && this.state.NewArticles.length}></NewsStep>
                
                <div className="content__box content__box__010">
                    <section className={eclass}>
                        <h3 className="title">文章生成</h3>

                        <div className="articleOne">
                            {/* <div
                                className="arr arr--left"
                                onClick={() => {
                                    this.toPrev(id)
                                }}>
                                <i className="iconfont icon-arr-l"></i>
                            </div> */}
                            <div className="broadcast">
                                <div className="top">
                                    <span
                                        className="return"
                                        style={{
                                            display: this.state.editVisible
                                                ? "none"
                                                : "inline-block"
                                        }}
                                        onClick={this.toNewArticles}>返回到列表</span>
                                    <span
                                        className="return"
                                        style={{
                                            display: this.state.editVisible
                                                ? "inline-block"
                                                : "none"
                                        }}
                                        onClick={this.toArticle}>返回到文章</span>
                                    <span className="count">共改写生成：{NewArticles.length}篇</span>
                                </div>
                                
                                {ContentEle}

                                <div className="bottom">
                                    <span>标题字数：{item && item.titleCount}</span>
                                    <span>总字数：{item && item.totalCount}</span>
                                    <span>段落数：{item && item.paragraphCount}</span>
                                    <span>图片：{item && item.imagesCount}</span>
                                    <span>适合媒体： {_platform}
                                    </span>
                                </div>
                            </div>
                            {/* <div
                                className="arr arr--right"
                                onClick={() => {
                                    this.toNext(id)
                                }}>
                                <i className="iconfont icon-arr-r"></i>
                            </div> */}
                        </div>

                        <div className="page">
                            <Pagination
                                size={"samll"}
                                current={current}
                                pageSize={1}
                                total={this.state.count}
                                onChange={this.onPageChange}/>
                        </div>
                    </section>

                    <div
                        className="btn-box"
                        style={{
                            display: this.state.editVisible
                                ? "none"
                                : "block"
                        }}>
                        <button
                            className="btn btn--blue"
                            style={{
                                marginRight: "30px"
                            }}
                            onClick={() => this.exportFile(0)}>导出
                        </button>
                        <button className="btn" onClick={() => this.exportFile(1)}>全部导出</button>
                    </div>
                    <div
                        className="btn-box"
                        style={{
                            display: this.state.editVisible
                                ? "block"
                                : "none"
                        }}>
                        <button
                            className="btn"
                            style={{
                                marginRight: "30px",
                                fontSize: "14px"
                            }}
                            onClick={() => this.saveNews(0)}>保存
                        </button>
                        <button
                            className="btn btn--grayblue"
                            style={{
                                marginRight: "30px",
                                fontSize: "14px"
                            }}
                            onClick={this.toArticle}>放弃修改
                        </button>
                        <button
                            className="btn"
                            style={{
                                marginRight: "30px",
                                fontSize: "14px"
                            }}
                            onClick={() => this.saveNews(1)}>保存并修改下一篇
                        </button>
                        <button className="btn btn--blue" onClick={() => this.exportFile(0)}>导出</button>
                    </div>

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

    return {OneArticle, NewArticles:NewArticlesWithid, count, OneGo}
}

export default connect(mapStateToProps)(News3R)
