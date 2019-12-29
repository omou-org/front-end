import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import BackArrow from "@material-ui/icons/ArrowBack";
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
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import TextField from "@material-ui/core/TextField";
import Prompt from "react-router-dom/es/Prompt";
import PriceQuoteForm from "../../Form/PriceQuoteForm";
import {durationParser} from "../../../actions/apiActions";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

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

    const [selectedCourses, selectCourse] = useState({});
    const [usersLoaded, setLoadingUsers] = useState(false);
    const [updatedCourses, addUpdatedCourse] = useState([]);
    const [selectionPendingStatus, setSelectionPending] = useState(false);

    useEffect(()=>{
        api.initializeRegistration();
        api.fetchCourses();
    },[api]);

    useEffect(()=>{
        if(props.registration.registered_courses){
            // Get student id's
            let studentIDs = Object.keys(props.registration.registered_courses);
            let checkedCourses = {};
            studentIDs.forEach((studentID)=>{
                checkedCourses[studentID] = {};
                props.registration.registered_courses[studentID].forEach((registrationForm) => {
                    if(registrationForm.course_id){
                        checkedCourses[studentID][registrationForm.course_id] = {checked:false,sessions:registrationForm.sessions};
                    }
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
        let currentlySelectedCourses = {...selectedCourses};
        currentlySelectedCourses[studentID][courseID] = {
            sessions: currentlySelectedCourses[studentID][courseID].sessions,
            checked: !currentlySelectedCourses[studentID][courseID].checked
        };
        selectCourse(currentlySelectedCourses);
    };

    const handleCourseSessionsChange = (selectedCourse, studentID, courseID) => (e) =>{
        // registration.sessions = e.target.value;
        let {value} = e.target;
        selectCourse({
            ...selectedCourses,
            [studentID]:{
                ...selectedCourses[studentID],
                [courseID]:{
                    ...selectedCourse,
                    sessions:value,
                }
            }
        });
        //update registration in redux
        let updatedRegisteredCourse = {
            ...props.registration.registered_courses[studentID].find((course)=>{return courseID === course.course_id}),
            sessions:Number(value),
        };
        let courses = updatedCourses;
        courses.push(updatedRegisteredCourse);
        addUpdatedCourse(courses);
    };

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
                                Course
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
                                    let startDate = new Date(course.schedule.start_date),
                                        endDate = new Date(course.schedule.end_date);
                                    startDate = startDate.toLocaleDateString("en-US", dateOptions);
                                    endDate = endDate.toLocaleDateString("en-US", dateOptions);

                                    return (<Grid item xs={12} md={12}>
                                        <Paper square={true} >
                                            <Grid container alignItems="center">
                                                <Grid item xs={1} md={1}>
                                                    <Checkbox checked={selectedCourses[student_id][registration.course_id].checked}
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
                                                        {
                                                            !selectedCourses[student_id][registration.course_id].checked ?
                                                                <Typography align={'center'}>
                                                                    {selectedCourses[student_id][registration.course_id].sessions}
                                                                </Typography>
                                                                :
                                                                <TextField
                                                                    id="outlined-number"
                                                                    label="Quantity"
                                                                    value={selectedCourses[student_id][registration.course_id].sessions}
                                                                    onChange={handleCourseSessionsChange(
                                                                        selectedCourses[student_id][registration.course_id],
                                                                        student_id,
                                                                        registration.course_id)}
                                                                    type="number"
                                                                    // className={classes.textField}
                                                                    InputLabelProps={{
                                                                    shrink: true,
                                                                    }}
                                                                    margin="normal"
                                                                    variant="outlined"
                                                            />
                                                        }
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



    const renderPayment = (isOneCourse, selectedStudentID, selectedCourseID) =>{
        let selectedRegistration = props.registration.registered_courses[selectedStudentID].find(({course_id})=>{
            if(selectedCourseID.indexOf("T") > -1){
                return course_id === selectedCourseID;
            } else {
                return course_id === Number(selectedCourseID)
            }
        });
        let isSmallGroup = selectedCourseID.indexOf("T") === -1 ? props.courseList[selectedCourseID].capacity < 5: false;
        let {form, course_id} = selectedRegistration;
        let formType = form.form;

        let selectedCoursesHaveSession = () =>{
            let haveSession = true;
            Object.values(selectedCourses).forEach((student) => {
                Object.values(student).forEach((course)=>{
                    if(course.checked && course.sessions < 1 ){
                        haveSession = false;
                    }
                })
            });
            return haveSession;
        };

        // This determines if there's been an update to the number of sessions to checkout for any course
        let selectedCourseSameAsRedux = () =>{
            // go to each selectedCourses
            // get selectedCourse from registered_courses
            // compare if both sessions are equal
            let sameSessions = true;
            Object.entries(selectedCourses).forEach(([studentID, studentVal])=>{
                Object.entries(studentVal).forEach(([courseID, courseVal])=>{
                    let reduxCourse = props.registration.registered_courses[studentID].find(({course_id})=>{
                        if(courseID.indexOf("T") > -1) {
                            return course_id === courseID;
                        } else {
                            return course_id === Number(courseID);
                        }
                    });
                    if(reduxCourse.sessions !== courseVal.sessions){
                        sameSessions = false;
                    }
                });
            });
            return sameSessions;
        };

        // generate student list
        let registeredStudents = () => {
            return Object.keys(selectedCourses);
        };
        // generate registered course object split by class and tutoring
        let registeredCourses = () => {
            let courses = {
                courses: [],
                tutoring: [],
            };
            Object.entries(selectedCourses).forEach(([studentID, studentVal])=>{
                Object.entries(studentVal).forEach(([courseID, courseVal])=>{
                    if(courseVal.checked){
                        if(courseID.indexOf("T") > -1){
                            //{category, academic_level, sessions, form}
                            let tutoringCourse = props.registration.registered_courses[studentID].find((course)=>{
                                return course.course_id === courseID
                            });
                            let {category, academic_level, form} = tutoringCourse;
                            courses["tutoring"].push({
                                category_id: category,
                                academic_level: academic_level,
                                sessions: courseVal.sessions,
                                duration: durationParser[form["Schedule"]["Duration"]],
                                student_id: studentID,
                                new_course: tutoringCourse.new_course,
                            });
                        } else {
                            courses["courses"].push({
                                course_id: courseID,
                                sessions: courseVal.sessions,
                                student_id: studentID,
                            });
                        }
                    }
                });
            });
            return courses;
        }

        return <Grid container spacing={8}>
            {
                <Grid item xs={12}>
                    <Grid container justify={"flex-end"}>
                        <Grid item xs={6}/>
                        {
                            isOneCourse &&
                            <>
                                <Grid item>
                                    {
                                        isSmallGroup ?
                                            <Button
                                                className={"button"}
                                                component={NavLinkNoDup}
                                                to={`/registration/form/course_details/${selectedCourseID}/edit`}
                                            >Edit Group Course</Button> : ""
                                    }
                                </Grid>
                                <Grid item>
                                    <Button className={"button"}
                                            component={NavLinkNoDup}
                                            to={`/registration/form/${formType}/${selectedStudentID}+${course_id}/edit`}
                                    >
                                        Edit Registration
                                    </Button>
                                </Grid>
                            </>
                        }
                        <Grid item >
                            <Grid container justify={"flex-end"}>
                                {
                                    !selectedCourseSameAsRedux() &&
                                    <Button className={"button"} onClick={updateQuantity()}>
                                        UPDATE SESSIONS
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            <Grid item xs={12}>
                <PriceQuoteForm
                    courses={registeredCourses()["courses"]}
                    tutoring={registeredCourses()["tutoring"]}
                    disablePay={!(selectedCoursesHaveSession() && selectedCourseSameAsRedux())}
                />
            </Grid>
        </Grid>
    }

    const updateQuantity = () => (e) => {
        e.preventDefault();
        updatedCourses.forEach((updatedCourse)=>{
            api.editRegistration(updatedCourse);
        });
    }



    const selectedCourseOptions = () => {
        let displaySelectionOptions = 0;
        let selectedCourseID=-1, selectedStudentID = -1;
        Object.keys(selectedCourses).forEach((studentID)=>{
            for (let [courseID, checkbox] of Object.entries(selectedCourses[studentID])){
                if(checkbox.checked){
                    displaySelectionOptions++;
                    selectedCourseID = courseID;
                    selectedStudentID = studentID;
                }
            }
        });
        if(selectedCourseID !== -1) {
            return renderPayment(displaySelectionOptions === 1, selectedStudentID, selectedCourseID);
        }
        return "";
    }

    return (
        <form>
            <Paper className={"registration-cart paper"}>
                <Grid container layout={"row"} spacing={8}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item={3}>
                                <Button
                                    className={"button"}
                                    component={NavLinkNoDup} to={"/registration"}>
                                    <BackArrow/>
                                    Register
                                </Button>
                            </Grid>
                        </Grid>
                        <hr/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h3"} align={"left"}>Select Course(s)</Typography>
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
    "instructorAccounts": state.Users.InstructorList,
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
