import React, {Component} from 'react'
import classnames from 'classnames';
import {Menu, Dropdown} from 'antd';

import userManager from '../services/userManager'


class HeadUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dropdown: false,
            user: {}
        }
    }

    componentWillMount() {
        var _this = this;
        userManager.getUser().then((user) => {
            if (user) {
                _this.setState({
                    user: user.profile
                });
            }
        });
    }

    menuChange = (visible) => {
        this.setState({
            dropdown: visible
        })
    };

    render() {

        let iconDrop = classnames({
            "iconfont": true,
            "icon-down": !this.state.dropdown,
            "icon-up": this.state.dropdown,
        });

        const loginMenu = (
            <Menu className="logon__dropdown">
                <Menu.Item key="2" onClick={this.props.logoOut}>
                    <i className="iconfont icon-out"></i>
                    <a>退出登录</a>
                </Menu.Item>
            </Menu>
        );

        const loginBox = (
            <Dropdown
                overlay={loginMenu}
                onVisibleChange={this.menuChange}
                style={{"min-width": "160px"}}
            >
                <div className="login__box">
                    <strong>Hi</strong>
                    <span>{this.state.user.name}</span>
                    <i className={iconDrop}></i>
                </div>
            </Dropdown>
        );

        return (
            <div>
                <div className="login" id="login">
                    {loginBox}
                </div>
            </div>
        )
    }
}

export default HeadUser;

