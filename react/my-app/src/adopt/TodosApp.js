import React from 'react';
import styled from "@emotion/styled";

import {TodosContainer} from "./TodosContainer";
import {TodosList} from "./TodosList";
import {TodosFooter} from "./TodosFooter";

const Heading = styled('h1')`
  font-size: 24px;
  margin: 30px 0 10px;
  padding:0;
  color:#5f27cd;
`;

const Wrapper = styled('div')`
  width:300px;
  margin:0 auto;
`;

export const TodosApp = ()=>(
    <TodosContainer>
        {({todos:{loading, data}})=>(
            <Wrapper>
                <Heading>
                    {loading?"loading...":"Get things done"}
                </Heading>
                {!loading && <TodosList todos={data.todos} />}
                {!loading && <TodosFooter/>}

            </Wrapper>
        )}
    </TodosContainer>
)