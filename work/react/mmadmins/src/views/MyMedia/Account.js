// 媒体账号管理 wsc 20190927
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {useSelector, useDispatch, useStore} from "react-redux";
// import classNames from 'classnames';
import {Row, Col, Table, Button, Spin, message} from 'antd';

import * as action from "../../store/actions/index";

import service from "../../services/request";
import Api from '../../services/api';
import useAsync from "../../hooks/useAsync";
import AccountStatus from '../../components/AccountStatus';
import AccountEdit from '../../components/AccountEdit';
import AccountTopForm from '../../components/AccountTopForm';
import './Account.css';

import {useInjectSaga} from "../../services/injectSaga";
import {useInjectReducer} from "../../services/injectReducer";
import saga from './saga';
import {account_list_act, platform_act, publish_type_act} from "./actions";
import reducer from './reducer';

import {
    account_list_sel,
    publish_type_sel,
    platform_list_sel
} from "./selector";


const _ = window._;

export default function MediaAccount() {

    useInjectSaga({key: 'MediaAccount', saga: saga});
    useInjectReducer({key: 'MediaAccount', reducer: reducer});

    // 分页要素
    const [pg, setPg] = useState({
        page: 1,
        size: 10,
    });

    // 平台账号列表
    const [editRecord, setEditRecord] = useState({});
    const [update, setUpdate] = useState(0);
    const [sobj, setSobj] = useState({
        platform: "全部",
        key: "",
        status: -1,
        normal: -1,
    });

    // 添加账号弹窗显示标记
    const [accountModalVisable, setAccountModalVisable] = useState(false);

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
            title: "状态",
            dataIndex: "status"
        },
        {
            title: "账号",
            dataIndex: "name"
        },
        {
            title: "分类",
            dataIndex: "category"
        },
        {
            title: "可发布文章",
            dataIndex: "publishTypes",
            render: (text, record, index) => {
                if (_.isNil(text)) {
                    return ""
                }

                return text.join(", ")
            }
        },
        {
            title: "发布间隔",
            dataIndex: "publishInterval",
            render: function (text) {
                if (text === 0) {
                    return text;
                } else if (text === undefined) {
                    return 0;
                }
                return text + '小时'
            }
        },
        {
            title: "发布时间段",
            render: (text, record, index) => {
                return <span id={`T${record._id}`}>{record.timeStart}-{record.timeEnd}</span>
            }
        },
        {
            title: "操作",
            render: (text, record, index) => {
                let aProps = {
                    record,
                    accounts: account_list.data
                };

                return (
                    <div className={"operation"}>
                        <Button type="primary" size="small" onClick={() => editAccount(record)}>编辑</Button>

                        <AccountStatus
                            url={Api.hotnews_account_putStatus}
                            field={"status"}
                            on={"启用"}
                            off={"禁用"}
                            {...aProps} />

                        <AccountStatus
                            url={Api.hotnews_account_putpublish}
                            field={"enablePublish"}
                            on={"自动发布"}
                            off={"停止发布"}
                            {...aProps} />
                    </div>
                )
            }
        },

    ];

    // 页码改变
    const changePage = (page) => {
        setPg({
            ...pg,
            page
        });
    };

    // 页面显示条数改变
    const changeSize = (_, size) => {
        setPg({
            ...pg,
            size
        });
    };

    const dispatch = useDispatch();

    const publish_type_list = useSelector(publish_type_sel);
    const platform_list = useSelector(platform_list_sel);
    const account_list = useSelector(account_list_sel);

    useEffect(() => {
        if (platform_list && platform_list.length === 0) {
            dispatch(platform_act.request());
        }
    }, []);

    // 发布类型
    useEffect(() => {
        if (publish_type_list && publish_type_list.length === 0) {
            dispatch(publish_type_act.request());
        }
    }, []);

    // 筛选，页码，条数改变时，更新账号列表
    useEffect(() => {

        const searchObj = {
            page: pg.page,
            size: pg.size,
            ...sobj,
            platform: sobj.platform === "全部" ? "" : sobj.platform
        };

        dispatch(account_list_act.request(searchObj));

    }, [pg.page, pg.size, sobj, update]);


    // 打开添加账号弹窗
    const openAccountModal = () => {
        setAccountModalVisable(true);
    };

    const editAcProps = {
        accountModalVisable,
        setAccountModalVisable,
        setUpdate,
        platform_list,
        publish_type_list
    };

    const editAccount = (record) => {
        setEditRecord(record);
        openAccountModal();
    };

    let ACForm = null;
    // dispatch
    const submitForm = function () {
        setSobj({...sobj, ...ACForm.props.form.getFieldsValue()})
    };

    // 注入到 top form 的 props
    const topSearchProps = {
        openAccountModal,
        submitForm,
        platform_list,
    };

    const Tbc = function () {

        let tdata = [...account_list.data];

        if (tdata.length > 0) {
            tdata = tdata.map((v, i) => {
                v.index = 1 + i + (pg.page - 1) * pg.size;
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
                    current: pg.page,
                    defaultCurrent: 1,
                    pageSize: pg.size,
                    pageSizeOptions: ['10', '15', '20'],
                    total: account_list.count,
                    showTotal: total => `共 ${total} 条`,
                    onShowSizeChange: changeSize,
                    onChange: changePage
                }}

            />
        )
    }

    // 页面布局
    return useMemo(() => (
        <>
            <Row gutter={16} className={"top-divider"}>
                <Col span={20}>
                    <AccountTopForm
                        wrappedComponentRef={(form) => ACForm = form}

                        {...sobj}
                        {...topSearchProps}
                    />
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Tbc/>
                </Col>
            </Row>

            <AccountEdit record={editRecord} {...editAcProps} />
        </>
    ));
}