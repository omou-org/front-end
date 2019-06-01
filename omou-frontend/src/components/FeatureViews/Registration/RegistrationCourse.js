import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import Categories from "@material-ui/icons/Category";
import CourseList from "@material-ui/icons/List";
import {NavLink} from "react-router-dom";

class RegistrationCourse extends Component {
    constructor(props){
        super(props);
        this.state = {
            mobileViewToggle: true,
            mobileView: false,
        }
    }


    render(){
        return (
            <Grid item xs={12}>
                <Paper className={"paper"}>

                </Paper>
            </Grid>
        )
    }
}

RegistrationCourse.propTypes = {
    stuffActions: PropTypes.object,
    RegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"],
        courseCategories: state.Registration["categories"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationCourse);