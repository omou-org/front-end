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
import RegistrationForm from "../FeatureViews/Registration/Form";
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import Accounts from "../FeatureViews/Accounts/Accounts";
import RegistrationCourse from "../FeatureViews/Registration/RegistrationCourse";
import CourseCategory from "../FeatureViews/Registration/CourseCategory";
import LoginPage from "../LoginPage/LoginPage.js";
import ProtectedRoute from "./ProtectedRoute";

function rootRoutes(props) {
    return (
        <Switch>
            {/* Main Feature Views */}
            <Route
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
            <Route
                path="/scheduler"
                render={(passedProps) => <Scheduler {...passedProps} />} />
            {/* <ProtectedRoute
                path="/directory"
                render={(passedProps) => <UsersDirectory {...passedProps} />} /> */}
            <Route
                path="/accounts"
                render={(passedProps) => <Accounts {...passedProps} />} />
            <Route
                path="/login"
                render={(passedProps) => <LoginPage setLogin={props.setLogin} {...passedProps} />} />

            {/* Registration Routes */}
            <Route
                path="/registration/form/:type/:course?"
                render={(passedProps) => <RegistrationForm {...passedProps} />} />
            <Route
                path="/registration/course/:courseID?/:courseTitle?"
                render={(passedProps) => <RegistrationCourse {...passedProps} />} />
            <Route
                path="/registration/category/:categoryID"
                render={(passedProps) => <CourseCategory {...passedProps} />} />
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
