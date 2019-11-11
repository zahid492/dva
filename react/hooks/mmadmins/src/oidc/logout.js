import React from "react";
import {connect} from "react-redux";
import {SignoutCallbackComponent, userSignedOut} from "redux-oidc";
import {push} from "connected-react-router";
import * as store2 from "store2";
import userManager from '../services/userManager';

class LogoutPage extends React.Component {

    render() {
        return (
            <SignoutCallbackComponent
                userManager={userManager}
                errorCallback={error => {
                    this.props.dispatch(push("/"));
                }}
                successCallback={(user) => {
                    this.props.dispatch(userSignedOut());
                    userManager.removeUser();
                    store2.session("oidc_user", null);
                    this.props.dispatch(push("/"))
                }}>
                <div>重定向中...</div>
            </SignoutCallbackComponent>
        )
    }
}

export default connect()(LogoutPage);