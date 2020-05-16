import React, { Component } from 'react';
import loadable from '@loadable/component';
import CurrentTime from '../components/CurrentTime';
import ErrorBoundary from '../components/ErrorBoundary';

const AsyncCom = loadable(props => import(`./${props.page}`));

export default class App extends Component {
    render() {
        return (
            <div>
                <CurrentTime />
                <ErrorBoundary>
                    <AsyncCom page="Logs" />
                    <AsyncCom page="Hello" />
                </ErrorBoundary>
            </div>
        );
    }
}
