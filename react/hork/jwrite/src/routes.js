import App from './containers/App'
import News from './containers/News'
import Ad from './containers/Ad'

const routes = [{
    component: App,
    path: '/',
    exact: true,
}, {
    path: '/news',
    component: News,

}, {
    path: '/ad',
    component: Ad,

}];

export default routes;