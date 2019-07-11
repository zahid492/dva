import React from 'react';
import {observer} from 'mobx-react';
import {observable, action, computed} from 'mobx';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default observer(class TodoItem extends React.Component {
    @observable editText = "";

    render() {
        const {todo} = this.props;
        return (
            <li
                className={[
                    todo.complated ? "complated" : "",
                    this.isBeingEdited ? "editing" : ""
                ].join(" ")}
            >
                <div className="view">
                    <input type="checkbox"
                           className="toggle"
                           checked={todo.complated}
                           onChange={this.handleChange}
                    />
                    <label onDoubleClick={this.handleEdit}>{todo.title}</label>
                    <button className="destroy" onClick={this.handleDestroy}></button>
                </div>
                <input
                    type="text"
                    ref="editField"
                    className="edit"
                    value={this.editText}
                    onBlur={this.handleSubmit}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />

            </li>
        )
    }

    @computed
    get isBeingEdited() {
        return this.props.viewStore.todoBeingEdited === this.props.todo;
    }

    @action
    handleSubmit = () => {
        const val = this.editText.trim();
        if (val) {
            this.props.todo.setTitle(val);
            this.editText = val;
        } else {
            this.handleDestroy();
        }
        this.props.viewStore.todoBeingEdited = null;
    };

    @action
    handleDestroy = () => {
        this.props.todo.destroy();
        this.props.viewStore.todoBeingEdited = null;

    };

    @action
    handleEdit = () => {
        const todo = this.props.todo;
        console.log(todo)
        this.props.viewStore.todoBeingEdited = todo;
        this.editText = todo.title;
    };

    @action
    handleKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.editText = this.props.todo.title;
            this.props.viewStore.todoBeingEdited = null;
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit(event);
        }
    };

    @action
    handleChange = (event) => {
        this.editText = event.target.value;
    };

    @action
    handleToggle = () => {
        this.props.todo.toggle();
    };

});