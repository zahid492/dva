import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import {Pagination,  message,Button} from 'antd';

import * as apiUrl from '@/services/ApiUrl';
import WriteItem from '@/components/Item/WriteItem';
import * as actions from "@/store/actions";
import store from "store2";
import qs from "qs";

import '@/style/article_list.css'

class WriteList extends Component {
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
    componentWillUnmount() {

    }

    exportFile = (m) => {

        if (m === 0 && _.size(this.state.checkedList) === 0) {
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
        }

        const token = store.get("accesstoken");
        let pss = qs.stringify(ps);
        let wopen = window.open(apiUrl.newArticlesUrl + 'export?accesstoken=' + token + "&" + pss);

        this.props.dispatch(actions.calculation.request({articleIds:this.state.checkedList}));
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


    };

    toPrevClick = () => {
        this.props.history.push("/write/writeinput/" + this.props.match.params.nid);
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

    addOne = () =>{
        let ArticleId  = this.props.match.params.nid;
        this.props.dispatch(actions.oneArticleHandle.request({
            handleType : 'copy',
            articleId: ArticleId,
            index: this.state.current,
            listtype: 1,
            applyplatform: this.state.applyplatform
        }));
    }
    deleteOne = (_id) =>{
        let ArticleId  = this.props.match.params.nid;
        this.props.dispatch(actions.oneArticleHandle.request({
            handleType : 'del',
            articleId: ArticleId,
            index: this.state.current,
            listtype: 1,
            applyplatform: this.state.applyplatform,
            newarticleId:_id
        }));
    }
    render() {        
        return (
            <div>

                {/* <NewsStep step={3} count={this.state.count}></NewsStep> */}

                <div className="content__box">
                    <section className="articleListBox article">
                        {/* <h3 className="title">文章生成</h3> */}
                        <div className="articleList">
                            <div className="top">
                                <span className="select" onClick={this.onCheckAll} style={{cursor: 'pointer'}}>全选</span>
                                <span className="select" onClick={this.onReverseCheck}
                                      style={{cursor: 'pointer'}}>反选</span>
                                <span className="count">共改写生成：{this.state.count}篇</span>
                            </div>
                            <ul className="list">
                                {this.state.NewArticles && Array.isArray(this.state.NewArticles) && this.state.NewArticles.map((item, i) => {
                                    let index = i + 1 + (this.state.current - 1) * apiUrl.NEWS_PAGESIZE;
                                    return (<WriteItem key={item._id}
                                                      sindex={index}
                                                      id={item._id}
                                                      current={apiUrl.NEWS_PAGESIZE * (this.state.current - 1) + i + 1}
                                                      checked={_.includes(this.state.checkedList, item._id)}
                                                      onCheck={this.onCheck}
                                                      item={item}
                                                      collectItem={this.collectItem}
                                                      index={i}
                                                      history={this.props.history}
                                                      del = {this.deleteOne}
                                                      ></WriteItem>)
                                })}
                                 
                            </ul>

                        </div>
                        <div style={{padding:'20px 0',textAlign: 'center'}}>
                            <Button icon="plus"  style={{width:120,borderRadius:'30px'}}   onClick={this.addOne.bind(this)}></Button> 
                        </div>
                        <div className="page">
                            <Pagination size={"samll"} current={this.state.current} pageSize={apiUrl.AD_PAGESIZE}
                                        total={this.state.count}
                                        onChange={this.onPageChange}/>
                        </div>

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

export default connect(mapStateToProps)(WriteList)

