
import {Link, useParams, useHistory} from "react-router-dom";
import BackButton from "../../../BackButton";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as userActions from "actions/userActions";
import * as calendarActions from "../../../../actions/calendarActions"
import {bindActionCreators} from "redux";
import * as hooks from "actions/hooks";
import * as registrationActions from "../../../../actions/registrationActions";

import Grid from "@material-ui/core/Grid";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Notes from "components/FeatureViews/Notes/Notes";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Loading from "components/Loading";
import Button from "@material-ui/core/Button";
import {GET} from "../../../../actions/actionTypes";
import {NEW_REGISTERING_PARENT} from "../../../../reducers/apiReducer";


const DayConverter = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
};

const timeOptions = {
    "hour": "2-digit",
    "minute": "2-digit",
};
const dateOptions = {
    "year": "numeric",
    "month": "numeric",
    "day": "numeric",
};

const courseDataParser = ({schedule, status, tuition}) => {
    const DaysString = schedule.days;

    const endDate = new Date(schedule.end_date + schedule.end_time),
        startDate = new Date(schedule.start_date + schedule.start_time);

    return {
        "date": `${startDate.toLocaleDateString("en-US", dateOptions)} - ${endDate.toLocaleDateString("en-US", dateOptions)}`,
        "day": DaysString,
        "endTime": endDate.toLocaleTimeString("en-US", timeOptions),
        "startTime": startDate.toLocaleTimeString("en-US", timeOptions),
        status,
        tuition,
    };
};

const CourseSessionStatus = (props) => {
    const history = useHistory();

    const {"accountID": studentID, courseID} = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const courseSessions = useSelector(({Calendar}) => Calendar.CourseSessions);
    const usersList = useSelector(({Users}) => Users);
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const course = courses[courseID];

    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(calendarActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    const studentStatus = hooks.useStudent(studentID);
    const courseStatus = hooks.useCourse(courseID);
    const instructorStatus = hooks.useInstructor(course && course.instructor_id, true);
    const enrollmentStatus = hooks.useEnrollmentByCourse(courseID);
    const courseTypeParse = {
        "T":"tutoring",
        "C":"course",
    };

    const enrollment = (enrollments[studentID] && enrollments[studentID][courseID]) || {};
    useEffect(() => {
        api.initializeRegistration();
        api.fetchEnrollmentNotes(enrollment.enrollment_id, studentID, courseID);
    }, [api, enrollment.enrollment_id, studentID, courseID]);

    const registeringParent = useSelector(({Registration}) => Registration.CurrentParent);
    // const registeredCourses = useSelector(({Registration}) => Registration.registered_courses);

    const noteInfo = useMemo(() => ({
        courseID,
        "enrollmentID": enrollment.enrollment_id,
        studentID,
    }), [courseID, enrollment.enrollment_id, studentID]);
    useEffect(()=>{
        if(course){
            api.fetchSessions({
                config: {
                    params: {
                        time_frame: "month",
                        view_option: courseTypeParse[course.type],
                        time_shift: 1,
                    }
                }
            });
        }
    },[course, api]);

    const sessionDataParse = useCallback(({start_datetime, end_datetime, course, status}) => {
        // let {start, end, course, status} = paramCourse
        const startDate = start_datetime && new Date(start_datetime);
        const endDate = end_datetime && new Date(end_datetime);

        if(start_datetime && end_datetime && course){
            return {
                "date": startDate.toLocaleDateString("en-US", dateOptions),
                "day": DayConverter[startDate.getDay()],
                "endTime": endDate.toLocaleTimeString("en-US", timeOptions),
                "startTime": startDate.toLocaleTimeString("en-US", timeOptions),
                status,
                "tuition": course && courses[course].tuition,
            };
        }
        return {};
    }, [courses, api]);

    // either doesn't exist or only has notes defined
    if (!enrollment || Object.keys(enrollment).length <= 1) {
        return <Loading />;
    }
    if (hooks.isLoading(courseStatus, enrollmentStatus, studentStatus, instructorStatus)) {
        return <Loading />;
    }
    if (hooks.isFail(courseStatus, enrollmentStatus, studentStatus)) {
        return "Error loading data";
    }

    const calendarSessions = courseSessions ? courseSessions
            .filter(session => session.course === Number(courseID)) : [],
        paymentSessionStatus = enrollment.session_payment_status,
        statusKey = (status) => {
            if (status === 1) {
                return "Paid";
            } else if (status === 0) {
                return "Unpaid";
            }
            return "Waived";

        };

    const handleTabChange = (_, newTab) => {
        setActiveTab(newTab);
    };
    // console.log(course, calendarSessions)
    const sessions = course.type === "T" && courseSessions
        ? calendarSessions.map((session) => ({
            ...session,
            "status": statusKey(paymentSessionStatus[session.session_id]),
        }))
        : [
            {
                ...course,
                "status": Object.values(paymentSessionStatus)
                    .some((session) => session === 0)
                    ? "Unpaid"
                    : "Paid",
                "type": "C",
            },
        ];

    let parentOfCurrentStudent = usersList.StudentList[studentID].parent_id;

    const courseToRegister = {
        "Course Selection":{
            "Course":{
                label: course.title,
                value: course.course_id,
            },
        },
        "Course Selection_validated":{
            "Course": true,
        },
        "Student":{
            "Student":{
                label: usersList.StudentList[studentID].name,
                value: studentID,
            }
        },
        "Student_validated":{
            "Student": true,
        },
        "Student Information":{},
        "activeSection":"Student",
        "activeStep":0,
        "conditional": "",
        "existingUser": false,
        "form": "course",
        "hasLoaded":true,
        "preLoaded":false,
        "submitPending":false,
    };

    const initRegisterMoreSessions = event => {
        event.preventDefault();
        // check if registering parent is the current student's parent
        console.log(registeringParent, parentOfCurrentStudent);
        if(registeringParent && registeringParent.user.id !== parentOfCurrentStudent){
            // if not, warn user they're about to discard everything with the current registering parent
            // set current parent to current student's parent
            console.log("Different parent!", registeringParent, parentOfCurrentStudent)
        } else if(registeringParent && registeringParent.user.id === parentOfCurrentStudent){
            //registering parent is the same as the current student's parent
            api.addCourseRegistration(courseToRegister);
            history.push("/registration/cart/")
        } else if(!registeringParent) {
            // api.fetchParents(parentOfCurrentStudent);
            api.setParentAddCourseRegistration(parentOfCurrentStudent, courseToRegister);
            history.push("/registration/cart/")
        }
    };

    const renderMain = () => {
        switch (activeTab) {
            case 0:
                return (
                    <>
                        <Grid
                            item
                            md={12}
                            xs={12}>
                            <Grid
                                className="accounts-table-heading"
                                container>
                                <Grid
                                    item
                                    xs={1} />
                                <Grid
                                    item
                                    xs={3}>
                                    <Typography
                                        align="left"
                                        className="table-text">
                                        Session Date
                                    </Typography>
                                </Grid>
                                {
                                    ["Day", "Time", "Tuition", "Status"].map((header) => (
                                        <Grid
                                            item
                                            key={header}
                                            xs={2}>
                                            <Typography
                                                align="left"
                                                className="table-text">
                                                {header}
                                            </Typography>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={8}>
                            {sessions.length !== 0
                                ? sessions.map((session, i) => {
                                    const {day, date, startTime, endTime, status, tuition} =
                                        course.type === "T"
                                            ? sessionDataParse(session) : courseDataParser(session);
                                    return (
                                        <Grid
                                            className="accounts-table-row"
                                            item
                                            key={i}
                                            xs={12}>
                                            <Paper square>
                                                <Grid container>
                                                    <Grid
                                                        item
                                                        xs={1} />
                                                    <Grid
                                                        item
                                                        xs={3}>
                                                        <Typography align="left">
                                                            {date}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}>
                                                        <Typography align="left">
                                                            {day}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}>
                                                        <Typography align="left">
                                                            {startTime} - {endTime}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}>
                                                        <Typography align="left">
                                                    ${tuition}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}>
                                                        <div className={`sessions-left-chip ${status}`}>
                                                            {status}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    );
                                })
                                : <Grid
                                    item
                                    xs={12}>
                                    <Paper className="info">
                                        <Typography style={{"fontWeight": 700}}>
                                        No Courses Yet!
                                        </Typography>
                                    </Paper>
                                </Grid>
                            }
                        </Grid>
                        <Grid item md={12}>
                            <Grid container
                                  direction={"row"}
                                  justify={"flex-end"}>
                                <Grid item>
                                    <Button
                                        onClick={initRegisterMoreSessions}
                                    >
                                        Add Sessions
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                );
            case 1:
                return (
                    <Notes
                        ownerID={noteInfo}
                        ownerType="enrollment" />
                );
            // no default
        }
    };

    return (
        <Paper className="paper">
            <Grid
                className="course-session-status"
                container>
                <Grid
                    item
                    xs={12}>
                    <BackButton />
                    <hr />
                </Grid>
                <Grid
                    item
                    xs={12}>
                    <Typography
                        align="left"
                        variant="h4">
                        {course.title}
                    </Typography>
                    <Typography align="left">
                        Student:
                        <Link to={`/accounts/student/${studentID}`}>
                            {usersList.StudentList[studentID].name}
                        </Link>
                    </Typography>
                    <Typography align="left">
                        Instructor:
                        <Link to={`/accounts/instructor/${course.instructor_id}`}>
                            {usersList.InstructorList[course.instructor_id].name}
                        </Link>
                    </Typography>
                </Grid>
                <Tabs
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    style={{
                        "marginBottom": "10px",
                    }}
                    value={activeTab}>
                    <Tab
                        label={<><RegistrationIcon className="NoteIcon" /> Registration</>} />
                    <Tab
                        label={
                            Object.values(enrollment.notes).some(({important}) => important)
                                ? <><Avatar
                                    className="notificationCourse"
                                    style={{"width": 10,
                                        "height": 10}} /><NoteIcon className="TabIcon" />  Notes
                                </>
                                : <><NoteIcon className="NoteIcon" /> Notes</>} />
                </Tabs>
                <br />
                {renderMain()}
            </Grid>
        </Paper>
    );
};

export default CourseSessionStatus;
