import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import { message } from 'antd';
import * as query from "@/services/Utils"
import * as apiUrl from '@/services/ApiUrl'; 
import ComposeItem from '@/components/Item/ComposeItem';
import * as actions from "@/store/actions";
import store from "store2";
import qs from "qs";

import '@/style/article_list.css'

class ComposeList extends Component {
    constructor(props) {
        super(props); 
        this.state = { 
            NewArticles: [],
            count: 0,
            current: 1,
            checkAll: false,
            checkedList: []
        };
        store.session('articleId', this.props.match.params.nid);
 

    }

    onPageChange = (page) => {
        this.setState({
            current: page,
        }, function () {
             let param = {
                    page : page,              
                    size : 10,  
                    parentId : this.props.match.params.nid
                }
             query.__request('get',apiUrl.apiStructArticleSecondListUrl,param,(res)=>{
                 this.setState({
                    NewArticles: res.data,
                    count:res.count
                 });
             })
        });
    };

    search = ()=>{
        let param = {
            page : this.state.current,              
            size : 10,  
            parentId : this.props.match.params.nid
        }
        query.__request('get',apiUrl.apiStructArticleSecondListUrl,param,(res)=>{
            this.setState({
                NewArticles: res.data,
                count:res.count
            });
        })
    }
    onCheckAll = () => {
        this.setState({
            // checkAll: true,
            checkedList: this.state.NewArticles.map(function (v) {
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
            checkedList: _.map(_.filter(this.state.NewArticles, (v) => {
                if (!_.includes(this.state.checkedList, v._id)) {
                    return true
                } else {
                    return false
                }
            }), (d) => (d._id))
        })
    };

    componentDidMount() {
        this.onPageChange(1);
    }
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
        let list = [];
        if(this.state.NewArticles.length > 0)
        {
            list = this.state.NewArticles.map((item, i) => {
                let index = i + 1 + (this.state.current - 1) * apiUrl.NEWS_PAGESIZE;
                return (<ComposeItem key={item._id}
                                  sindex={index}
                                  id={item._id}
                                  current={apiUrl.NEWS_PAGESIZE * (this.state.current - 1) + i + 1}
                                  checked={_.includes(this.state.checkedList, item._id)}
                                  onCheck={this.onCheck}
                                  item={item} 
                                  index={i}
                                  history={this.props.history} 
                                  fresh = {this.search}
                                  ></ComposeItem>)
            })
        }    
        return (
            <div>

                
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
                                {list }
                                 
                            </ul>

                        </div>                        

                    </section>
                    <div className="btn-box">
                         
                        {/* <button className="btn_a btn-fh" style={{marginRight: "30px"}}
                                onClick={() => this.exportFile(0)}>导出
                        </button> */} 
                    </div>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {

    return {}
}

export default connect(mapStateToProps)(ComposeList)

