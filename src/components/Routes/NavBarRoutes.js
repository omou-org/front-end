// React Imports
import {Route, Switch} from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

// Local Component Imports
import AuthenticatedNav from "../Navigation/AuthenticatedNav";
import UnauthenticatedNav from "../Navigation/UnauthenticatedNav";

const NavBarRoutes = ({toggleDrawer}) => (
    <Switch>
        <Route
            path="/login"
            render={() => <UnauthenticatedNav />} />
        <Route
            path="/"
            render={() => <AuthenticatedNav toggleDrawer={toggleDrawer} />} />
    </Switch>
);

NavBarRoutes.propTypes = {
    "toggleDrawer": PropTypes.func.isRequired,
};

export default NavBarRoutes;
