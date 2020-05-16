import React, { Component } from 'react';
import loadable from '@loadable/component';

const Loading = loadable(() => import('../components/Loading/Loading'));

export default class Logs extends Component {
    constructor(props) {
        super(props);
        // class properties
        this.state = {
            logs: ['susy', 'allen', 'mm'],
            Com: Loading,
        };
    }

    pushLog(log) {
        this.setState({
            logs: [...this.state.logs, log],
        });
    }

    // TODO：ssr 事件
    handleClick() {
        import(/* webpackChunkName: 'Hello' */ './Hello').then(res => {
            this.setState({
                Com: res.default,
            });
        });
    }

    render() {
        let { Com } = this.state;
        return (
            <div>
                <input placeholder="占位符" />
                <ul className={'list'}>
                    {this.state.logs &&
                        this.state.logs.map((log, index) => {
                            return <li key={index}>{log}</li>;
                        })}
                </ul>
                <Com />
                <button onClick={() => this.handleClick()}>按需加载</button>
            </div>
        );
    }
}
