import React from 'react';
import {Icon} from 'antd'
import $ from 'jquery'
import {connect} from 'react-redux';
import Common from '@/components/Common'

class TitlesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { }; 
    }
    show = () => { 
        var v = this.props.visible;
        this.props.show(!v);
    }   
    componentDidMount() {
         
        var _this = this;
        Common.addEvent(window,'resize',() => {
            var itemWidth = _this.getItwmWidth();
            $('.recommend_card_title .recommend_list .item').css({
                width: itemWidth + 'px'
            }); 
            var left = $('.recommend_card_title .recommend_card .recommend_list').css('left');
            left = parseInt(left, 10);
            var leftCount = parseInt(left * -1 / itemWidth + 0.5, 10);
            left = leftCount * itemWidth * -1;
        
            $('.recommend_card_title .recommend_card .recommend_list').css({left:left + 'px'});
            
        });
        
        this.setEvent();
    }
 
    componentDidUpdate() { 
        
    }
    

    getItwmWidth = () =>{
        var screenWidth = window.document.body.offsetWidth;
        /**
         * 内容宽度： 屏幕宽 * 98%
         * 左侧内容宽度： 内容宽度 * 58%
         * 去掉padding: 左侧内容宽度 - 40
         * 每一个item占 1/3 ：  * 32.5% (每条之间有空白margin，所以没用33%)
         */
        //var itemWidth = (((screenWidth * 98 * 58) / 10000 - 80) * 330) / 1000;
        var itemWidth = (((screenWidth * 98 * 58) / 10000 - 10) * 325) / 1000;

        return itemWidth;
    }
    setEvent = () => {     
         
            //向左按钮
            $('.recommend_card_title .t-right').click(() => {
                var count = $('.recommend_card_title .recommend_card .recommend_list .item').length;
                 if (count > 3) { //一屏显示3条，不到3条滚动没有意义
                    var itemWidth = this.getItwmWidth();     
                    var left = $('.recommend_card_title .recommend_card .recommend_list').css('left');
                    left = parseInt(left, 10);
                    var leftCount = parseInt(left * -1 / itemWidth + 0.5, 10);
                    left = leftCount * itemWidth * -1;
                    var _left = left;
                    //总的数量减去已经滚到左边看不见的数量，还要大于当前展示的数量3，才继续去滚动
                    if (count - leftCount > 3) {
                        //右侧还有大于3条数据没有展示，向左移动3条的宽度
                        if (count - leftCount > 6) {
                            _left = left - (itemWidth * 3);
                        } else {
                            //右侧还有不到3条数据没有展示，向左移动剩余几条的宽度
                            _left = left - (itemWidth * (count - leftCount - 3));
                        }

                    }
                    $('.recommend_card_title .recommend_card .recommend_list').animate({
                        left: _left
                    }, 700)
                }

            });

            $('.recommend_card_title .t-left').click(() => {
                var count = $('.recommend_card_title .recommend_card .recommend_list .item').length;
                 if (count > 3) {
                    var itemWidth = this.getItwmWidth();  
                    var left = $('.recommend_card_title .recommend_card .recommend_list').css('left');
                    left = parseInt(left, 10);
                    if (left < 0) {
                        var leftCount = parseInt(left * -1 / itemWidth + 0.5, 10);
                        left = leftCount * itemWidth * -1;
                        var _left = left;
                        if (leftCount > 3) {
                            _left = left + (itemWidth * 3);
                        } else {
                            _left = left + (itemWidth * leftCount);
                        }

                    } else {
                        _left = 0;
                    }
                    $('.recommend_card_title .recommend_card .recommend_list').animate({
                        left: _left
                    }, 700)
                }
            }); 
         

    }

    replaceEditorContent = (item) => {
        this.props.fun(item);
    }
    render() {
        const _this = this;
        const {visible} = this.props;
         
        var caretEle = <Icon type="caret-up"/>;
        if (!visible) {
            caretEle = <Icon type="caret-down"/>
        }
      
        var itemWidth =  this.getItwmWidth();

        var data = this.props.ActileProviderTitlesData
        var ele = [];
        if (data) {
            ele = data.map((element, index) => {
                return <li className="item" key={index} style={{width:itemWidth + 'px'}}>
                    <div className="recommend_title">
                        <span>{index + 1}</span> 
                    </div>
                    <div className="recommend_text" title={element.title}>
                        <p className="text" style={{textIndent:'2em',marginTop:'5px'}}>
                            {element.title.length < 60 ? element.title : element.title.substring(0, 60) + '...'}
                        </p>
                    </div>
                    <div className="recommend_label">
                        <button
                            className="btn2"
                            onClick={_this
                            .replaceEditorContent
                            .bind(_this, element)}>
                            <span className="iconfont icon-cr"></span>&nbsp;&nbsp;替换</button>                        
                    </div>
                </li>
            });
        }

        return (
            <div className={"recommend_card_title"} style={{padding:'0 22px'}}>
                <div
                    className="recommend_card"
                    style={{
                    display: visible
                        ? 'block'
                        : 'none'
                }}>
                    <ul className="recommend_list">
                        {ele}
                    </ul>
                    <div className="t-left">
                        <Icon type="left"/>
                    </div>
                    <div className="t-right">
                        <Icon type="right"/>
                    </div>
                </div>
                <div className="recommend_tuijian change" onClick={this.show}>
                    <span
                        style={{
                        marginRight: '10px'
                    }}>标题推荐</span>
                    {caretEle}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const ActileProviderTitlesData = state.ActileProviderTitlesData;

    return {ActileProviderTitlesData}
}

export default connect(mapStateToProps)(TitlesPanel)
