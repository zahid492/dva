import React, {Component} from 'react';
import {Row, Col, Table, Button, Spin, Modal, Form, Select, Input, message} from 'antd';
import service from "../../services/request";
import Api from '../../services/api';

import LangForm from '../../components/TplLangForm';
import LangProperty from '../../components/TplLangProperty';


const _ = window._;
const {TextArea} = Input;

// todo 属性空值
export default class TplLang extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tplModalFlag: false,

            langList: [],
            page: 1,
            size: 10,
            count: 0,

            lmData: {
                _id: 0,
                name: "",
                content: "",
                tlProperties: []
            },

            // tlProperties
            mpData: {
                name: "",
                pType: "",
                pValue: "",
                pMix: 0,
                pMax: 0,
            },
        };

        this.langCols = [

            {
                title: "名称",
                dataIndex: "name",
                width: 200
            },
            {
                title: "简介",
                dataIndex: "content",
                width: 400,
                render: (text) => {
                    let cts = text.split("\n");
                    return (
                        <div>
                            {
                                cts.map((v, i) => {
                                    return (
                                        <p key={i}>{v}</p>
                                    )
                                })
                            }
                        </div>
                    )
                }
            },
            {
                title: "属性",
                dataIndex: "tlProperties",
                width: 150,
                render: (text, record, index) => {

                    return (
                        <>
                            {
                                text && text.map((t, i) => {
                                    if (t.pType === 1) {
                                        return <p key={i}>{t.name + ' : ' + t.pValue}</p>;
                                    } else if (t.pType === 2) {
                                        return <p key={i}>{t.name + ' : (' + t.pMix + ' , ' + t.pMax + ')'}</p>;
                                    }
                                    return <p key={i}>{t.name}</p>
                                })
                            }
                        </>
                    )
                }
            },
            {
                title: "操作",
                width: 100,
                render: (text, record, index) => {
                    return (
                        <div className={"operation"}>
                            <Button type="primary" size="small"
                                    onClick={() => this.openEditLang(record)}>编辑</Button>
                            <Button type="primary" size="small"
                                    onClick={() => this.deleteLang(record)}>删除</Button>
                        </div>
                    )
                }
            },
        ];

        this.lmEditFlag = false;
        this.langForm = null;
        this.langPropertyAddForm = null;
        this.tlPropertiesCols = [

            {
                title: "名称",
                dataIndex: "name",
                width: 150
            },
            {
                title: "类型",
                dataIndex: "pType",
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
                dataIndex: "pValue",
                width: 50
            },
            {
                title: "最小值",
                dataIndex: "pMix",
                width: 50
            },
            {
                title: "最大值",
                dataIndex: "pMax",
                width: 50
            },
            {
                title: "操作",
                width: 50,
                render: (text, record) => {
                    return (
                        <Button size={"small"}
                                type={"primary"}
                                onClick={() => this.delProperty(record)}
                        >删除</Button>
                    )
                }
            },
        ];
    }

    componentDidMount() {
        this.getLangList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    //---数据获取

    getLangList = () => {
        const {page, size} = this.state;
        service({
            url: Api.hotnews_tpl_list,
            method: 'get',
            params: {
                page: page,
                limit: size,
            }
        }).then((result) => {
            result.data = result.data.map((v, i) => {

                return v;
            });
            console.log(result)

            this.setState({
                langList: result.data,
                count: result.count
            })
        });
    };

    // ---列表操作
    openEditLang = (record) => {
        this.lmEditFlag = true;
        const nr = _.omit({...record}, ["addDateTime", "addUser", "lastUpdateDateTime", "lastUpdateUser", "score"]);
        this.setState({
            lmData: {
                ...nr
            }
        });
        this.openTplModal();
    };

    deleteLang = (record) => {
        service({
            url: Api.hotnews_tpl_del,
            method: 'post',
            headers: {
                post: {
                    "Content-Type": 'application/json',
                }
            },
            data: '"' + record._id + '"'
        }).then((result) => {
            this.getLangList();
        });
    };

    changeSize = (size) => {
        this.setState({
            size: size
        }, () => {
            this.getLangList();
        })
    };

    changePage = (page) => {
        this.setState({
            page: page
        }, () => {
            this.getLangList();
        })
    };


    // ---对话框
    openTplModal = () => {
        this.setState({
            tplModalFlag: true
        })
    };

    closeTplModal = () => {
        this.setState({
            tplModalFlag: false
        })
    };

    tplModalOk = () => {
        const formValues = this.langForm.props.form.getFieldsValue();

        this.setState({
            lmData: {
                ...this.state.lmData,
                content: formValues.content,
                name: formValues.name,
            }
        }, () => {
            this.addLang();
        });
    };

    // 重置模板
    resetLmData = () => {
        this.setState({
            lmData: {
                _id: 0,
                name: "",
                content: "",
                tlProperties: []
            }
        })
    };

    // 添加编辑模板语言 ajax
    addLang = () => {
        const data = this.state.lmData;
        let url = "";

        if(this.lmEditFlag){
            url = Api.hotnews_tpl_put;
        }else{
            url = Api.hotnews_tpl_add;
        }

        service({
            url: url,
            method: 'post',
            headers: {
                post: {
                    "Content-Type": 'application/json',
                }
            },
            data: data
        }).then((result) => {
            this.closeTplModal();
            this.resetLmData();
            this.getLangList();
        });
    };

    tplModalCancel = () => {
        console.log("cancel")
        this.closeTplModal();

    };

    // 添加属性
    addProperty = (property) => {
        let obj = {};

        if (property.pMax === "") {
            obj.name = property.name;
            obj.pType = 1;
            obj.pValue = property.pMix;
            obj.pMix = -1;
            obj.pMax = -1;
        } else {
            obj.name = property.name;
            obj.pType = 2;
            obj.pValue = '-';
            obj.pMix = property.pMix;
            obj.pMax = property.pMax;
        }
        // todo 检查重复值
        this.setState({
            lmData: {
                ...this.state.lmData,
                tlProperties: _.concat(this.state.lmData.tlProperties, [obj])
            }
        })
    };

    delProperty = (record) => {
        let na = _.concat([], this.state.lmData.tlProperties);
        _.remove(na, (n) => {
            return n.pName === record.pName
        });

        this.setState({
            lmData: {
                ...this.state.lmData,
                tlProperties: na
            }
        });
    };

    render() {

        const {page, size, count, langList} = this.state;
        const langCols = this.langCols;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18}
        };
        const {name, content} = this.state.lmData;
        const {tlProperties} = this.state.lmData;

        return (
            <>
                <Row gutter={16} className={"top-divider"}>
                    <Col span={24}>
                        <div className={"operation"}>
                            <Button type="primary"
                                    onClick={this.openTplModal}
                                    style={{display: "inline-block", marginLeft: "10px"}}>添加</Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        {
                            langList && <Table
                                size="middle"
                                rowKey={(record) => record._id}
                                columns={langCols}
                                dataSource={langList}
                                bordered
                                pagination={{
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                    current: page,
                                    defaultCurrent: 1,
                                    pageSize: size,
                                    pageSizeOptions: ['10', '15', '20'],
                                    total: count,
                                    showTotal: total => `共 ${total} 条`,
                                    onShowSizeChange: this.changeSize,
                                    onChange: this.changePage
                                }}

                            />
                        }


                    </Col>
                </Row>

                <Modal
                    maskClosable={false}
                    title="模板语言"
                    visible={this.state.tplModalFlag}
                    width={800}
                    onOk={this.tplModalOk}
                    onCancel={this.tplModalCancel}
                >
                    <div>

                        <Row>
                            <Col span={24}>
                                <LangForm
                                    wrappedComponentRef={(form) => this.langForm = form}
                                    name={name}
                                    content={content}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form layout="horizontal">
                                    <Form.Item label="属性："  {...formItemLayout} >
                                        {
                                            tlProperties && <Table
                                                size="small"
                                                rowKey={(record) => record.name}
                                                columns={this.tlPropertiesCols}
                                                dataSource={tlProperties}
                                                bordered
                                                pagination={false}
                                            />
                                        }
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={20} offset={2}>
                                <LangProperty wrappedComponentRef={(form) => this.langPropertyAddForm = form}
                                              addProperty={this.addProperty}/>
                            </Col>
                        </Row>

                    </div>
                </Modal>
            </>
        )
    }

}