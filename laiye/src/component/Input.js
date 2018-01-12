import {List, InputItem, WhiteSpace} from 'antd-mobile';
import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions'

class InputBox extends Component {

    handleChange = (val) => {
        this.props.dispatch(actions.getAllNews(val));
    };

    render() {
        return ( <div>
                <List>
                    <InputItem
                        onBlur={(val)=>{this.handleChange(val)}}
                    >输入关注词</InputItem>
                </List>
            </div>
        )
    }
}

InputBox.defaultProps = {};

export default connect()(InputBox)

