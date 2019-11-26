import React, {Component} from 'react'
import $ from "jquery";
import _ from "lodash";

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function N2H (WrappedComponent){
    N2H.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;

    return class HocN2 extends Component {
        constructor(props) {
            super(props);

            this.state = {
                editVisible: false,
                checkedList: this.props.checkedList,
            };
        }

        static getDerivedStateFromProps(nextProps, prevState) {

            let nstate = null;

            if (prevState.checkedList !== nextProps.checkedList) {
                nstate = _.extend(nstate, {
                    checkedList: nextProps.checkedList
                });
            }

            if(!_.isEmpty(nstate)){
                return nstate;
            }

            return nstate;
        }

        showEditModal = () => {
            this.setState({
                editVisible: true,
            });
        };

        // 显示编辑框
        editShow = (e, id) => {
            let curEl = $(e.currentTarget).closest(".editBoxE");
            let aream = curEl.find(".editModify");
            let arear = curEl.find(".editRead");
            arear.hide();
            aream.show();
        };

        editCancel = () => {
            this.setState({
                editVisible: false,
            });
            const pel = $(".editBoxE");
            pel.find(".editModify").css("display", "none");
            pel.find(".editRead").css("display", "block");
        };

        // 内外检查的问题
        addChecked = (id)=>{
            const i = _.indexOf(this.state.checkedList, id);
            const temp = _.concat([], this.state.checkedList);

            if (i === -1) {
                temp.push(id);
                this.setState({
                    checkedList: temp
                })
            }
        };

        removeChecked = (id)=>{
            const i = _.indexOf(this.state.checkedList, id);
            if(i!==-1){
                const temp = _.concat([], this.state.checkedList);
                _.pull(temp, id);
                this.setState({
                    checkedList: temp
                })
            }
        };

        render(){
            const newProps = {
                showEditModal:this.showEditModal,
                editShow: this.editShow,
                editCancel: this.editCancel,
                removeChecked: this.removeChecked,
                addChecked: this.addChecked
            };
            return <div>
                <WrappedComponent {...this.props} {...newProps} {...this.state}/>
            </div>
        }
    }
}

