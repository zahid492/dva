import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {OidcProvider} from 'redux-oidc';
import {ConfigProvider, message} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import {PersistGate} from "redux-persist/integration/react";

import Routes from './router';
import configureStore from './store/store/configureStore';
import userManager from './services/userManager';
import rootSaga from './store/sagas';

import './index.css';

const store = configureStore(window.__INITIAL_STATE__);
store.store.runSaga(rootSaga);

message.config({
    top: 350,
    duration: 2,
    maxCount: 3,
});

// 布局容器
class App extends Component {
    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <Provider store={store.store}>
                    <OidcProvider store={store.store} userManager={userManager}>
                        <PersistGate loading={null} persistor={store.persistor}>
                            <Routes></Routes>
                        </PersistGate>
                    </OidcProvider>
                </Provider>
            </ConfigProvider>
        );
    }
}

export default App;
