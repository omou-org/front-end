import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";
import "./AdminPortal.scss";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect} from "react-redux";
import {Button, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
})

function AdminPortal(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCourses, selectCourse] = useState(()=>{
        // Get student id's
        let studentIDs = Object.keys(props.registration.registered_courses);
        let checkedCourses = {};
        studentIDs.forEach((studentID)=>{
            checkedCourses[studentID] = {};
            props.registration.registered_courses[studentID].forEach((registrationForm) => {
                checkedCourses[studentID][registrationForm.course_id] = false;
            });
        });
        return checkedCourses;
    })
    const classes = useStyles();

    useEffect(()=>{
        props.registrationActions.initializeRegistration();
    },[]);
    const goToCourse = (courseID) => () => {
        props.history.push(`/registration/course/${courseID}`);
    }

    const handleCourseSelect = (studentID, courseID) => (e) => {
        // e.preventDefault();
        let currentlySelectedCourses = JSON.parse(JSON.stringify(selectedCourses));
        currentlySelectedCourses[studentID][courseID] = !currentlySelectedCourses[studentID][courseID];
        selectCourse(currentlySelectedCourses);
    }

    return (
        <form>
            <Paper className={"registration-cart paper"}>
                <Grid container layout={"row"}>
                    <Grid item xs={12}>
                        <BackButton/>
                        <hr/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h3"} align={"left"}>Admin Portal</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={2}>
                                <Button component={NavLinkNoDup} to={"/registration/form/instructor"}
                                        color={"primary"}
                                    className={"button"}> Add Instructor</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </form>

    );
}

AdminPortal.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPortal));
