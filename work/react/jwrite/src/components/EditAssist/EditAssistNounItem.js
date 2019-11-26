import React, {Component} from 'react'
import { Tooltip } from 'antd';
import '../../style/article_edit.css'
import '../../style/tab.css'
import moment from 'moment'
import $ from 'jquery'

/**
 * 编辑页-辅助内容列表条目(名词解释)
 */
export default class AssistNounItem extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handle = (index)=>{
        var item = this.props.data;
        this.props.insert(item.description,index);
    }
    render() { 
        var item = this.props.data;
        var index = this.props.index;
        var user = item.addUser;
        var time = item.addDateTime;
        //var eleCss = (user || time) ? 'item' : 'p-item item';
        var eleAdd = <span className="add-time"></span>;
        if(user || time)
        {
            var date = moment(time * 1000).format('YYYY-MM-DD HH:mm');
        eleAdd = <span className="add-time">添加时间：{date} {user &&<Tooltip title={'添加人：' + user}><span className="iconfont icon-ren"></span></Tooltip>}</span>;
        }
        var title = $.trim(item.name);
        var content = $.trim(item.description);
        var _index = index + 1;
        if(index > 998)
        {
            if((index +1)%1000 === 0)
            {
              _index = (index +1)/1000 + 'k'
            }else{
                _index = parseInt((index +1)/1000,10) + 'k+'
            }
            
        }
        return (
            <div className= 'item' tag = {index}>
                <div className="title-bar">
                    <h2  title = {title} style={{"textAlign":"left", "float":"none", "lineHeight":"24px",display: 'block',width: '80%'}}>
                        <span>{_index}</span>                        
                          {title}
                        </h2>
                        <div style={{display:'inline-block',verticalAlign: 'top',position:'absolute',top:'-5px',right:'5px'}}>
                         <button className="btn2" onClick={this.handle.bind(this,index)}
                            style={{  "marginTop":"0", "marginBottom":"10px"}}>
                        <span className="iconfont icon-cr"></span>
                        插入</button>
                        <span className="toggle unfold ">展开</span>
                    </div>
                     
                </div> 
                <div
                        className="p hotnews_text" 
                        tag = {index}
                        dangerouslySetInnerHTML={{
                            __html: content
                        }}></div>

                 <p className="source"  > {eleAdd}</p>
                
            </div>
        )
    }
}

 
