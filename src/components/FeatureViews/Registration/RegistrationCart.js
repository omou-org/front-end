import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";
import "./registration.scss";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as userActions from "../../../actions/userActions.js"
import {connect, useDispatch, useSelector} from "react-redux";
import {FormControl, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as apiActions from "../../../actions/apiActions";
import * as searchActions from "../../../actions/searchActions";
import {GET} from "../../../actions/actionTypes";
import Button from "@material-ui/core/Button";
import Loading from "../../Loading";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
})

function RegistrationCart(props) {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    const [paymentMethod, setPaymentMethod] = useState(()=>{
        return {
            cash: false,
            creditCard: false,
            check: false,
        }
    });
    const [viewPaymentOptions, setPaymentOptions] = useState(false);
    const [selectedCourses, selectCourse] = useState({});
    const [usersLoaded, setLoadingUsers] = useState(false);

    useEffect(()=>{
        console.log("triggered");
        api.initializeRegistration();
        api.fetchCourses();
    },[api]);

    useEffect(()=>{
        if(props.registration.registered_courses){
            console.log(props.registration);
            // Get student id's
            let studentIDs = Object.keys(props.registration.registered_courses);
            let checkedCourses = {};
            studentIDs.forEach((studentID)=>{
                checkedCourses[studentID] = {};
                props.registration.registered_courses[studentID].forEach((registrationForm) => {
                    checkedCourses[studentID][registrationForm.course_id] = false;
                });
            });
            // Set-up checkboxes
            selectCourse(checkedCourses);

            studentIDs.forEach((studentID)=>{
                api.fetchStudents(studentID);
            });

            setLoadingUsers(true);
        }

    },[props.registration.registered_courses, api]);

    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const classes = useStyles();

    const goToCourse = (courseID) => () => {
        props.history.push(`/registration/course/${courseID}`);
    }

    const handleCourseSelect = (studentID, courseID) => (e) => {
        // e.preventDefault();
        let currentlySelectedCourses = JSON.parse(JSON.stringify(selectedCourses));
        currentlySelectedCourses[studentID][courseID] = !currentlySelectedCourses[studentID][courseID];
        selectCourse(currentlySelectedCourses);
    }

    const renderStudentRegistrations = () => {
        return Object.keys(props.registration.registered_courses).map((student_id) =>{
            let registrations = props.registration.registered_courses[student_id];
            return props.studentAccounts[student_id] && <Grid container>
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
                        <Grid item xs={3} md={3}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Dates
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={1}>
                            <Typography align={'center'} style={{color: 'white', fontWeight: '500'}}>
                                Sessions
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Typography align={'center'} style={{color: 'white', fontWeight: '500'}}>
                                Tuition
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Typography align={'center'} style={{color: 'white', fontWeight: '500'}}>
                                Material Fee
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container >
                        {
                            registrations.map((registration) => {
                                let course;
                                if (registration.new_course){ //if tutoring
                                    course = registration.new_course;
                                } else {
                                    course = props.courseList[registration.course_id];
                                }
                                if(course){
                                    let dateOptions = {year: "numeric", month: "short", day: "numeric"};
                                    let startDate = new Date(course.schedule.start_date + course.schedule.start_time),
                                        endDate = new Date(course.schedule.end_date + course.schedule.end_time);
                                    startDate = startDate.toLocaleDateString("en-US", dateOptions);
                                    endDate = endDate.toLocaleDateString("en-US", dateOptions);
                                    return (<Grid item xs={12} md={12}>
                                        <Paper square={true} >
                                            <Grid container alignItems="center">
                                                <Grid item xs={1} md={1}>
                                                    <Checkbox checked={selectedCourses[student_id][registration.course_id]}
                                                              onChange={handleCourseSelect(student_id, registration.course_id)}  />
                                                </Grid>
                                                <Grid item xs={3} md={3} >
                                                    <Typography align={'left'}>
                                                        {course.title}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3} md={3}>
                                                    <Typography align={'left'}>
                                                        {startDate} - {endDate}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1} md={1}>
                                                    <Typography align={'center'}>
                                                        ??
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2} md={2}>
                                                    <Typography align={'center'}>
                                                        {course.tuition}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>);
                                }
                            })
                        }
                    </Grid>
                </Grid>
            </Grid>
        });
    };

    const handlePayMethodChange = method => e =>{
        setPaymentMethod({ [method]: e.target.checked })
    }

    const renderPayment = () =>{
        const {cash, creditCard, check} = paymentMethod;
        return <Grid container>
            <Grid item xs={3}>
                <FormControl>
                    <FormLabel>Select Payment Method</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            label={"Cash"}
                            control={<Checkbox checked={cash} onChange={handlePayMethodChange('cash')} value={"Cash"}/>}
                        />
                        <FormControlLabel
                            label={"Check"}
                            control={<Checkbox checked={check} onChange={handlePayMethodChange('check')} value={"Check"}/>}
                        />
                        <FormControlLabel
                            label={"Credit Card"}
                            control={<Checkbox checked={creditCard} onChange={handlePayMethodChange('creditCard')} value={"Credit Card"}/>}
                        />
                    </FormGroup>
                </FormControl>
            </Grid>
            <Grid item xs={9}>
                <Grid container>
                    <Grid item xs={10}/>
                    <Grid item xs={2}>
                        <Button className={"button"}>PAY</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    }

    const selectedCourseOptions = () => {
        let displaySelectionOptions = 0;
        Object.keys(selectedCourses).forEach((studentID)=>{
            Object.values(selectedCourses[studentID]).forEach((checkbox)=>{
                if(checkbox){
                    displaySelectionOptions++;
                }
            })
        });
        if(displaySelectionOptions === 1){
            return <Grid container>
                <Grid item xs={10}/>
                <Grid item xs={2}>
                    <Button className={"button"}>
                        Edit Registration
                    </Button>
                </Grid>
            </Grid>
        } else if(displaySelectionOptions > 1){
            return renderPayment();
        }
        return "";
    }

    return (
        <form>
            <Paper className={"registration-cart paper"}>
                <Grid container layout={"row"} spacing={8}>
                    <Grid item xs={12}>
                        <BackButton/>
                        <hr/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h3"} align={"left"}>Select Course(s) to Pay</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {usersLoaded ? renderStudentRegistrations() : <Loading/>}
                    </Grid>
                    <Grid item xs={12}>
                        {selectedCourseOptions()}
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
    "userActions": bindActionCreators(userActions, dispatch),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationCart));
