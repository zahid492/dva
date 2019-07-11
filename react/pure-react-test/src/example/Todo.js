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
    untracke
} from "mobx";
import {observer, Provider, inject, Observer} from "mobx-react";
import DevTools from 'mobx-react-devtools';
import _ from 'lodash';

const todoFactory = function (title) {

    const todo = observable({
        id: Math.random(),
        title: title,
        finished: false,
        toggleStatus: action(function () {
            todo.finished = !todo.finished;
        })
    });


    return todo;
};

const todoListFactory = function () {
    const todoList = observable({
        todos: [],
        get unfinishedTodoCount() {
            return todoList.todos.filter(function (todo) {
                return !todo.finished;
            }).length;
        },

        addTodo: action(function (todo) {
            todoList.todos.push(todo);
        }),

        addTodos: action(function (todos) {
            todoList.todos = todoList.todos.concat(todos);
        })
    });

    return todoList;
};

const TodoListView = observer(function () {

    return (
        <div>
            <span>{this.props.todoList.unfinishedTodoCount}</span>
            <ul>
                {
                    this.props.todoList.todos.map((todo) => {
                        return (
                            <TodoView todo={todo} key={todo.id}></TodoView>
                        )
                    })
                }
            </ul>

        </div>
    )
});

const TodoView = observer(class TodoView extends Component {
    constructor(props) {
        super(props)
    }

    selectHandler = () => {
        this.props.todo.toggleStatus();
    };

    render() {
        const todo = this.props.todo;
        return (
            <li>
                {todo.title}
                <input type="checkbox"
                       checked={todo.finished}
                       onChange={this.selectHandler}/>
            </li>
        )
    }
});



class App extends Component {
    constructor(props) {
        super(props);
    }

    store = todoListFactory();

    componentDidMount() {
        this.store.addTodos([todoFactory('Get Coffee'), todoFactory('Write simpler code')]);
        this.store.todos[0].toggleStatus(true);
    }

    render() {
        return (
            <div className="App">
                <TodoListView todoList={this.store}></TodoListView>
                <DevTools/>
            </div>
        );
    }
}

export default App;
