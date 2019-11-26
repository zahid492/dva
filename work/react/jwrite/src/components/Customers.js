import React from 'react';
import {Select,message} from 'antd';
import store from "store2";
import _ from 'lodash';

const Option = Select.Option;

export default class CustomerSelect extends React.Component {
     getCurValue = ()=>{
        return{Customer:this.props.customer,Industry:this.props.industry}
    }; 

    
    onCustomerChange = (value) => {     
            let subObjIndex = _.findIndex(this.props.ClientInfo, {clientName: value});

            if (subObjIndex>-1) {
                let sid = this.props.ClientInfo[subObjIndex].subjectId;
                if(!sid)
                {
                    message.warn('请创建该客户的关联实体！');
                    return
                }
                this.props.selectIndustry(value, this.props.ClientInfo[subObjIndex].industry.split(",")[0]);
            }
         
    };

    onIndustryChange = (value) => {
            let subObjIndex = _.findIndex(this.props.ClientInfo, {clientName: this.state.curCustomer});

            if (subObjIndex>-1) {
                
                this.props.selectIndustry(this.props.customer, value);
            }
 
    };

    render() {
        let aOPtCustomer, aOPtIndustry;
        const Account = store.get("Account");
        let customers = this.props.ClientInfo;
        if(Account && Account.uname === window.SpecileUser)
        {
            let subObjIndex = _.findIndex(customers, {clientName: '奈特康赛'});

            if (subObjIndex>-1) {
                 let customer = customers[subObjIndex];
                 customers = [customer];
                 
            }

            
        }
        if (!_.isEmpty(customers)) {
            aOPtCustomer = _.map(customers, ((item, index) => {
                return <Option key={index} value={item.clientName}>{item.clientName}</Option>
            }));
        } else {
            aOPtCustomer = ""
        }

        if (!_.isEmpty(customers)) {
            let subObjIndex = _.findIndex(customers, {clientName: this.props.customer});

            if (subObjIndex>-1) {
                aOPtIndustry = _.map(customers[subObjIndex].industry.split(","), ((item, index) => {
                    return <Option key={item} value={item}>{item}</Option>
                }));
            } else {
                aOPtIndustry = ""
            }

        } else {
            aOPtIndustry = ""
        }

        return (<div id="_customerArea">
                <Select value={this.props.customer  ? this.props.customer : '请选择客户'}
                        style={{width: 160}}
                        onChange={this.onCustomerChange}
                        disabled = {this.props.disabled}
                        getPopupContainer={() => document.getElementById('_customerArea')}>
                    {aOPtCustomer}
                </Select>

                <Select value={this.props.industry ? this.props.industry : '请选择行业'}
                        style={{width: 160, marginLeft: '20px'}}
                        onChange={this.onIndustryChange} 
                        disabled = {this.props.disabled}
                        getPopupContainer={() => document.getElementById('_customerArea')}>
                    {aOPtIndustry}
                </Select>
            </div>);
    }
}