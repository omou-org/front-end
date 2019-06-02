//React Imports
import {connect} from 'react-redux';
import { Route, Switch } from "react-router-dom";
import {bindActionCreators} from 'redux';
import * as stuffActions from '../../actions/stuffActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Local Component Imports
import Dashboard from "../FeatureViews/Dashboard/Dashboard";
import Attendance from "../FeatureViews/Attendance/Attendance";
import Courses from "../FeatureViews/Courses/Courses";
import Gradebook from "../FeatureViews/Gradebook/Gradebook";
import Registration from "../FeatureViews/Registration/Registration";
import RegistrationForm from "../FeatureViews/Registration/Form"
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import UsersDirectory from "../FeatureViews/UsersDirectory/UsersDirectory";
import ReduxExample from "../reduxExample";
import RegistrationCourse from "../FeatureViews/Registration/RegistrationCourse";

class rootRoutes extends Component {
    render(){
        return (
        <Switch>
            {/*Main Feature Views*/}
            <Route exact path="/" component={Dashboard}/>
            <Route path="/attendance" component={Attendance}/>
            <Route path="/courses" component={Courses}/>
            <Route path="/gradebook" component={Gradebook}/>
            <Route exact path="/registration" render={(props)=> <Registration {...props}/>}/>
            <Route path="/scheduler" component={Scheduler}/>
            <Route path="/directory" component={UsersDirectory}/>
            <Route path="/reduxexample" component={ReduxExample}/>

            {/*Registration Routes*/}
            <Route path={"/registration/form/:type/:course?"} render={(props)=> <RegistrationForm {...props}/>}/>
            <Route path={"/registration/course/:courseID?/:courseTitle?"} render={(props)=> <RegistrationCourse {...props}/>}/>
        </Switch>
        )
    }
}

rootRoutes.propTypes = {
    stuffActions: PropTypes.object,
    stuffs: PropTypes.array
};

function mapStateToProps(state) {
    return {
        stuffs: state.stuff
    };
}

function mapDispatchToProps(dispatch) {
    return {
        stuffActions: bindActionCreators(stuffActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(rootRoutes);