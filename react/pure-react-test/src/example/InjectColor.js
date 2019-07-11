import React, {Component} from 'react';
import {
    observable,
    decorate,
    autorun,
    action,
    intercept,
    createAtom,
    runInAction,
    extendObservable,
} from "mobx";
import {observer, Provider, inject, Observer} from "mobx-react";
import DevTools from 'mobx-react-devtools';
import _ from 'lodash';

@inject("color")
@observer
class Button extends Component {
    render() {
        return React.createElement(
            "button",
            {
                style: {
                    background: this.props.color
                }
            },
            this.props.children
        )
    }
}

class Message extends Component{
    render(){
        return (
            <div>
                {this.props.text}
                {React.createElement(
                    Button,
                    null,
                    "Delete"
                )}
            </div>
        )
    }
}

const MessageList = function(props){
    const children = props.messages.map((msg)=>{
        return (
            <Message text={msg.text} key={msg.text}></Message>
        )
    });
    return(
        <Provider color={`green`}>
            <div>
                {children}
            </div>
        </Provider>
    )
};



class App extends Component {
    constructor(props) {
        super(props);

    }

    messages= [
        {text: 'Message 1'},
        {text: 'Message 2'},
        {text: 'Message 3'}
    ];


    componentDidMount() {

    }

    render() {
        return (
            <div className="App">
                <MessageList messages={this.messages}></MessageList>
                <DevTools/>
            </div>
        );
    }
}

export default App;
