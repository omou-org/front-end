<<<<<<< HEAD
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
=======
import React from "react";
import {Admin, Resource} from "react-admin";
import * as components from "./UserList";
import {Provider} from "react-redux";
import {createHashHistory} from "history";
>>>>>>> 0cd1ef260d7e6744d4a2fba7ede3868fa79582c4
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
<<<<<<< HEAD
            <Resource edit={CategoryEdit} create={CategoryCreate} list={CategoryList}
                name="courseCategories" show={CategoryShow} />
            <Resource edit={SchoolEdit} create={SchoolCreate} list={SchoolList}
                name="schools" show={SchoolShow} />
            <Resource edit={TuitionEdit} create={TuitionCreate} list={TuitionList}
                name="tuitionRules" show={TuitionShow} />

=======
            <Resource create={components.CategoryCreate}
                edit={components.CategoryEdit} list={components.CategoryList}
                name="courseCategories" show={components.CategoryShow} />
            <Resource create={components.SchoolCreate}
                edit={components.SchoolEdit} list={components.SchoolList}
                name="schools" show={components.SchoolShow} />
            <Resource create={components.BulkDiscountCreate}
                edit={components.BulkDiscountEdit}
                list={components.BulkDiscountList}
                name="bulkDiscounts" show={components.BulkDiscountShow} />
            <Resource create={components.DateRangeDiscountCreate}
                edit={components.DateRangeDiscountEdit}
                list={components.DateRangeDiscountList}
                name="dateRangeDiscounts"
                show={components.DateRangeDiscountShow} />
            <Resource create={components.PaymentMethodDiscountCreate}
                edit={components.PaymentMethodDiscountEdit}
                list={components.PaymentMethodDiscountList}
                name="paymentMethodDiscounts"
                show={components.PaymentMethodDiscountShow} />
>>>>>>> 0cd1ef260d7e6744d4a2fba7ede3868fa79582c4
        </Admin>
    </Provider>
);

export default App;
