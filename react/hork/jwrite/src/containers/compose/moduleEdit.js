import * as React from "react";
import DragulaEle from '@/components/dragula' 
import Tags from '@/components/tags'
import * as query from "@/services/Utils"
import * as apiUrl from '@/services/ApiUrl';
import $ from 'jquery'

export default class App extends React.Component {
  state = {
     tagsData : [],
     modules : this.props.data.modules,
     isCommon : 0
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
        tagsData:[...data]
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

    let item = {...this.props.data};
    item.modules = modules;
    this.props.setTemplate(item)
       
  }
  setCommon = ()=>{
    /* let isCommon = this.state.isCommon;
    if(isCommon === 1)
    {
      this.Sure();
    }else{
       this.setState({
        isCommon : 1
       },()=>{
        this.props.setCommon();
       });
    } */
    let sure = this.props.setCommon();
    if(sure)
    {
      this.Sure();
    }
  }
 
  render () {
    let ele = '';
    if(this.state.modules.length > 0)
    {
      ele = <DragulaEle datas = {this.state.modules} updateData = {this.updateData}/>
    }
    return ( <div className="mokuai_box">

                    <div className="mk-yidong-box">
                      {ele}
                      </div> 
                    <div className="mbt-line"></div>
                    
                    <div className="mk-biaoqian">
                        <Tags datas = {this.state.tagsData} change = {this.setDatas} select = {this.pushDataToModuals}  ManuscriptType={this.props.ManuscriptType}/>                       

                        <div className="mkt-btn-box" style={{clear:'both'}}>
                            <button className="btn-bc mkt-btn-bc fr" onClick = {this.props.cancel}>取消</button>
                            <button className="btn-fh mkt-btn-fh fr" onClick = {this.setCommon.bind(this)}>创建模板</button>

                            <button className="btn-fh mkt-btn-fh fr" onClick = {this.Sure.bind(this)}>使用</button>
                        </div>
                    </div>             
          </div>
             )

  } 
};