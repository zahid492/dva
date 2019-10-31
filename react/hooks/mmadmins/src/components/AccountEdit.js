import {Form, Input, message, Modal, Select} from "antd";
import {TimerRange} from "./FormEl";
import React, {Component, useState, useEffect, useMemo} from "react";
import service from "../services/request";
import Api from "../services/api";

const _ = window._;
const moment = window.moment;
const format = 'HH:mm';
const {Option} = Select;

// 添加账号表单内部元素布局
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 14}
};

class AccountForm extends Component {
    state = {
        category: this.props.category,
        publishTypes: _.isArray(this.props.publishTypes) ? this.props.publishTypes.join(", ") : ""
    };

    changeCategory = (c) => {
        console.log(c)
        let atl = this.props.publish_type_list;
        if (c !== "全部") {
            let index = _.findIndex(atl, {name: c});
            if (index !== -1) {
                this.setState({
                    category: c,
                    publishTypes: _.isNil(atl[index].hotTopicTypes) ? "" : atl[index].hotTopicTypes.join(", ")
                })
            }
        } else {
            this.setState({
                category: c,
                publishTypes: ""
            })
        }
    };


    render() {

        const {getFieldDecorator} = this.props.form;

        const {
            name,
            platform,
            publishInterval,
            time,
            platform_list,
            publish_type_list,
        } = this.props;


        return (
            <Form layout="horizontal">

                <Form.Item
                    label="平台"
                    style={{width: "auto"}}
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator("platform", {
                            initialValue: platform,
                            normalize: (value) => {
                                this.setState({
                                    platform: value
                                });

                                return value;
                            }

                        })(
                            <Select
                                style={{width: "100%"}}
                            >
                                {
                                    platform_list && platform_list.map(p => {
                                        return <Option value={p.name} key={p._id}>{p.name}</Option>

                                    })
                                }
                            </Select>
                        )
                    }

                </Form.Item>

                <Form.Item label="账号名称："  {...formItemLayout} >
                    {
                        getFieldDecorator("name", {
                            initialValue: name,
                            rules: [
                                {
                                    required: true,
                                    message: "输入账号名称"
                                }
                            ]
                        })(<Input/>)
                    }

                </Form.Item>

                <Form.Item
                    label="账号分类"
                    style={{width: "auto"}}
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator("category", {
                            initialValue: this.state.category,

                        })(
                            <Select
                                onChange={this.changeCategory}
                                style={{width: "100%"}}
                            >
                                {
                                    publish_type_list && publish_type_list.map(p => {
                                        return <Option value={p.name} key={p._id}>{p.name}</Option>

                                    })
                                }
                            </Select>
                        )
                    }


                </Form.Item>

                <Form.Item
                    label="文章分类"
                    style={{width: "auto"}}
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator("publishTypes", {
                            initialValue: this.state.publishTypes,

                        })(
                            <Input disabled={true}/>
                        )
                    }

                </Form.Item>

                <Form.Item label="发布时段："  {...formItemLayout} >
                    {
                        getFieldDecorator("time", {
                            initialValue: time,

                        })(
                            <TimerRange
                                format={format}
                            />
                        )
                    }

                </Form.Item>

                <Form.Item
                    label="发布间隔"
                    style={{width: "auto"}}
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator("publishInterval", {
                            initialValue: publishInterval,

                        })(
                            <Select
                                style={{width: "120px"}}
                            >
                                {
                                    _.range(1, 25).map(p => {
                                        return <Option value={p} key={p}>{p}小时</Option>
                                    })
                                }
                            </Select>
                        )
                    }

                </Form.Item>

            </Form>
        )
    }
}

export default function AccountEdit(props) {
    const {
        record,
        accountModalVisable,
        setAccountModalVisable,
        setUpdate,
        platform_list,
        publish_type_list
    } = props;

    const innerForms = {
        platform_list,
        publish_type_list
    };

    // 表单到引用
    let ACForm = null;

    const initObjValue = {
        name: "",
        category: "",
        publishTypes: [],
        platform: "百家号",
        appId: "",
        appToken: "",
        cookie: "",
        publishInterval: "",

        time: {start: moment("00:00", format), end: moment("23:59", format)}
    };

    // 表单和时间的初值
    const [obj, setObj] = useState({
        ...initObjValue
    });

    // 编辑 id
    const [editId, setEditId] = useState("");

    // 用于更新 state 从 props.record，弹出可视标记刷新
    useEffect(() => {
        setObj({
            ...obj,
            ...record,
            time: {
                start: moment(record.timeStart || "00:00", format),
                end: moment(record.timeEnd || "23:59", format)
            }
        });

        setEditId(record._id);
    }, [accountModalVisable]);

    // 确认添加账号
    const accountModalOk = async () => {
        let url = editId !== "" ? Api.mymedia_account_put + "/" + editId : Api.mymedia_account_post;

        let vs = ACForm.props.form.getFieldsValue();

        console.log(vs)

        Promise.all([
            service({
                url: url,
                method: 'post',
                data: {
                    ...vs,
                    publishTypes: vs.publishTypes !== "" ? vs.publishTypes.split(", ") : [],
                    timeStart: vs.time.start.format(format),
                    timeEnd: vs.time.end.format(format),
                }
            }),
            service({
                method: "post",
                url: Api.mymedia_account_time + "/" + editId,
                data: {
                    startTime: vs.time.start.format(format),
                    endTime: vs.time.end.format(format),
                }
            }),
            service({
                method: "post",
                url: Api.mymedia_account_interval + "/" + editId,
                data: Number(vs.publishInterval)
            }),
        ]).then((res) => {
            message.success("保存成功");
            setUpdate(Math.random());
            accountModalCancel();
        }).catch(e => {
            message.info("保存失败")
        });
    };

    // 添加账号表单清除
    const clearAc = () => {
        setObj({
            ...initObjValue
        });
        ACForm = null;
    };

    // 取消添加账号
    const accountModalCancel = () => {
        setAccountModalVisable(false);
        clearAc();
    };

    // antd 表单组件创建
    const AccountFormW = Form.create({
        name: "AccountForm",
    })(AccountForm);

    return useMemo(() => (
        <Modal
            title="账号"
            visible={accountModalVisable}
            onOk={accountModalOk}
            onCancel={accountModalCancel}
        >
            <div>
                <AccountFormW wrappedComponentRef={(form) => ACForm = form}
                              {...innerForms}
                              {...obj} />
            </div>
        </Modal>
    ))
}