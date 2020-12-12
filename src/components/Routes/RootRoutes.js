// React Imports
import {Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
// Local Component Imports
import Accounts from "../FeatureViews/Accounts/Accounts";
import AdminPortal from "../FeatureViews/AdminPortal/AdminPortal";
import AuthenticatedRoute from "./AuthenticatedRoute";
import CatsPage from "../CatsPage/CatsPage";
import EnrollmentView from "../FeatureViews/Accounts/TabComponents/EnrollmentView";
import EditSessionView from "../FeatureViews/Scheduler/EditSessionView";
import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";
import ForgotPassword from "../Authentication/ForgotPassword";
import LoginPage from "../Authentication/LoginPage.js";
import NewAccount from "../Authentication/NewAccount";
import NoResultsPage from "../FeatureViews/Search/NoResults/NoResultsPage";
import NotEnrolledStudentsDialog from "../FeatureViews/Scheduler/NotEnrolledStudentDialog";
import PaymentReceipt from "../FeatureViews/Registration/PaymentReceipt";
import Registration from "../FeatureViews/Registration/Registration";
import FormPage from "../Form/FormPage";
import RegistrationCourse from "../FeatureViews/Registration/RegistrationCourse";
import ResetPassword from "../Authentication/ResetPassword";
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import SearchResults from "../FeatureViews/Search/SearchResults";
import SessionView from "../FeatureViews/Scheduler/SessionView";
import UserProfile from "../FeatureViews/Accounts/UserProfile";
import CourseManagementContainer from "../FeatureViews/Courses/CourseManagementContainer";
import CourseClasses from "../FeatureViews/Courses/CourseClasses"
import DemoRoutes from './DemoRoutes';

import {resetSubmitStatus} from "actions/registrationActions";
import {USER_TYPES} from "utils";
import RegistrationForm from "../FeatureViews/Registration/RegistrationForm";
import RegistrationCartContainer from "../FeatureViews/Registration/RegistrationCart/RegistrationCartContainer";
import DashboardSwitch from "../FeatureViews/Dashboard/DashboardSwitch";
import TeachingLogContainer from "../FeatureViews/TeachingLog/TeachingLogContainer";
import AvailabilityContainer from "../FeatureViews/Availability/AvailabilityContainer";
import ManagePayments from "../FeatureViews/ManagePayments/ManagePayments";
import StudentCourseViewer from "components/FeatureViews/Accounts/TabComponents/StudentCourseViewer";
import SessionPaymentStatusChip from "components/OmouComponents/SessionPaymentStatusChip";

import AddItemButtonTestDemo from '../OmouComponents/AddItemButtonTestDemo';

export const RootRoutes = () => {
    const dispatch = useDispatch();
    const AuthUser = useSelector(({auth}) => auth);
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
            <Route path="/setpassword">
                <ResetPassword isSet />
            </Route>
            <Route path="/login">
                <LoginPage/>
            </Route>
            <Route path="/new/:type?">
                <NewAccount/>
            </Route>
            
            {/* Dahl Design Migration Demos */}
            <Route path="/demo/:type">
                <DemoRoutes/>
            </Route>


            {/* Route for Testing AddItemButton */}
            <Route path="/demos/AddItemButton">
                <AddItemButtonTestDemo />
            </Route>
            

            {/* Main Feature Views */}
            <AuthenticatedRoute exact path="/">
                {
                    {
                        [USER_TYPES.receptionist]: <DashboardSwitch/>,
                        [USER_TYPES.admin]: <DashboardSwitch/>,
                        [USER_TYPES.parent]: <Scheduler/>,
                        [USER_TYPES.instructor]: <Scheduler/>,
                    }[AuthUser.accountType]
                }

            </AuthenticatedRoute>
            <AuthenticatedRoute exact
                                path="/registration"
                                users={[USER_TYPES.admin, USER_TYPES.receptionist, USER_TYPES.parent]}
            >
                <Registration/>
            </AuthenticatedRoute>

            {/* Scheduler Routes */}
            <AuthenticatedRoute exact path="/scheduler">
                <Scheduler/>
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/scheduler/view-session/:course_id/:session_id/:instructor_id">
                <SessionView/>
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
            <AuthenticatedRoute exact path="/accounts"
                users={[USER_TYPES.admin, USER_TYPES.receptionist]}>
                <Accounts />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact
                path="/enrollment/:enrollmentId">
                <EnrollmentView />
            </AuthenticatedRoute>

            {/* Registration Routes */}
            <AuthenticatedRoute path="/registration/form/:type/:id?">
                <RegistrationForm />
            </AuthenticatedRoute>
            <AuthenticatedRoute
                path="/registration/course/:courseID?/:courseTitle?">
                <RegistrationCourse />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/registration/cart/">
                <RegistrationCartContainer />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/registration/receipt/:paymentID?">
                <PaymentReceipt />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/NotEnrolledStudent">
                <NotEnrolledStudentsDialog />
            </AuthenticatedRoute>

            {/* Instructor Routes */}
            <AuthenticatedRoute path="/teaching-log"
                users={[USER_TYPES.instructor]}>
                <TeachingLogContainer />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/availability"
                users={[USER_TYPES.instructor]}>
                <AvailabilityContainer />
            </AuthenticatedRoute>

            {/* Parent Routes */}
            <AuthenticatedRoute path="/my-payments/:view?/:paymentId?"
                                users={[USER_TYPES.parent]}
            >
                <ManagePayments/>
            </AuthenticatedRoute>

            {/* Admin Routes */}
            <AuthenticatedRoute exact
                                path="/adminportal/:view?/:type?/:id?/:edit?"
                                users={[USER_TYPES.admin]}>
                <AdminPortal/>
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/form/:type/:id?"
                users={[USER_TYPES.admin, USER_TYPES.parent]}>
                <FormPage />
            </AuthenticatedRoute>

            {/* Course Management Routes */}
            <AuthenticatedRoute 
            path="/coursemanagement"
            exact
            >
                <CourseManagementContainer />
            </AuthenticatedRoute>

            <AuthenticatedRoute 
           path="/coursemanagement/class/:id?"
            >
                <CourseClasses />
            </AuthenticatedRoute>

            <AuthenticatedRoute path="/PageNotFound">
                <ErrorNotFoundPage />
            </AuthenticatedRoute>
            <Redirect to="/PageNotFound" />

        </Switch>
    );
};
