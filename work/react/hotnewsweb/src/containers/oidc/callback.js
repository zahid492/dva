import React from "react";
import {connect} from "react-redux";
import {CallbackComponent} from "redux-oidc";
import {push} from "connected-react-router";
import userManager from '../../services/userManager';

class CallbackPage extends React.Component {

    render() {
        return (
            <CallbackComponent
                userManager={userManager}
                errorCallback={error => {
                    this.props.dispatch(push("/"));
                }}
                successCallback={(user) => {
                    this.props.dispatch(push("/"))
                }}>
                <div>重定向中...</div>
            </CallbackComponent>
        )
    }
}

export default connect()(CallbackPage);