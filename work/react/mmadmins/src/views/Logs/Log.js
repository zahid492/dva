// 日志 20191018
import React, {useState, useMemo, useCallback, useEffect} from "react";
import {useSelector, useDispatch, useStore, shallowEqual} from "react-redux";
import {Row, Col, Table, Pagination, Modal, Button, message, Spin} from "antd";
import * as action from "../../store/actions";
import {platform_act} from "../MyMedia/actions";
import {
    log_status_sel,
    log_type_sel,
    log_source_sel,
    log_list_sel,
} from "../../store/reducers/logs/forms_slector";
import {platform_list_sel} from "../MyMedia/selector";

import useAsync from "../../hooks/useAsync";
import LogTopForm from '../../components/LogTopForm';


const _ = window._;
const moment = window.moment;

function Log() {
    const dispatch = useDispatch();
    // 详情查看
    const [openDetail, setOpenDetail] = useState({
        flag: false,
        detail: ""
    });

    const format = "YYYY-MM-DD";

    const [sobj, setSobj] = useState({
        Page: 1,
        Size: 10,
        Key: "",
        Platform: "全部",
        TimeStart: "",
        TimeEnd: "",
        Status: "全部",
        From: "全部",
        LogType: "全部",
        count: 0,
    });

    const [formInit, setFormInit] = useState({
        ...sobj,
        FromDisable: true,
        TypeDisable: true,
    });

    const [logForm, setForm] = useState(null);

    const platform_list = useSelector(platform_list_sel);

    const log_status_list = useSelector(log_status_sel);

    const log_source_list = useSelector(log_source_sel);

    const log_type_list = useSelector(log_type_sel);

    const log_list_obj = useSelector(log_list_sel);

    useEffect(() => {
        dispatch(action.log_status.request());
    }, []);

    useEffect(() => {
        dispatch(action.log_source.request());
    }, []);

    useEffect(() => {
        dispatch(action.log_type.request());
    }, []);

    useEffect(() => {
        if(platform_list.length===0){
            dispatch(platform_act.request());
        }
    }, []);

    // 日志列表
    useEffect(() => {
            let fobj = (logForm && logForm.props) ? logForm.props.form.getFieldsValue() : {};

            let xobj = {};
            // 顶部表单筛选数据重构
            if (!_.isEmpty(fobj)) {
                xobj = {
                    Key: fobj.Key.trim(),
                    Platform: fobj.Platform === "全部" ? "" : fobj.Platform,
                    Status: fobj.Status === "全部" ? "" : Number(fobj.Status),
                    From: fobj.From === "全部" ? "" : Number(fobj.From),
                    LogType: fobj.LogType === "全部" ? "" : Number(fobj.LogType),
                    TimeStart: fobj.dateRange[0] !== "" ? fobj.dateRange[0].format(format) : "",
                    TimeEnd: fobj.dateRange[1] !== "" ? fobj.dateRange[1].format(format) : "",
                }
            }

            let obj = {
                ...sobj,
                // 默认 sobj 初始化数据
                Key: sobj.Key.trim(),
                Platform: sobj.Platform === "全部" ? "" : sobj.Platform,
                Status: sobj.Status === "全部" ? "" : Number(sobj.Status),
                From: sobj.From === "全部" ? "" : Number(sobj.From),
                LogType: sobj.LogType === "全部" ? "" : Number(sobj.LogType),
                // 表单筛选数据
                ...xobj,
            };

            if (log_source_list.length > 0
                && log_status_list.length > 0
                && log_type_list.length > 0) {
                dispatch(action.log_list.request(obj));
            }
        },
        // 拆开写，和直接对象是一样到，浅比较
        [
            sobj,
            log_status_list,
            log_source_list,
            log_type_list
        ]);


    // useUpdateEffect 要比 useEffect 少一次调用，mounted 的次数
    // 列表数据处理，用于和其他 ajax 筛选条件同步数据

    const submitForm = useCallback(() => {
        // console.log(logForm.props.form.getFieldsValue());
        let fobj = logForm.props.form.getFieldsValue();
        setSobj({
            ...sobj,
            ...fobj,
            TimeStart: fobj.dateRange[0] !== "" ? fobj.dateRange[0].format(format) : "",
            TimeEnd: fobj.dateRange[1] !== "" ? fobj.dateRange[1].format(format) : "",
        })

    }, [logForm]);

    const formProps = {
        // 不变到
        platform_list: platform_list,
        status_list: log_status_list,
        // 表单联动改变到
        source_list: log_source_list,
        type_list: log_type_list,
        // 结果值
        ...formInit,
        submitForm,
    };

    // 页码改变
    const changePage = useCallback((page) => {
        setSobj({
            ...sobj,
            Page: page
        });
    }, []);

    // 页面显示条数改变
    const changeSize = useCallback((_, size) => {
        setSobj({
            ...sobj,
            Size: size
        });
    }, []);

    const viewDetail = useCallback((record) => {
        setOpenDetail({
            flag: true,
            detail: record.detail
        });

    }, []);

    const closeDetail = useCallback(() => {
        setOpenDetail({
            flag: false,
            detail: ""
        });
    }, []);

    // ---表格构造---
    const columns = [
        {
            title: "序号",
            dataIndex: "index"
        },
        {
            title: "平台",
            dataIndex: "platform"
        },

        {
            title: "账号",
            dataIndex: "accountName"
        },
        {
            title: "文章标题",
            dataIndex: "title"
        },
        {
            title: "状态",
            dataIndex: "statusName"
        },
        {
            title: "来源",
            dataIndex: "sourceName"
        },
        {
            title: "日志类别",
            dataIndex: "typeName"
        }, {
            title: "时间",
            dataIndex: "logDtFormated"
        },

        {
            title: "操作",
            render: (text, record, index) => {
                let aProps = {
                    record,
                };
                return (
                    <div className={"operation"}>
                        <Button type="primary" size="small" onClick={() => viewDetail(record)}>查看详情</Button>
                    </div>
                )
            }
        },

    ];

    const Tbc = function () {
        let tdata = [...log_list_obj.data];
        // 序列号
        if (tdata.length > 0) {
            tdata = tdata.map((v, i) => {
                v.index = i + 1 + (sobj.Page - 1) * sobj.Size;
                return v;
            })
        }

        return (
            <Table
                size="middle"
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={tdata}
                bordered
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    current: sobj.Page,
                    defaultCurrent: 1,
                    pageSize: sobj.Size,
                    pageSizeOptions: ['10', '15', '20'],
                    // total: sobj.count,
                    total: log_list_obj.count,
                    showTotal: total => `共 ${total} 条`,
                    onShowSizeChange: changeSize,
                    onChange: changePage
                }}

            />
        )
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <LogTopForm
                        wrappedComponentRef={(form) => setForm(form)}
                        {...formProps}
                    />
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Tbc/>
                </Col>
            </Row>

            <Modal
                title="详情"
                visible={openDetail.flag}
                cancelText={""}
                onOk={closeDetail}
                onCancel={closeDetail}
                footer={[
                    <Button key="back" onClick={closeDetail}>关闭</Button>,
                ]}
            >
                <p>{openDetail.detail}</p>
            </Modal>
        </>
    )
}

export default Log