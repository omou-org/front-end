import React from 'react';
import { Admin, Resource, ListGuesser, } from 'react-admin';
import jsonServerProvider from "ra-data-json-server"

import { Provider } from 'react-redux'
import { createHashHistory } from 'history';


import createAdminStore from '../../../createAdminStore';

import { UserList } from './UserList'



// dependency injection
const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const authProvider = () => Promise.resolve();
const history = createHashHistory();

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            history,
        })}
    >
        <Admin dataProvider={dataProvider} history={history}>
            <Resource name="posts" list={ListGuesser} />
            <Resource name='users' list={UserList} />
        </Admin>
    </Provider>
);

export default App