import React, {Component} from 'react'
import {Modal, Input, message, Row, Col} from 'antd';
import _ from "lodash";
import $ from 'jquery'
import * as actions from "../actions";
import MdE from './MdE';


class TrendItemE extends Component {
    constructor(props) {
        super(props)

        this.editor = null;
        this.itemTitleRef = React.createRef();
        this.editorEle = React.createRef();
    }

    toSave = () => {
        // 可以引用实例
        // console.log(this.editorEle)
        // console.log($(this.editorEle.current).find(".w-e-text").html())

        this.props.toSave({
            title:this.itemTitleRef.current.input.value,
            content: this.editor.txt.html()
        })
    };

    setEditor = (editor) => {
        this.editor = editor;
    };

    render() {
        let item = this.props.TrendItemE;

        const Erbox = React.forwardRef((props, ref) => {
            return <MdE {...props} refd={ref}/>
        });

        return (<Modal
                width={1000}
                className="popup"
                title='编辑'
                visible={this.props.editVisable}
                onOk={this.toSave}
                onCancel={this.props.toClose}
                destroyOnClose={true}
            >
                <Row>
                    <Col span={3}>标题：</Col>
                    <Col span={21}><Input ref={this.itemTitleRef} defaultValue={item.title}/></Col>
                </Row>

                <Row>
                    <Col span={3}>内容：</Col>
                    <Col span={21}>
                        <Erbox ref={this.editorEle} txt={this.props.TrendItemE.content} setEditor={this.setEditor}
                               oldEditor={this.editor}/>
                    </Col>
                </Row>


            </Modal>


        )
    }
}

export default TrendItemE

