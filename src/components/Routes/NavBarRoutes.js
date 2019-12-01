// React Imports
import { Route, Switch, Redirect } from "react-router-dom";
import React from "react";
import UnauthenticatedNav from "../Navigation/UnauthenticatedNav";
import AuthenticatedNav from "../Navigation/AuthenticatedNav";

// Local Component Imports



function NavBarRoutes(props) {

    return (
        <Switch>
            <Route
                path="/login"
                render={(passedProps) => <UnauthenticatedNav/> }/>
            <Route
                path="/"
                render={(passedProps) => <AuthenticatedNav/> }/>

        </Switch>
    );
}

export default NavBarRoutes;