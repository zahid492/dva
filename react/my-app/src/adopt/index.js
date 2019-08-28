import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
import {ApolloProvider} from "react-apollo";
import ApolloClient from 'apollo-boost';

import './index.css';
import {TodosApp} from './adopt/TodosApp';

const client = new ApolloClient({
    uri: 'https://api.graph.cool/simple/v1/cjfitlb222zju01860wc988f6'
});

const ApolloApp = AppComponent=>(
    <ApolloProvider client={client}>
        <AppComponent/>
    </ApolloProvider>
);

ReactDOM.render(
    ApolloApp(TodosApp),
    document.getElementById('root'));

// import * as serviceWorker from './serviceWorker';

// serviceWorker.unregister();
