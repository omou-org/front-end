// React Imports
import {Redirect, Route, Switch} from "react-router-dom";
import {useDispatch} from "react-redux";
import {resetSubmitStatus} from "actions/registrationActions";
import React from "react";

// Local Component Imports
import Accounts from "../FeatureViews/Accounts/Accounts";
import AdminPortal from "../FeatureViews/AdminPortal/AdminPortal";
import AdminRoute from "./AdminRoute";
import CatsPage from "../CatsPage/CatsPage";
import CourseSessionStatus from
    "../FeatureViews/Accounts/TabComponents/EnrollmentView";
// import Dashboard from "../FeatureViews/Dashboard/Dashboard";
import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";
import ForgotPassword from "../Authentication/ForgotPassword";
import LoginPage from "../Authentication/LoginPage.js";
import NoResultsPage from "../FeatureViews/Search/NoResults/NoResultsPage";
import NotEnrolledStudentsDialog from
    "../FeatureViews/Scheduler/NotEnrolledStudentDialog";
import PaymentReceipt from "../FeatureViews/Registration/PaymentReceipt";
import ProtectedRoute from "./ProtectedRoute";
import Registration from "../FeatureViews/Registration/Registration";
import RegistrationCart from "../FeatureViews/Registration/RegistrationCart";
import RegistrationCourse from
    "../FeatureViews/Registration/RegistrationCourse";
import RegistrationForm from "../Form/Form";
import Dashboard from "../FeatureViews/Dashboard/Dashboard";
import RegistrationReceipt from "../Form/RegistrationReceipt";
import ResetPassword from "../Authentication/ResetPassword";
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import EditSessionView from "../FeatureViews/Scheduler/EditSessionView";
import SearchResults from "../FeatureViews/Search/SearchResults";
import SessionView from "../FeatureViews/Scheduler/SessionView";
import UserProfile from "../FeatureViews/Accounts/UserProfile";

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

            <ProtectedRoute
                exact
                path="/"
                render={(passedProps) => <Dashboard {...passedProps} />}
            />
            <ProtectedRoute exact path="/registration">
                <Registration />
            </ProtectedRoute>

            {/* Scheduler Routes */}
            <ProtectedRoute
                exact
                path="/scheduler"
                render={(passedProps) => <Scheduler {...passedProps} />}
            />
            <Route
                path="/scheduler/view-session/:course_id/:session_id/:instructor_id"
                render={(passedProps) => <SessionView {...passedProps} />}
            />
            <Route
                path="/scheduler/edit-session/:course_id/:session_id/:instructor_id/edit"
                render={(passedProps) => <EditSessionView {...passedProps} />}
            />
            <ProtectedRoute
                exact
                path="/search"
                render={(passedProps) => <SearchResults {...passedProps} />}
            />
            <ProtectedRoute
                exact
                path="/dashboard"
                render={(passedProps) => <Dashboard {...passedProps} />}
            />

            <ProtectedRoute path="/scheduler/view-session/:course_id/:session_id/:instructor_id">
                <SessionView />
            </ProtectedRoute>

            <ProtectedRoute exact path="/search">
                <SearchResults />
            </ProtectedRoute>
            <ProtectedRoute exact path="/cats">
                <CatsPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/noresults">
                <NoResultsPage />
            </ProtectedRoute>

            {/* Accounts */}
            <ProtectedRoute exact path="/accounts/:accountType/:accountID">
                <UserProfile />
            </ProtectedRoute>
            <ProtectedRoute exact
                path="/accounts/parent/payment/:paymentID">
                <PaymentReceipt />
            </ProtectedRoute>
            <ProtectedRoute exact path="/accounts">
                <Accounts />
            </ProtectedRoute>
            <ProtectedRoute exact
                path="/accounts/:accountType/:accountID/:courseID">
                <CourseSessionStatus />
            </ProtectedRoute>

            {/* Registration Routes */}
            <ProtectedRoute path="/registration/form/:type/:id?/:edit?">
                <RegistrationForm />
            </ProtectedRoute>
            <ProtectedRoute
                path="/registration/course/:courseID?/:courseTitle?">
                <RegistrationCourse />
            </ProtectedRoute>
            <ProtectedRoute path="/registration/cart/">
                <RegistrationCart />
            </ProtectedRoute>
            <ProtectedRoute path="/registration/receipt/:paymentID?">
                <RegistrationReceipt />
            </ProtectedRoute>
            <ProtectedRoute path="/NotEnrolledStudent">
                <NotEnrolledStudentsDialog />
            </ProtectedRoute>

            {/* Admin Routes */}
            <AdminRoute exact path="/adminportal/:view?/:type?/:id?/:edit?">
                <AdminPortal />
            </AdminRoute>

            <Route path="/PageNotFound">
                <ErrorNotFoundPage />
            </Route>
            <Redirect to="/PageNotFound" />
        </Switch>
    );
};
