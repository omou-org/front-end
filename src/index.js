import * as serviceWorker from "./serviceWorker";
import {applyMiddleware, createStore} from "redux";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {composeWithDevTools} from "redux-devtools-extension";
import Provider from "react-redux/es/components/Provider";
import React from "react";
import ReactDOM from "react-dom";
import rootReducer from "./reducers/rootReducer.js";
import thunk from "redux-thunk";

import {ApolloClient} from "apollo-client";
import {ApolloLink} from "apollo-link";
import {ApolloProvider} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {onError} from "apollo-link-error";
import {setContext} from "apollo-link-context";

import {setCredentials} from "actions/authActions";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk)),
);

const httpLink = ApolloLink.from([
    onError(({graphQLErrors, networkError}) => {
        if (graphQLErrors) {
            console.error("[GraphQL Error(s)]", graphQLErrors);
        }
        if (networkError) {
            console.error(networkError);
        }
    }),
    new HttpLink({
        "uri": `${process.env.REACT_APP_DOMAIN}/graphql`,
    }),
]);

const authLink = setContext((_, {headers}) => {
    const {token} = store.getState().auth;
    return {
        "headers": {
            ...headers,
            "Authorization": token ? `JWT ${token}` : "",
        },
    };
});

export const client = new ApolloClient({
    "cache": new InMemoryCache(),
    "link": httpLink.concat(authLink),
});

(async () => {
    const VERIFY_TOKEN = gql`
        mutation VerifyToken($token: String!) {
            verifyToken(token: $token) {
                payload
            }
        }`;

    const token = JSON.parse(localStorage.getItem("auth"))?.token;

    if (token) {
        try {
            await client.mutate({
                "mutation": VERIFY_TOKEN,
                "variables": {token},
            });
            store.dispatch(setCredentials({token}));
        } catch {
            localStorage.removeItem("auth");
        }
    }
})();

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    </Provider>,
    document.getElementById("root"),
);

// expose store when run in Cypress
if (window.Cypress) {
    window.store = store;
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
