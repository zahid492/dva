import React, {Component} from 'react'
import {Table, message, Spin, Button, Modal, Input, Divider, List, Card, Select} from 'antd';
import {connect} from "react-redux";

import * as apiUrl from '../services/ApiUrl';
import * as query from '../services/Utils';
import '../style/index.css' ;
import Edit from "./ArticleEdit";

const _ = window._;
const moment = window.moment;
const aOrder = ['desc', 'asc'];

const Option = Select.Option;
const {Search} = Input;
const Timer = {};


const cImg = (urls, url, fun) => {
    if (urls.findIndex(img => img === url) > -1) {
        return <img className="selected" alt="" onClick={() => fun(url)} width='100%' height='80' src={url}/>
    } else {
        return <img className="unselected" alt="" onClick={() => fun(url)} width='100%' height='80' src={url}/>
    }
};

class ListArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datas: [],
            count: 0,
            key: '',
            newsType: '',
            pagination: {defaultCurrent: 1, total: 0, pageSize: 30, hideOnSinglePage: true, current: 1},
            loading: false,
            field: 'AddDateTime',
            order: 0,

            //发布
            publishModalVisible: false,
            accountList: [],
            accountDatasource: [],
            platform: '全部',
            category: '全部',
            publishRecord: {},
            publishing: false,

            //图片
            imgModalVisible: false,
            imgList: [],
            imgRecord: {},
            setCoverImgsing: false,
            typesList: [],
            // 发布时账号搜索
            accountKey: "",

            platformList:[],
            accountTypeList:[],

        };
    }

    componentDidMount() {
        this.loadNewsTypeList();
        this.loadDatas();
        this.loadAccounts();
        this.getPlatformList();
        this.getAccountType();
    }

    // 平台列表
    getPlatformList = () => {

        query.__request('get',
            apiUrl.mymedia_platform_getlist,
            {
                page: 1,
                size: 1000,
            },
            (res) => {

                this.setState({
                    platformList: [{"_id": "0", "name": "全部"}].concat([], res.data)
                })

            }, () => {
                this.setState({
                    platformList: [{"_id": "0", "name": "全部"}]
                })
            });
    }

    // 编辑：账号分类
    getAccountType = () => {

        query.__request('get',
            apiUrl.relation_publish_getlist,
            {
                page: 1,
                size: 1000,
            },
            (res) => {

                this.setState({
                    accountTypeList: [{"_id": "0", "name": "全部"}].concat([], res.data)
                })

            }, () => {
                this.setState({
                    accountTypeList: [{"_id": "0", "name": "全部"}]
                })
            });
    }

    //文章列表
    loadDatas = (page) => {
        this.setState({
            loading: true
        });

        let pagination = this.state.pagination;
        let topic = this.props.match.params.topic;
        if (page) {
            pagination.current = page;
        }

        let param = {
            page: pagination.current,
            pageSize: pagination.pageSize,
            keyword: this.state.key,
            TopicName: topic,
            field: this.state.field,
            order: aOrder[this.state.order],
            Type: this.state.newsType,
            IsGenerate: 1,
        };

        query.__request('get', apiUrl.GetArticlesUrl, param, (res) => {
            pagination.total = res.count;

            let datas = res.data.map(d => {
                d.key = d._id;
                let date1 = moment(new Date(d.addDateTime)).format('MM-DD HH:mm:ss');
                let date2 = moment(new Date(d.lastBuildDateTime)).format('MM-DD HH:mm:ss');

                d.addDateTime = date1;
                d.lastBuildDateTime = date2;

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

    //发布账号列表
    loadAccounts = () => {
        query.__request('get', apiUrl.GetWebAccountsUrl,
            {page: 1, size: 10000, platfrom: '', status: 1, normal: -1},
            (res) => {
            let datas = res.data.map((d, index) => {
                d.key = d._id;
                return {...d};
            });

            this.setState({
                accountList: datas,
                accountDatasource: datas
            });

        }, () => {
            this.setState({
                accountList: []
            })
        });
    };

    //话题类别列表
    loadNewsTypeList = () => {
        query.__request_Temp('get', apiUrl.GetArticleTypesUrl, {}, (res) => {
            if (res.code === 200) {
                this.setState({
                    typesList: res.data
                });
            } else {
                this.setState({
                    typesList: res.data
                });
                message.error(res.errmsg);
            }

        }, () => {
            this.setState({
                typesList: []
            });
        })

    };

    //生成或更新话题文章
    Create = (record) => {
        let id = record._id;
        let datas = this.state.datas;
        let index = datas.findIndex(d => d._id === id);
        datas[index].updating = true;

        this.setState({
            datas
        });

        query.__request_Temp('post', apiUrl.CreateNewsUrl, id, (res) => {
            this.loadDatas();
        }, () => {
            message.destroy();
            message.warn('操作失败！');
            datas[index].updating = false;

            this.setState({
                datas
            });
        });
    };

    //打开发布弹出框
    showPublish = (record) => {
        this.setState({
            publishModalVisible: true,
            publishRecord: {newsId: record._id}
        });
    };

    //打开封面图片弹出框
    openImgModal = (record) => {
        let imgs = record.converImages;

        if (!imgs) {
            imgs = [];
        }

        this.setState({
            imgModalVisible: true,
            setCoverImgsing: false,
            imgRecord: {newsId: record._id, imgs: imgs}
        });

        this.loadImgList(record._id);
    };

    //封面图片列表
    loadImgList = (id) => {
        query.__request('get', apiUrl.GetArticleImgsUrl, {id}, (res) => {
            let data = res.data;
            this.setState({
                imgList: data
            });
        }, (res) => {
            this.setState({
                imgList: []
            });
            message.error(res.error);
        })
    };

    //发布
    publishArticle = (accountid) => {
        let publishRecord = this.state.publishRecord;
        var index = this.state.accountList.findIndex(acc => acc._id === accountid);
        //build发布的那条数据记录
        publishRecord = {...publishRecord, ...this.state.accountList[index], accountId: accountid};

        this.setState({
            publishRecord
        }, this.publish);
    };

    //关闭弹框
    handleCancel = () => {
        this.setState({
            addModalVisible: false,
            publishModalVisible: false,
            imgModalVisible: false,
            publishRecord: {},
            imgRecord: {imgs: []},
            addObj: {
                title: ''
            }
        }, () => {
            Modal.destroyAll();
        });
    };

    //发布 todo 平台 url 提出
    publish = () => {

        let publishRecord = this.state.publishRecord;
        let datas = this.state.datas;

        let id = publishRecord.newsId;

        let timerName = 'timer_' + id;
        let url = '';

        if (publishRecord.platform === '百家号') {
            url = apiUrl.PublishArticleUrl;
        } else if (publishRecord.platform === '今日头条') {
            url = apiUrl.PublishArticleUrl_toutiao;
        } else {
            message.warn(publishRecord.platform + '平台开发中');
            return;
        }

        // todo timerName
        message.warn('正在发布中。。。');

        if (publishRecord.accountId) {
            let recordIndex = datas.findIndex(d => d._id === id);
            datas[recordIndex].publishing = true;

            this.setState({
                publishing: true
            });

            let param = {
                newsId: publishRecord.newsId,
                accountId: publishRecord.accountId
            };

            var that = this;

            query.__request('post', url, param, (res) => {
                datas[recordIndex].publishing = false;

                that.setState({
                    publishing: false,
                    publishModalVisible: false,
                }, () => {
                    that.loadDatas();
                    that.handleCancel();
                });

            }, (res) => {
                datas[recordIndex].publishing = false;

                that.setState({
                    publishing: false
                });

                message.warn(res.errmsg);
            }, (res) => {
                datas[recordIndex].publishing = false;

                that.setState({
                    publishing: false
                });
                message.warn('系统出错啦。。。');
            })
        } else {
            message.warn('请选择一个发布账号！');
        }

    };

    //排序
    setOrder = (propertie) => {
        let order = this.state.order;
        let field = this.state.field;

        if (field === propertie) {
            order = (order + 1) % 2;
        }

        let pagination = this.state.pagination;
        pagination.current = 1;

        this.setState({
            order,
            field: propertie,
            pagination
        }, this.loadDatas);
    };

    columns = [
        {
            title: '文章标题',
            dataIndex: 'newArticleTitle',
            key: 'newArticleTitle',
            width: 400,
            render: (text, record, index) => {
                if (record.released) {
                    return <a href={document.location.origin + '/edit/' + record._id}
                              style={{textDecoration: 'none', color: 'red'}}
                              target='_blank'>{text}</a>
                }

                return <a href={document.location.origin + '/edit/' + record._id}
                          style={{textDecoration: 'none'}}
                          target='_blank'>{text}</a>
            }
        },
        {
            title: '图片',
            dataIndex: 'converImages',
            key: 'converImages',
            render: (text, record, index) => {
                return <div style={{width: '240px'}}>
                    {
                        text && text.map((url, j) => {
                            return <span key={j}
                                         style={{
                                             cursor: 'pointer',
                                             display: 'inline-block',
                                             width: '30%',
                                             paddingRight: '5px'
                                         }} onClick={() => this.openImgModal(record)}>
                                <img width='100%'
                                     height='50' src={url}
                                     alt=''/></span>
                        })
                    }
                </div>
            }

        },
        {
            title: '模板',
            dataIndex: 'template',
            key: 'template',
        },
        {
            title: ({sortOrder, filters}) => <span style={{cursor: 'pointer', color: '#1890ff'}}
                                                   onClick={() => this.setOrder('AddDateTime')}>创建时间</span>,
            dataIndex: 'addDateTime',
            key: 'addDateTime'
        },
        {
            title: ({sortOrder, filters}) => <span style={{cursor: 'pointer', color: '#1890ff'}}
                                                   onClick={() => this.setOrder('LastBuildDateTime')}>更新时间</span>,
            dataIndex: 'lastBuildDateTime',
            key: 'lastBuildDateTime'
        },
        {
            title: '评分',
            dataIndex: 'score',
            key: 'score'
        },
        {
            title: '发布平台',
            dataIndex: 'publishPlatform',
            key: 'publishPlatform'
        },
        {
            title: '发布账号',
            dataIndex: 'publishAccount',
            key: 'publishAccount'
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (text, record, index) => {
                let template = record.template;
                let btnTxt = '生成';
                let publish = '';

                if (record.newArticleTitle) {
                    btnTxt = '更新';

                    if (record.publishing) {
                        publish = <Spin tip='发布'/>
                    } else {
                        publish = <span>
                                <a onClick={() => {
                                    this.showPublish(record)
                                }}>发布</a>
                            </span>
                    }
                }

                let up = '';

                if (template === '通用模板') {
                    up = <span>
                            <span>
                                <a onClick={() => {
                                    this.Create(record)
                                }}>{btnTxt}</a>
                            </span>
                            <Divider type="vertical"/>
                           </span>
                }

                if (record.updating) {
                    return <Spin/>
                } else {
                    return (
                        <div>
                            {up}
                            <div style={{display: "inline-block"}}>
                                <a href={document.location.origin + '/edit/' + record._id}
                                   style={{textDecoration: 'none'}} target='_blank'>编辑</a>
                            </div>
                            <Divider type="vertical"/>
                            {publish}
                        </div>
                    )
                }
            }
        }];

    accountColumns = [
        {
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
        },
        {
            title: '账号名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '账号类型',
            dataIndex: 'category',
            key: 'category',

        },
        {
            title: '操作',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <div>
                        <span>
                            <a onClick={() => {
                                this.publishArticle(record._id)
                            }}>发布</a>
                        </span>
                    </div>
                )
            }
        }];

    //关闭弹框
    handleCancel = () => {
        this.setState({
            addModalVisible: false,
            publishModalVisible: false,
            imgModalVisible: false,
            publishRecord: {},
            imgRecord: {imgs: []},
            addObj: {
                title: ''
            }
        }, () => {
            Modal.destroyAll();
        });
    };

    //设置封面图片
    setImg = () => {
        this.setState({
            setCoverImgsing: true
        });

        let imgRecord = this.state.imgRecord;

        let param = {
            id: imgRecord.newsId,
            converImages: imgRecord.imgs
        };

        query.__request('post', apiUrl.PutArticleCoverImgsUrl, param, (res) => {
            message.success('设置成功！');
            this.loadDatas();
            this.handleCancel();

            this.setState({
                setCoverImgsing: false
            });
        }, (res) => {
            message.success(res.errmsg);

            this.setState({
                setCoverImgsing: false
            });
        })
    };

    //选择封面图片
    selectImg = (item) => {
        let imgRecord = this.state.imgRecord;

        if (imgRecord.imgs) {
            let imgs = [...imgRecord.imgs];
            let index = imgs.findIndex(img => img === item);

            if (index > -1) {
                imgRecord.imgs = [...imgs.slice(0, index), ...imgs.slice(index + 1, imgs.length)]
            } else {

                if (imgs.length < 3) {
                    imgRecord.imgs.push(item);
                } else {
                    message.warn('最多选择3张图片！');
                }

            }
        } else {
            imgRecord.imgs = [item]
        }
        this.setState({
            imgRecord
        });
    };

    //发布弹出框中筛选账号切换平台
    changePlatform = (plat) => {

        if (_.isNil(plat)) {
            return;
        }

        if (plat!=="全部") {

            let source = this.state.accountList.filter(ac => ac.platform === plat);

            this.setState({
                platform: plat,
                accountDatasource: source,
            });

        } else {
            this.setState({
                platform: plat,
                accountDatasource: this.state.accountList
            });
        }
    };

    //发布弹出框中筛选账号切换类型
    changeCategory = (category) => {
        if (_.isNil(category)) {
            return;
        }

        let platform = this.state.platform;

        if (category!=="全部") {
            if(platform!=="全部"){
                let source = this.state.accountList.filter(ac => ac.platform === platform && ac.category === category);

                this.setState({
                    category: category,
                    accountDatasource: source,
                });
            }else{
                let source = this.state.accountList.filter(ac => ac.category === category);

                this.setState({
                    category: category,
                    accountDatasource: source,
                });
            }

        } else {
            this.setState({
                category: category,
                accountDatasource: this.state.accountList,
            });
        }
    };

    //账号筛选
    changeAccountKey = (key) => {
        if (_.isNil(key)) {
            return;
        }

        let source = this.state.accountList.filter(ac => ac.name.includes(key));

        this.setState({
            accountDatasource: source,
        });

    };

    //翻页
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, this.loadDatas);

    };

    render() {
        const {
            datas, pagination, publishModalVisible, loading,
            imgModalVisible, imgList, imgRecord, setCoverImgsing
        } = this.state;
        let _columns = this.columns;

        return (
            <div>
                <Table columns={_columns} dataSource={datas} pagination={pagination} loading={loading}
                       onChange={this.handleTableChange}/>

                <Modal title="请选择发布账号"
                       visible={publishModalVisible}
                       onCancel={this.handleCancel.bind(this)}
                       cancelText={'关闭'}
                       width={800}
                       footer={[
                           <Button key="back" onClick={this.handleCancel.bind(this)}>
                               关闭
                           </Button>
                       ]}
                       maskClosable={false}>
                    <div className='titleModal'>
                        <div className='item'>
                            <span className='label' style={{textAlign: 'center'}}>平台 : </span>
                            <Select style={{width: 120}}
                                    value={this.state.platform}
                                    allowClear
                                    onChange={this.changePlatform}>
                                {this.state.platformList && this.state.platformList.map((plat) => {
                                    return <Option key={plat._id} value={plat.name}>{plat.name}</Option>
                                })}
                            </Select>

                            <span className='label' style={{textAlign: 'center'}}>类型 : </span>
                            <Select style={{width: 120}}
                                    value={this.state.category}
                                    onChange={this.changeCategory}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {this.state.accountTypeList && this.state.accountTypeList.map((cate) => {
                                    return <Option key={cate._id} value={cate.name}>{cate.name}</Option>
                                })}
                            </Select>

                            <span className='label' style={{textAlign: 'center'}}>账号 : </span>
                            <Search
                                placeholder="账号名称"
                                onSearch={this.changeAccountKey}
                                style={{width: 120, top: "-2px"}}
                            />


                        </div>

                        <Table columns={this.accountColumns}
                               dataSource={this.state.accountDatasource}
                               bordered
                               size="small"/>
                    </div>
                </Modal>

                <Modal title="选择图片"
                       width={700}
                       visible={imgModalVisible}
                       onOk={this.setImg.bind(this)}
                       onCancel={this.handleCancel.bind(this)}
                       okText={'确认'}
                       cancelText={'取消'}
                       confirmLoading={setCoverImgsing}
                       maskClosable={false}>
                    <List
                        grid={{
                            gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4,
                        }}
                        dataSource={imgList}
                        renderItem={item => (
                            <List.Item>
                                <Card>
                                    {cImg(imgRecord.imgs, item, this.selectImg)}
                                </Card>
                            </List.Item>

                        )

                        }
                    />

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

export default connect(mapStateToProps)(ListArticle);

