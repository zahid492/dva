import React, {Component} from 'react';
import {connect} from "react-redux";
import {Table, Input, Button, Modal, Select, message} from 'antd';

const _ = window._;

const Option = Select.Option;
const Search = Input.Search;

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        console.log("Home")
    }

    render() {

        return (
            <div>views/index</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        oidc: state.oidc
    }
};

export default connect(mapStateToProps)(Index);



