import React from "react";
import {ApolloClient} from "apollo-client";
import {ApolloProvider, useQuery, useMutation} from "@apollo/react-hooks";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";

const client = new ApolloClient({
    link: new HttpLink({
        uri: "https://plp0mopxq.sse.codesandbox.io/"
    }),
    cache: new InMemoryCache()
});

const get_todos = gql`
    {
        todos{
            id,
            type
        }
    }
`;

const update_todo = gql`
    mutation UpdateTodo($id:String!, $type:String!){
        updateTodo(id: $id, type:$type){
            id,
            type
        }
    }
`;

function Todos() {
    const {loading, error, data} = useQuery(get_todos);
    const [updateTodo, {loading: mutationLoading, error: mutationError}] = useMutation(update_todo);

    if(loading) return <p>loading</p>;
    if(error) return <p>error</p>;

    return data.todos.map(({id, type})=>{
        let input;

        return (
            <div key={id}>
                <p>{type}</p>
                <form onSubmit={e=>{
                    e.preventDefault();
                    updateTodo({variables: {id, type: input.value}});

                    input.value = "";
                }}>
                    <input type="text" ref={node=>input=node}/>
                    <button type="submit">update todo</button>
                </form>

                {mutationLoading && <p>loading....</p>}
                {mutationError && <p>error</p>}
            </div>
        )
    })
}

const add_todo = gql`
    mutation AddTodo($type: String){
        addTodo(type: $type){
            id,
            type
        }
    }
`;

const todos = gql`
    {
        todos{
            id
        }
    }
`;

function AddTodo() {
    let input;

    const [addTodo] = useMutation(add_todo, {
        update(cache, {data: {addTodo}}){
            const {todos} = client.readQuery({query: todos});
            client.writeQuery({
                query: todos,
                data: {todos: todos.concat([addTodo])}
            });
        }
    });

    return(
        <div>
            <form onSubmit={e=>{
                e.preventDefault();
                addTodo({variables: {type: input.value}});
                input.value = ""
            }}>
                <input type="text" ref={node=>input = node}/>
                <button type="submit">add todo</button>
            </form>
        </div>
    )
}

export const App = () =>(
    <ApolloProvider client={client}>
        <div>
            <AddTodo/>
            <Todos/>
        </div>
    </ApolloProvider>
);
