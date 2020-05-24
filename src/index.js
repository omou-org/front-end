import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";
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

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);

const client = new ApolloClient({
    uri: process.env.REACT_APP_DOMAIN,
    // note: since graphql endpoint atm has no authentication, this is not tested
    request: (operation) => {
        operation.setContext({
            "Authorization": `Token ${sessionStorage.getItem("authToken")}`
        })
    }
});

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    </Provider>,
    document.getElementById("root")
);

// expose store when run in Cypress
if (window.Cypress) {
	window.store = store;
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
