import React from "react";
import {Switch} from "react-router-dom";

import AdminPortalHome from "../FeatureViews/AdminPortal/AdminPortalHome";
import AuthenticatedRoute from "./AuthenticatedRoute";
import FormPage from "../Form/FormPage";
import ActionLog from "../FeatureViews/AdminPortal/ActionLog";
import ManageCategories from "../FeatureViews/AdminPortal/ManageCategories";
import ManageDiscounts from "../FeatureViews/AdminPortal/ManageDiscounts";
import TuitionRules from "../FeatureViews/AdminPortal/TuitionRules";

import {USER_TYPES} from "utils";
import AdminPanel from "components/FeatureViews/AdminPortal/AdminPanel";

const AdminViewsRoutes = () => (
    <Switch>
        <AuthenticatedRoute path="/adminportal/management"
                            users={[USER_TYPES.admin]}>
            <AdminPanel/>
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/adminportal/tuition-rules"
                            users={[USER_TYPES.admin]}>
            <TuitionRules/>
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
            <FormPage title="Set Price Rule" />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/adminportal/actionlog" users={[USER_TYPES.admin]}>
            <ActionLog />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/adminportal/" users={[USER_TYPES.admin]}>
            <AdminPortalHome />
        </AuthenticatedRoute>
    </Switch>
);

export default AdminViewsRoutes;
