import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../../store/actions";
import {Upload, message} from 'antd';
import _ from "lodash";
import '../../style/article_edit.css'
import '../../style/tab.css'  

/**
 * 编辑页-辅助内容-添加图片
 */
class AssistAddImgItem extends Component {
    constructor(props) {
        super(props);

        var client = props.client;
        this.state = {
            Subjects: [],
            fileList: [],
            client: props.client
        }


        /* if(!client)
        {
            var Account = store.get("Account");
            client = Account.clients[0].ClientName;
        } */

        this.props.dispatch(actions.loadeditAssistImgSubject({clientName: client}));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            Subjects: nextProps.Subjects
        };
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    save = () => {
        if (this.state.fileList.length) {
            var title = this.refs.titleref.value;
            var select = this.refs.subjectsref;
            var subjectid = select.options[select.selectedIndex].value;
            var list = [this.state.fileList[0].originFileObj];
            if (_.isNil(subjectid) || subjectid === "") {
                message.warn("请选择客户实体！")
                return;
            }
            if (_.isNil(title) || title === "") {
                message.warn('请输入图片描述信息！')
                return;
            }
            this.props.save({
                title, subjectid, list
            });
        } else {
            message.warn('请上传图片！');
        }

    }

    handleChange = ({file, fileList}) => {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        if (isJPG) {
            this.setState({fileList})
        }
    }

    render() {
        var aSubject = [];
        if (this.state.Subjects.length > 0) {
            aSubject = this.state.Subjects.map(item => {
                return <option key={item.id} value={item.id}>{item.name}</option>;
            })
        }
        const uploadButton = (
            <div>
                <span className="iconfont icon-addimg"></span>

            </div>
        );
        const props = {
            onRemove: (file) => {
                this.setState({fileList: []});
            },
            beforeUpload: (file) => {
                /* const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                if(isJPG)
                {
                      this.setState({
                          fileList: [file]
                      });
                }else{
                    message.warn('请上传图片！')
                } */

                return false;
            },
            fileList: this.state.fileList,
            listType: "picture-card",
            accept: 'image/*',
            onChange: this.handleChange
        };

        return (
            <div className="adding">
                <div className="title_box">
                    <input className="adding_title" type="text" placeholder="请输入图片描述" ref='titleref'/><span
                    className="star">*</span>
                </div>
                <div className="content_box content_box4">
                    <span className="iconfont icon-down xiala"></span>
                    <select ref="subjectsref">
                        {aSubject}
                    </select><span className="star">*</span>
                </div>
                <div className="adding_img_box">

                    <Upload {...props}>
                        {this.state.fileList.length > 0 ? null : uploadButton}
                    </Upload>


                    <span className="star">*</span>
                </div>
                <div className="adding_btn_box">
                    <button className="btn btn1" onClick={this.save}>保存</button>
                    <button className="btn fr btn2 btn--grayblue" onClick={this.props.cancel}>取消</button>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {

    const Subjects = state.Subjects;
    return {Subjects}
}

export default connect(mapStateToProps)(AssistAddImgItem)
