import React, { Component } from "react";
import { Provider } from "react-redux";
//import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import { Router as HashRouter, Switch, Route } from "react-router-dom";

//import store from "store2";
import configureStore from "@/store/store/configureStore";
import rootSaga from "@/store/sagas";

import NotFound from "@/containers/NotFound";
import Head from "@/containers/Head";
import Foot from "@/containers/Foot";

import WriteInput from "@/containers/Write/index";

import WriteList from "@/containers/Write/WriteList";
import WriteEdit from "@/containers/Write/WriteEdit";

import SeoList from "@/containers/seo/list";
import SeoEdit from "@/containers/seo/edit";

import ComposeInput from "@/containers/compose/index";
import ComposeEdit from "@/containers/compose/edit";
import ComposeList from "@/containers/compose/list";

import MyArticles from "@/containers/MyArticles";
import Callback from "@/containers/callback";
import Renew from "@/containers/renew";

import mgr from '@/containers/userManager'

import createHistory from "history/createHashHistory";

//import { makeAuthenticator, makeUserManager, Callback } from 'react-oidc'

const history = createHistory();

const storew = configureStore(window.__INITIAL_STATE__);
storew.runSaga(rootSaga);
 


// 布局容器

class App extends Component {
  componentDidMount(){
         
        mgr.getUser().then(function(user) {
                    if (!user) {
                     return  mgr.signinRedirect();                       
                    }
                  })
                  .catch(function(err) {
                   return  mgr.signinRedirect();
                  });
  }
  render() {
   
    return (
      <Provider store={storew}>
        <HashRouter history={history}>
          <div className="wrap">
            <Switch>
              <Route path="/callback" component={Callback} />
              <Route path="/renew" component={Renew} />
              <Route 
                path="/"
                render={routeProps => { 
                  return (
                            <div>
                              <Head />
                              <content style={{ minHeight: "800px" }}>
                                <section className="w_100">
                                  <Switch>
                                    <Route exact path="/" component={ComposeInput} />

                                    <Route
                                      exact
                                      path="/compose"
                                      component={ComposeInput}
                                    />
                                    <Route
                                      exact
                                      path="/compose/edit/:id"
                                      component={ComposeEdit}
                                    />
                                    <Route
                                      exact
                                      path="/compose/list/:nid/:page?"
                                      component={ComposeList}
                                    />

                                    <Route
                                      path="/write/edit/:id"
                                      component={WriteEdit}
                                    />
                                    <Route exact path="/write" component={WriteInput} />
                                    <Route
                                      path="/write/list/:nid/:page?"
                                      component={WriteList}
                                    />

                                    <Route path="/seo/edit/:id" component={SeoEdit} />
                                    <Route
                                      path="/seo/list/:nid/:page?"
                                      component={SeoList}
                                    />

                                    <Route path="/my" component={MyArticles} />

                                    <Route component={NotFound} />
                                  </Switch>
                                  <div className="last_bg">
                                    <img src="/img/last_bg_07.png" alt="" />
                                  </div>
                                </section>
                              </content>
                              <Foot />
                            </div>
                          );
                 
                }}
              />
            </Switch>
          </div>
        </HashRouter>
      </Provider>
    );
  }
}
export default App;

/*
class App extends Component {
  render() {
    return (
      <Provider store={storew}>
        <HashRouter history={history}>
          <div className="wrap">
            
                      <Head />
                      <content style={{ minHeight: "800px" }}>
                        <section className="w_100">
                          <Switch>
                            <Route exact path="/" component={ComposeInput} />

                            <Route
                              exact
                              path="/compose"
                              component={ComposeInput}
                            />
                            <Route
                              exact
                              path="/compose/edit/:id"
                              component={ComposeEdit}
                            />
                            <Route
                              exact
                              path="/compose/list/:nid/:page?"
                              component={ComposeList}
                            />

                            <Route
                              path="/write/edit/:id"
                              component={WriteEdit}
                            />
                            <Route exact path="/write" component={WriteInput} />
                            <Route
                              path="/write/list/:nid/:page?"
                              component={WriteList}
                            />

                            <Route path="/seo/edit/:id" component={SeoEdit} />
                            <Route
                              path="/seo/list/:nid/:page?"
                              component={SeoList}
                            />

                            <Route path="/my" component={MyArticles} />

                            <Route component={NotFound} />
                          </Switch>
                          <div className="last_bg">
                            <img src="/img/last_bg_07.png" alt="" />
                          </div>
                        </section>
                      </content>
                      <Foot />
                    </div>
                   
        </HashRouter>
      </Provider>
    );
  }
}
debugger;
console.log(apiUrl.OIDCConfig);
const userManager = makeUserManager(apiUrl.OIDCConfig)
const AppWithAuth = makeAuthenticator({
  userManager: userManager,
  signinArgs: {
    state: {
      foo: 15
    }
  }
})(App)


export default () => (
  <HashRouter  history={history}>
    <Switch>
      <Route
        path="/callback"
        render={routeProps => (
          <Callback
            onSuccess={user => {
              debugger;
              // `user.state` will reflect the state that was passed in via signinArgs.
              routeProps.history.push('/')
            }}
            onError = {

            }
            userManager={userManager}
          />
        )}
      />
      <AppWithAuth />
    </Switch>
  </HashRouter>
)
*/

