import React from 'react'
import { Input } from 'antd';

const { TextArea } = Input;

export default {
     ModelTitle(title,checkedCount,tatolCount){
                        var ele = <div key={"head"} style={{color:'#fff'}}>
                                <h2 key={"edit-head"} style={{fontWeight:'bold',color:'#fff'}}>{title}</h2>
                                <p key={"edit-des"}>
                                        <span>已勾选数量：{checkedCount}</span>
                                        <span style={{display:'inline-block',position:'relative', float: 'right'}}>最多显示 {tatolCount} 条{title}</span>
                                </p>
                                </div>;
                        return ele;
                },
    Close(callback){
        return <button key={"edit-cancel"} type="button" className="btn btn--grayblue" onClick={callback}><span>关闭</span></button>
    },
    
    editModel(item,editid,saveEdit,properties){
              var ele = '';
              var id = item.rid;
              var c = item.content;
                 if(properties)
                 {
                        c = item[properties];
                 }

              if(id === editid)
              {                
                 ele = <TextArea defaultValue={c} onChange = {(e)=>{saveEdit(e,properties)}} />
              }else{
                ele = <div>{c}</div>
              }
              return ele;
    },
    editInputModel(item,editid,saveEdit,properties){
        var ele = '';
        var id = item.rid;
        var c = item.content;
           if(properties)
           {
                  c = item[properties];
           }

        if(id === editid)
        {                
           ele = <Input defaultValue={c} onChange = {(e)=>{saveEdit(e,properties)}} />
        }else{
          ele = <div>{c}</div>
        }
        return ele;
},
    editGoodsModel(item,editid,saveEdit){
        var ele = [];
        var id = item.rid;
        var webSites = item.webSites;
 

        if(id === editid)
        {     
                webSites.forEach((element,i) => {
                        var title = element.title;
                        var url = element.url;
                        ele.push(<Input key={i + 'title'} defaultValue={title} onChange = {(e)=>{saveEdit(e,'title',i)}} />);
                        ele.push(<Input  key={i + 'url'} defaultValue={url} onChange = {(e)=>{saveEdit(e,'url',i)}} />);

                });    
                if(webSites.length === 1)
                {
                        ele.push(<Input key={'title1'}  onChange = {(e)=>{saveEdit(e,'title',1)}} />);
                        ele.push(<Input  key={'url1'}   onChange = {(e)=>{saveEdit(e,'url',1)}} />);
                }       
            
        }else{
                webSites.forEach((element,i) => {
                        var title = element.title;
                        var url = element.url;
                        ele.push(<div key={i + 'title'}>{title}</div>);
                        ele.push(<div key={i + 'url'}>{url}</div>);

                });  
           
        }
        return ele;
      },
      editNewsModel(item,editid,saveEdit){
        var ele = '';
        var id = item.rid;
        if(id === editid)
        {          ele = <div> 
                         <Input defaultValue={item.title} onChange = {(e)=>{saveEdit(e,'title')}} />
                         <TextArea style={{marginTop:'10px'}} defaultValue={item.content} onChange = {(e)=>{saveEdit(e,'content')}} />
                        </div>          
        }else{                
                        ele = <div> 
                                {item.title}
                              </div>
           
        }
        return ele;
}
   } 
    

  