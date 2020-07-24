import React, { useEffect } from "react";
import { Admin, ListGuesser, Resource } from "react-admin";
import {
    CategoryCreate,
    CategoryEdit,
    CategoryList,
    CategoryShow,
    SchoolList,
    SchoolCreate,
    SchoolShow,
    SchoolEdit,
    TuitionCreate,
    TuitionShow,
    TuitionEdit,
    TuitionList
} from "./UserList";
import { Provider } from "react-redux";
import { createHashHistory } from "history";
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
            <Resource edit={CategoryEdit} create={CategoryCreate} list={CategoryList}
                name="courseCategories" show={CategoryShow} />
            <Resource edit={SchoolEdit} create={SchoolCreate} list={SchoolList}
                name="schools" show={SchoolShow} />
            <Resource edit={TuitionEdit} create={TuitionCreate} list={TuitionList}
                name="tuitionRules" show={TuitionShow} />

        </Admin>
    </Provider>
);

export default App;
