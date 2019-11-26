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
import SearchResults from '../FeatureViews/Search/SearchResults';
import SessionView from "../FeatureViews/Scheduler/SessionView"



import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";
import UserProfile from "../FeatureViews/Accounts/UserProfile";
import CourseSessionStatus from "../FeatureViews/Accounts/TabComponents/CourseSessionStatus";
import ParentPayment from "../Form/ParentPayment";
import NoResultsPage from "../FeatureViews/Search/NoResults/NoResultsPage"
import FilterAccountsPage from "../FeatureViews/Search/FilterAccountsPage";
import AccountResults from '../FeatureViews/Search/FilterAccountsPage'


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
            <ProtectedRoute
                exact
                path="/search/:type/:query?"
                render={(passedProps) => <SearchResults {...passedProps} />} />

            {/* <ProtectedRoute
                exact
                path="/search/account/:query?"
                render={(passedProps) => <AccountResults {...passedProps} />} /> */}

            {/* <ProtectedRoute
                path="/search/course/:query?"
                render={(passedProps) => <SearchResults {...passedProps} />} /> */}
            {/*
            <ProtectedRoute
                path='/scheduler/resource'
                render={(passedProps) => <ResourceView {...passedProps} />} /> */}

            <ProtectedRoute
                path='/test'
                render={(passedProps) => <NoResultsPage {...passedProps} />} />
            <ProtectedRoute
                path="/filterAccount"
                render={(passedProps) => <FilterAccountsPage {...passedProps} />} />

            <ProtectedRoute
                path='/noresults'
                render={(passedProps) => <NoResultsPage {...passedProps} />} />


            {/*<ProtectedRoute
                exact
                path="/scheduler"
                render={(passedProps) => <Scheduler {...passedProps} />}/> */}


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
                render={(passedProps) => <CourseSessionStatus {...passedProps} />} />

            {/* Registration Routes */}
            <ProtectedRoute
                path="/registration/form/:type/:id?/:edit?"
                render={(passedProps) => <RegistrationForm {...passedProps} />} />
            <ProtectedRoute
                path="/registration/course/:courseID?/:courseTitle?"
                render={(passedProps) => <RegistrationCourse {...passedProps} />} />
            <ProtectedRoute
                path="/registration/category/:categoryID"
                render={(passedProps) => <CourseCategory {...passedProps} />} />

            <Route path="/PageNotFound" component={ErrorNotFoundPage} />
            <Redirect to="/PageNotFound" />
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
