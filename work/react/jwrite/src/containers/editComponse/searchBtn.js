import React from 'react';
import {Button} from 'antd'

const SearchBtn = (top,left,fun) =>(
    <div id = 'searchBtnPanel' style = {{width : '30px',height :'30px',background : '#fff',position:'absolute', top:top,left:left}}>
        <Button icon='search'  style={{'zIndex':99999,position:'relative',color:'yellowgreen'}} shape="circle" onClick = {fun.bind(null,'') }/>
    </div>
)

export default SearchBtn