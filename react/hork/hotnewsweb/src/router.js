import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import {ConnectedRouter} from 'connected-react-router';
import {history} from './store/store/configureStore';
import CallbackPage from "./containers/oidc/callback";
import SilentRenew from "./containers/oidc/renew";

import Foot from "./containers/Foot";
import Head from "./containers/Head";
import Index from "./containers/index";
import Loading from "./components/Loading";

import NotFound from "./containers/NotFound";

const LoadableView = Loadable({
    loader: () => import('./containers/view'),
    loading: Loading
});

const LoadableArticles = Loadable({
    loader: () => import('./containers/ListArticle'),
    loading: Loading
});

const LoadableEdit = Loadable({
    loader: () => import('./containers/ArticleEdit'),
    loading: Loading
});

var routes = <div>
    <Switch>
        <Route path="/" render={({history, location, match}) => (
            <div className="wrap">
                <Head/>
                <div style={{minHeight: '800px'}}>
                    <section className="w_100">
                        <Switch>
                            <Route exact path="/" component={Index}/>
                            <Route exact path="/view/:id" component={LoadableView}/>
                            <Route exact path="/list/:topic" component={LoadableArticles}/>
                            <Route exact path="/edit/:id" component={LoadableEdit}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </section>
                </div>
                <Foot/>
            </div>
        )}/>
    </Switch>
</div>;

// c3: ConnectedRouter as child of react-redux's provider
export default function Routes() {
    return (
        <ConnectedRouter history={history}>
            <div className="wrap">
                <Switch>
                    <Route path="/callback" component={CallbackPage}/>
                    <Route path="/renew" component={SilentRenew}/>
                    <Route
                        path="/"
                        render={() => {
                            return routes
                        }}
                    />
                </Switch>
            </div>
        </ConnectedRouter>
    )

}
