import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import { NavLink } from "react-router-dom";
import './registration.scss';

class RegistrationActions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let courseRoute = "";
        (this.props.courseTitle !== undefined && this.props.courseTitle !== "") ? courseRoute = '/' + encodeURIComponent(this.props.courseTitle) : courseRoute="";
        return (<Grid container
            direction={"row"}
            justify={"flex-start"}
            className={"registration-action-control"}>
            <Grid item>
                <Button component={NavLink} to={'/registration/form/student'}
                    variant="outlined"
                    color="secondary"
                    className={"button"}>
                    <NewUser className={"icon"} />
                    New Student
                                </Button>
            </Grid>
            <Grid item>
                <Button component={NavLink} to={`/registration/form/tutoring${courseRoute}`}
                    variant="outlined"
                    color="secondary"
                    className={"button"}>
                    <NewTutor className={"icon"} />
                    New Tutoring
                                </Button>
            </Grid>
            <Grid item>
                <Button component={NavLink} to={`/registration/form/course${courseRoute}`}
                    variant="outlined"
                    color="secondary"
                    className={"button"}>
                    <NewCourse className={"icon"} />
                    New Course
                                </Button>
            </Grid>
        </Grid>)
    }
}

RegistrationActions.propTypes = {
    stuffActions: PropTypes.object,
    stuffs: PropTypes.array,
    course_title: PropTypes.string,
    admin: PropTypes.bool,
}

function mapStateToProps(state) {
    return {
        stuffs: state.stuff
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationActions);