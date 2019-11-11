import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import {Pagination, Divider, message} from 'antd';
import NewsStep from '@/components/Step/NewsStep';
import ComposeStep from '@/components/Step/ComposeStep';
import * as apiUrl from '@/services/ApiUrl';
import NewsItem from '@/components/Item/NewsItem';
import * as actions from "@/store/actions";
import store from "store2";
import qs from "qs";

import '@/style/article_list.css'

class News3 extends Component {
    constructor(props) {
        super(props);

        let pa =  this.props.match.params.page  || '1';
        var paltform = store.session('applyPlatform');
        if(paltform == null)
        {
            store.session('applyPlatform',-1);
            paltform = -1;
        }
        this.state = {
            NewArticles: this.props.NewArticles,
            count: this.props.count,
            current: parseInt(pa),
            checkAll: false,
            checkedList: [],
            type: this.props.match.params.tin,
            applyplatform:paltform,
            NewsGenerate:props.Acticle_inGenerate.NewsGenerate
        };

        store.session('articleId', this.props.match.params.nid);


        /* this.props.dispatch(actions.loadNewArticles({nid: this.props.match.params.nid, 
                                                     index: this.state.current, 
                                                     listtype:1,
                                                     applyplatform:paltform})); */
        
        this.props.dispatch(actions.newArticles.clear());
        var param = {
            ArticleId: this.props.match.params.nid, 
            index: this.state.current, 
            listtype:1,
            applyplatform:paltform
        }
        this.props.dispatch(actions.loadNewArticles(param));
         
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.NewArticles!= nextProps.NewArticles || prevState.current != nextProps.current) {
            return {
                NewArticles: nextProps.NewArticles,
                count: nextProps.count,
                current: prevState.current || 1,
                //NewsGenerate:nextProps.Acticle_inGenerate.NewsGenerate
            };
        }

        return null;
    }

    onPageChange = (page) => {
        this.setState({
            current: page,
        }, function () {
            var param = {
                ArticleId: this.props.match.params.nid, 
                index: page, 
                listtype:1,
                applyplatform:this.state.applyplatform
            }
            this.props.dispatch(actions.loadNewArticles(param));
        });
    };
    
    loadData = (Plateformtype)=>{ 
        var paltform = store.session('applyPlatform');
        if(paltform == Plateformtype)
        {
            Plateformtype = -1;
        }
        this.setState({
            current: 1,
            applyplatform:Plateformtype
        }, function () {
            var param = {
                ArticleId: this.props.match.params.nid, 
                index: 1, 
                listtype:1,
                applyplatform:Plateformtype
            }

            store.session('applyPlatform',Plateformtype);
            this.props.dispatch(actions.loadNewArticles(param));
        });
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

    componentDidMount() {

    }

    exportFile = (m) => {

        if(m===0 && _.size(this.state.checkedList)===0){
            message.warning("请至少选择一个");
            return
        }

        let ps = {articleId: this.props.match.params.nid, ids:this.state.checkedList,Platform:this.state.applyplatform};
        if(m == 1)
        {
          ps.ids = [];
        }
        
        const token = store.get("accesstoken");
        let pss = qs.stringify(ps);
        window.open( apiUrl.newArticlesUrl+ 'export?accesstoken=' + token +"&"+ pss);
        //this.props.dispatch(actions.outWordArticles.request(ps));

    };
    toPrevClick = ()=>{ 
        this.props.history.push("/news2/" + this.props.match.params.nid + "/ar");
    }
    render() {
        //var _selectApplyplatformStyle =  '2px solid #fff';
        var _selectApplyplatformStyle =  {opacity:0.5};

        return (
            <div>
                 <NewsStep step={3} count={this.state.count}></NewsStep>
                <div className="content__box">
                    <section className="articleListBox article" style={{minHeight:'600px'}}>
                        <h3 className="title">文章生成</h3>
                        <div className="articleList">
                            <div className="top">
                                <span className="select" onClick={this.onCheckAll} style={{cursor:'pointer'}} >全选</span>
                                <span className="select" onClick={this.onReverseCheck} style={{cursor:'pointer'}} >反选</span>
                                <Divider type="vertical" />
                                <span className="select" onClick={()=>{this.loadData(0)}} style={{cursor:'pointer', marginLeft: '30px'}} ><img style = {this.state.applyplatform == 0 ? {}:_selectApplyplatformStyle} alt=''  src="img/weibotab.png"/></span>
                                <span className="select" onClick={()=>{this.loadData(1)}} style={{cursor:'pointer'}} ><img   style = {this.state.applyplatform == 1? {} : _selectApplyplatformStyle} alt=''  src="img/wechattab.png"/></span>
                                <span className="select" onClick={()=>{this.loadData(2)}} style={{cursor:'pointer'}} ><img   style = { this.state.applyplatform == 2? {} : _selectApplyplatformStyle} alt=''   src="img/webnettab.png"/></span>
                                {/* <span className="select" onClick={()=>{this.loadData(-1)}} style={{cursor:'pointer'}} ><span  style = { {display : 'inline-block',height: '33px',lineHeight: '33px',borderBottom: this.state.applyplatform == -1?_selectApplyplatformStyle:'none'}}  >全部</span></span>
                                  */}
                                 <span
                                    className="count">共改写生成：{this.state.count}篇</span> 
                            </div>
                            <ul className="list">
                                {this.state.NewArticles && Array.isArray(this.state.NewArticles) && this.state.NewArticles.map((item, i) => {
                                    let index = i+1+(this.state.current - 1) * apiUrl.NEWS_PAGESIZE;
                                    return (<NewsItem key={item._id}
                                                      type={this.state.type}
                                                      sindex={index}
                                                      id={item._id}
                                                      current={apiUrl.NEWS_PAGESIZE * (this.state.current - 1) + i + 1}
                                                      checked={_.includes(this.state.checkedList, item._id)}
                                                      onCheck={this.onCheck} item={item} index={i}
                                                      history={this.props.history}></NewsItem>)
                                })}
                            </ul>

                        </div>
                        <div className="page">
                            <Pagination size={"samll"} current={this.state.current} pageSize={apiUrl.AD_PAGESIZE}
                                        total={this.state.count}
                                        onChange={this.onPageChange}/>
                        </div>

                    </section>
                    <div className="btn-box">
                    {/* <button  className="btn" style={{marginRight: "30px",display:this.state.NewsGenerate ?'inline-block':'none'}} onClick={this.toPrevClick}>返回
                    </button> */}

                        <button className="btn btn--blue" style={{marginRight: "30px"}} onClick={()=>this.exportFile(0)}>导出
                        </button>
                        <button className="btn" onClick={()=>this.exportFile(1)}>全部导出</button>
                    </div>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const {
        NewArticles,
        count
        
    } = state.Articles3;
    const Acticle_inGenerate = state.Acticle_inGenerate;
    return {
        NewArticles,
        count,
        Acticle_inGenerate
    }
}

export default connect(mapStateToProps)(News3)

