import React, {Component} from 'react';
import {Input, Checkbox, Modal, message} from 'antd';
import md5 from 'md5'
import * as actions from "../actions";
import store from "store2";
import $ from 'jquery';
import _ from 'lodash';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uname: "",
            upwd: "",
        };
        this.loginCancel = props.loginCancel;
    }


    setTxt = (e, id) => {
        this.setState({
            [id]: e.target.value
        })
    };

    changeRemberPwd = (e) => {
        this.props.changeRem(e.target.checked)
    };

    loginRequest = (e) => {
        e.preventDefault();

        if ($.trim(this.state.uname).length === 0) {
            message.destroy()
            message.warning("请输入用户名");

            return;
        }

        if ($.trim(this.state.upwd).length === 0) {
            message.destroy()
            message.warning("请输入密码");
            return;
        }
        this.props.clearMsg();
        var uname = this.state.uname;
        var upwd = md5(this.state.upwd);

        this.props.dispatch(actions.login.request({
            uname,
            upwd
        }));
        store.local("_sys_username", this.state.uname);
        if (this.props.remberPwd) {
            
            store.local("_sys_user", this.state.upwd);
        } else {
            //store.local.remove("_sys_username");
            store.local.remove("_sys_user");
            this.setState({
                
                upwd:  ''
            })

        }


        
        

        // if (!this.props.remberPwd) {
        //     this.setState({
        //         uname: '',
        //         upwd: ''
        //     });
        // }
        
    };

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {
        let that = this;
        let uname = store.local("_sys_username");
        let upwd = store.local("_sys_user");
        this.setState({
            uname: uname ? uname : '',
            upwd: upwd ? upwd : ''
        })

        // 456
        $(window).keyup(function(e){
            if(e.keyCode===13){
                const Account = store.get("Account");
                if(_.isNil(Account)){

                    that.loginRequest(e);
                }

            }
        })
    }

    render() {
        return (
            <Modal
                width={450}
                closable={false}
                className="login login-contant"
                maskClosable={false}
                visible={this.props.loginVisible}
                onCancel={() => {
                    this.loginCancel()
                }}
                footer={null}
            >
                {/* <i className="iconfont icon-close" onClick={this.loginCancel}></i> */}
                <div className="login-logo">
                    <img src="/img/logo.png" alt=''/>
                </div>
                <ul className="login-M">
                    <li className="login_user">
                        <Input className="f-text"
                               placeholder="账号"
                               type="text"
                               value={this.state.uname}
                               onChange={(e) => {
                                   this.setTxt(e, 'uname');
                               }}
                        />

                    </li>
                    <li className="login_pass">
                        <Input className="f-text"
                               placeholder="密码"
                               type="password"
                               value={this.state.upwd}
                               onPressEnter={(e) => this.loginRequest(e)}
                               onChange={(e) => {
                                   this.setTxt(e, 'upwd');
                               }}
                        />
                    </li>
                    <li className="login-btn"><a onClick={(e) => this.loginRequest(e)}>登录</a></li>
                    <li className="login-forget">
                        <Checkbox id="RememberMe"
                                  name="RememberMe"
                                  type="checkbox"
                                  checked={this.props.remberPwd}
                                  onChange={this.changeRemberPwd}
                        >
                            <span>记住密码</span>
                        </Checkbox>

                    </li>
                </ul>
            </Modal>
        )
    }

}

export default Login

