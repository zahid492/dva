import React from 'react'
// "babel-preset-react-app": "^3.1.1",
import App from './containers/App'
import UserPage from './containers/UserPage'
import RepoPage from './containers/RepoPage'

const routes = [{
    component: App,
    path: '/',
    exact: true,
}, {
    path: '/:login',
    component: UserPage,
    routes: [
        {
            path: '/:login/:name',
            component: RepoPage
        }
    ]
}];

export default routes;