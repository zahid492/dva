import {Form, Input} from "antd";
import React, {Component} from "react";
import Button from "antd/lib/button";


class LangProperty extends Component {

    render() {
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14}
        };

        const {getFieldDecorator} = this.props.form;

        return (

            <Form layout="inline">
                <Form.Item label="属性名称：" >
                    {
                        getFieldDecorator('name', {
                            rules:[
                                {type:'string', message:"请输入字符串"}
                            ]
                        })(<Input
                            style={{width:"100px"}}/>)
                    }
                </Form.Item>

                <Form.Item label="最小值："  >
                    {
                        getFieldDecorator("pMix", {
                            normalize:(value)=>{
                                if(value<0){
                                    return 0;
                                }
                                return Number(value);
                            },
                            rules:[
                                {type:'number', message:"请输入数字"}
                            ]
                        })(<Input
                            type={"number"}
                            style={{width:"50px"}} />)
                    }
                </Form.Item>

                <Form.Item label="最大值：" >
                    {
                        getFieldDecorator("pMax", {
                            normalize:(value)=>{
                                if(value<0){
                                    return 0;
                                }
                                return Number(value);
                            },
                            rules:[
                                {type:'number', message:"请输入数字"}
                            ]
                        })(<Input
                            type={"number"}
                            style={{width:"50px"}}/>)
                    }
                </Form.Item>

                <Form.Item>
                    <Button
                        size={"small"} type={"primary"}
                        onClick={()=>{
                        this.props.addProperty(this.props.form.getFieldsValue());
                        this.props.form.resetFields();
                    }}>添加</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({
    name: "LangProperty",
})(LangProperty)