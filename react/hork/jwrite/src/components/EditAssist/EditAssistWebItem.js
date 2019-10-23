import React, {Component} from 'react'
import { Tooltip } from 'antd';
import '../../style/article_edit.css'
import '../../style/tab.css'
import moment from 'moment'
import $ from 'jquery'

class AssistItem extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handle = (index)=>{
        var item = this.props.data;
        this.props.insert(item.content,index);
    }
    render() { 
        var item = this.props.data;
        var index = this.props.index;
        var user = item.addUser;
        var time = item.addDateTime;
        var eleCss =  'p-item';
        var eleAdd = <p className="add-time"></p>;
        if(user || time)
        {
            var date = moment(time * 1000).format('YYYY-MM-DD HH:mm');
        eleAdd = <p className="add-time">添加时间：{date} {user &&<Tooltip title={'添加人：' + user}><span className="iconfont icon-ren"></span></Tooltip>}</p>;
        }
        var title = $.trim(item.title);
        var content = $.trim(item.content);
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
            <div className="p-item item" key = {index}>
                    <div className="title-bar">
                        <h2  style={{cursor:'pointer',paddingTop:0}} onClick={()=>{window.open(item.url)}}> 
                          <span className="mk-shuzi">{index + 1}</span> 
                          <p dangerouslySetInnerHTML={{   __html: title  }}></p>
                        </h2>                        
                    </div>

                    <p className="p" style={{textAlign:'left',overflow: 'hidden',fontSize: '12px',color: '#3c3c3c',width: '100%',lineHeight: '20px'}}
                         dangerouslySetInnerHTML={{
                            __html: content
                        }}></p>
                </div>

           /*  <div className={eleCss} tag = {index}>
                <div className="title-bar" style = {{cursor:'pointer'}} onClick={()=>{window.open(item.url)}} >
                    <h2  title = {title}  style={{"textAlign":"left", "float":"none", "lineHeight":"24px",display: 'block',width: '96%'}}>
                        <span>{_index}</span>
                       
                        <p dangerouslySetInnerHTML={{
                            __html: content
                        }}></p>
                        </h2>
                    
                </div> 
                <div
                        className="p hotnews_text Collectitem" 
                        tag = {index}
                        dangerouslySetInnerHTML={{
                            __html: content
                        }}></div>

                 
            </div> */
        )
    }
}

export default AssistItem
