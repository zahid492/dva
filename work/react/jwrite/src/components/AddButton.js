import React from 'react'
import { Icon } from 'antd';

const Add = (callback,text='添加',style,  icon= 'plus' ,color)=>{
     
    var  _style = { 
        width:'100%',
        height:'30px',
        lineHeight: '30px', 
        border:'1px solid #eee',
        borderRadius: '10px',
        textAlign: 'center',
        MozBoxShadow: '3px 3px 3px #ccc',
        boxShadow: '3px 3px 3px #ccc',
        backgroundColor:'#fff'
    }

    if(style)
    {
        for (var key in style) {
            _style[key] = style[key];
        }
    }
    var iconEle = <Icon type={icon}  />;
    if(color)
    {
        iconEle = <Icon type={icon}  style={{color:color}}/>;
    } 
    var butt = <div style={_style} onClick={callback}>
                   
                  <a href='javascript:;'> {iconEle}  {text}</a>
                
              </div>;
              return butt;
}

export default Add;