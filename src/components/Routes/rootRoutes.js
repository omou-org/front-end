// React Imports

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Switch, Redirect } from "react-router-dom";
import * as registrationActions from "../../actions/registrationActions";

import PropTypes from "prop-types";
import React from "react";

// Local Component Imports
import Dashboard from "../FeatureViews/Dashboard/Dashboard";
import Registration from "../FeatureViews/Registration/Registration";
import RegistrationForm from "../Form/Form";
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import Accounts from "../FeatureViews/Accounts/Accounts";
import RegistrationCourse from "../FeatureViews/Registration/RegistrationCourse";
import CourseCategory from "../FeatureViews/Registration/CourseCategory";
import LoginPage from "../Authentication/LoginPage.js";
import ProtectedRoute from "./ProtectedRoute";

import SessionView from "../FeatureViews/Scheduler/SessionView"



import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";
import UserProfile from "../FeatureViews/Accounts/UserProfile";
import CourseSessionStatus from "../FeatureViews/Accounts/TabComponents/CourseSessionStatus";
import ParentPayment from "../Form/ParentPayment";


function rootRoutes(props) {
    props.registrationActions.resetSubmitStatus();
    return (
        <Switch>
            <Route
                path="/login"
                render={(passedProps) => <LoginPage {...passedProps} />} />

            {/* Main Feature Views */}
            <ProtectedRoute
                exact
                path="/"
                render={(passedProps) => <Accounts {...passedProps} />} />

            <ProtectedRoute
                exact
                path="/registration"
                render={(passedProps) => <Registration {...passedProps} />} />
            {/* Scheduler Routes */}
            {/* <ProtectedRoute
                exact path="/scheduler"
                render={(passedProps) => <Scheduler {...passedProps} />} />
            <ProtectedRoute
                path="/scheduler/view-session/:course_id/:session_id"
                render={(passedProps) => <SessionView {...passedProps} />} /> */}

            {/*
            <ProtectedRoute
                path='/scheduler/resource'
                render={(passedProps) => <ResourceView {...passedProps} />} /> */}

            {/* <ProtectedRoute
                exact
                path="/scheduler"
                render={(passedProps) => <Scheduler {...passedProps} />}/> */} */}


            {/* Accounts */}
            <ProtectedRoute
                exact
                path="/accounts/:accountType/:accountID"
                render={(passedProps) => <UserProfile {...passedProps} />} />
            {/* <ProtectedRoute
                exact
                path="/accounts/parents/:parentID/pay"
                render={(passedProps) => <ParentPayment {...passedProps} />}/> */}
            <ProtectedRoute
                exact
                path="/accounts"
                render={(passedProps) => <Accounts {...passedProps} />} />
            <ProtectedRoute
                exact
                path="/accounts/:accountType/:accountID/:courseID"
                render={(passedProps) => <CourseSessionStatus {...passedProps} />}/>

            {/* Registration Routes */}
            <ProtectedRoute
                path="/registration/form/:type/:id?/:edit?"
                render={(passedProps) => <RegistrationForm {...passedProps} />} />
            <ProtectedRoute
                path="/registration/course/:courseID?/:courseTitle?"
                render={(passedProps) => <RegistrationCourse {...passedProps} />} />
            <ProtectedRoute
                path="/registration/category/:categoryID"
                render={(passedProps) => <CourseCategory {...passedProps} />}/>
            <Route path="/PageNotFound" component={ErrorNotFoundPage}/>
            <Redirect to="/PageNotFound"/>
        </Switch>
    );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    registrationActions: bindActionCreators(registrationActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(rootRoutes);
