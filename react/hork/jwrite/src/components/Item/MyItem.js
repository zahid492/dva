import React, {Component} from 'react'
import * as apiUrl from "../../services/ApiUrl";
import store from "store2";
import qs from "qs";
import moment from 'moment';

class MyItem extends Component {

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    
    toNews3 = () => {
        

         if (this.props.item.type === 8) {
           this.props.history.push("/compose/list/" + this.props.id)
            return;
        }

        if (this.props.item.type === 5) {
            this.props.history.push("/write/list/" + this.props.id)
            return;
        }
        if (this.props.item.type === 6) {
            this.props.history.push("/seo/list/" + this.props.id)
            return;
        }
    };

 

    wordOut = (id) => {
        let ps = {articleId: id, ids: []};

        ps.Platform = -1;
        const token = store.get("accesstoken");
        let pss = qs.stringify(ps);
        window.open(apiUrl.newArticlesUrl + 'export?accesstoken=' + token + "&" + pss);
    };

    artlist = (item) => {
        let ele = '';
        switch(item.type)
        {
           case 1 :
            ele =  <div className="con ys-con">
                            <h3>
                                新闻改编
                            </h3>
        
                            <div>
                                <span>内容：<br/> 内容：</span>
                                <p>{item.title} </p>
                                <p style={{height:'21px'}}>{item.content} </p>
        
                            </div>
                        </div>
                break;
            case 3: ele = <div className="con ys-con">
                    <h3>借势传播</h3>
                    <div>
                        <div style={{"marginBottom": "5px"}}>
                            <span>标题：</span>
                            <p style={{textIndent: 'unset'}}>{item.title}</p>
                        </div>
                        <div>
                            <span>内容：</span>
                            <p style={{textIndent: 'unset',lineHeight:'21px',height:'21px'}}>{item.content}</p>
                        </div>
                    </div>
                </div>;
                break;
            case 5 : ele = <div className="con ys-con">
                        <h3>素材改编</h3>
                        <div>
                            <div style={{"marginBottom": "5px"}}>
                                <span>标题：</span>
                                <p style={{textIndent: 'unset'}}>{item.title}</p>
                            </div>
                            <div>
                                <span>内容：</span>
                                <p style={{textIndent: 'unset',lineHeight:'21px',height:'21px'}}>{item.content}</p>
                            </div>
                        </div>

                    </div>;
                    break;
            case 6: ele =     <div className="con ys-con">
                    <h3>
                        机器改编
                    </h3>

                    <div>
                        <span>内容：<br/> 内容：</span>
                        <p>{item.title} </p>
                        <p style={{height:'21px'}}>{item.content} </p>

                    </div>
                </div>
                break;
            case 7: ele = <div className="con ys-con">
                            <h3>评论维护</h3>
                            <div>
                                <div style={{"marginBottom": "5px"}}>
                                    <span>标题：</span>
                                    <p style={{textIndent: 'unset'}}>{item.title}</p>
                                </div>
                                <div>
                                    <span>内容：</span>
                                    <p style={{textIndent: 'unset',lineHeight:'21px',height:'21px'}}>{item.content}</p>
                                </div>
                            </div>
                        </div>;
                        break;
            case 8: ele = <div className="con ys-con">
                            <h3>文章撰写</h3>
                            <div>
                                <div style={{"marginBottom": "5px",minHeight:'25px'}}>
                                    <span>标题：</span>
                                    <p style={{textIndent: 'unset'}}>{item.title ? item.title: ' '}</p>
                                </div>
                                <div>
                                    <span>内容：</span>
                                    <p style={{textIndent: 'unset',lineHeight:'21px',height:'21px',width:'80%'}}>{item.content}</p>
                                </div>
                            </div>

                        </div>;
                    break;
            default : ele = <div className="con ys-con">
                        <h3>新闻改编</h3>
                        <div>
                            <div style={{"marginBottom": "5px"}}>
                                <span>标题：</span>
                                <p style={{textIndent: 'unset'}}>{item.title}</p>
                            </div>
                            <div>
                                <span>内容：</span>
                                <p style={{textIndent: 'unset',lineHeight:'21px',height:'21px'}}>{item.content}</p>
                            </div>
                        </div>

                    </div>
        }
         
     return ele;
         
        
    };

    render() {
        const {item} = this.props;

        return (
            <li className="list__item">
                <div className="button">

                    
                    <button className="btn_list" onClick={() => this.toNews3(item.type)}>文章列表</button>
                    <span
                        style={{width: '125px'}}>{moment(item.modifyDateTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                    <span>文章篇数：{item.count}</span>
                    {/* <i className="iconfont icon-download change" onClick={() => this.wordOut(item.articleId)}></i> */}
                </div>

                {this.artlist(item)}
            </li>
        )
    }
}

export default MyItem

