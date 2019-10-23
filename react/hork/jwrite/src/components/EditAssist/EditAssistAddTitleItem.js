import React, {Component} from 'react'
import '../../style/article_edit.css'
import '../../style/tab.css'
import $ from 'jquery';

/**
 * 编辑页-辅助内容-添加标题
 */
class AssistAddTitleItem extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}
    save =()=>{ 
        var title = $.trim(this.refs.titleref.value);       
        this.props.save({title});
    }
    render() {
         
        return (
            <div className="adding">
                <div className="title_box">
                    <input className="adding_title" type="text" placeholder="请输入标题"  ref='titleref'/><span className="star">*</span>
                </div>              
                <div className="adding_btn_box">
                    <button className="btn btn1 fl" style={{marginLeft:'20%'}} onClick={this.save.bind(this)} >保存</button>
                    <button className="btn fr btn2 btn--grayblue"  style={{marginRight:'20%'}}  onClick={this.props.cancel}>取消</button>
                </div>
          </div>
        )
    }
}

export default AssistAddTitleItem
