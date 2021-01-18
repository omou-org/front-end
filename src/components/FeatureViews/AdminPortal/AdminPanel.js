import React from 'react';
import { Admin, Resource } from 'react-admin';
import * as components from './AdminPanelViews';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import createAdminStore from '../../../createAdminStore';
import dataProvider from './dataProvider';

const authProvider = () => Promise.resolve();
const history = createHashHistory();

const AdminPanel = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            history,
        })}
    >
        <Admin dataProvider={dataProvider} history={history}>
            <Resource
                create={components.CategoryCreate}
                edit={components.CategoryEdit}
                list={components.CategoryList}
                name='courseCategories'
                show={components.CategoryShow}
            />
            <Resource
                create={components.SchoolCreate}
                edit={components.SchoolEdit}
                list={components.SchoolList}
                name='schools'
                show={components.SchoolShow}
            />
            <Resource
                create={components.BulkDiscountCreate}
                edit={components.BulkDiscountEdit}
                list={components.BulkDiscountList}
                name='bulkDiscounts'
                show={components.BulkDiscountShow}
            />
            <Resource
                create={components.DateRangeDiscountCreate}
                edit={components.DateRangeDiscountEdit}
                list={components.DateRangeDiscountList}
                name='dateRangeDiscounts'
                show={components.DateRangeDiscountShow}
            />
            <Resource
                create={components.PaymentMethodDiscountCreate}
                edit={components.PaymentMethodDiscountEdit}
                list={components.PaymentMethodDiscountList}
                name='paymentMethodDiscounts'
                show={components.PaymentMethodDiscountShow}
            />
            <Resource
                create={components.TuitionCreate}
                edit={components.TuitionEdit}
                list={components.TuitionList}
                name='tuitionRules'
                show={components.TuitionShow}
            />
        </Admin>
    </Provider>
);

export default AdminPanel;
