import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { OidcProvider } from 'redux-oidc';

import Routes from './router';
import configureStore from './store/store/configureStore';
import userManager from './services/userManager';
import rootSaga from './store/sagas';

const store = configureStore(window.__INITIAL_STATE__);
store.runSaga(rootSaga);

// 布局容器
class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <OidcProvider store={store} userManager={userManager}>
                    <Routes></Routes>
                </OidcProvider>
            </Provider>
        );
    }
}

export default App;
