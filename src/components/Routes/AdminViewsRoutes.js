import React from "react";
import {Switch} from "react-router-dom";

import AdminPortalHome from "../FeatureViews/AdminPortal/AdminPortalHome";
import AdminRoute from "./AdminRoute";
import FormPage from "../Form/FormPage";
import ManageCategories from "../FeatureViews/AdminPortal/ManageCategories";
import ManageDiscounts from "../FeatureViews/AdminPortal/ManageDiscounts";
import TuitionRules from "../FeatureViews/AdminPortal/TuitionRules";

const AdminViewsRoutes = () => (
    <Switch>
        <AdminRoute path="/adminportal/tuition-rules">
            <TuitionRules />
        </AdminRoute>
        <AdminRoute path="/adminportal/manage-course-categories">
            <ManageCategories />
        </AdminRoute>
        <AdminRoute path="/adminportal/manage-discounts">
            <ManageDiscounts />
        </AdminRoute>
        <AdminRoute path="/adminportal/form/:type?">
            <FormPage />
        </AdminRoute>
        <AdminRoute path="/adminportal">
            <AdminPortalHome />
        </AdminRoute>
    </Switch>
);

export default AdminViewsRoutes;
