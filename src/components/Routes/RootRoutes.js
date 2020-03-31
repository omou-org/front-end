// React Imports
import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetSubmitStatus } from "../../actions/registrationActions";
import React from "react";
// Local Component Imports
import Accounts from "../FeatureViews/Accounts/Accounts";
import CourseSessionStatus from "../FeatureViews/Accounts/TabComponents/EnrollmentView";
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
import CatsPage from "../CatsPage/CatsPage";

export const RootRoutes = () => {
    const dispatch = useDispatch();
    dispatch(resetSubmitStatus());

    return (
        <Switch>
            <Route
                path="/login"
                render={(passedProps) => <LoginPage {...passedProps} />}
            />

            {/* Main Feature Views */}
            <ProtectedRoute
                exact
                path="/"
                render={(passedProps) => <Scheduler {...passedProps} />}
            />

            <ProtectedRoute
                exact
                path="/registration"
                render={(passedProps) => <Registration {...passedProps} />}
            />
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
            <ProtectedRoute
                exact
                path="/search"
                render={(passedProps) => <SearchResults {...passedProps} />}
            />

            {/* <ProtectedRoute*/}
            {/*    path='/scheduler/resource'*/}
            {/*    render={(passedProps) => <ResourceView {...passedProps} />} /> */}
            <ProtectedRoute
                exact
                path="/cats"
                render={(passedProps) => <CatsPage {...passedProps} />}
            />
            <ProtectedRoute
                exact
                path="/noresults"
                render={(passedProps) => <NoResultsPage {...passedProps} />}
            />

            {/* Accounts */}
            <ProtectedRoute
                exact
                path="/accounts/:accountType/:accountID"
                render={(passedProps) => <UserProfile {...passedProps} />}
            />
            <ProtectedRoute
                exact
                path="/accounts/parent/payment/:parentID/:paymentID"
                render={(passedProps) => <RegistrationReceipt {...passedProps} />}
            />
            <ProtectedRoute
                exact
                path="/accounts"
                render={(passedProps) => <Accounts {...passedProps} />}
            />
            <ProtectedRoute
                exact
                path="/accounts/:accountType/:accountID/:courseID"
                render={(passedProps) => <CourseSessionStatus {...passedProps} />}
            />

            {/* Registration Routes */}
            <ProtectedRoute
                path="/registration/form/:type/:id?/:edit?"
                render={(passedProps) => <RegistrationForm {...passedProps} />}
            />
            <ProtectedRoute
                path="/registration/course/:courseID?/:courseTitle?"
                render={(passedProps) => <RegistrationCourse {...passedProps} />}
            />
            <ProtectedRoute
                path="/registration/cart/"
                render={(passedProps) => <RegistrationCart {...passedProps} />}
            />
            <ProtectedRoute
                path="/registration/receipt/:paymentID?"
                render={(passedProps) => <RegistrationReceipt {...passedProps} />}
            />

            {/* Admin Routes */}
            <AdminRoute
                exact
                path="/adminportal/:view?/:type?/:id?/:edit?"
                render={(passedProps) => <AdminPortal {...passedProps} />}
            />
            <Route path="/PageNotFound"
                render={(passedProps) => <ErrorNotFoundPage {...passedProps} />}
            />
            <Redirect to="/PageNotFound" />
        </Switch>
    );
};
