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

import {types, onSnapshot} from "mobx-state-tree";
import DevTools from 'mobx-react-devtools';
import _ from 'lodash';


const Todo = types.model("Todo", {
    title: types.string,
    done: false
}).actions(self => ({
    toggle() {
        self.done = !self.done
    }
}));

const Store = types.model("Store", {
    loaded:types.boolean,
    endpoint: "http://localhost:3000",
    todos: types.array(Todo),
    selectedTodo: types.reference(Todo)
}).views(self=>{
    return {
        get complatedTodos(){
            return self.todos.filter(t=>t.done)
        },
        findTodosByUser(user){
            return self.todos.filter(t=>t.assignee === user)
        }
    }
}).actions(self=>{
    return {
        addTodo(title){
            self.todos.push({
                id:Math.random(),
                title
            })
        }
    }
});

const store = Store.create({
    todos:[
        {title: "Get coffee"}
    ]
});

onSnapshot(store, snapshot => {
    console.dir(snapshot)
});

store.todos[0].toggle();

class App extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className="App">
                <DevTools/>
            </div>
        );
    }
}

export default App;
