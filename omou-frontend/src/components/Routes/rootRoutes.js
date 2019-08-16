// React Imports
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import React from "react";

// Local Component Imports
import Dashboard from "../FeatureViews/Dashboard/Dashboard";
// import Attendance from "../FeatureViews/Attendance/Attendance";
// import Courses from "../FeatureViews/Courses/Courses";
// import Gradebook from "../FeatureViews/Gradebook/Gradebook";
import Registration from "../FeatureViews/Registration/Registration";
import RegistrationForm from "../Form/Form";
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import Accounts from "../FeatureViews/Accounts/Accounts";
import RegistrationCourse from "../FeatureViews/Registration/RegistrationCourse";
import CourseCategory from "../FeatureViews/Registration/CourseCategory";
import LoginPage from "../Authentication/LoginPage.js";
import ProtectedRoute from "./ProtectedRoute";
import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";
import Redirect from "react-router-dom/es/Redirect";

function rootRoutes(props) {
    return (
        <Switch>
            {/* Main Feature Views */}
            <ProtectedRoute
                exact
                path="/"
                render={(passedProps) => <Dashboard {...passedProps} />} />
            {/* <Route
                path="/attendance"
                render={(passedProps) => <Attendance {...passedProps} />} />
            <Route
                path="/courses"
                render={(passedProps) => <Courses {...passedProps} />} />
            <Route
                path="/gradebook"
                render={(passedProps) => <Gradebook {...passedProps} />} /> */}
            <ProtectedRoute
                exact
                path="/registration"
                render={(passedProps) => <Registration {...passedProps} />} />
            <ProtectedRoute
                path="/scheduler"
                render={(passedProps) => <Scheduler {...passedProps} />} />
            {/* <ProtectedRoute
                path="/directory"
                render={(passedProps) => <UsersDirectory {...passedProps} />} /> */}
            <ProtectedRoute
                path="/accounts"
                render={(passedProps) => <Accounts {...passedProps} />} />
            <Route
                path="/login"
                render={(passedProps) => <LoginPage setLogin={props.setLogin} {...passedProps} />} />

            {/* Registration Routes */}
            <ProtectedRoute
                path="/registration/form/:type/:course?"
                render={(passedProps) => <RegistrationForm {...passedProps} />} />
            <ProtectedRoute
                path="/registration/course/:courseID?/:courseTitle?"
                render={(passedProps) => <RegistrationCourse {...passedProps} />} />
            <ProtectedRoute
                path="/registration/category/:categoryID"
                render={(passedProps) => <CourseCategory {...passedProps} />} />
            <Route path={"/PageNotFound"} component={ErrorNotFoundPage}/>
            <Redirect to={"/PageNotFound"}/>
        </Switch>
    );
}

rootRoutes.propTypes = {
    "setLogin": PropTypes.func,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(rootRoutes);
