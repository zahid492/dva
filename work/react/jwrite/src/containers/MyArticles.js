import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import {Pagination} from 'antd'; 
import * as apiUrl from '@/services/ApiUrl';
import MyItem from '@/components/Item/MyItem';
import * as actions from "@/store/actions"; 
import store from "store2";

import   '@/style/my_articleList.css'; 

class MyArticles extends Component {
    constructor(props) {
        super(props);

        let aType = [100,5,6,8];
        
        this.state = {
            MArticles: this.props.MArticles,
            count: this.props.count,
            current: 1,
            checkAll: false,
            checkedList: [], 
            aType:  aType, 
        };     
         

    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (_.size(prevState.MArticles) === 0 || prevState.current > 0) {

            return {
                MArticles: nextProps.MArticles,
                count: nextProps.count,
                current: prevState.current || 1, 
            };
        }

        return null;
    }

    onPageChange = (page) => {
        this.setState({
            current: page, 
        }, function () {
            this.props.dispatch(actions.loadMyArticles({index: page, listtype:1, ArticleTypes: this.state.aType}));
        });
    };

    changeAType = (v) => {
        if(v[0] == 0){
            v = [100,5,6,8]
        }
        this.setState({
            aType: v
        }, ()=>{
             this.onPageChange(1);
        })
    };

    componentDidUpdate() {
        // console.log(this.state)
    }

    componentDidMount() { 
        this.onPageChange(this.state.current); 
        this.props.dispatch(actions.Acticle_inGenerate({
            NewsGenerate: false
        }));
    }

    render() { 
         
        const hasArticles = _.size(this.state.MArticles)>0;
        
        var aType = this.state.aType;
        var liStyle = {
            display: 'inline-block',
            marginLeft: '20px',
            cursor:'pointer'
        }
        
        var liStyleCur = {
            display: 'inline-block',
            marginLeft: '20px',
            cursor:'pointer',
            borderBottom: '2px solid #fff',
            height:'100%'
        }
         var types = [];
        
            types.push(<span className="select" key={0} onClick = {()=>{this.changeAType([0]);}} style={aType.length > 1 ? liStyleCur : liStyle}>全部</span>);       
            types.push(<span className="select" key={8}  onClick = {()=>{this.changeAType([8]);}} style={aType[0] === 8 ? liStyleCur : liStyle}>文章撰写</span> );
            types.push(<span className="select" key={5}  onClick = {()=>{this.changeAType([5]);}} style={aType[0] === 5 ? liStyleCur : liStyle}>素材改编</span> );
            types.push(<span className="select" key={6}  onClick = {()=>{this.changeAType([6]);}} style={aType[0] === 6 ? liStyleCur : liStyle}>机器改编</span> );
        return (
            <div>         
                <div className="content__box" style={{marginTop: '0'}}>
                    <section className="articleListBox article my_articleListBox">                         
                        <div className="myArticle articleList">
                             <div className="top">
                                 {types}
                            </div> 
  
                            <ul className="list">
                                {this.state.MArticles && this.state.MArticles.map((item, i) => {
                                    return (<MyItem key={item.articleId}
                                                    index={i + 1 + (this.state.current - 1) * apiUrl.NEWS_PAGESIZE}
                                                    id={item.articleId}
                                                    item={item}
                                                    current={apiUrl.NEWS_PAGESIZE * (this.state.current - 1) + i + 1}
                                                    history={this.props.history}></MyItem>)
                                })}
                            </ul>

                        </div>
                        <div className="page" style={{display: hasArticles?"block":"none"}}>
                            <Pagination size={"samll"} current={this.state.current} pageSize={apiUrl.AD_PAGESIZE}
                                        total={this.state.count}
                                        onChange={this.onPageChange}/>
                        </div>

                    </section>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const {
        MArticles,
        count
    } = state.MyArticles4;

    return {
        MArticles,
        count
    }
}

export default connect(mapStateToProps)(MyArticles)

