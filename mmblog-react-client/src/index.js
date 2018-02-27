import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import App from './containers/App'

import NotFound from './router/NotFound'

import store from './store/configureStore'

render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);
