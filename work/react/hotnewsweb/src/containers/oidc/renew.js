import React from "react";
import {connect} from "react-redux";
import { processSilentRenew } from 'redux-oidc';

class SilentRenew extends React.Component {
    render() {
        processSilentRenew();

        return (
                <div>重定向中...</div>

        )
    }
}

export default connect()(SilentRenew);