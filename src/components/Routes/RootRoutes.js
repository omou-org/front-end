// React Imports
import {Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import {useDispatch} from "react-redux";
// Local Component Imports
import Accounts from "../FeatureViews/Accounts/Accounts";
import AdminPortal from "../FeatureViews/AdminPortal/AdminPortal";
import AuthenticatedRoute from "./AuthenticatedRoute";
import CatsPage from "../CatsPage/CatsPage";
import CourseSessionStatus from "../FeatureViews/Accounts/TabComponents/EnrollmentView";
// import Dashboard from "../FeatureViews/Dashboard/Dashboard";
import EditSessionView from "../FeatureViews/Scheduler/EditSessionView";
import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";
import ForgotPassword from "../Authentication/ForgotPassword";
import LoginPage from "../Authentication/LoginPage.js";
import NoResultsPage from "../FeatureViews/Search/NoResults/NoResultsPage";
import NotEnrolledStudentsDialog from "../FeatureViews/Scheduler/NotEnrolledStudentDialog";
import PaymentReceipt from "../FeatureViews/Registration/PaymentReceipt";
import Registration from "../FeatureViews/Registration/Registration";
import RegistrationCart from "../FeatureViews/Registration/RegistrationCart";
import RegistrationCourse from "../FeatureViews/Registration/RegistrationCourse";
import RegistrationForm from "../Form/Form";
import RegistrationReceipt from "../Form/RegistrationReceipt";
import ResetPassword from "../Authentication/ResetPassword";
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import SearchResults from "../FeatureViews/Search/SearchResults";
import SessionView from "../FeatureViews/Scheduler/SessionView";
import UserProfile from "../FeatureViews/Accounts/UserProfile";

import {resetSubmitStatus} from "actions/registrationActions";
import {USER_TYPES} from "utils";
import DashboardSwitch from "../FeatureViews/Dashboard/DashboardSwitch";

export const RootRoutes = () => {
    const dispatch = useDispatch();
    dispatch(resetSubmitStatus());

    return (
        <Switch>
            {/* Authentication views */}
            <Route path="/forgotpassword">
                <ForgotPassword />
            </Route>
            <Route path="/resetpassword">
                <ResetPassword />
            </Route>
            <Route path="/login">
                <LoginPage />
            </Route>

            {/* Main Feature Views */}
            <AuthenticatedRoute exact path="/">
                <DashboardSwitch/>
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/registration">
                <Registration />
            </AuthenticatedRoute>

            {/* Scheduler Routes */}
            <AuthenticatedRoute exact path="/scheduler">
                <Scheduler />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/scheduler/view-session/:course_id/:session_id/:instructor_id">
                <SessionView />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/scheduler/edit-session/:course_id/:session_id/:instructor_id/edit">
                <EditSessionView />
            </AuthenticatedRoute>

            <AuthenticatedRoute exact path="/search">
                <SearchResults />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/cats">
                <CatsPage />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/noresults">
                <NoResultsPage />
            </AuthenticatedRoute>

            {/* Accounts */}
            <AuthenticatedRoute exact path="/accounts/:accountType/:accountID">
                <UserProfile />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact
                path="/accounts/parent/payment/:paymentID">
                <PaymentReceipt />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/accounts">
                <Accounts />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact
                path="/accounts/:accountType/:accountID/:courseID">
                <CourseSessionStatus />
            </AuthenticatedRoute>

            {/* Registration Routes */}
            <AuthenticatedRoute path="/registration/form/:type/:id?/:edit?">
                <RegistrationForm />
            </AuthenticatedRoute>
            <AuthenticatedRoute
                path="/registration/course/:courseID?/:courseTitle?">
                <RegistrationCourse />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/registration/cart/">
                <RegistrationCart />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/registration/receipt/:paymentID?">
                <RegistrationReceipt />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/NotEnrolledStudent">
                <NotEnrolledStudentsDialog />
            </AuthenticatedRoute>

            {/* Admin Routes */}
            <AuthenticatedRoute exact
                path="/adminportal/:view?/:type?/:id?/:edit?"
                users={[USER_TYPES.admin]}>
                <AdminPortal />
            </AuthenticatedRoute>

            <AuthenticatedRoute path="/PageNotFound">
                <ErrorNotFoundPage />
            </AuthenticatedRoute>
            <Redirect to="/PageNotFound" />
        </Switch>
    );
};
