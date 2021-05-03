import React from 'react';
import AuthenticatedRoute from './AuthenticatedRoute';
import { USER_TYPES } from '../../utils';
import { Switch } from 'react-router-dom';
import InvoiceReceipt from '../FeatureViews/Invoices/InvoiceReceipt';
import ActiveInvoices from '../FeatureViews/ManagePayments/ActiveInvoices';
import Invoices from '../FeatureViews/Invoices/Invoices';

/**
 * @description Old payment routes for only parents
 * @todo Work out updated invoice routes Keep this file or not.
 */

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
                <Invoices />
            </AuthenticatedRoute>
            <AuthenticatedRoute
                exact
                path='/my-payments/payment/:paymentID?'
                users={[USER_TYPES.parent]}
            >
                <InvoiceReceipt />
            </AuthenticatedRoute>
        </Switch>
    );
}
