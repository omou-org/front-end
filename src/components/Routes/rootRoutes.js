// React Imports
import {Redirect, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../actions/registrationActions";
import React from "react";
// Local Component Imports
import Accounts from "../FeatureViews/Accounts/Accounts";
import CourseSessionStatus from "../FeatureViews/Accounts/TabComponents/CourseSessionStatus";
// import Dashboard from "../FeatureViews/Dashboard/Dashboard";
import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";
import RegistrationCourse from "../FeatureViews/Registration/RegistrationCourse";
import LoginPage from "../Authentication/LoginPage.js";
import NoResultsPage from "../FeatureViews/Search/NoResults/NoResultsPage";
import ProtectedRoute from "./ProtectedRoute";
import Registration from "../FeatureViews/Registration/Registration";
import RegistrationForm from "../Form/Form";
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import SearchResults from "../FeatureViews/Search/SearchResults";
import SessionView from "../FeatureViews/Scheduler/SessionView";
import UserProfile from "../FeatureViews/Accounts/UserProfile";
import RegistrationCart from "../FeatureViews/Registration/RegistrationCart";
import AdminRoute from "./AdminRoute";
import AdminPortal from "../FeatureViews/AdminPortal/AdminPortal";
import RegistrationReceipt from "../FeatureViews/Registration/RegistrationReceipt";


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
                exact path="/scheduler"
                render={(passedProps) => <Scheduler {...passedProps} />} />
            <Route
                path="/scheduler/view-session/:course_id/:session_id"
                render={(passedProps) => <SessionView {...passedProps} />} />
            <ProtectedRoute
                exact
                path="/search/"
                render={(passedProps) => <SearchResults {...passedProps} />} />

            {/*<ProtectedRoute*/}
            {/*    path='/scheduler/resource'*/}
            {/*    render={(passedProps) => <ResourceView {...passedProps} />} /> */}

            <ProtectedRoute
                exact
                path='/noresults'
                render={(passedProps) => <NoResultsPage {...passedProps} />} />

            {/* Accounts */}
            <ProtectedRoute
                exact
                path="/accounts/:accountType/:accountID"
                render={(passedProps) => <UserProfile {...passedProps} />} />
            <ProtectedRoute
                exact
                path="/accounts/parent/payment/:parentID/:paymentID"
                render={(passedProps) => <RegistrationReceipt {...passedProps} />}/>
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
                path="/registration/cart/"
                render={(passedProps) => <RegistrationCart {...passedProps}/>}
            />
            <ProtectedRoute
                path="/registration/receipt/:paymentID?"
                render={(passedProps) => <RegistrationReceipt {...passedProps}/> }
            />

            {/* Admin Routes */}
            <AdminRoute
                exact
                path="/adminportal/:view?/:type?/:id?/:edit?"
                render={(passedProps) => <AdminPortal/>}/>

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
