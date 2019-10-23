import React from 'react'
import { Modal  } from 'antd';

/* const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin /> */
 
class Loading extends React.Component{
     render(){
         return (
            <Modal
            className={"spinModal"}
            width={"50px"}
            wrapClassName="vertical-center-modal"
            maskClosable = {false}
            closable={false}
            style={{top: 20}}
            visible={this.props.loading}
            footer={null}
        >
            <img src='/img/loading.gif' alt='' style={{marginLeft: '-50px',marginTop: '-50px'}} />
            <div style={{color:'#fff',marginLeft: '-25px'}}>Loading...</div>
        </Modal>
         ) 
     }
}

 
 export default Loading