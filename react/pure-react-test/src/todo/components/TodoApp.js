import React from 'react';
import {observer} from 'mobx-react';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

import TodoEntry from './TodoEntry';
import TodoOverview from './TodoOverview';

import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';


export default observer(class TodoApp extends React.Component{
    render() {
        const {todoStore, viewStore} = this.props;
        return (
            <div>
                <header className="header">
                    <TodoEntry todoStore={todoStore}></TodoEntry>
                    <TodoOverview todoStore={todoStore} viewStore={viewStore} />
                </header>
            </div>
        )
    }
})