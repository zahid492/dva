import * as React from "react";
import Dragula from 'react-dragula'; 
import $ from 'jquery' 
export default class DragulaComponse extends React.Component {    
      render () { 
        let eles = this.props.datas.map((ele,index)=>{
             return <li className="item" data-id = {ele._id} source={ele.source} index = {index} key={ele._id + index + Math.random()}>
                      <div className="mkt-textarea">
                          <div className="mkt-name"> <span className="mk-shuzi">{index +1}</span>  <span className = 'itemname'>{ele.name}</span> </div>
                          <div className="mkt-text" 
                                    tag = {index}
                                    dangerouslySetInnerHTML={{
                                        __html: ele.content
                                    }}></div>  
                          <div className="mkt-text-remark" style={{display:'none'}} 
                                    tag = {index}
                                    dangerouslySetInnerHTML={{
                                        __html: ele.remark
                                    }}></div>                        
                      </div>
                  </li>
        })
         
         return  <ul className="dragula container mk-yidong-list"  ref={this.dragulaDecorator}>
                  {eles}
                </ul>        
      }
       dragulaDecorator = (componentBackingInstance) => { 
        let _this = this;
        if (componentBackingInstance) {
          let options = {removeOnSpill: true,revertOnSpill:true };
          Dragula([componentBackingInstance], options).on('remove',   (el, container, source) =>{   
                     
              let modules= [];               
              $.each($(container).find('li'),(index,li)=>{
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
              _this.props.updateData(modules);

          }).on('drag', function (el, source) {
            
          }).on('dragend', function (el) {
             
            let container = el.parentNode;
            if(container)
            {
              let modules= [];
              $.each($(container).find('li'),(index,li)=>{
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
              _this.props.updateData(modules);
            }
            
        });;
        } 
      };
};