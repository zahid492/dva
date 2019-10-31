import {Row, Col, Form, Input, Table, Button} from "antd";
import React, {Component} from "react";

const {TextArea} = Input;

class LangForm extends Component {

    tlPropertiesCols = [

        {
            title: "名称",
            dataIndex: "name",
            width: 50
        },
        {
            title: "类型",
            dataIndex: "name",
            width: 50,
            render: (text) => {

                if (text === 2) {
                    return "范围值"
                }

                if (text === 1) {
                    return "固定值"
                }

            }
        },
        {
            title: "属性",
            dataIndex: "name",
            width: 50
        },
        {
            title: "最小值",
            dataIndex: "name",
            width: 50
        },
        {
            title: "最大值",
            dataIndex: "name",
            width: 50
        },
        {
            title: "操作",
            width: 50,
            render: () => {
                return (
                    <Button>删除</Button>
                )
            }
        },
    ];

    render() {
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18}
        };

        const {getFieldDecorator} = this.props.form;

        const {tlProperties} = this.props;

        return (
            <Form layout="horizontal">
                <Form.Item label="语言名称："  {...formItemLayout} >
                    {
                        getFieldDecorator('name', {
                            initialValue: this.props.name,
                        })(<Input/>)
                    }
                </Form.Item>

                <Form.Item label="简介："  {...formItemLayout} >
                    {
                        getFieldDecorator("content", {
                            initialValue: this.props.content,
                        })(<TextArea />)
                    }
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({
    name: "LangForm",
})(LangForm)