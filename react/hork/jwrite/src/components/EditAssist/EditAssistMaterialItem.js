import React, {Component} from 'react'
import '../../style/article_edit.css'
import '../../style/tab.css'
import $ from 'jquery'

/**
 * 编辑页-辅助内容列表条目(首尾段等内文)
 */
class AssistMaterialItem extends Component {
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
        var eleCss = (user || time) ? 'item' : 'p-item item';
        /* var eleAdd = <p className="add-time"></p>;
         if(user || time)
        {
            var date = moment(time * 1000).format('YYYY-MM-DD HH:mm');
             eleAdd = <p className="add-time">添加时间：{date} {user &&<Tooltip title={'添加人：' + user}><span className="iconfont icon-ren"></span></Tooltip>}</p>;
        }  */
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
            <div className={eleCss} tag = {index}>
                <div className="title-bar">
                    <h2 style={{"textAlign":"left", "float":"none", "lineHeight":"24px",display: 'block',width: '80%'}}>
                        <span style={{top:'10px'}}>{_index}</span>
                    </h2>
                </div>
                <div
                        className="p hotnews_text Collectitem" 
                        tag = {index}
                        dangerouslySetInnerHTML={{
                            __html: content
                        }}></div>

                 
                <div style={{padding:'5px 0',textAlign:'left'}}>
                    { /*<span className="source" style={{display:'inline-block',bottom:0}} title={item.media} >文章来源：今日头条 <a href={item.url} target='_blank' ><span className="iconfont icon-link"></span></a></span> */}
                   {/*    文章来源  */}
                {   item.media  ? 
                   <span className="source" style={{display:'inline-block',bottom:0}} title={item.media} >文章来源：{$.trim(item.media).length > 6 ? $.trim(item.media).substring(0,6) : $.trim(item.media)} <a href={item.url} target='_blank' ><span className="iconfont icon-link"></span></a></span>
                    : '' 
                }               
                 { title  ? 
                   <span className="source" title={title} style={{display:'inline-block',bottom:0}}>标题：{title.length > 12 ? title.substring(0,10) + '...' : $.trim(item.title)}</span>
                    : ''
                } 
                </div>
                
                 <span style={{position: 'absolute',right: '5px', bottom: '5px'}}>
                         <button className="btn2" onClick={this.handle.bind(this,index)}
                            style={{  "marginTop":"0", "marginBottom":"10px"}} >
                        <span className="iconfont icon-cr"></span>
                        插入</button>
                        <span className="toggle unfold" id={item.url} extend = {item.extend}>展开</span>
                    </span>
            </div>
        )
    }
}

export default AssistMaterialItem
