import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";
import "./registration.scss";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect} from "react-redux";
import {Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
})

function RegistrationCart(props) {
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

    const renderStudentRegistrations = () =>{
        return Object.keys(props.registration.registered_courses).map((student_id) =>{
            let registrations = props.registration.registered_courses[student_id];
            return <Grid container>
                <Grid item xs={12}>
                    <Typography variant={"h5"} align={"left"}>
                        {props.studentAccounts[student_id].name}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container className={'accounts-table-heading'}>
                        <Grid item xs={1} md={1}> </Grid>
                        <Grid item xs={3} md={3}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Session
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Dates
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Sessions
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Tuition
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Material Fee
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container >
                        {
                            registrations.map(({course_id}) => {
                                let course = props.courseList[course_id];

                                let dateOptions = {year: "numeric", month: "short", day: "numeric"};
                                let startDate = new Date(course.schedule.start_date + course.schedule.start_time),
                                    endDate = new Date(course.schedule.end_date + course.schedule.end_time);
                                startDate = startDate.toLocaleDateString("en-US", dateOptions);
                                endDate = endDate.toLocaleDateString("en-US", dateOptions);
                                return (<Grid item xs={12} md={12} className={'accounts-table-row'}>
                                    <Paper square={true} >
                                        <Grid container>
                                            <Grid item xs={1} md={1}>
                                                <Checkbox checked={selectedCourses[student_id][course_id]}
                                                          onChange={handleCourseSelect(student_id, course_id)}  />
                                            </Grid>
                                            <Grid item xs={3} md={3} >
                                                <Typography align={'left'}>
                                                    {course.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2} md={2}>
                                                <Typography align={'left'}>
                                                    {startDate} - {endDate}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2} md={2}>
                                                <Typography align={'left'}>
                                                    ??
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2} md={2}>
                                                <Typography align={'left'}>
                                                    {course.tuition}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>);
                            })
                        }
                    </Grid>
                </Grid>
            </Grid>
        });
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
                        <Typography variant={"h3"} align={"left"}>Select Course(s) to Pay</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {renderStudentRegistrations()}
                    </Grid>
                </Grid>
            </Paper>
        </form>

    );
}

RegistrationCart.propTypes = {
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
)(RegistrationCart));
