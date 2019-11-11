import React, {Component} from 'react'
import {Checkbox, Modal, Input, message,Popconfirm,List,Icon} from 'antd';
import _ from "lodash";
import $ from 'jquery'
import * as actions from "../../store/actions";
import * as hocs from "../../hocs/N2H"
import AddButt from '../AddButton'
import  ModelComponent  from '../ModelComponent'

/**
 * 延伸阅读
 */
class ExtRead extends Component {
    constructor(props) {
        super(props);
        this.msgCount = 15;

        this.state = {
            ExtRead: this.props.ExtRead,
            isadd : true,
            editId:-1
        };
        this.editItem = {};
        this.addExtReadTitleRef = React.createRef();
        this.addExtReadLinkRef = React.createRef();
    }

    onCheckedChange = (e,index) => {
         

        var ExtRead = this.state.ExtRead;
         
        ExtRead[index].checked = e.target.checked ? 1 : 0;
        this.props.dispatch(actions.extReadEdit.request({data:ExtRead,  nid: this.props.match.params.nid}))
    };
    // 添加
    addMessage = () => {
        if(this.state.ExtRead.length > this.msgCount){
            message.info('最多添加' + this.msgCount + '条延伸阅读');
            return;
        }

        if(this.addExtReadTitleRef.current.input.value.trim().length===0
            || this.addExtReadLinkRef.current.input.value.trim().length===0){
            return;
        }

        let ExtRead = this.state.ExtRead;
        let id = 0;
        if(ExtRead.length > 0)
        {
            id = ExtRead[ExtRead.length - 1].rid + 1
        }
        
        ExtRead.push({
            "rid": id,
            "title": this.addExtReadTitleRef.current.input.value,
            "link": this.addExtReadLinkRef.current.input.value,
            "checked": 0,
        });
        this.setState({
            ExtRead,
            isadd:false
        }, function(){
            this.props.dispatch(actions.extReadEdit.request({data:this.state.ExtRead,  nid: this.props.match.params.nid}))
            this.addExtReadTitleRef.current.input.value= "";
            this.addExtReadLinkRef.current.input.value = "";
            if(this.state.ExtRead.length>=this.msgCount){
                $("#editArea").hide();
            }
        });
    };
    validEmpty = ()=>{
        let temp = _.concat([], this.state.ExtRead);
        return _.every(temp, function(v){
            return v.title.trim().length>0 && v.link.trim().length>0;
        });
    };
     

    static getDerivedStateFromProps(nextProps, prevState) {
 
     return {
        ExtRead: nextProps.ExtRead
      }
        
    }

    componentDidCatch(err, info){
        console.log(err, info)
    }

    // 保证初始[] 到 异步数据后的渲染
    getSnapshotBeforeUpdate(prevProps, prevState) {
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(prevProps, prevState, snapshot)
    }
    showAddInput = () =>
    {
        if(this.state.ExtRead.length < this.msgCount)
        {
            this.setState({isadd:true},
                ()=>{
                  
                    var sTop = $('.ant-modal-body').scrollTop(); 
                    $('.ant-modal-body').scrollTop(sTop + 100);
                 });
        }else{
            message.info('最多添加' + this.msgCount + '条延伸阅读');
        }

    }

    setEdit=(item)=>{
        var rid = item.rid;
        this.editItem = _.extend({}, item);
        this.setState({
            editId:rid
        });
    }
    saveEdit =()=>{
        var ExtRead = this.state.ExtRead;
        var count = ExtRead.filter(c=>c.title === '' || c.link === '').length;
        
        if(count === 0 && $.trim(this.editItem.title) && $.trim(this.editItem.link))
        {
            var item = ExtRead.filter(c=>c.rid === this.state.editId)[0];
            item.title = this.editItem.title;
            item.link = this.editItem.link;
            this.setState({ 
                editId:-1 
            },()=>{this.editItem = {}});
            this.props.dispatch(actions.extReadEdit.request({data:ExtRead,nid:this.props.match.params.nid}))
        }else{
            message.warn('请输入信息');
        }
    }
    onChangeContent=(e,properties)=>{
            var content = e.target.value;
             
            this.editItem[properties] = content;
            
    }
    DelItem=(i)=>{

            var ExtRead = this.state.ExtRead;
            ExtRead.splice(i,1);             
            this.props.dispatch(actions.extReadEdit.request({data:ExtRead,nid:this.props.match.params.nid}))            
    }




    render() {
        
        let { close} = this.props;
        let {ExtRead} = this.state;
        var addEle = '';
        if(this.state.ExtRead.length < this.msgCount)
        {
          if(this.state.isadd)
          {
            addEle = AddButt(this.addMessage,'确定',{},'check-circle','#4fc855');
                 
          }else{
            addEle = AddButt(this.showAddInput,'添加');
          }
        }
         var counts = ExtRead.filter(ex=>ex.checked === 1).length;

        return (
            
                    <Modal
                        width={1000}
                        className="popup"
                        title={[ModelComponent.ModelTitle('延伸阅读',counts,this.msgCount)]}
                        visible={this.props.editReadVisible}
                        onCancel={close}
                        footer={[ModelComponent.Close(close)]}
                        destroyOnClose = {true}
                    >
                        <List 
                                itemLayout="horizontal" 
                                dataSource={this.state.ExtRead}
                                renderItem={(item,i) => (
                                <List.Item  key = {i} actions={[this.state.editId === item.rid ? <Icon type="check-circle" style={{ fontSize: 16, color: '#08c' }} onClick={this.saveEdit} /> : <Icon type="edit" style={{ fontSize: 16 }} onClick={()=>{this.setEdit(item)}} />, 
                                                        <Popconfirm title="确定删除该信息么？" okText="确定" cancelText="取消" onConfirm={()=>{this.DelItem(i)}}>                                                
                                                                <Icon type="delete" />
                                                         </Popconfirm>]}
                                                       
                                                         >

                                    <List.Item.Meta
                                     avatar={<Checkbox checked={item.checked===1} onChange={(e) => this.onCheckedChange(e, i)}>{i+1}</Checkbox>}                            
                                    title ={ModelComponent.editInputModel(item,this.state.editId,this.onChangeContent,'title')}
                                    description ={ModelComponent.editInputModel(item,this.state.editId,this.onChangeContent,'link') }
                                    />
                                    
                                </List.Item>
                                )}
                            />                
 
                        <div id="editArea"  style = {{display:(this.state.isadd  && this.state.ExtRead.length < this.msgCount) ? 'block' : 'none' }}>
                            <h3>添加延伸阅读</h3>
                            <section className="editBox">
                                <div>
                                    <Input ref={this.addExtReadTitleRef} key={"add-ExtRead1"} placeholder="请添加题目"/>
                                    <Input ref={this.addExtReadLinkRef} key={"add-ExtRead2"} placeholder="请添加链接"/>
                                </div>
                            </section>
                        </div>
                        <div  style = {{padding:'20px 0' }}>
                            {addEle}
                        </div>
                    </Modal>
                
        )
    }
}

export default hocs.N2H(ExtRead);

