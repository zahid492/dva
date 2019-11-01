import React from 'react';
import {Layout, Menu} from 'antd';

import {Switch, Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import {ConnectedRouter, push} from 'connected-react-router';

import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import {history} from './store/store/configureStore';


import userManager from './services/userManager';
import CallbackPage from "./oidc/callback";
import LogoutPage from "./oidc/logout";
import SilentRenew from "./oidc/silent-renew";

import Index from "./views/index";

import Loading from "./components/Loading";
import NotFound from "./views/NotFound";

const {Sider, Content} = Layout;
const {SubMenu} = Menu;
//媒体账号
const MediaAccount = Loadable({
    loader: () => import('./views/MyMedia/Account'),
    loading: Loading
});
//模板语言
const TplLang = Loadable({
    loader: () => import('./views/HotNews/TplLang'),
    loading: Loading
});

//统计账号
const StatisticsAccount = Loadable({
    loader: () => import('./views/Statistics/Account'),
    loading: Loading
});

//日志列表
const LogsLog = Loadable({
    loader: () => import('./views/Logs/Log'),
    loading: Loading
});

//test
const Test = Loadable({
    loader: () => import('./views/Test/index'),
    loading: Loading
});

function menuItemClick({item, key, keyPath, domEvent}) {
    console.log("push: ", key, `/${key}`)
    history.push(`/${key}`);
}

var routes = <div>
    <Switch>
        <Route path="/" render={({history, location, match}) => (
            <Layout>
                <Sider style={{position: "fixed", zIndex: 1, left: 0, top: 0, height: "100vh"}}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['hotNews_1']}
                        defaultOpenKeys={['hotNews']}
                        style={{height: '100%', borderRight: 0}}
                        onClick={menuItemClick}
                    >
                        <SubMenu
                            key="hotNews"
                            title={
                                <span>热文管理</span>
                            }
                        >
                            <Menu.Item key="media-account">媒体账号管理</Menu.Item>
                            <Menu.Item key="test">Test</Menu.Item>
                            <Menu.Item key="hotNews_2">新闻源</Menu.Item>
                            <Menu.Item key="hotNews_3">模板</Menu.Item>
                            <Menu.Item key="hotNews_4">框架</Menu.Item>
                            <Menu.Item key="hotNews_5">模块</Menu.Item>
                            <Menu.Item key="hotNews_6">细分</Menu.Item>
                            <Menu.Item key="tpl-lang">模板语言</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="statistics"
                            title={
                                <span>统计分析</span>
                            }>
                            <Menu.Item key="statistics-account">账号</Menu.Item>
                            <Menu.Item key="statistics-platform">平台</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="logs"
                            title={
                                <span>日志</span>
                            }>
                            <Menu.Item key="logs-log">日志列表</Menu.Item>
                        </SubMenu>

                    </Menu>
                </Sider>
                <Content style={{marginLeft: "200px", padding: "10px"}}>
                    <Switch>
                        <Route exact path="/" component={Index}/>

                        <Route exact path="/media-account" component={MediaAccount}/>
                        <Route exact path="/tpl-lang" component={TplLang}/>

                        <Route exact path="/statistics-account" component={StatisticsAccount}/>
                        <Route exact path="/statistics-platform" component={TplLang}/>

                        <Route exact path="/logs-log" component={LogsLog}/>

                        <Route exact path="/test" component={Test}/>

                        <Route component={NotFound}/>
                    </Switch>
                </Content>
            </Layout>
        )}/>
    </Switch>
</div>;

// c3: ConnectedRouter as child of react-redux's provider
export default function Routes() {
    return (
        <ConnectedRouter history={history}>
            <ConfigProvider locale={zhCN}>
                <div className="wrap">
                    <Switch>
                        <Route path="/logout" component={LogoutPage}/>
                        <Route path="/callback" component={CallbackPage}/>
                        <Route path="/silent-renew" component={SilentRenew}/>
                        <Route
                            path="/"
                            render={() => {
                                userManager.getUser().then((user) => {
                                    if (!user || user.expired) {
                                        // userManager.clearStaleState();
                                        userManager.signinRedirect();
                                    }
                                }).catch((err) => {
                                    console.error(err)
                                });
                                return routes
                            }}
                        />
                    </Switch>
                </div>
            </ConfigProvider>
        </ConnectedRouter>
    )

}
