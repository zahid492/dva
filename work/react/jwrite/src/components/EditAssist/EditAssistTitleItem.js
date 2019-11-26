import React, {Component} from 'react' 
import $ from 'jquery'

/**
 * 编辑页-辅助内容列表条目(标题)
 */
export default class AssistTitleItem extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handle = (index)=>{
        var item = this.props.data;
        var title = item.suggestTitle ? item.suggestTitle : item.pattern;
        this.props.insert({title:title,id:item._id},index);
    }
    render() { 
        var item = this.props.data;
        var index = this.props.index;

        var content = $.trim(item.suggestTitle);
        if(!content)
        {
            content = $.trim(item.pattern);
        }
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
            <div className="item" tag = {index}>
                <div className="shuzi">{_index}</div>
                <button className="btn2 fr" onClick={this.handle.bind(this,index)}
                            style={{  "marginTop":"0", "marginBottom":"10px"}}>
                        <span className="iconfont icon-cr"></span>
                        添加</button>
                    <p
                        className="bt-text" 
                        title = {item.pattern}
                        dangerouslySetInnerHTML={{
                         __html: content
                        }}></p>
                 
            </div>
        )
    }
}
 
