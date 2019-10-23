import React, {Component} from 'react'
import {Progress } from 'antd';
import store from "store2";
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash'; 
import { message } from 'antd';

class SeoItem extends Component {
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

 
    newsEdit = (current) => {

        store.session("news3Rcurrent", current)
        this.props.history.push("/seo/edit/" + this.props.id);
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
    
    render() {
        const {item,  current} = this.props;

        var platforms = [<img key={0} alt='' src="/img/sina.png"/>, <img key={1} alt='' src="/img/wx.png"/>,
            <img key={2} alt='' src="/img/webnet.png"/>];

        var _platform = [];
        var platformsValue = item.applyPlatform;
        if (platformsValue) {
            platformsValue.forEach(element => {
                _platform.push(platforms[element]);
            });
        }

        var modify = '';

        var mDate = item.modifyDateTime;
        var mUser = item.modifyUser;
        if (mDate && mDate > 0 && mUser) {
            mDate = moment(mDate * 1000);

            modify = <span><span>修改人：{mUser}</span><span>最后修改时间：{mDate.format('YYYY-MM-DD HH:mm')}</span></span>
        }

        let collectClass = classnames({
            iconfont: true,
            "icon-star": true,
            collect: item.collected===1
        });

        let collectLiBg = ()=>{
            if(item.collected===1){
                return <img className="sc" src="/img/shoucang.png" alt=""/>
            }
        };

        var title = item.title;
        let titleSplit = '$TT$';
        var _titles = title.split(titleSplit);
        if(_titles.length === 3)
        {      
            title =  _titles[2];    
        }
        let percent = item.finishScore;
        let ele_fresh = '';
        if((percent && percent <= 1) || percent === 0)
        {
            percent = parseInt(percent * 100,10);
            if(percent < 100)
            {
                ele_fresh =  <span className='change' onClick = {this.props.fresh}> <a>刷新</a> </span>
            }
        }
        let ele_status = <Progress percent={percent ? percent : 0} style={{width:'120px'}} status="active" />;
        let ele_edit = percent&&percent == 100 ?<i className="iconfont icon-edit change"  style={{"marginRight": "18px"}}  onClick={() => this.newsEdit(current)}></i> : '';

        return (
            <li className="list__item">
                {collectLiBg()}
                <div className="button">
                    <i className={collectClass} style={{"marginRight": "18px"}} ></i>
                    {ele_edit}                  
                </div>
                <div>
                    <span>
                         {/* <Checkbox checked={this.state.checked}
                                   onChange={this.onChange}
                                   ref={this.liRef}
                                   pid={id}>{sindex}</Checkbox> */}
                    </span>
                    <p className="title" style={{marginBottom: 0,cursor:'pointer',marginLeft: '43px'}}
                       onClick={() => {if(percent&&percent == 100){this.newsEdit(current)}else{message.info('文章正在生成中。。。')}}}>{title}</p>
                    <p className="content" dangerouslySetInnerHTML={{__html: item.content}}></p>
                </div>
                <div className="bottom">
                    <span>标题字数：{item.titleCount}</span>
                    <span>总字数：{item.totalCount}</span>
                    <span>段落数：{item.paragraphCount}</span>
                    <span>图片：{item.imagesCount}</span>
                    {modify}
                    <span>适合媒体： {_platform} </span>
                    <span className="process" style={{display:'inline-block',width:'200px'}}>稿件状态： {ele_status} </span>
                    {ele_fresh}

                   {/*  <span className="fr change3">{parseInt(item.differenceValue * 10000,10)/100 + '%'}</span> */}
                </div>
              
            </li>
        )
    }
}

export default SeoItem

