import React from 'react'; 
import {connect} from 'react-redux';
import {Spin} from 'antd' 
import NWItem from '@/components/EditAssist/EditNWItem'
import EditAssistTitleItem from '@/components/EditAssist/EditAssistTitleItem'
import EditAssistImgItem from '@/components/EditAssist/EditAssistImgItem'
import AssistItem from '@/components/EditAssist/EditAssistWebItem'

 

class TabList extends React.Component{   
    render(){ 
          const {tabList,tabTag,insertHandle,changeEvent} = this.props;
          
          let loadingStyle = {
            textAlign: 'center',
            paddingTop: '20px'
          }
           //辅助编辑列表
          var itemListEle = <div style={loadingStyle}><Spin size="large"   /></div>; 
            if(!tabList)
                { 
                   itemListEle =  <div style={loadingStyle}><Spin size="large" tip="正在查询。。。" /></div>
                }
                else if(tabList.length === 0)
                {
                    itemListEle = <div  style={loadingStyle}>{'没有查询到数据'}</div>;
                   
                }
            else{
                if(tabTag === -3)           
                {                     
                    itemListEle = tabList.map((_item, index)=>{return  <EditAssistTitleItem key={index} index={index} data={_item} insert={insertHandle}/> });                                  
                }
                if(tabTag === 2)           
                {                  
                    itemListEle = tabList.map((_item, index)=>{return   <NWItem key={index} index={index} data={_item} insert={insertHandle}  changeEvent= {changeEvent} />  });                
                }
                if(tabTag === -6)           
                {                  
                    itemListEle = tabList.map((_item, index)=>{return   <EditAssistImgItem key={index} index={index} data={_item} /> });                                  
                }
                if(tabTag === -5)           
                {                  
                    itemListEle = tabList.map((_item, index)=>{return   <AssistItem key={index} index={index} data={_item} /> });                               
                }if(tabTag === 6)           
                {                  
                    itemListEle = tabList.map((_item, index)=>{return   <NWItem key={index} index={index} data={_item} insert={insertHandle}  changeEvent= {changeEvent} />  });                
                }
                
        }
             
            
         
          return (
            <div>
              {itemListEle}
             </div>
          )
    }
}
function mapStateToProps(state, ownProps) {
    const TitleCategorys = state.ActileEditTitleCategory.data;

    return {TitleCategorys}
}

export default connect(mapStateToProps)(TabList) 


 