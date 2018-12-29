import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import App from '../containers/App'
import UserPage from '../containers/UserPage'
import RepoPage from '../containers/RepoPage'
import NotFound from './NotFound'
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory();

const Routes = () => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route path='/:login' component={UserPage}/>
                <Route path='/:login/:name' component={RepoPage}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    )
};

export default Routes
