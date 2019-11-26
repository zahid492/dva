import React, {Component} from 'react'
import {Modal, Select, Icon, message} from 'antd';
import _ from "lodash";
import * as actions from "../../store/actions";
import * as apiUrl from '../../services/ApiUrl';
import UploadImg from '../../components/EditAssist/EditAssistAddImgItem'
import $ from 'jquery'

const Option = Select.Option;

class CoreImage extends Component {
    constructor(props) {
        super(props);
        this.msgCount = 20;
        /* let cm = store.session("CoreImages");
        
        if (_.isNull(cm) || cm.length == 0) {
            cm = this.props.CoreImages;
        } */
        let cm = this.props.CoreImages;
        this.state = {
            imgCount: cm.length,    //系统推荐图片数量，  用于判断是否显示编辑图片按钮
            editVisible: false,
            CoreImages: cm,
            SysImages: this.props.SysImages,
            CoreImagesCars: props.CoreImagesCars,
            page: 1,
            nid: props.nid,
            carid: ''
        };
    }

    // 编辑核心信息
    showEditModal = () => {
        var id = '';
        if (this.state.CoreImagesCars.length) {
            id = this.state.CoreImagesCars[0].id;
            this.props.dispatch(actions.loadSysImages({
                data: {index: 1, size: apiUrl.SYSIMAGE_PAGESIZE},
                subjectId: id
            }));

        }

        this.setState({
            carid: id,
            editVisible: true,
        });
    };

    editCancel = () => {
        this.setState({
            editVisible: false,
        });
    };

    delImage = (e, rid) => {
        debugger;
        let temp = _.concat([], this.state.CoreImages);
        _.remove(temp, (v) => {
            return v.rid === rid
        });

        this.props.dispatch(actions.coreImagesEdit.request({
            data: temp,
            nid: this.props.match.params.nid
        }));
        /* this.setState({
            CoreImages: temp
        }) */

    };

    addImage = (e, rid) => {
        //let temps = _.concat([], this.state.SysImages);
        //let tempc = _.concat([], this.state.CoreImages);


        let SysImages = this.state.SysImages;
        let CoreImages = this.state.CoreImages;

        let item = _.find(SysImages, (v) => {
            return v.rid === rid
        });

        if (CoreImages.length >= this.msgCount) {
            message.warn('最多选择' + this.msgCount + '张');

            return;
        }

        if (_.findIndex(CoreImages, {rid: rid}) == -1) {
            CoreImages.push(item);

            this.props.dispatch(actions.coreImagesEdit.request({
                data: CoreImages,
                nid: this.props.match.params.nid
            }));
            /* 
            this.setState({
                CoreImages
            }) */
        } else {
            message.warn('所选图片已经存在！');
        }

    };

    /* saveImage = () => {
        this.props.dispatch(actions.coreImagesEdit.request({
            data: this.state.CoreImages,
            nid: this.props.match.params.nid
        }));
        this.setState({
            editVisible: false,
        });
    }; */

    nextSysImage = () => {
        var page = this.state.page;
        var id = this.state.carid;
        if (page > 0 && this.state.SysImages.length < apiUrl.SYSIMAGE_PAGESIZE) {
            page = 1;

            var category = this.state.CoreImagesCars;
            var carid = this.state.carid;
            var index = category.findIndex(ca => ca.id == carid);
            if (index == this.state.CoreImagesCars.length - 1) {
                index = 0;
            } else {
                index++;
            }
            id = category[index].id;

        } else {
            page++;
        }
        this.setState({
            page,
            carid: id
        }, function () {
            this.props.dispatch(actions.loadSysImages({
                data: {
                    index: this.state.page,
                    size: apiUrl.SYSIMAGE_PAGESIZE
                },
                subjectId: id
            }))
        });
    };

    // state 的变化是要放到 reducer 里面的，组件内部微调。 getDerivedStateFromProps 对应于组件整体变化。

    static getDerivedStateFromProps(nextProps, prevState) {
        let cm = nextProps.CoreImages;
        /*if(store.session("news2nid") ==  prevState.nid)
        {
          cm = store.session("CoreImages");
           
        }
        */
        /* if ((_.size(prevState.CoreImages) === 0)
            || (_.size(prevState.SysImages) === 0)
            || (_.size(nextProps.SysImages) > 0 && prevState.SysImages[0].rid !== nextProps.SysImages[0].rid)
        )   
       
         {
            cm = nextProps.CoreImages;
         }*/
        return {
            CoreImages: cm,
            imgCount: cm.length,
            SysImages: nextProps.SysImages,
            CoreImagesCars: nextProps.CoreImagesCars ? nextProps.CoreImagesCars : []
        };


        /*  }

         return null; */
    }

    // 保证初始[] 到 异步数据后的渲染
    getSnapshotBeforeUpdate(prevProps, prevState) {
        // if(prevState.SysImages.length !=)
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(prevProps, prevState, snapshot)
    }

    handleChangeCar = (value) => {
        this.setState({
            carid: value,
            page: 0
        }, this.nextSysImage);
    }
    showUplaod = () => {        
        this.setState({uploadVisible:true })              
    }
    hideUpload = ()=>{
        this.setState({uploadVisible:false })              

    }
    upload = (item)=>{
          
        var list = item.list;
         
        if(list.length === 0)
        {
            message.destroy();
            message.warn('请上传图片！');
            return;
        }
        let obj = {
            data:{
                subjectId:item.subjectid,
                imageName: this.state.CoreImagesCars[0].name
            } ,
            file:list[0],
            filename:list[0].name, 
            CoreImages: this.state.CoreImages,
            nid: this.props.match.params.nid

        }
        this.props.dispatch(actions.newsAddImg.request(obj));
        this.hideUpload();
    }
    render() {
        const frommy = _.isUndefined(this.props.match.params.fron) ? "block" : "none";
        const {CoreImages, SysImages, CoreImagesCars} = this.state;
        var editPic = <span><i className="iconfont icon-edit"></i>编辑图片</span>
        if (this.state.imgCount == 0) {
            editPic = <span>未找到相关图片</span>
        }
        var carOptions = [];
        CoreImagesCars && CoreImagesCars.forEach(element => {
            var op = <Option key={element.id}>{element.name}</Option>
            carOptions.push(op);
        });

        var uploadEle = '';
        if(this.state.uploadVisible && CoreImagesCars.length > 0)
        {
            uploadEle =  <UploadImg subjectid = {CoreImagesCars[0].id}  save = {this.upload} cancel = {this.hideUpload} />
                           
        }
        return (
            <div className="section-box__con">
                <div className="top">
                    <span>已勾选数量：{CoreImages ? CoreImages.length : 0}</span>
                    {/*<span>还可添加数量：{this.msgCount - (this.state.CoreImages.length > this.msgCount ? this.msgCount : this.state.CoreImages.length)}</span>*/}
                    {CoreImages.length < this.msgCount && <span  style={{display:frommy,float:'right',cursor:'pointer'}} onClick = {this.showUplaod}>上传图片</span>}
                    <Modal key='upload' visible={this.state.uploadVisible} footer={null} > {uploadEle}</Modal>
                </div>
                <div className="content content--img">
                    <ul>
                        {CoreImages && CoreImages.map((v, i) => {

                            return (
                                <li key={v.rid}
                                    className="mid-box"
                                    style={{
                                        // backgroundImage: "url(" + apiUrl.IMAGE_ROOT + v.path +")",
                                        // backgroundPosition: "center center",
                                        // backgroundRepeat: "no-repeat",
                                        // backgroundSize: "160px"
                                    }}>

                                    <img src={apiUrl.IMAGE_ROOT + v.path} className="mid-img"/>
                                </li>
                            )

                        })}

                    </ul>
                    <button onClick={() => {
                        if (this.state.imgCount > 0) {
                            this.showEditModal();
                        }
                    }} style={{display: frommy, margin: '0 auto'}}>
                        {editPic}
                    </button>
                    <Modal
                        width={1000}
                        className="popup"
                        title={[<div style={{color: '#fff'}} key={"edit-head"}><h2 
                                                                 style={{fontWeight: 'bold', color: '#fff'}}>相关图片推荐</h2>
                            <p key={"edit-des"}>
                                <span>已勾选数量：{CoreImages ? CoreImages.length : 0}</span>
                                <span style={{display: 'inline-block', position: 'relative', float: 'right'}}>可主动添加 {this.msgCount} 张图片</span>
                            </p></div>]}
                        visible={this.state.editVisible}
                        onCancel={() => {
                            this.editCancel()
                        }}
                        footer={[

                            <button key={"edit-cancel"} type="button" className="btn btn--grayblue"
                                    onClick={this.editCancel}><span>关闭</span>
                            </button>
                        ]}
                    >
                        <h3>已添加图片</h3>
                        <section className="content--img">
                            <ul>
                                {CoreImages && CoreImages.map((v, i) => {

                                    if (i < this.msgCount) {
                                        return (
                                            <li key={v.rid + "mread"}
                                                className="mid-box"
                                            >
                                                <img src={apiUrl.IMAGE_ROOT + v.path} className="mid-img" akt='' />
                                                <button className="close"  onClick={(e) => this.delImage(e, v.rid)}></button>

                                            </li>
                                        )
                                    }

                                })}
                            </ul>
                        </section>
                        <div className="line"></div>
                        <h3>
                            <div style={{display:'block', width: '100%',position: 'relative'}}>
                                <div  style={{display:'inline-block', width: '10%',position: 'relative'}}>
                                <h3> 添加图片</h3>
                                </div>
                                <div  id='changeType' style={{display:'inline-block',textAlign: 'right', width: '85%',position: 'relative'}}>
                                <button onClick={this.nextSysImage}><i className="iconfont icon-change"></i>换一批</button>
                                    <Select value={this.state.carid} style={{width: 120,  marginRight: '20px'}}
                                            onChange={this.handleChangeCar}   getPopupContainer={() => document.getElementById('changeType')}>
                                        {carOptions}
                                    </Select>
                                </div>
                          </div>
                        </h3>
                        <section className="content--img">
                            <ul>
                                {SysImages && SysImages.map((v, i) => {
                                    return (
                                        <li key={v.rid + 'sysImage'} className="mid-box">
                                            <img src={apiUrl.IMAGE_ROOT + v.path} className="mid-img" alt=''/>
                                            <div className="btnBox" style={{display: "block"}}>
                                                {
                                                    CoreImages && CoreImages.some(img => img.rid == v.rid) ?
                                                        <button><Icon type="check"
                                                                      style={{fontSize: 24, color: '#0f0'}}/></button>
                                                        :
                                                        <button className="add"
                                                                onClick={(e) => this.addImage(e, v.rid)}></button>
                                                }

                                                {/* <button className="add"
                                                        onClick={(e) => this.addImage(e, v.rid)}></button> */}
                                                {/*<button className="view" onClick={(e) => this.seeImage(e, v.rid)}></button>*/}
                                            </div>
                                        </li>

                                    )
                                })}
                            </ul>
                        </section>

                    </Modal>
                </div>
            </div>
        )
    }
}

export default CoreImage

