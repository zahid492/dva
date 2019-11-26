import React, {Component} from 'react'
import {Checkbox,Progress} from 'antd';
import store from "store2";
import moment from 'moment';
import _ from 'lodash'; 

class ComposeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        store.session("news3Rcurrent", current)
        this.props.history.push("/compose/edit/" + this.props.id);
    };

    newsEdit = (current,item) => {
        store.session("news3Rcurrent", current)
        if(item.changeType == 'seo')
        {
          this.props.history.push("/compose/edit/" + item._id);
        }else{ 
          this.props.history.push("/compose/edit/" + item._id);
        }
        
    };

    collectItem = (item) => {
      this.props.collectItem(item);
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
    delete = ()=>{
        var item = this.props.item;
        this.props.del(item._id); 
    }
    render() {
        const {item, sindex, id, current} = this.props;       

        var modify = '';

        /* var mDate = item.modifyDateTime;
        var mUser = item.modifyUser;
        if (mDate && mDate > 0 && mUser) {
            mDate = moment(mDate * 1000);

            modify = <span><span>修改人：{mUser}</span><span>最后修改时间：{mDate.format('YYYY-MM-DD HH:mm')}</span></span>
        } */

        
        var title = item.title;
        let percent = item.finishScore;
        let ele_fresh = '';
        let ele_Progress = '';

        if((percent && percent <= 1) || percent === 0)
        {
            percent = parseInt(percent * 100,10);
            if(percent < 100)
            {
                ele_fresh =  <span className='change' onClick = {this.props.fresh}> <a>刷新</a> </span>
            }
        }
        let ele_status = <Progress percent={percent ? percent : 0} style={{width:'120px'}} status="active" />;
        let ele_edit = <i className="iconfont icon-edit change"  style={{"marginRight": "18px"}}  onClick={() => this.newsEdit(current,item)}></i>;
         
        let articleType = '原创稿';
        /* if(item.changeType == 'seo')
        {
            articleType = 'SEO改编稿';
            ele_Progress = <span className="process" style={{display:'inline-block',width:'200px'}}>稿件状态： {ele_status} </span>
            ele_edit = percent == 100 ?<i className="iconfont icon-edit change"  style={{"marginRight": "18px"}}  onClick={() => this.newsEdit(current,item)}></i> : '';
             

        }else if(item.changeType.toLowerCase() == 'struct')
        {
            articleType = '结构改编稿'          
        } */
        

        return (
            <li className="list__item"> 
                <div className="button"> 
                     {ele_edit}
                </div>
                <div>
                    <span>
                         <Checkbox checked={this.state.checked}
                                   onChange={this.onChange}
                                   ref={this.liRef}
                                   pid={id}>{sindex}</Checkbox>
                    </span>
                    <p className="title" style={{marginBottom: 0,cursor:'pointer'}} >{title}</p>
                    <p className="content" >
                       {item.content}
                    </p>
                </div>
                <div className="bottom">
                    <span style={{marginRight:'20px',color:'green'}}> {articleType}</span> 
                    <span>标题字数：{item.titleCount}</span> 
                    <span>段落数：{item.paragraphCount}</span> 
                    <span>图片数：{item.imagesCount}</span> 
                    {modify}  
                    {ele_Progress}
                    {ele_fresh}
                </div>
                
            </li>
        )
    }
}

export default ComposeItem

