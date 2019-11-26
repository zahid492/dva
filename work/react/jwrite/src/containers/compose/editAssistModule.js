import * as React from "react";
import {Modal,Input, message} from 'antd'
import DragulaEle from '@/components/dragula' 
import Tags from '@/components/tags'
import * as query from "@/services/Utils"
import * as apiUrl from '@/services/ApiUrl';
import $ from 'jquery'

export default class App extends React.Component {
  state = {
     tagsData : [],
     modules : this.props.data.modules,
     setCommonVisible:false,
     data : this.props.data
  }
 
 
  componentDidMount(){ 
    this.fetchModuals();
  }
  fetchModuals = ()=>{
    let url = apiUrl.apiMKDatasGetUrl.replace('{type}',this.props.ManuscriptType);
    query.callData(url).then(res=>{
       if(res.code == 200)
       {
         let data = res.data;
         this.setState({
            tagsData:data
         });
       } 
    })
  }
  setDatas = (data)=>{
      this.setState({
        tagsData:data
      });
  }
  pushDataToModuals = (_module)=>{
    let modules = this.state.modules;
    modules.push(_module);
    this.setState({
      modules
    });

  }
  updateData = (_modules)=>{ 
    let modules = this.state.modules;
    modules = [..._modules];
    this.setState({
      modules:[]
    },()=>{
      this.setState({
        modules:modules
      });
    });
      
  }
  Sure = ()=>{
    let modules= [];
    $.each($('.dragula li'),(index,li)=>{
          let id = $(li).attr('data-id');
          let name = $(li).find('.itemname').html();
          let source = $(li).attr('source');
          let content = $(li).find('.mkt-text').html();
          let remark = $(li).find('.mkt-text-remark').html();

          let d = {
             _id:id,name,source,remark,content
          }
          modules.push(d);
           
    })

    let item = this.props.data;
    item.modules = modules;
    this.props.setTemplate(item)
       
  }
  closeEditModal = ()=>{
     this.setState({
      setCommonVisible : false
     });
  }
  openEditModal = ()=>{
    let data = this.state.data;
    let _data = {...data,name:''}
    this.setState({
      data:_data,
     setCommonVisible : true
    });
  }
  okEvent = ()=>{
    let data = this.state.data;
    if($.trim(data.name))
    {
        let modules= [];
        $.each($('.dragula li'),(index,li)=>{
              let id = $(li).attr('data-id');
              let name = $(li).find('.itemname').html();
              let source = $(li).attr('source');
              let content = $(li).find('.mkt-text').html();
              let remark = $(li).find('.mkt-text-remark').html();

              let d = {
                _id:id,name,source,remark,content
              }
              modules.push(d);
              
        })
    
        data.modules = modules;

          let url = apiUrl.apimoduleDataAddUrl; 
          query.__request('post',url,data);
          
        this.props.setTemplate(data);
        this.closeEditModal();
    }else{
      message.info('请输入新模板名称');
    }
    
  }
  changeName = (e) =>{
    let data = this.state.data;
    let _data = {...data}
    _data.name = e.target.value;
    this.setState({
      data:_data
    });
  }
  render () {
    let ele = '';
    if(this.state.modules.length > 0)
    {
      ele = <DragulaEle datas = {this.state.modules}  updateData = {this.updateData}/>
    }
    return ( <div className="mokuai_box">

                    <div className="mk-yidong-box">
                      {ele}
                      </div> 
                    <div className="mbt-line"></div>
                    
                    <div className="mkc-biaoqian"> 
                         <div style={{width: '95%',overflowY: 'scroll',height: '180px'}}>
                           <Tags datas = {this.state.tagsData} change = {this.setDatas} select = {this.pushDataToModuals}  ManuscriptType={this.props.ManuscriptType}/>                       
                         </div>
                        <div className="mkc-btn-box" style={{paddingRight:'40px'}}> 
                            <button className="btn-fh mkt-btn-fh fr" onClick = {this.openEditModal}>设为常用</button>
                            <button className="btn-fh mkt-btn-fh fr" onClick = {this.Sure.bind(this)}>使用</button>
                        </div>
                    </div>   
                    <Modal visible={this.state.setCommonVisible} title= {'设为常用'} okText={'确定'} cancelText = {'取消'} destroyOnClose={true} maskClosable = {false}  width = '400px' onOk = {this.okEvent} onCancel={this.closeEditModal}  >
                       模板名称：<Input value = {this.state.data.name} style= {{width:'240px'}} onChange = {this.changeName} />
                    </Modal>          
          </div>
             )

  } 
};