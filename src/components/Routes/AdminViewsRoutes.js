import React from "react";
import {Switch} from "react-router-dom";

import AdminPortalHome from "../FeatureViews/AdminPortal/AdminPortalHome";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Form from "../Form/Form";
import ManageCategories from "../FeatureViews/AdminPortal/ManageCategories";
import ManageDiscounts from "../FeatureViews/AdminPortal/ManageDiscounts";
import TuitionRules from "../FeatureViews/AdminPortal/TuitionRules";

import {USER_TYPES} from "utils";

const AdminViewsRoutes = () => (
    <Switch>
        <AuthenticatedRoute path="/adminportal/tuition-rules"
            users={[USER_TYPES.admin]}>
            <TuitionRules />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/adminportal/manage-course-categories"
            users={[USER_TYPES.admin]}>
            <ManageCategories />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/adminportal/manage-discounts"
            users={[USER_TYPES.admin]}>
            <ManageDiscounts />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/adminportal/form/:type?"
            users={[USER_TYPES.admin]}>
            <Form title="Set Price Rule" />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/adminportal/" users={[USER_TYPES.admin]}>
            <AdminPortalHome />
        </AuthenticatedRoute>
    </Switch>
);

export default AdminViewsRoutes;
