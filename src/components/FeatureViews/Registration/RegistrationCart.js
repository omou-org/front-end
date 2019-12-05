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
                    checkedCourses[studentID][registrationForm.course_id] = {checked:false,sessions:registrationForm.sessions};
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

    const renderCourseSessions = (selected, course, studentID) => {
        let registration = props.registration.registered_courses[studentID].find((registration)=>{
            return registration.course_id === course.course_id;
        });
        if(registration.type === "class"){
            registration.sessions = course.capacity;
        }

        return !selected.checked ? selected.sessions : <TextField
                  id="outlined-number"
                  label="No. Sessions"
                  value={selected.sessions}
                  onChange={handleCourseSessionsChange(selected,registration)}
                  type="number"
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined"
                />;
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

    const handlePayMethodChange = method => e =>{
        setPaymentMethod({ [method]: e.target.checked })
    }

    const renderPayment = (isOneCourse, selectedStudentID, selectedCourseID) =>{
        const {cash, creditCard, check} = paymentMethod;
        let selectedRegistration = props.registration.registered_courses[selectedStudentID].find(({course_id})=>{
            return course_id === selectedCourseID});
        let isSmallGroup = selectedCourseID.indexOf("T") === -1 ? props.courseList[selectedCourseID].capacity < 5: false;
        let {form, course_id} = selectedRegistration;
        let formType = form.form;
        return <Grid container>
            {
                isOneCourse ? <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6}/>
                        <Grid item xs={3}>
                            {
                                isSmallGroup ?
                                    <Button
                                        className={"button"}
                                        component={NavLinkNoDup}
                                        to={`/registration/form/course_details/${selectedCourseID}/edit`}
                                        >Edit Group Course</Button> : ""
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <Button className={"button"}
                                    component={NavLinkNoDup}
                                    to={`/registration/form/${formType}/${selectedStudentID}+${course_id}/edit`}
                            >
                                Edit Registration
                            </Button>
                        </Grid>
                    </Grid>
                </Grid> : ""
            }
            <Grid item xs={12}>
                <Grid container>
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
                        <Grid item xs={6}/>
                        <Grid item xs={4}>
                            <Button className={"button"} onClick={updateQuantity()}>
                                UPDATE SESSIONS
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button className={"button"} onClick={handlePay()}>
                                PAY
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
        </Grid>
    }

    const updateQuantity = () => (e) => {
        e.preventDefault();
        updatedCourses.forEach((updatedCourse)=>{
            api.editRegistration(updatedCourse);
        });
    }

    const handlePay = () => (e)=>{
        e.preventDefault();
        setSelectionPending(false);

        console.log("paying!");
        // console.log("updated Courses?", props.registration.registered_courses);
        Object.keys(props.registration.registered_courses).forEach((studentID)=>{
            props.registration.registered_courses[studentID].forEach(({type, course_id, new_course})=>{
                console.log(new_course, course_id, studentID);
                if(selectedCourses[studentID][course_id].checked){
                    switch(type){
                        case "class":
                            api.submitClassRegistration(studentID, course_id);
                            break;
                        case "tutoring":
                            break;
                    }
                }
            })
        })
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
