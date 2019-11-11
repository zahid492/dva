import React, {Component} from 'react'
import '../../style/article_edit.css'
import '../../style/tab.css'
import $ from 'jquery';

/**
 * 编辑页-辅助内容-添加(通用)
 */
class AssistAddItem extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}
    save =()=>{ 
        var title = $.trim(this.refs.titleref.value);
        var content = $.trim(this.refs.contentref.value);
        var media = $.trim(this.refs.sourceref.value);
        var url = $.trim(this.refs.linkref.value);
        this.props.save({title,content,media,url});
    }
    render() {
         
        return (
            <div className="adding">
                <div className="title_box">
                    <input className="adding_title" type="text" placeholder="请输入标题"  ref='titleref'/><span className="star">*</span>
                </div>
                <div className="content_box">
                    <textarea placeholder="请输入文章内容" ref='contentref' ></textarea><span className="star">*</span>
                </div>
                <input className="adding_source" type="text" placeholder="请输入文章来源" ref='sourceref' />
                <input className="adding_url" type="text" placeholder="请输入文章URL"  ref='linkref' />
                <div className="adding_btn_box">
                    <button className="btn btn1 fl" onClick={this.save.bind(this)} >保存</button>
                    <button className="btn fr btn2 btn--grayblue" onClick={this.props.cancel}>取消</button>
                </div>
          </div>
        )
    }
}

export default AssistAddItem
