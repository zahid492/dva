import React, {Component, useState, useCallback, useMemo} from "react";
import {Row, Col, Table, Button, Spin, Form, Select, Input, Radio, DatePicker, message} from "antd";


import service from "../../services/request";
import Api from '../../services/api';
import useAsync from "../../hooks/useAsync";



const _ = window._;
const moment = window.moment;

const {Option} = Select;
const {RangePicker} = DatePicker;

class SearchFormV extends Component {

    disabledDate = (current) => {
        let oneYearAgo = moment().subtract(1, 'days').subtract(1, 'years');
        let yesterday = moment().subtract(1, 'days');
        return current > yesterday || current < oneYearAgo;
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            PlatForm,
            DateTimeType,
            TimeStartv,
            TimeEndv,
            AccountName,
        } = this.props;

        const dataRange = [TimeStartv, TimeEndv];


        return (
            <Form layout={"inline"}>
                <Form.Item label={"平台："}>
                    {getFieldDecorator("PlatForm", {
                        initialValue: PlatForm
                    })(
                        <Select
                            style={{width: "100px"}}
                            placeholder="请选择"
                        >
                            {
                                window.accountPlatForms && (["全部"].concat(window.accountPlatForms)).map(p => {
                                    console.log(p)
                                    return <Option value={p} key={p}>{p}</Option>
                                })
                            }
                        </Select>
                    )}
                </Form.Item>

                <Form.Item label={"统计方式："}>
                    {
                        getFieldDecorator("DateTimeType", {
                            initialValue: DateTimeType
                        })(
                            <Radio.Group>
                                <Radio value={0}>日</Radio>
                                <Radio value={1}>月</Radio>
                            </Radio.Group>
                        )
                    }
                </Form.Item>

                <Form.Item label={"时间："}>
                    {
                        getFieldDecorator("dateRange", {
                            initialValue: dataRange
                        })(
                            <RangePicker
                                allowClear={false}
                                disabledDate={this.disabledDate}
                                format={"YYYY-MM-DD"}
                            />
                        )
                    }
                </Form.Item>

                <Form.Item label={"账号："}>
                    {
                        getFieldDecorator("AccountName", {
                            initialValue: AccountName
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>

                <Form.Item>
                    <Button
                        size={"small"} type={"primary"}
                        onClick={() => {
                            this.props.search(this.props.form.getFieldsValue());
                            this.props.form.resetFields();
                        }}>查询</Button>
                </Form.Item>
            </Form>
        )
    }
}

const SearchForm = Form.create({
    name: "SearchForm",
})(SearchFormV);

const format = "YYYYMMDD";

export default function Account() {
    const yesterday = moment().subtract(1, 'days');

    const [searchObj, setSearchObj] = useState({
        PlatForm:"全部",
        StatisticsType: 0,
        DateTimeType: 0,
        TimeStartv: yesterday,
        TimeStart: yesterday.format(format),
        TimeEndv: yesterday,
        TimeEnd: yesterday.format(format),
        Page: 1,
        Size: 10,
    });

    const [list, setList] = useState([]);

    const [count, setCount] = useState(0);

    const search = (obj) => {
        setSearchObj({
            ...searchObj,
            PlatForm: obj.PlatForm,
            DateTimeType: obj.DateTimeType,
            TimeStartv: obj.dateRange[0],
            TimeStart: Number(obj.dateRange[0].format(format)),
            TimeEndv: obj.dateRange[1] || yesterday,
            TimeEnd: Number(obj.dateRange[1].format(format)),
            AccountName: obj.AccountName ? obj.AccountName.trim() : "",
        });

        console.log(searchObj)
    };

    const columns = [

        {
            title: "序号",
            dataIndex: "numbers"
        },
        {
            title: "日期",
            dataIndex: "date"
        },
        {
            title: "账号名",
            dataIndex: "accountName"
        },
        {
            title: "平台",
            dataIndex: "platForm"
        },

        {
            title: "文章数",
            dataIndex: "articleCnt"
        },

        {
            title: "阅读数",
            dataIndex: "readCnt"
        },

        {
            title: "平均阅读数",
            dataIndex: "avgReadCnt"
        },

        {
            title: "粉丝数",
            dataIndex: "fansCnt"
        },

        {
            title: "活跃天数",
            dataIndex: "activeCnt"
        },

    ];

    // 筛选，页码，条数改变时，更新账号列表
    const accountsObj = useAsync(async () => {

        const obj = _.omit({
            ...searchObj,
            PlatForm: searchObj.PlatForm === "全部" ? "" : searchObj.PlatForm,
        }, ['TimeStartv', 'TimeEndv']);

        const result = await service({
            url: Api.statistics_account,
            method: 'get',
            params: obj
        });

        if (result) {
            if (result.code === 200) {
                result.data.map(function (v, i) {
                    v.numbers = i + 1 + (searchObj.Page - 1) * searchObj.Size;
                    return v;
                });

                setList(result.data);
                setCount(result.count);
            }
        }

        return result;

    }, [searchObj]);

    const changePage = (page) => {
        setSearchObj({
            ...searchObj,
            Page: page
        })
    };

    const changeSize = (size) => {
        setSearchObj({
            ...searchObj,
            Size: size
        })
    };

    return useMemo(()=>(
        <>
            <Row>
                <Col span={24}>
                    <SearchForm search={search} {...searchObj} />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {
                        accountsObj.loading ?
                            <Spin/> :
                            <Table
                                size="middle"
                                rowKey={(record) => record.numbers}
                                columns={columns}
                                dataSource={list}
                                bordered
                                pagination={{
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                    current: searchObj.Page,
                                    defaultCurrent: 1,
                                    pageSize: searchObj.Size,
                                    pageSizeOptions: ['10', '15', '20'],
                                    total: count,
                                    showTotal: total => `共 ${total} 条`,
                                    onShowSizeChange: changeSize,
                                    onChange: changePage
                                }}

                            />
                    }
                </Col>
            </Row>
        </>

    ))
}
