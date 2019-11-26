import React, {Component} from 'react'
import {Checkbox, Modal, Input, message,Popconfirm,List,Icon} from 'antd';
import _ from "lodash";
import $ from 'jquery';
import * as actions from "../../store/actions";
import AddButt from '../AddButton'
import ModelComponent from '../ModelComponent'

class Noun extends Component {
    constructor(props) {
        super(props)
        this.msgCount = 15;

        this.state = { 
            Nouns: props.Nouns, 
            isadd:true,
            editId:-1

        }; 
        this.editItem = {};
        this.addNounNameRef = React.createRef();
        this.addNounContentRef = React.createRef();
         
    }

    
      
    onCheckedChange = (e, index) => {
        
        var Nouns = this.state.Nouns;
         
            Nouns[index].checked = e.target.checked ? 1 : 0;
            this.props.dispatch(actions.nounsEdit.request({data:Nouns,nid: this.props.match.params.nid}));
         

    };
    // 添加
    addNouns = () => { 
        if(this.state.Nouns.length > this.msgCount){
            message.info('最多添加' + this.msgCount + '条名词解释');
            return;
        }

        if(this.addNounNameRef.current.input.value.trim().length===0
            || this.addNounContentRef.current.input.value.trim().length===0){
            return;
        } 
        let temp = _.concat([], this.state.Nouns);
        let id = 0;
        if(temp.length > 0)
        {
            id = temp[temp.length - 1] ? temp[temp.length - 1].rid + 1 : 0;
        }
         
        temp.push({
            "rid": id,
            "name": this.addNounNameRef.current.input.value,
            "content": this.addNounContentRef.current.input.value,
            "checked": 0,
        });
        this.editItem = {};
        this.setState({
            Nouns: temp,
            isadd:false,
            editId:-1
        }, function(){
            this.props.dispatch(actions.nounsEdit.request({data:temp,  nid: this.props.match.params.nid}))
            this.addNounNameRef.current.input.value= "";
            this.addNounContentRef.current.input.value = "";
           
        });
    };


    validEmpty = ()=>{
        let temp = _.concat([], this.state.Nouns);
        return _.every(temp, function(v){
            return v.name.trim().length>0 && v.content.trim().length>0;
        });
    };
 
    static getDerivedStateFromProps(nextProps, prevState) {
        //if ((_.size(prevState.Nouns) === 0 || _.size(prevState.checkedList) === 0 || (_.size(nextProps.Nouns) > 0 && nextProps.Nouns[0].name !=prevState.Nouns[0].name))) {
            return {
                Nouns: nextProps.Nouns
            };
       // }
       // return null;
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
        if(this.state.Nouns.length < this.msgCount)
        {
            this.setState({isadd:true},
                ()=>{                
                    var sTop = $('.ant-modal-body').scrollTop(); 
                    $('.ant-modal-body').scrollTop(sTop + 100);
                 });
        }else{
            message.info('最多添加' + this.msgCount + '条名词解释');
        }
 
    }
    setEdit=(item)=>{
        var rid = item.rid;
        this.editItem.content = item.content;
        this.editItem.name = item.name;
        this.setState({
            editId:rid
        });
    }
    saveEdit =()=>{ 
        var Nouns = this.state.Nouns;
        var count = Nouns.filter(c=>c.content === '').length;
        
        if(count === 0 && $.trim(this.editItem.content) && $.trim(this.editItem.name))
        {
            var item = Nouns.filter(c=>c.rid === this.state.editId)[0];
            item.content = this.editItem.content;
            item.name = this.editItem.name;
            this.setState({ 
                editId:-1 
            },()=>{this.editItem = {}});
            this.props.dispatch(actions.nounsEdit.request({data:Nouns,nid:this.props.match.params.nid}))
        }else{
            message.warn('请输入信息');
        }
    }
    onChangeContent=(e,properties)=>{ 
            var content = e.target.value;
            
                if(properties)
                {
                    this.editItem[properties] = content;
                }else{
                this.editItem.content = content;
                }
             
            
    }
    DelItem=(i)=>{
         
            var Nouns = this.state.Nouns;
            Nouns.splice(i,1); 
          
           this.props.dispatch(actions.nounsEdit.request({data:Nouns,nid:this.props.match.params.nid}))
                       
    }
    render() { 
        let {close} = this.props;
        const {editId} = this.state;
        var addEle = '';
        if(this.state.Nouns.length < this.msgCount)
        { 
            if(this.state.isadd)
            {
                addEle = AddButt(this.addNouns.bind(this),'确定',{},'check-circle','#4fc855');
            }else{
                addEle = AddButt(this.showAddInput.bind(this),'添加');

            }
        }
         var counts = this.state.Nouns.filter(n=>n.checked === 1).length;
        return (
            
                    <Modal
                        width={1000}
                        className="popup"
                        title={[ModelComponent.ModelTitle('相关名词解释',counts,this.msgCount)]}
                        visible={this.props.editNounVisible}
                        onCancel={close}
                        footer={[ ModelComponent.Close(close)]}
                        destroyOnClose = {true}
                    >
                         <List 
                                itemLayout="horizontal" 
                                dataSource={this.state.Nouns}
                                renderItem={(item,i) => (
                                <List.Item  key = {i} actions={[editId === item.rid ? <Icon type="check-circle" style={{ fontSize: 16, color: '#08c' }} onClick={this.saveEdit} /> : <Icon type="edit" style={{ fontSize: 16 }} onClick={()=>{this.setEdit(item)}} />, 
                                                        <Popconfirm title="确定删除该信息么？" okText="确定" cancelText="取消" onConfirm={()=>{this.DelItem(i)}}>                                                
                                                                <Icon type="delete" />
                                                         </Popconfirm>]}                                                     
                                                         >

                                    <List.Item.Meta
                                     avatar={<Checkbox checked={item.checked===1} onChange={(e) => this.onCheckedChange(e, i)}>{i+1}</Checkbox>}                            
                                    title ={ModelComponent.editModel(item,editId,this.onChangeContent,'name')}
                                    description ={ModelComponent.editModel(item,editId,this.onChangeContent) }
                                    />
                                    
                                </List.Item>
                                )}
                            />                        
                        <div  id="editArea" style = {{display:(this.state.isadd && this.state.Nouns.length < this.msgCount) ? 'block' : 'none' }}>
                         
                            <h3>添加相关名词解释</h3>
                            <section className="editBox">
                                <div>
                                    <Input ref={this.addNounNameRef} placeholder="请输入标题"/>
                                    <Input ref={this.addNounContentRef} placeholder="请输入内容"/>
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

export default Noun

