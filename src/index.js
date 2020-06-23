import * as serviceWorker from "./serviceWorker";
import {applyMiddleware, createStore} from "redux";
import {ApolloProvider} from "@apollo/react-hooks";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {composeWithDevTools} from "redux-devtools-extension";
import Provider from "react-redux/es/components/Provider";
import React from "react";
import ReactDOM from "react-dom";
import rootReducer from "./reducers/rootReducer.js";
import thunk from "redux-thunk";
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {onError} from "apollo-link-error";
import {ApolloLink} from "apollo-link";

export const client = new ApolloClient({
    "cache": new InMemoryCache(),
    "link": ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
            if (graphQLErrors) {
                graphQLErrors.forEach(({message, locations, path}) => {
                    console.error(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    );
                });
            }
            if (networkError) {
                console.error(`[Network error]: ${networkError}`);
            }
        }),
        new HttpLink({
            "uri": `${process.env.REACT_APP_DOMAIN}/graphql`,
        }),
    ]),
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk)),
);

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
