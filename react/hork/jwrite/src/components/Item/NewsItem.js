import React, {Component} from 'react'
import {Checkbox} from 'antd';
import store from "store2"; 

class NewsItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            checked: this.props.checked,
            sindex: this.props.sindex
        };

        this.liRef = React.createRef();
    }

    onChange = (e) => {
        this.setState({
            checked: e.target.checked,
        });

        this.props.onCheck(e, this.liRef, e.target.checked)
    };

    newsRead = (current) => {
        store.session('News3editVisible', false);
        store.session("news3Rcurrent", current)
        this.props.history.push("/news/news3r/" + this.props.id );
    };

    newsEdit = (current) => {
        store.session('News3editVisible', true);
        store.session("news3Rcurrent", current)
        this.props.history.push("/news/news3r/" + this.props.id);
    };

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.checked !== this.props.checked) {
            return true;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (snapshot !== null) {
            this.setState({
                checked: this.props.checked,
            });
        }
    }

    render() {
        const {item, sindex, id, current} = this.props;
        var platforms = [<img key={0} src="img/sina.png"/>,<img key={1}  src="img/wx.png"/>,<img  key={2} src="img/webnet.png"/>];
        var _platform = [];
        var platformsValue = item.applyPlatform;
        if(platformsValue)
        {
            platformsValue.forEach(element =>{
                _platform.push(platforms[element]);
            });
        }
        var title = item.title;
        let titleSplit = '$TT$';
        var _titles = title.split(titleSplit);
        if(_titles.length === 3)
        {      
            title =  _titles[2];    
        }
        return (
            <li className="list__item">
                                    <div className="button"> 
                                        <i className="iconfont icon-edit" style={{cursor:'pointer'}} onClick={()=>this.newsEdit(current)}></i>
                                    </div>
                                    <div>
                                        <span style={{    display: 'inline-block',verticalAlign: 'top'}}>
                                        <Checkbox checked={this.state.checked} onChange={this.onChange} ref={this.liRef}   pid={id}>{sindex}</Checkbox>
                                             
                                        </span>
                                        <p className="title" style={{display: 'inline-block',width: '90%','textIndent':'unset',cursor:'pointer',textAlign: 'left'}}  onClick={()=>this.newsRead(current)}>{title}</p>
                                        <div className="content" style={{textIndent:'unset'}} dangerouslySetInnerHTML={{__html:item.content}}></div>
                                    </div>
                                    <div className="bottom">
                                        <span>标题字数：{item.titleCount}</span>
                                        <span>总字数：{item.totalCount}</span>
                                        <span>段落数：{item.paragraphCount}</span>
                                        <span>图片：{item.imagesCount}</span>
                                        <span>适合媒体： {_platform} </span>                                       
                                    </div>
                                    
                                </li>

             
        )
    }
}

export default NewsItem

