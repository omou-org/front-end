// React Imports

import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";

import PropTypes from "prop-types";
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

const mapStateToProps = (state) => ({});

export default NavBarRoutes;