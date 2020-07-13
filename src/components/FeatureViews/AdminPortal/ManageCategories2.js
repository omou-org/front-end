import React from "react";
import {Admin, ListGuesser, Resource} from "react-admin";
import {CategoryEdit, CategoryList, CategoryShow} from "./UserList";
import {Provider} from "react-redux";
import {createHashHistory} from "history";
import createAdminStore from "../../../createAdminStore";
import dataProvider from "./dataProvider";

const authProvider = () => Promise.resolve();
const history = createHashHistory();

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            history,
        })}>
        <Admin dataProvider={dataProvider} history={history}>
            <Resource edit={CategoryEdit} list={CategoryList}
                name="courseCategories" show={CategoryShow} />
        </Admin>
    </Provider>
);

export default App;
