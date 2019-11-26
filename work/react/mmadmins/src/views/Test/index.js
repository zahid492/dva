import React from "react";
import {Row, Col, message} from "antd";
import Api from '../../services/api';

const Observer = (function () {
    let message = {};
    return {
        regist: (type, fn) => {
            if(typeof message[type]==='undefined'){
                message[type] = [fn];
            }else{
                message[type].push(fn);
            }
        },

        fire: (type, args)=>{
            if(!message[type]) return;
            let events = {
                type: type,
                args: args || {}
            };
            let i=0, len = message[type].length;
            for(;i<len; i++){
                message[type][i].call(this, events)
            }
        },

        remove: (type, fn)=>{
            if(message[type] instanceof Array){
                let i = message[type].length -1;
                for(; i>=0; i--){
                    message[type][i] === fn && message[type].splice(i, 1);
                }
            }
        }
    }
})();

export default function AccountTest() {

    Observer.regist('test', (e)=>{
        console.log(e.type, e.args)
    });

    Observer.fire('test', {msg: 111});
    return (
        <>
            <Row>
                <Col span={24}>

                </Col>
            </Row>
        </>

    )
}
