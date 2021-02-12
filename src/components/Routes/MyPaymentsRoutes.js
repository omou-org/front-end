import React from 'react';
import AuthenticatedRoute from './AuthenticatedRoute';
import { USER_TYPES } from '../../utils';
import { Switch } from 'react-router-dom';
import PaymentReceipt from '../FeatureViews/Registration/PaymentReceipt';
import MyPaymentHistory from '../FeatureViews/ManagePayments/MyPaymentHistory';
import ActiveInvoices from '../FeatureViews/ManagePayments/ActiveInvoices';

export default function MyPaymentsRoutes() {
    return (
        <Switch>
            <AuthenticatedRoute
                exact
                path='/my-payments'
                users={[USER_TYPES.parent]}
            >
                <ActiveInvoices />
            </AuthenticatedRoute>
            <AuthenticatedRoute
                exact
                path='/my-payments/history'
                users={[USER_TYPES.parent]}
            >
                <MyPaymentHistory />
            </AuthenticatedRoute>
            <AuthenticatedRoute
                exact
                path='/my-payments/payment/:paymentID?'
                users={[USER_TYPES.parent]}
            >
                <PaymentReceipt />
            </AuthenticatedRoute>
        </Switch>
    );
}
