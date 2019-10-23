import React, {Component} from 'react'
import {Checkbox, Modal, Input, message, Popconfirm, List, Icon} from 'antd';
import _ from "lodash";
import $ from 'jquery'
import * as actions from "../../store/actions";
import AddButt from '../AddButton'
import ModelComponent from '../ModelComponent'

class Goods extends Component {
    constructor(props) {
        super(props)
        this.msgCount = 15;

        this.state = {
            Goods: this.props.Goods,
            isadd: true,
            editId: -1
        };
        this.editItem = {};
        this.addGoodsNameRef = React.createRef();
        this.addGoodsOnLineNameRef = React.createRef();
        this.addGoodsOnLineUrlRef = React.createRef();
        this.addGoodsOnLineNameRef2 = React.createRef();
        this.addGoodsOnLineUrlRef2 = React.createRef();
    }
 
    onCheckedChange = (e, id) => {
       
        var Goods = this.state.Goods;

        Goods[id].checked = e.target.checked ? 1 : 0;
        this.props.dispatch(actions.goodsEdit.request({data: Goods, nid: this.props.match.params.nid}))
    };
    // 添加
    addMessage = () => {

        if(this.state.Goods.length > this.msgCount){
            message.info('最多添加' + this.msgCount + '条相关产品');
            return;
        }

        if ($.trim(this.addGoodsNameRef.current.input.value).length === 0
            || $.trim(this.addGoodsOnLineNameRef.current.input.value).length === 0
            || $.trim(this.addGoodsOnLineUrlRef.current.input.value).length === 0) {
                message.info('请填写信息！');
            return;
        }

        //商品第二个站点必须网站名称跟网址都存在
        if (($.trim(this.addGoodsOnLineNameRef2.current.input.value).length > 0 && $.trim(this.addGoodsOnLineUrlRef2.current.input.value).length === 0)
            || ($.trim(this.addGoodsOnLineNameRef2.current.input.value).length === 0 && $.trim(this.addGoodsOnLineUrlRef2.current.input.value).length > 0)
        ) {
            message.info('商品电商2必须电商名称与电商地址同时填写');
            return;
        }
        //let temp = _.concat([], this.state.Goods);

        var goods = this.state.Goods;
        let id = 0
        if(goods.length > 0)
        {
            id = goods[goods.length - 1].rid + 1;
        }
         
        var webSites = [];
        webSites.push({
            title: $.trim(this.addGoodsOnLineNameRef.current.input.value),
            url: $.trim(this.addGoodsOnLineUrlRef.current.input.value)
        });
        if ($.trim(this.addGoodsOnLineNameRef2.current.input.value).length > 0 && $.trim(this.addGoodsOnLineUrlRef2.current.input.value).length > 0) {
            webSites.push({
                title: $.trim(this.addGoodsOnLineNameRef2.current.input.value),
                url: $.trim(this.addGoodsOnLineUrlRef2.current.input.value)
            });
        }
        goods.push({
            rid: id,
            name: this.addGoodsNameRef.current.input.value,
            webSites,
            checked: 0,
        });
        /*
        temp.push({
            "rid": id,
            "name": this.addGoodsNameRef.current.input.value,
            "onlineName": this.addGoodsOnLineNameRef.current.input.value,
            "onlineAddress": this.addGoodsOnLineUrlRef.current.input.value,
            "checked": 0,
        });
        */
        this.setState({
            Goods: goods,
            isadd:false
        }, function () {
            this.props.dispatch(actions.goodsEdit.request({data: goods, nid: this.props.match.params.nid}))
            this.addGoodsNameRef.current.input.value = "";
            this.addGoodsOnLineNameRef.current.input.value = "";
            this.addGoodsOnLineUrlRef.current.input.value = "";
            this.addGoodsOnLineNameRef2.current.input.value = "";
            this.addGoodsOnLineUrlRef2.current.input.value = "";
             
        });
    };

    validEmpty = () => {
        /* let temp = _.concat([], this.state.Goods);
         return _.every(temp, function(v){
             return v.name.trim().length>0
                 && v.onlineName.trim().length>0
                 && v.onlineAddress.trim().length>0;
         });
 */
        var goods = this.state.Goods;
        return _.every(goods, function (v) {
            return v.name.trim().length > 0
                && v.webSites.length > 0
        });

    };
    
    // state 的变化是要放到 reducer 里面的，组件内部微调。 getDerivedStateFromProps 对应于组件整体变化。

    static getDerivedStateFromProps(nextProps, prevState) {
        //if ((_.size(prevState.Goods) === 0 || _.size(prevState.checkedList) === 0 || (_.size(nextProps.Goods) > 0 &&  nextProps.Goods[0].name !=prevState.name[0].title))) {
        return {
            Goods: nextProps.Goods
        };
        // }
        // return null;
    }

    // 保证初始[] 到 异步数据后的渲染
    getSnapshotBeforeUpdate(prevProps, prevState) {
        return null;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(prevProps, prevState, snapshot)
    };

    showAdd = () => {
        if(this.state.Goods.length < this.msgCount)
        {
            this.setState({isadd:true},
                ()=>{             
                    var sTop = $('.ant-modal-body').scrollTop(); 
                    $('.ant-modal-body').scrollTop(sTop + 500);
                 });
        }else{
            message.info('最多添加' + this.msgCount + '条相关产品');
        }
    };

    setEdit = (item) => {
        var rid = item.rid;

        this.editItem = _.extend({}, item);
        this.setState({
            editId: rid
        });
    };

    saveEdit = () => {
        var Goods = this.state.Goods;
        var count = Goods.filter(c => c.name === '').length;
        if (count === 0 && $.trim(this.editItem.name)) {
            //判断商品电商名称及地址是否为空
            var emptyItemCount = 0;
            this.editItem.webSites.forEach((web,i)=>{
                if(($.trim(web.title) !== '' && $.trim(web.url) === '')  || ($.trim(web.title) === '' && $.trim(web.url) !== ''))
                {
                    emptyItemCount++;
                }
                if($.trim(web.title) === '' && $.trim(web.url) === '')
                {
                    this.editItem.webSites.splice(i,1)
                }

            })
            if(emptyItemCount > 0){
                 message.warn('信息不能为空！');
                 return;
            }
            if(this.editItem.webSites.length === 0){
                message.warn('电商网站不能为空！');
                
                return;
           }

            var item = Goods.filter(c => c.rid === this.state.editId)[0];           
            item.webSites = this.editItem.webSites;
            item.name = this.editItem.name;
            this.setState({
                editId: -1
            }, () => {
                this.editItem = {}
            });
            this.props.dispatch(actions.goodsEdit.request({data: Goods, nid: this.props.match.params.nid}))
        } else {
            message.warn('请输入信息');
        }
    };

    onChangeContent = (e, properties, index) => {
        var content = e.target.value;

        if (properties === 'name') {
            this.editItem.name = content;
        } else {
            if(this.editItem.webSites[index])
            {
              this.editItem.webSites[index][properties] = content;
            }else{
                this.editItem.webSites.push({title:'',url:''});
                this.editItem.webSites[index][properties] = content;

            }
            
        }
    };

    DelItem = (i) => {
        var Goods = this.state.Goods;
        Goods.splice(i, 1);
        this.props.dispatch(actions.goodsEdit.request({data: Goods, nid: this.props.match.params.nid}))

    };

    render() {
        let { close} = this.props;
        var addEle = '';
        if(this.state.Goods.length < this.msgCount)
        {
            if (this.state.isadd) {
                addEle = AddButt(this.addMessage, '确定', {}, 'check-circle', '#4fc855');
            } else {
                addEle = AddButt(this.showAdd, '添加');
            }
        }
        var counts = this.state.Goods.filter(goods => goods.checked === 1).length;
        return (

            <Modal
                width={1000}
                className="popup"
                title={[ModelComponent.ModelTitle('相关产品', counts, this.msgCount)]}
                visible={this.props.editGoodsVisible}
                onCancel={close}
                footer={[ModelComponent.Close(close)]}
                destroyOnClose = {true}
            >

                <List
                    itemLayout="horizontal"
                    dataSource={this.state.Goods}
                    renderItem={(item, i) => (
                        <List.Item key={i} actions={[this.state.editId === item.rid ?
                            <Icon type="check-circle" style={{fontSize: 16, color: '#08c'}} onClick={this.saveEdit}/> :
                            <Icon type="edit" style={{fontSize: 16}} onClick={() => {
                                this.setEdit(item)
                            }}/>,
                            <Popconfirm title="确定删除该信息么？" okText="确定" cancelText="取消" onConfirm={() => {
                                this.DelItem(i)
                            }}>
                                <Icon type="delete"/>
                            </Popconfirm>]}

                        >
                            <List.Item.Meta
                                avatar={<Checkbox checked={item.checked === 1}
                                                  onChange={(e) => this.onCheckedChange(e, i)}>{i + 1}</Checkbox>}
                                title={ModelComponent.editInputModel(item, this.state.editId, this.onChangeContent, 'name')}
                                description={ModelComponent.editGoodsModel(item, this.state.editId, this.onChangeContent)}
                            />

                        </List.Item>
                    )}
                />


                <div id="editArea" style = {{display:(this.state.isadd  && this.state.Goods.length < this.msgCount) ? 'block' : 'none' }}>
                    <h3>添加相关产品</h3>
                    <section className="editBox" >
                     <div>
                            <Input ref={this.addGoodsNameRef} placeholder="请添加相关产品"/>
                            <Input ref={this.addGoodsOnLineNameRef} placeholder="请添加电商名称1"/>
                            <Input ref={this.addGoodsOnLineUrlRef} placeholder="请添加电商地址1"/>
                            <Input ref={this.addGoodsOnLineNameRef2} placeholder="请添加电商名称2"/>
                            <Input ref={this.addGoodsOnLineUrlRef2} placeholder="请添加电商地址2"/>
                        </div>
                    </section>
                </div>

                <div style={{padding: '20px 0'}}>
                    {addEle}
                </div>
            </Modal>

        )
    }
}

export default Goods

