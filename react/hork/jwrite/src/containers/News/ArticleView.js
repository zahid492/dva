import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import { Pagination,BackTop} from 'antd';

import * as apiUrl from '@/services/ApiUrl';
import store from "store2";
import * as actions from "@/store/actions";
import qs from "qs";
import $ from 'jquery';

import '@/style/article_produce.css'
import '@/style/toBottom.css'

class ArticleView extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            checked: false,
            count: this.props.count,
            //OneArticle: Object.assign({}, this.props.OneArticle),
            OneArticle: {},
            NewArticles: [],
            id: this.props.match.params.id
        }; 
        this.signed = 0; //预览页是否已经对文章添加对比 0 = 没有 1= 有
        this.articleId = store.session('articleId');
        this.modual = this.props.location.pathname.substring(1).split('/')[0];

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

    onPageChange = (page) => {
        //const aid = this.state.NewArticles[page - 1]._id;
        const aid = this.state.NewArticles[page - 1];

        this.props.history.push(`/${this.modual}/articleview/${aid}`);
        this.signed = 0;

        
        this.setState({
            id: aid,
            current: page,
            
        },   () => {
            this.signed = 0; 
            this.props.dispatch(actions.loadOneArticle({nid: this.articleId, id: aid}));
            // 传页数到编辑
            store.session('news3Rcurrent', page)
        });
    };

     
    
    toEdit = () => {
       this.props.history.push('/'+ this.modual +'/articleedit/' + this.state.id );
    };


    toNewArticles = () => {
         
        this.signed = 0;
         
        //const cid = _.findIndex(this.state.NewArticles, {_id: this.state.id}) + 1;
        //const cid = _.findIndex(this.state.NewArticles, this.state.id) + 1;
        var id = this.state.id;
        var NewArticles = this.props.NewArticles;
        const cid = NewArticles.findIndex(_id=>_id=== id) + 1;
        let page = _.ceil(cid / apiUrl.AD_PAGESIZE, 0) || 1;
        this.props.history.push('/' + this.modual + '/writelist/' + this.articleId + '/'  + page);
    };

    
    exportFile = (m) => {
        const token = store.get('accesstoken');
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
        window.open(apiUrl.newArticlesUrl + '/export?accesstoken=' + token + '&' + pss);
    };

    static getDerivedStateFromProps(nextProps, prevState) { 
         
        if (_.size(prevState.NewArticles) === 0 || _.isUndefined(prevState.OneArticle) || (prevState.OneArticle._id !== prevState.id) || prevState.id !== nextProps.id) {
            return {  
                count: nextProps.count,
                OneArticle: nextProps.OneArticle,
                NewArticles: nextProps.NewArticles,
                id: prevState.id
            };

        }
        return null;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {       
        return null;
    }
 

    componentDidMount() {
        this.btnTop();
        window.scrollTo(0,0)
        window.onscroll = this.btnTop;

    }

    componentDidUpdate() {
        this.signDiff();
        
    }

    componentWillUnmount(){ 
        
        this.signed = 0;
        
        this.props.dispatch(actions.oneArticle.clear());
    }
    goBottom = () => {
        var _height = document.getElementById('article').clientHeight;
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
    //次方法废弃
    restore = (oA)=>{ 
        var ele =  $(oA).closest('p');
        $(ele).removeClass('articledeletecontent');
        var txt = $(ele).find('s').html();
        $(ele).html('');
        $(ele).append(txt);
        const item = this.state.OneArticle; 
        var index = $(ele).index();
        $('.disContent').children().eq(index).removeClass('articledeletecontent');
        
        var initContent = $('.disContent').html();

        this.signed = 0; 
         this.props.dispatch(actions.editOneArticle.request({
            nid: this.articleId,
            id: this.state.id,
            title: item.title,
            content: initContent,
            m: 0
        })); 
    }
    //预览模式文章右侧加标注
    signDiff = () => {
        
        if (this.signed === 0) {
            var addEle = $('.news3content .articleaddcontent');
            if (addEle && addEle.length > 0) {
               
                var oi = document.createElement('i');
                var oem = document.createElement('em');
                oem.innerHTML = '添加内容';
                oi.appendChild(oem);
                $(addEle).prepend(oi);
                this.signed = 1;
            }

            var delEle = $('.news3content .articledeletecontent');
            if (delEle && delEle.length > 0) {
                $.each(delEle, (i, element) => {

                    var oSdel = document.createElement('s');
                    oSdel.innerHTML = $(element).text();
                    $(element).html(oSdel);
                    var oidel = document.createElement('i');
                    var oemdel = document.createElement('em');
                    oemdel.innerHTML = '删除内容';
                    oidel.appendChild(oemdel);

                    /* var oA = document.createElement('a');
                    oA.href = 'javascript:;';
                    oA.innerHTML = '恢复';
                    oA.onclick = ()=>{this.restore(oA)};
                    oemdel.appendChild(oA); */
                    $(element).prepend(oidel);
                })
                this.signed = 1;
            }
            var titleEle = $('.news3content .title');
            if (titleEle && titleEle.length > 0) {
                
                var oititle = document.createElement('i');
                var oemtitle = document.createElement('em');
                oemtitle.innerHTML = this.state.OneArticle.oriTitle.length > 20 ? this.state.OneArticle.oriTitle.substring(0,18) + '...' : this.state.OneArticle.oriTitle;
                oemtitle.title = this.state.OneArticle.oriTitle;
                oititle.appendChild(oemtitle);
                $(titleEle).prepend(oititle);
                this.signed = 1;
            }

         
        }
    }
    
     
    render() { 
        const {NewArticles} = this.props;
        const item = this.state.OneArticle;
         
        const current = store.session('news3Rcurrent') || 1;
        //const icons = this.getIcons(); const plugins = this.getPlugins();
        var platforms = [<img key={0} alt='' src='/img/sina.png'/>,
            <img key={1} alt='' src='/img/wx.png'/>,
            <img key={2} alt='' src='/img/webnet.png'/>
        ];
        var _platform = [];
        var platformsValue = item.applyPlatform;
        if (platformsValue) {
            platformsValue.forEach(element => {
                _platform.push(platforms[element]);
            });
        }

        var ContentEle = '';
        
            var allContent = '';
            if (item && item.title) {
                allContent = '<p class="title edit">' + item.title + '</p><div class="contentBox edit">' + item.content + '</div>';
            }
            ContentEle = <div  key={"read"} className="articleOne__box articleOne__box__read" style={{background:'#fff'}} >
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
                        margin: '0 8px 0 36px',
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
         

        return (
            <div>
                {/* this.state.tin === "wr" ?<ComposeStep step={3} count={this.state.count}></ComposeStep>: <NewsStep step={3} count={this.state.count}></NewsStep> */}
                 
                <div className="content__box">
                    <section className= 'articleOneBox article' style={{width:'1400px'}}>                       
                        <div className="articleOne" id="article">
                            {/* <div
                                className="arr arr--left"
                                onClick={() => {
                                    this.toPrev(id)
                                }}>
                                <i className="iconfont icon-arr-l"></i>
                            </div> */}
                            <div className="broadcast">
                                <div className="top">
                                    <span className="return"  onClick={this.toNewArticles}>返回到列表</span>
                                    
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

                    <div  className="btn-box" >
                        <button
                            className="btn_a btn-fh"
                            style={{
                                marginRight: "30px"
                            }}
                            onClick={() => this.exportFile(0)}>导出
                        </button>
                        <button className="btn-bc"  ref='submitBtn'  onClick={() => this.exportFile(1)}>全部导出</button>
                    </div>
                    <BackTop/>
                    <div className="ant-back-Bottom" ref='gotobottom' onClick={this.goBottom}>
                        <div className="ant-back-Bottom-content">
                            <div className="ant-back-Bottom-icon"></div>
                        </div>
                    </div>
                  {/*  <div style={{display:'none'}} className='disContent' dangerouslySetInnerHTML={{
                            __html: item.content
                        }}></div>
 */}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) { 
    const {NewArticlesWithid, count} = state.ArticleIds
    const OneArticle = state.OneArticle.one;
    
    return {OneArticle, NewArticles:NewArticlesWithid, count}
}

export default connect(mapStateToProps)(ArticleView)
