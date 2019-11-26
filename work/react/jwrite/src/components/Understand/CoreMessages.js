import React, {Component} from 'react'
import {Checkbox, Modal, Input, message,Popconfirm,List,Icon} from 'antd';
import _ from "lodash";
import $ from 'jquery'
import * as actions from "../../store/actions";
import AddButt from '../AddButton'
import ModelComponent from '../ModelComponent'

const {cMEdit} = actions;
const {TextArea} = Input;



class CoreMessages extends Component {
    constructor(props) {
        super(props)
        this.msgCount = 15;
        this.state = { 
            CMessages: [],  
            isadd : true,
            editId:-1
        };
        this.msgUpdateCount = 0;
         
        this.editItem = {};
        this.addMessageRef = React.createRef();
    }
   
     
    onCheckedChange = (e, id) => {       
           var CMessages = this.state.CMessages;        
            CMessages[id].checked = e.target.checked ? 1 : 0;
            this.props.dispatch(cMEdit.request({data:CMessages,nid: this.props.match.params.nid}))
            
    };
    // 添加
    addMessage = () => { 
        if(this.state.CMessages.length > this.msgCount){
            message.info('最多添加' + this.msgCount + '条核心信息');
            return;
        }

        if(this.addMessageRef.current.textAreaRef.value.trim().length===0){
            message.warn('请输入核心信息');
            return;
        }
       
        let txt = this.addMessageRef.current.textAreaRef.value.trim();

        let temp = _.concat([], this.state.CMessages);
        let id = 0;
        if(temp.length > 0)
        {
            id = temp[temp.length - 1].rid + 1;
        }
         
        temp.push({
            "rid": id,
            "content": txt,
            "checked": 0
        });
        this.setState({
            CMessages: temp,
            isadd:false
        }, function(){
            this.props.dispatch(cMEdit.request({data:temp,nid:this.props.match.params.nid}))
            this.addMessageRef.current.textAreaRef.value = ""
             
        });
    };

    validEmpty = ()=>{
        let temp = _.concat([], this.state.CMessages);
        return _.every(temp, function(v){
            return v.content.trim().length>0;
        });
    };
    
    // state 的变化是要放到 reducer 里面的，组件内部微调。 getDerivedStateFromProps 对应于组件整体变化。

    static getDerivedStateFromProps(nextProps, prevState) {
        //if ((_.size(prevState.CMessages) === 0 || _.size(prevState.checkedList)===0 ||(_.size(nextProps.CMessages) > 0 &&  nextProps.CMessages[0].content !=prevState.CMessages[0].content))) {
        
        return {
                CMessages: nextProps.CMessages
            }
        //}
        //return null;
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
        if(this.state.CMessages.length < this.msgCount)
        {
            this.setState({isadd:true},
                ()=>{
                  
                    var sTop = $('.ant-modal-body').scrollTop(); 
                    $('.ant-modal-body').scrollTop(sTop + 100);
                 });
        }else{
            message.info('最多添加' + this.msgCount + '条核心信息');
        }
         
    }
    setEdit=(item)=>{
        var rid = item.rid;
        this.editItem.content = item.content;
        this.setState({
            editId:rid
        });
    }
    saveEdit =()=>{
        var CMessages = this.state.CMessages;
        var count = CMessages.filter(c=>c.content === '').length;
        
        if(count === 0 && $.trim(this.editItem.content))
        {
            var item = CMessages.filter(c=>c.rid === this.state.editId)[0];
            item.content = this.editItem.content;
            this.setState({ 
                editId:-1 
            },()=>{this.editItem = {}});
            this.props.dispatch(cMEdit.request({data:CMessages,nid:this.props.match.params.nid}))
        }else{
            message.warn('请输入信息');
        }
    }
    onChangeContent=(e)=>{
            var content = e.target.value;
            this.editItem.content = content;
   
    }
    DelItem=(i)=>{
         
            var CMessages = this.state.CMessages;
            CMessages.splice(i,1); 
             
            this.props.dispatch(cMEdit.request({data:CMessages,nid:this.props.match.params.nid}))
             
    }
    render() {  
        let { close} = this.props;  
        var addEle = '';
        if(this.state.CMessages.length < this.msgCount)
        {
            if(this.state.isadd)
            {
                addEle = AddButt(this.addMessage,'确定',{},'check-circle','#4fc855');
            }else{
                addEle = AddButt(this.showAddInput,'添加');

            } 
       }
         var checkedMSG = this.state.CMessages.filter(m=> m.checked === 1);
         var counts = checkedMSG.length;
        return (            
                    <Modal
                        width={1000}
                        className="popup"
                        title={[ModelComponent.ModelTitle('核心信息',counts,this.msgCount)]}
                        visible={this.props.editCMVisible}
                        onCancel={close}
                        footer={[ ModelComponent.Close(close)]}
                        destroyOnClose = {true}
                    > 
                        <List 
                                itemLayout="horizontal" 
                                dataSource={this.state.CMessages}
                                renderItem={(item,i) => (
                                <List.Item  key = {i} actions={[this.state.editId === item.rid ? <Icon type="check-circle" style={{ fontSize: 16, color: '#08c' }} onClick={this.saveEdit} /> : <Icon type="edit" style={{ fontSize: 16 }} onClick={()=>{this.setEdit(item)}} />, 
                                                        <Popconfirm title="确定删除该信息么？" okText="确定" cancelText="取消" onConfirm={()=>{this.DelItem(i)}}>                                                
                                                                <Icon type="delete" />
                                                         </Popconfirm>]}
                                                       
                                                         >

                                    <List.Item.Meta
                                     avatar={<Checkbox checked={item.checked===1} onChange={(e) => this.onCheckedChange(e, i)}>{i+1}</Checkbox>}
                                     title={ModelComponent.editModel(item,this.state.editId,this.onChangeContent) }
                                    />
                                    
                                </List.Item>
                                )}
                            />
                        
                        <div  id="editArea" style = {{display:(this.state.isadd && this.state.CMessages.length < this.msgCount) ? 'block' : 'none' }}>
                            <h3>添加核心信息</h3>
                            <section className="editBox">
                                <div>
                                    <TextArea ref={this.addMessageRef}  placeholder="请输入信息"/>
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

export default CoreMessages

