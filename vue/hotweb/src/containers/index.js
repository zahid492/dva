import React, {Component} from 'react';
import {connect} from "react-redux";
import {Table, Input, Button, Modal, Select, message} from 'antd';
import * as apiUrl from '../services/ApiUrl';
import * as query from '../services/Utils';

import '../style/index.css' ;

const _ = window._;
const moment = window.moment;
const weiboLink = 'https://s.weibo.com/weibo?q=';

const Option = Select.Option;
const Search = Input.Search;

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datas: [],
            count: 0,

            key: '',
            newsType: '',

            pagination: {defaultCurrent: 1, total: 0, pageSize: 30, hideOnSinglePage: true, current: 1},

            loading: false,

            //添加话题
            addModalVisible: false,
            addloading: false,
            addObj: {
                title: ''
            },

            //话题类别
            typesList: []
        };
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        this.loadNewsTypeList();
        this.loadDatas();
    }

    // 文章列表
    loadDatas = (page) => {
        this.setState({
            loading: true
        });

        let pagination = this.state.pagination;

        if (page) {
            pagination.current = page;
        }

        let param = {
            page: pagination.current,
            size: pagination.pageSize,
            topicName: this.state.key,
            topicType: this.state.newsType
        };

        query.__request('get', apiUrl.GetTopicUrl, param, (res) => {
            pagination.total = res.count;

            let datas = res.data.map(d => {
                d.key = d._id;

                let date1 = moment(new Date(d.createDateTime)).format('MM-DD HH:mm:ss');
                // 创建时间
                d.addDateTime = date1;
                //发布生成
                d.pg = d.publishCount + '/' + d.generateCount;

                return d;
            });

            this.setState({
                datas,
                pagination,
                loading: false
            });

        }, () => {
            pagination.total = 0;
            this.setState({
                loading: false,
                pagination
            })
        });
    };

    // 话题类别
    loadNewsTypeList = () => {

        query.__request_Temp('get', apiUrl.GetArticleTypesUrl, {}, (res) => {
            if (res.code === 200) {
                this.setState({
                    typesList: res.data
                });
            } else {
                this.setState({
                    typesList: []
                });
                message.error(res.errmsg);
            }

        }, () => {
            this.setState({
                typesList: []
            });
        })

    };

    columns = [{
        title: '热门话题',
        dataIndex: 'topicName',
        key: 'topicName',
        width: 500,
        render: (text, record, index) => {
            if (record.referenceUrl) {
                return <a href={record.referenceUrl} style={{textDecoration: 'none'}} target='_blank'>{text}</a>
            }

            return <a href={weiboLink + text} style={{textDecoration: 'none'}} target='_blank'>{text}</a>
        }
    }, {
        title: '话题类别',
        dataIndex: 'topicType',
        key: 'topicType',
    }, {
        title: '创建时间',
        dataIndex: 'addDateTime',
        key: 'addDateTime'
    }, {
        title: '话题明星指数',
        dataIndex: 'topicExponent',
        key: 'topicExponent'
    }, {
        title: '发布/生成',
        dataIndex: 'pg',
        key: 'pg'
    }, {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record, index) =>
            <div>
                <a href={document.location + 'list/' + record.topicName}
                   style={{textDecoration: 'none'}}
                   target='_blank'>查看</a>
            </div>
    }];

    //输入搜索框内容
    changeKey = (e) => {
        let value = e.target.value;
        this.setState({
            key: value
        });
    };

    //选择分类，重置 page
    changeNewsType = (v) => {
        const pager = {...this.state.pagination};
        pager.current = 1;

        this.setState({
            newsType: v,
            pagination: pager
        }, this.loadDatas);
    };

    //翻页
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, this.loadDatas);

    };

    //添加话题
    handleAdd = () => {
        let _this = this;
        let obj = _this.state.addObj;

        if (_.trim(obj.title).length === 0) {
            message.warn('请输入热门话题内容！');
            return;
        }

        this.setState({
            addloading: true
        });

        query.__request('post', apiUrl.AddArticleTopicUrl, obj.title);

        this.setState({
            addloading: false
        });

        this.handleCancel();
    };

    //关闭话题弹框
    handleCancel = () => {
        this.setState({
            addModalVisible: false,
            addObj: {
                title: ''
            }
        }, () => {
            Modal.destroyAll();
        });
    };

    //打开添加话题弹框
    showAddModal = () => {
        this.setState({
            addModalVisible: true
        });
    };

    //输入话题内容
    change = (value, key) => {
        let obj = this.state.addObj;
        obj[key] = value;
        this.setState({
            addObj: obj
        });
    };

    render() {
        const {datas, pagination, newsType, typesList, addObj, addModalVisible, addloading, loading,} = this.state;
        let _columns = this.columns;

        return (
            <div>
                <div className="table-operations" style={{padding: '15px 0', textAlign: 'right'}}>
                    <div style={{float: 'left'}}>话题类别：
                        <Select showSearch
                                value={newsType}
                                style={{width: 200}}
                                onChange={this.changeNewsType}
                                allowClear
                        >
                            {
                                typesList.map((plat) => {
                                    return <Option key={plat._id} value={plat.name}>{plat.name}</Option>
                                })
                            }
                        </Select>
                    </div>

                    <Search onSearch={() => this.loadDatas(1)}
                            style={{width: 200}}
                            value={this.state.key}
                            onChange={this.changeKey}
                    />

                    <Button onClick={this.showAddModal} style={{marginLeft: '25px'}}>添加话题</Button>
                </div>

                <Table columns={_columns}
                       dataSource={datas}
                       pagination={pagination}
                       loading={loading}
                       onChange={this.handleTableChange}
                />

                <Modal title="添加热门话题"
                       visible={addModalVisible}
                       onOk={this.handleAdd.bind(this)}
                       onCancel={this.handleCancel.bind(this)}
                       okText={'确认'}
                       cancelText={'取消'}
                       confirmLoading={addloading}
                       maskClosable={false}>

                    <div className='titleModal'>
                        <div className='item'>
                            <span className='label'>热门话题 : </span>
                            <Input style={{width: 300}}
                                   value={addObj.title}
                                   onChange={(e) => {
                                       this.change(e.target.value, 'title')
                                   }}
                            />
                        </div>
                    </div>

                </Modal>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        oidc: state.oidc
    }
};

export default connect(mapStateToProps)(Index);



