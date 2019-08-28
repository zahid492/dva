import React from "react";

import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const client = new ApolloClient({
    uri: "https://48p1r2roz4.sse.codesandbox.io"
});

function ExchageRates() {
    const {loading, error, data} = useQuery(gql`
        {
            rates(currency: "USD"){
                currency,
                rate
            }
        }
    `);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error:(</p>;

    return data.rates.map(({currency, rate})=>(
        <div key={currency}>
            <p>
                {currency}:{rate}
            </p>
        </div>
    ));
}

export const App = ()=>(
    <ApolloProvider client={client}>
        <div>
            <ExchageRates/>
        </div>
    </ApolloProvider>
);
