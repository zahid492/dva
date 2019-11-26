import React, {Component} from 'react'
import { Tooltip } from 'antd';
import '../../style/article_edit.css'
import '../../style/tab.css'
import moment from 'moment'

import Common from '../Common'

/**
 * 编辑页-辅助内容列表条目(图片)
 */
class AssistImgItem extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {

        return null;
    }

    componentDidMount(){
    }
    componentDidUpdate(prevProps, prevState, snapshot) {}
    handle = ()=>{
        var item = this.props.data;
        var index = this.props.index;
        this.props.insert('<img src= '+ window.IMAGE_ROOTS + item.path + ' index = '+ (index + 1) +' data-id=' + item.id + '  /><p style="text-align: center;">'+ item.name +'</p>');
    }
    setImg =()=>{
        var img = this.refs.imgref;
        Common.ScaleImg(img,200,120);
    }
    render() {
        var item = this.props.data;
        var index = this.props.index;
        var user = item.addUser;
        var eleCss = user
            ? 'item'
            : 'p-item item';
        var eleAdd = <p className="add-time-img"></p>;
         if (user) {
            var date = moment(item.addDateTime * 1000).format('YYYY-MM-DD HH:mm');
            eleAdd = <p className="add-time-img">添加时间：{date}
                &nbsp;&nbsp;<Tooltip title={'添加人：' + user}><span className="iconfont icon-ren"></span></Tooltip>
            </p>;
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
            <div className={eleCss} style={{ width: '50%',"float":'left',height:'240px' }}>
                <div className="title-bar">
                    <h2  title = {item.name}
                         style={{"textAlign":"left", "float":"none", "lineHeight":"24px",display: 'inline-block',width: '80%'}}> <span>{_index}</span>
                        {item.name ? (item.name.length > 8 ? item.name.substring(0,8) + '...' : item.name) : ''}
                         
                        </h2>
                    {/* <button className="btn2"  onClick={this.handle}
                            style={{  "marginTop":"0", "marginBottom":"10px"}}>
                        <span className="iconfont icon-cr"></span>
                        插入</button> */}
                </div>
                <div className="img">
                  <img src= {window.IMAGE_ROOTS + item.path} alt="" ref = 'imgref' className="hotnews_img change" onLoad={this.setImg} onClick={this.handle} />
                </div>
                {eleAdd}
        </div>
        )
    }
}

export default AssistImgItem