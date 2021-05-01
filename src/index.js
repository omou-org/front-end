import * as serviceWorker from './serviceWorker';
import { applyMiddleware, createStore } from 'redux';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import Provider from 'react-redux/es/components/Provider';
import React from 'react';
import ReactDOM from 'react-dom';
import rootReducer from './reducers/rootReducer.js';
import thunk from 'redux-thunk';
import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import * as actionCreators from 'actions/actionTypes';
import initialState from './reducers/initialState';
import invariant from 'redux-immutable-state-invariant';

const composeEnhancers = composeWithDevTools({
    actionCreators,
    trace: true,
    traceLimit: 25,
});

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(invariant(), thunk))
);

const httpLink = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            console.error('[GraphQL Error(s)]', graphQLErrors);
        }
        if (networkError) {
            console.error(networkError);
        }
    }),
    new createUploadLink({
        uri: `${process.env.REACT_APP_DOMAIN}/graphql`,
    }),
]);

const authLink = setContext((_, { headers }) => {
    const { token } = store.getState().auth;
    return {
        headers: {
            Authorization: token ? `JWT ${token}` : '',
            ...headers,
        },
    };
});

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root')
);

// expose store
window.store = store;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
