import React, {Component} from 'react';
import {Form, Select, Input, Button, Col} from "antd";

const {Option} = Select;

// 添加账号表单内部元素布局
class AccountTopFormC extends Component {

    render() {

        const {getFieldDecorator} = this.props.form;
        const {platform_list, platform, openAccountModal, submitForm} = this.props;

        return (
            <Form layout={"inline"}>
                <Form.Item
                    label={"平台："}
                    style={{width:250}}
                >{
                    getFieldDecorator("platform", {
                        initialValue: platform,
                    })(
                        <Select
                            style={{width: "200px"}}
                        >
                            {
                                platform_list && platform_list.map(p => <Option key={p._id} value={p.name}>{p.name}</Option>)
                            }
                        </Select>
                    )
                }</Form.Item>

                <Button type={"primary"}
                        htmlType={"submit"}
                        onClick={submitForm}
                >查询</Button>

                <Button type="primary"
                        onClick={openAccountModal}
                        style={{display: "inline-block", marginLeft: "10px"}}
                >添加</Button>

            </Form>
        )
    }
}

const AccountTopForm = Form.create({
    name: "AccountTopForm"
})(AccountTopFormC);

export default AccountTopForm;