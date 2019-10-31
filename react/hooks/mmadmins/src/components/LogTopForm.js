import React, {Component} from 'react';
import {Form, Select, Input, Button, Col, DatePicker} from "antd";


const {Option} = Select;
const {RangePicker} = DatePicker;
const _ = window._;
// todo 与父组件通信可以 context
class LogTopFormC extends Component {
    state = {
        Status: this.props.Status,
        From: this.props.From,
        types: this.props.type_list,
        FromDisable: true,
        TypeDisable: true,
    };

    changeStatus = (s) => {
        if (s !== "全部") {
            let nt = _.concat([{key: "全部", value: "全部"}],
                this.props.type_list.filter((item) => {
                if (s === item.key.substr(0, 1)) {
                    return true;
                }
                return false;
            }));

            this.setState({
                Status: s,
                types: nt,
                FromDisable: false,
            });
        } else {
            this.setState({
                Status: s,
                types: this.props.type_list,
                FromDisable: true,
                TypeDisable: true,
            });

        }

        this.props.form.setFieldsValue({
            From: "全部",
            LogType: "全部",
        });

    };

    changeFrom = (f) => {
        if (f !== "全部") {
            let nt = _.concat([{key: "全部", value: "全部"}],
                this.props.type_list.filter((item) => {
                if (this.state.Status === item.key.substr(0, 1)
                    && f === item.key.substr(1, 1)) {
                    return true;
                }
                return false;
            }));
            this.setState({
                From: f,
                types: nt,
                TypeDisable: false,
            })
        } else {
            let nt = _.concat([{key: "全部", value: "全部"}],this.state.types.filter((item) => {
                if (this.state.Status === item.key.substr(0, 1)) {
                    return true;
                }
                return false;
            }));

            this.setState({
                From: "全部",
                types: nt,
                FromDisable: false,
                TypeDisable: true,
            });
        }

        this.props.form.setFieldsValue({
            LogType: "全部",
        });

    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            platform_list,
            type_list,
            source_list,
            status_list,

            Platform,
            Status,
            From,
            LogType,
            TimeStart,
            TimeEnd,
            Key,

            FromDisable,
            TypeDisable,

            submitForm

        } = this.props;


        return (
            <>
                <Form layout={"inline"}>

                    <Form.Item
                        label={"平台："}
                        style={{width: 150}}
                    >{
                        getFieldDecorator("Platform", {
                            initialValue: Platform,
                        })(
                            <Select
                                style={{width: "100px"}}
                            >
                                {
                                    platform_list && platform_list.map(p => <Option key={p._id}
                                                                                    value={p.name}>{p.name}</Option>)
                                }
                            </Select>
                        )
                    }</Form.Item>

                    <Form.Item
                        label={"状态："}
                        style={{width: 150}}
                    >{
                        getFieldDecorator("Status", {
                            initialValue: Status,
                        })(
                            <Select
                                style={{width: "100px"}}
                                onChange={this.changeStatus}
                            >
                                {
                                    status_list && status_list.map(p => <Option key={p.key}
                                                                                value={p.key}>{p.value}</Option>)
                                }
                            </Select>
                        )
                    }</Form.Item>

                    <Form.Item
                        label={"来源："}
                        style={{width: 200}}
                    >{
                        getFieldDecorator("From", {
                            initialValue: From,
                        })(
                            <Select
                                disabled={this.state.FromDisable}
                                style={{width: "150px"}}
                                onChange={this.changeFrom}
                            >
                                {
                                    source_list && source_list.map(p => <Option key={p.key}
                                                                                value={p.key}>{p.value}</Option>)
                                }
                            </Select>
                        )
                    }</Form.Item>

                    <Form.Item
                        label={"类别："}
                        style={{width: 200}}
                    >{
                        getFieldDecorator("LogType", {
                            initialValue: LogType,
                        })(
                            <Select
                                disabled={this.state.TypeDisable}
                                style={{width: "150px"}}
                            >
                                {
                                    this.state.types && this.state.types.map(p => <Option key={p.key}
                                                                                          value={p.key}>{p.value}</Option>)
                                }
                            </Select>
                        )
                    }</Form.Item>

                    <Form.Item
                        label={"时间："}
                        style={{width: "270px"}}
                    >
                        {
                            getFieldDecorator("dateRange", {
                                initialValue: [TimeStart, TimeEnd]
                            })(
                                <RangePicker
                                    style={{width: "220px"}}
                                    allowClear={false}
                                    disabledDate={this.disabledDate}
                                    format={"YYYY-MM-DD"}
                                />
                            )
                        }
                    </Form.Item>

                    <Form.Item
                        label={"关键字："}
                        style={{width: 180}}
                    >
                        {
                            getFieldDecorator("Key", {
                                initialValue: Key
                            })(
                                <Input style={{width: "100px"}}/>
                            )
                        }
                    </Form.Item>

                    <Button type={"primary"}
                            htmlType={"submit"}
                            onClick={submitForm}
                    >查询</Button>
                </Form>
            </>
        )
    }
}

// 把更新操作放到父组件，联动更新的状态暂时不能同步，做成本地状态更新
const LogTopForm = Form.create({
    name: "LogTopForm",
    // onFieldsChange: (props, changedFields, allValues) => {
    //     props.changeSST(changedFields)
    // }
})(LogTopFormC);

export default LogTopForm;
