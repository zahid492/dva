import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import HeadUser from '../components/HeadUser'
import userManager from '../services/userManager'

//公用Head
class Head extends Component {
    constructor(props) {
        super(props);

        // userManager.getUser().then(function (user) {
        //     if (!user || user.expired) {
        //         console.log("head no:", user);
        //         // userManager.signinRedirect();
        //     }
        // }).catch(function (err) {
        //     console.error(err)
        // });

        userManager.getUser().then(function (user) {
            if (!user || user.expired) {
                console.log("head no:", user);
                userManager.signinRedirect();
            }
        }).catch(function (err) {
            console.error(err)
        });
    }

    state = {
        dropdown: false
    };

    logoOut = () => {
        userManager.removeUser();
        userManager.signoutRedirect();
    };

    menuChange = (visible) => {
        this.setState({
            dropdown: visible
        })
    };

    render() {
        return (
            <div>
                <header style={{height: '80px', width: '100%'}}>
                    <section className='w_100'
                             style={{padding: 0, height: '80px', lineHeight: '80px', margin: '0 auto'}}>
                        <div className="logo" style={{paddingLeft: '30px'}}>
                            <img src="/img/logo2.1.png" alt=''/>
                            <span style={{
                                fontSize: '24px',
                                color: '#fff',
                                position: 'relative',
                                left: '40px'
                            }}>热门话题机器人</span>
                        </div>

                        <HeadUser logoOut={this.logoOut}></HeadUser>
                    </section>

                </header>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        oidc: state.oidc
    }
};

export default connect(mapStateToProps)(withRouter(Head));
// export default connect()(withRouter(Head))