import React from 'react'; 
import {connect} from 'react-redux';
import {Icon,Spin} from 'antd' 
import AssistItem from '@/components/EditAssist/EditAssistItem'
import EditAssistImgItem from '@/components/EditAssist/EditAssistImgItem'
import EditAssistCollectedItem from '@/components/EditAssist/EditAssistCollectedItem'
import EditAssistNounItem from '@/components/EditAssist/EditAssistNounItem'
import EditAssistTitleItem from '@/components/EditAssist/EditAssistTitleItem'
import EditAssistItem from '@/components/EditAssist/EditAssistNoTitleItem'
import EditAssistMaterialItem from '@/components/EditAssist/EditAssistMaterialItem'


import Cloud from '@/components/Cloud'

const cloudCategoryName = '标题关键字'

class TabList extends React.Component{   
    render(){ 
          const {tabList,tabTag,searchList,insertHandle,insert,customer,TitleCategorys,TitleCategory,newstype,hidInsert} = this.props;
          
          let loadingStyle = {
            textAlign: 'center',
            paddingTop: '20px'
          }
           //辅助编辑列表
          var itemListEle = <div style={loadingStyle}><Spin size="large"   /></div>; 
            if(tabTag === -3)           
            {   
                if(!tabList)
                { 
                   itemListEle =  <div style={loadingStyle}><Spin size="large" tip="正在查询。。。" /></div>
                }
                else if(tabList.length === 0)
                {
                    itemListEle = <div  style={loadingStyle}>{'没有查询到数据'}</div>;
                   
                }
                else{
                    let categorys = TitleCategorys.filter(tc=>tc._id === TitleCategory);
                    let cName = '';
                    if(categorys.length)
                    {
                        cName = categorys[0].name;
                    }
                    if(cName === cloudCategoryName )
                    {                        
                        let data = tabList.map((item)=>{
                            return {title:item.suggestTitle,id:item._id}
                        });

                        itemListEle = <div style={{position: 'relative' , top:0,left:0,width:'100%',height:'500px'}}>
                                        <span  onClick={searchList} style={{position:'relative', left:'40%',cursor:'pointer'}}>
                                        <Icon type="reload" theme="outlined" /> 换一换</span>

                                        <Cloud fun = {insertHandle} data={data} />
                                    </div>
                    }else{
                         itemListEle = tabList.map((_item, index)=>{return index < 1000 && <EditAssistTitleItem key={index} index={index} data={_item} insert={insert}/> });
                    }
                }
                
            }else{     
                 if(!tabList)
                 { 
                    itemListEle =  <div style={loadingStyle}><Spin size="large" tip="正在查询。。。"   /></div>
                 }else if(tabList.length == 0)
                 {
                    itemListEle =  <div style={loadingStyle}>{'没有查询到数据'}</div>;
                    if(tabTag === -7 && (newstype === 6 || newstype ===  7))
                    {
                        itemListEle =  <div style={loadingStyle}><Spin size="large" tip="数据计算中。。。" /></div>
                    }
                 }else{
                   itemListEle = tabList.map((_item, index) => {
                                if (index < 1000 && tabTag === -1) {
                                    return <EditAssistImgItem key={index} index={index} data={_item} insert={insert}  client={customer}/>
                                } else if (index < 1000 && tabTag === -2) {
                                    return <EditAssistCollectedItem key={index} index={index} data={_item} insert={insert}/>
                                } else if (index < 1000 && tabTag === -7) {
                                    if(newstype === -7001)
                                    {
                                        return <EditAssistNounItem key={index} index={index} data={_item} insert={insert}/>
                                    }else if(newstype === 6 || newstype === 7 )
                                    {
                                        return <EditAssistMaterialItem key={index} index={index} data={_item} insert={insert}/>
                                    }else{
                                        return   <EditAssistItem key={index} index={index} data={_item} insert={insert}/>
                                    }
                                   
                                }               
                                else {
                                    return index < 1000 && <AssistItem key={index} index={index} data={_item} insert={insert} hidInsert={hidInsert}/>
                                }

                       });
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


 