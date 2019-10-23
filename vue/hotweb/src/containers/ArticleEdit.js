import React, {Component} from 'react'
import {Spin, Switch, message} from 'antd';
import * as apiUrl from '../services/ApiUrl';
import * as query from '../services/Utils';
import E from 'wangeditor';

import '../style/articleEdit.css'

const $ = window.$;
var editor;
var editor_title;
var timer;

const menus = [
    'head', // 标题
    'bold', // 粗体
    'fontSize', // 字号
    'fontName', // 字体
    'italic', // 斜体
    'underline', // 下划线
    'strikeThrough', // 删除线
    'foreColor', // 文字颜色
    'backColor', // 背景颜色
    'link', // 插入链接
    'list', // 列表
    'justify', // 对齐方式
    'image', // 插入图片
];

class Edit extends Component {
    constructor(props) {
        super(props);

        let id = props.match.params.id;

        this.state = {
            id: id ? id : '',
            title: '',
            content: '',
            checked: false,
            loading: false
        };
    }

    componentDidMount() {
        this.setEdit();
        this.loadData();
    }

    componentWillUnmount() {
        editor = null;
        editor_title = null;
    }

    loadData = () => {
        this.setState({
            loading: true
        });

        query.__request_Temp('get', apiUrl.GetArticleUrl, {id: this.state.id}, (res) => {

            this.setState({
                loading: false,
            });

            let title = res.newArticleTitle ? res.newArticleTitle : '';
            let content = res.newArticleContent ? res.newArticleContent : '';
            let checked = res.released ? true : false;

            this.setState({
                checked
            });

            this.setEditContent(title, content);

        }, () => {
            this.setState({
                loading: false,
                title: '',
                content: ''
            }, () => {
                this.setEditContent('', '');
            })
        });
    }

    //设置富文本编辑框
    setEdit = () => {
        var _this = this;

        if (!editor) {
            const elem = _this.refs.editorElem;
            const elemBar = _this.refs.editorElemtoobar;
            const elem_title = _this.refs.editorElem_title;
            const elemBar_title = _this.refs.editorTitletoobar;

            elemBar.innerHTML = '';

            if (elem && elemBar) {
                editor = new E(elemBar, elem);
                editor_title = new E(elemBar_title, elem_title);

                var customConfig = {
                    zIndex: 999,
                    showLinkImg: false,
                    uploadImgShowBase64: true,
                    pasteIgnoreImg: false,
                    pasteFilterStyle: true,
                    pasteTextHandle: (content) => {
                        //从word拷贝过来的文档带有大量的html标签，长度过大，一次replace不起作用，所以先把head去掉
                        var reg = new RegExp('<head>([\\s\\S]*?)<\\/head>');

                        if (reg.test(content)) {
                            content = content.replace(/<head>([\s\S]*?)<\/head>/g, '');
                            content = content.replace(/<[\s\S]*?>/g, '');
                        }

                        content = $.trim(content);

                        return content;

                    },
                    onchange: (html) => {
                        $('.align').removeClass('align');
                        $('img').parent().addClass('align');
                    },

                    menus: menus
                };

                editor.customConfig = Object.assign({}, customConfig);
                editor_title.customConfig = Object.assign({}, customConfig);

                editor_title.create();
                editor.create();

                $('.w-e-text').css('overflowY', 'auto');

            }
        }
    };

    //给富文本编辑框设置内容 //alt + e save
    setEditContent = (title, content) => {
        let _this = this;

        if (editor) {
            editor_title.txt.html('<article class="landingHead"><h1 class="titleSize">' + title + '</h1></article>');

            editor.txt.html(content);

            $('img').parent().addClass('align');

            document.onkeydown = function (event) {
                let e = event || window.event;

                if (e && window.event.altKey && e.keyCode === 69) {
                    _this.Save();
                }
            };


        }
    };

    // 保存文档
    Save = () => {
        let title = editor_title.txt.text();
        let content = editor.txt.html();
        let param = {
            _id: this.props.match.params.id,
            newArticleTitle: title,
            newArticleContent: content
        };

        query.__request_Temp('post', apiUrl.PutArticleUrl, param, () => {
            message.success('修改成功！');
        })
    };

    // 发送切换
    setReleased = (v) => {
        this.setState({checked: v});
        clearTimeout(timer);

        timer = setTimeout(() => {
            query.__request('post', apiUrl.PutArticleReleasedStatusUrl + '/' + v, this.props.match.params.id);
        }, 1000);
    };

    render() {
        const {loading} = this.state;

        return (
            <div className='article'>
                <Spin spinning={loading} size='large'/>

                <div style={{position: 'fixed', width: '95%', zIndex: 1000}}>
                    <div className="uEidt"
                         ref="editorElemtoobar"
                         style={{margin: '0 auto', marginBottom: '10px'}}/>
                </div>

                <div className="uEidt" ref="editorTitletoobar" style={{visibility: 'hidden'}}/>

                <div className="textarea" id="titletextarea">
                    <div ref="editorElem_title"/>
                </div>

                <div className="textarea" id="textarea">
                    <div ref="editorElem"/>
                </div>

                <div className="btn-box">
                    <Switch checkedChildren="已发送"
                            unCheckedChildren="未发送"
                            loading={this.state.loading}
                            checked={this.state.checked}
                            onChange={this.setReleased}/>
                </div>

                <div className="btn-box">
                    <button className="btn-bc"
                            style={{marginRight: "30px", fontSize: "14px"}}
                            onClick={this.Save}>保存
                    </button>
                </div>
            </div>
        )
    }
}

export default Edit

