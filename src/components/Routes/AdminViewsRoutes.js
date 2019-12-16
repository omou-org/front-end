// React Imports
import { Route, Switch, Redirect } from "react-router-dom";
import React from "react";
import ManageTuition from "../FeatureViews/AdminPortal/ManageTuition";
import AdminRoute from "./AdminRoute";
import Form from "../Form/Form";
import ManageCategories from "../FeatureViews/AdminPortal/ManageCategories";

// Local Component Imports

function AdminViewsRoutes(props) {

    return (
        <Switch>
            <AdminRoute
                path="/adminportal/manage-tuition"
                render={(passedProps) => <ManageTuition {...passedProps}/> }/>
            <AdminRoute
                path="/adminportal/manage-course-categories"
                render={(passedProps) => <ManageCategories {...passedProps}/>}/>
            {/*<AdminRoute*/}
            {/*    path="/adminportal/form/instructor"*/}
            {/*    render={(passedProps) => <Form {...passedProps}/> }/>*/}
            <AdminRoute
                path="/adminportal/"
                render={(passedProps) => <div/> }/>

        </Switch>
    );
}

export default AdminViewsRoutes;