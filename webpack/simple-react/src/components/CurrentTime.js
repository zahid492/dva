import React, { Component } from 'react';
import loadable from '@loadable/component';

// todo: ssr moment
const LoadMoment = loadable.lib(() => import('moment'));

export default class CurrentTime extends Component {
    mom = React.createRef();

    handleClick = () => {
        console.log(this.mom.current);
        if (this.mom.current) {
            // format("HH:mm")
            return console.log(this.mom.current.default.now());
        }
    };

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>几点了?</button>
                <LoadMoment
                    fallback={new Date().toLocaleDateString()}
                    ref={this.mom}
                >
                    {({ default: moment }) => {
                        return <strong> {moment(new Date()).format()}</strong>;
                    }}
                </LoadMoment>
            </div>
        );
    }
}
