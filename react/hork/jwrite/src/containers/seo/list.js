import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import {Pagination,  message,Button} from 'antd';

import * as apiUrl from '@/services/ApiUrl';
import SeoItem from '@/components/Item/SeoItem';
import * as actions from "@/store/actions";
import store from "store2";
import qs from "qs";

import '@/style/article_list.css'

 
class seoList extends Component {
    constructor(props) {
        super(props);

        let pa = this.props.match.params.page || '1';
        var paltform = store.session('applyPlatform');
        if (paltform == null) {
            store.session('applyPlatform', -1);
            paltform = -1;
        }
        var current = parseInt(pa,10);
        this.state = {
            Article: this.props.Article,
            NewArticles: this.props.NewArticles,
            count: this.props.count,
            current: current,
            checkAll: false,
            checkedList: [],
            applyplatform: paltform,
        };
        this.timer = null;
        this.timerInterval = 3000;
        store.session('articleId', this.props.match.params.nid);

        //const cus = store.session("customer");
        this.props.dispatch(actions.newArticles.clear());
        this.props.dispatch(actions.loadNewArticles({
            ArticleId: this.props.match.params.nid,
            index: this.state.current,
            listtype: 1,
            applyplatform: paltform
        }));

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            Article: nextProps.Article,
            count: nextProps.count,
            current: prevState.current || 1,
            NewArticles:nextProps.NewArticles
        };
    }

    onPageChange = (page) => {
        this.setState({
            current: page,
        }, function () {
            this.props.dispatch(actions.loadNewArticles({
                ArticleId: this.props.match.params.nid,
                index: page,
                listtype: 1,
                applyplatform: this.state.applyplatform
            }));
        });
    };
    search = ()=>{
        this.props.dispatch(actions.loadNewArticles({
            ArticleId: this.props.match.params.nid,
            index: this.state.current,
            listtype: 1,
            applyplatform: this.state.applyplatform
        }));
    }
    onCheckAll = () => {
        this.setState({
            // checkAll: true,
            checkedList: this.props.NewArticles.map(function (v) {
                return v._id
            })
        })
    };

    onCheck = (e, ref, check) => {
        if (check) {
            this.setState({
                checkedList: _.concat(this.state.checkedList, [ref.current.props.pid])
            })
        } else {
            this.setState({
                checkedList: _.pull(_.concat([], this.state.checkedList), ref.current.props.pid)
            })
        }

    };

    onReverseCheck = () => {
        this.setState({
            checkedList: _.map(_.filter(this.props.NewArticles, (v) => {
                if (!_.includes(this.state.checkedList, v._id)) {
                    return true
                } else {
                    return false
                }
            }), (d) => (d._id))
        })
    };

    componentDidMount() {}

  componentDidUpdate (prevProps, prevState) {
            if(this.state.NewArticles.length > 0)
            {
                let pendingData = this.state.NewArticles && this.state.NewArticles.filter(article=>article.finishScore < 1);                
                if(pendingData && pendingData.length > 0)
                {
                    if(!this.timer)
                    {
                        this.timer = setInterval(this.search,this.timerInterval)
                    }
                   
                }else{
                    clearInterval(this.timer);
                }

            }
    }
componentWillUnmount(){
    clearInterval(this.timer);
}
    exportFile = () => {

        /* if (m === 0 && _.size(this.state.checkedList) === 0) {
            message.warning("请至少选择一个");
            return
        }

        let ps = {
            articleId: this.props.match.params.nid,
            ids: this.state.checkedList,
            Platform: this.state.applyplatform
        };
        if (m === 1) {
            ps.ids = [];
        } */
        let articles = this.state.NewArticles;
        if(articles.length === 0)
        {
            return;
        }
        if(articles[0].finishScore == 1)
        {
            let ps = {
                        articleId: this.props.match.params.nid,
                        ids:  [articles[0]._id],
                        Platform: this.state.applyplatform
                    };
                    const token = store.get("accesstoken");
                    let pss = qs.stringify(ps);
                    let wopen = window.open(apiUrl.newArticlesUrl + 'export?accesstoken=' + token + "&" + pss);

                    this.props.dispatch(actions.calculation.request({articleIds:[articles[0]._id] }));
                    let wi = window.setInterval(()=>{
                        if(wopen.closed === true){
                            this.props.dispatch(actions.loadNewArticles({
                                ArticleId: this.props.match.params.nid,
                                index: this.state.current,
                                listtype: 1,
                                applyplatform: this.state.applyplatform
                            }));

                            window.clearInterval(wi);
                        }
                    });
        }else{
            message.info('请等待服务完成后再操作！');
        }
        


    };

    toPrevClick = () => {
        this.props.history.push("/seo/input/" + this.props.match.params.nid);
    };
    // 收藏
    collectItem = (v) =>{
        let isCollected = v.collected === 0? 1: 0;
        this.props.dispatch(actions.collectOneArticle.request({
            disfrom:"writelist",
            id:v._id,
            isCollected: isCollected,
            from: "list",
            ArticleId: this.props.match.params.nid,
            nid: this.props.match.params.nid,
            index: this.state.current,
            listtype: 1,
            applyplatform: this.state.applyplatform
        }));
    };
   
    render() {        
        return (
            <div>

                {/* <NewsStep step={3} count={this.state.count}></NewsStep> */}

                <div className="content__box">
                    <section className="articleListBox article">
                        {/* <h3 className="title">文章生成</h3> */}
                        <div className="articleList">
                            <div className="top">
                                {/* <span className="select" onClick={this.onCheckAll} style={{cursor: 'pointer'}}>全选</span>
                                <span className="select" onClick={this.onReverseCheck}
                                      style={{cursor: 'pointer'}}>反选</span> */}
                                
                                <span className="count">共改写生成：{this.state.count}篇</span>
                                 
                            </div>
                            <ul className="list">
                                {this.state.NewArticles && Array.isArray(this.state.NewArticles) && this.state.NewArticles.map((item, i) => {
                                    let index = i + 1 + (this.state.current - 1) * apiUrl.NEWS_PAGESIZE;
                                    return (<SeoItem key={item._id}
                                                      sindex={index}
                                                      id={item._id}
                                                      current={apiUrl.NEWS_PAGESIZE * (this.state.current - 1) + i + 1}
                                                      fresh = {this.search}
                                                      item={item} 
                                                      index={i}
                                                      history={this.props.history} 
                                                      ></SeoItem>)
                                })}
                                 
                            </ul>

                        </div>
                         
                        {/* <div className="page">
                            <Pagination size={"samll"} current={this.state.current} pageSize={apiUrl.AD_PAGESIZE}
                                        total={this.state.count}
                                        onChange={this.onPageChange}/>
                        </div> */}

                    </section>
                    <div className="btn-box">
                        {/* <button className="btn" style={{
                            marginRight: "30px",
                            display:'inline-block'
                        }} onClick={this.toPrevClick}>返回
                        </button> */}

                        <button className="btn_a btn-fh" style={{marginRight: "30px"}}
                                onClick={() => this.exportFile(0)}>导出
                        </button>
                        {/* <button className="btn-bc" onClick={() => this.exportFile(1)}>全部导出</button> */}
                    </div>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const Article = state.UploadWord;
    const {
        NewArticles,
        count
    } = state.Articles3;
    return {
        Article,
        NewArticles,
        count
    }
}

export default connect(mapStateToProps)(seoList)

