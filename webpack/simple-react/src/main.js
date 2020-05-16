import React from 'react';
import ReactDOM from 'react-dom';
import './scss/main.scss';
import App from './views/App';

ReactDOM.render(<App />, window.document.getElementById('app'));

// main.js 只有当开启了模块热替换时 module.hot 才存在
// eslint-disable-next-line no-undef
if (module.hot) {
    // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，
    // 这里表示只接受 ./App 这个子模块
    // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
    // eslint-disable-next-line no-undef
    module.hot.accept(['./views/App'], () => {
        // 新的 App 加载成功后重新执行下组建渲染逻辑
        ReactDOM.render(<App />, window.document.getElementById('app'));
    });
}
