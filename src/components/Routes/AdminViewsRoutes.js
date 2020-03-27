// React Imports
import { Switch } from "react-router-dom";
import React from "react";
import TuitionRules from "../FeatureViews/AdminPortal/TuitionRules";
import AdminRoute from "./AdminRoute";
import Form from "../Form/Form";
import ManageCategories from "../FeatureViews/AdminPortal/ManageCategories";
import ManageDiscounts from "../FeatureViews/AdminPortal/ManageDiscounts";
import AdminPortalHome from "../FeatureViews/AdminPortal/AdminPortalHome";

import TestPanel from "../FeatureViews/AdminPortal/TestPanel";
import CustomTestPanel from "../FeatureViews/AdminPortal/customTestPanel";
// Local Component Imports

function AdminViewsRoutes() {

    return (
        <Switch>
            <AdminRoute
                path="/adminportal/tuition-rules"
                render={(passedProps) => <TuitionRules {...passedProps}/> }/>
            <AdminRoute
                path="/adminportal/manage-course-categories"
                render={(passedProps) => <ManageCategories {...passedProps}/>}/>
            <AdminRoute
                path={"/adminportal/manage-discounts"}
                render={(passedProps) => <ManageDiscounts {...passedProps}/> }/>
            {/*    path="/adminportal/form/instructor"*/}
            {/*    render={(passedProps) => <Form {...passedProps}/> }/>*/}

            <AdminRoute
                path="/adminportal/test-paneldisplay" 
                render={(passedProps) => <TestPanel {...passedProps} /> }/>

            <AdminRoute
                path="/adminportal/test2-paneldisplay" 
                render={(passedProps) => <CustomTestPanel {...passedProps} /> }/>


            <AdminRoute
                exact
                path={"/adminportal/form/:type?"}
                render={(passedProps) => <Form title={"Set Price Rule"}/>}/>
            <AdminRoute
                path="/adminportal/"
                render={(passedProps) => <AdminPortalHome {...passedProps}/> }/>

        </Switch>
    );
}

export default AdminViewsRoutes;