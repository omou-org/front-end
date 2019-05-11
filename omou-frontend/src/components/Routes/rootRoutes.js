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
import Scheduler from "../FeatureViews/Scheduler/Scheduler";
import UsersDirectory from "../FeatureViews/UsersDirectory/UsersDirectory";
import ReduxExample from "../reduxExample";

class rootRoutes extends Component {
    render(){
        return (
        <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route path="/attendance" component={Attendance}/>
            <Route path="/courses" component={Courses}/>
            <Route path="/gradebook" component={Gradebook}/>
            <Route path="/registration" component={Registration}/>
            <Route path="/scheduler" component={Scheduler}/>
            <Route path="/directory" component={UsersDirectory}/>
            <Route path="/reduxexample" component={ReduxExample}/>
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