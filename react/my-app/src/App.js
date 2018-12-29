import React, {Component} from 'react';
// import {Button} from 'antd';
import './scss/app.module.scss'
import rxtest from './rx/rxtest';

class App extends Component {

    state = {
        val: 0
    };

    componentDidMount() {
        // let rt = new rxtest();
        // rt.test();
    }

    render() {
        return (
            <div>
                <div id="anchor">
                </div>
            </div>
        );
    }
}


export default App;
