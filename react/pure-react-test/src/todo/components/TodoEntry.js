import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {action} from 'mobx';

const ENTER_KEY = 13;

export default observer(class TodoEntry extends React.Component {
    render() {
        return (
            <input
                ref="newField"
                className="new-todo"
                placeholder="What needs to be done?"
                onKeyDown={this.handleNewTodoKeyDown}
                autoFocus={true}
            />
        )
    }

    @action
    handleNewTodoKeyDown = (event) => {
        if (event.keyCode != ENTER_KEY) {
            return;
        }

        event.preventDefault();

        let val = ReactDOM.findDOMNode(this.refs.newField).value.trim();
        if(val){
            this.props.todoStore.addTodo(val);
            ReactDOM.findDOMNode(this.refs.newField).value = ""
        }
    }
})