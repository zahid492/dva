import React, {Component} from 'react';

import TodoStore from './stores/TodoStore';
import ViewStore from './stores/ViewStore';
import TodoApp from './components/TodoApp';

class Todo extends Component {

    todoStore = TodoStore.fromJS([]);
    viewStore = new ViewStore();

    componentDidMount() {
        this.todoStore.subscribeServerToStore();
    }

    render() {
        return (
            <>
                <TodoApp todoStore={this.todoStore} viewStore={this.viewStore}></TodoApp>
            </>
        );
    }
}

export default Todo;
