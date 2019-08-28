import React from "react";
import styled from "@emotion/styled";
import {adopt} from "react-adopt";
import {Value} from "react-powerplug";

import {TodosContainer} from "./TodosContainer";

const Form = styled('form')`
    display: flex;
    margin: 15px 0 0;
    jestify-content: space-between;
`;

const Input = styled("input")`
  flex:1;
  outline:none;
  padding:7px 10px;
  font-size: 14px;
  color:#8395a7;
`;

const Button = styled("button")`
  padding: 0 15px;
  margin: 0 0 0 5px;
  border: none;
  border-radius: 3px;
  background: #5fa27c;
  font-size: 10px;
  text-transform: uppercase;
  color:white;
`;

const Composed = adopt({
    input: <Value initial=""/>,
    container: <TodosContainer/>
});

export const TodosFooter = () => (
    <Composed>
        {({container: {createTodo}, input}) => {
            const handleAdd = ev => {
                createTodo.mutation({
                    variables: {title: input.value},
                });

                input.set("");
                ev.preventDefault();
            };

            return (
                <Form onSubmit={handleAdd}>
                    <Input
                        type="text"
                        value={input.value}
                        onChange={ev => input.set(ev.target.value)}
                    />
                    <Button type="submit">add</Button>
                </Form>
            )
        }}
    </Composed>
)