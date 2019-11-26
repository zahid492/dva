import React, {Component} from 'react'
import {Modal, Input, message, Row, Col} from 'antd';
import _ from "lodash";
import wanEditor from 'wangeditor'

class MdE extends Component {
    constructor(props) {
        super(props)

        this.state= {
            txt: props.txt
        };

        this.editor = null;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.txt !== nextProps.txt){
            return {
                txt: nextProps.txt
            }
        }
        return null;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return null;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        //
        if(!_.isNull(this.props.oldEditor)){
            this.setEdit();
        }
        this.setEditContent();
    };

    componentDidMount() {
        this.setEdit();
        this.setEditContent();
    };

    //编辑模式，设置富文本编辑框
    setEdit = () => {
        const elem = document.querySelector(".textEditor");

        if (elem) {
            this.editor = new wanEditor(elem);
            // 使用 onchange 函数监听内容的变化，并实时更新到 state 中

            this.editor.customConfig.zIndex = 999;
            this.editor.customConfig.showLinkImg = false;
            this.editor.customConfig.uploadImgShowBase64 = true;
            //editor.customConfig.overflowY = 'none';
            this.editor.customConfig.menus = [
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
                'quote', // 引用
                'image', // 插入图片
            ];
            this.editor.create();
            console.log(this.editor)

            this.props.setEditor(this.editor)

        }
    };

    //给富文本编辑框设置内容
    setEditContent = () => {
        if (this.editor) {
            this.editor.txt.html(this.state.txt);
        }
    };

    render() {
        return (
            <div className="textEditor" ref={this.props.refd}>
            </div>
        )
    }
}

export default MdE

