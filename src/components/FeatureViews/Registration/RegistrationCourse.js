import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiActions from "../../../actions/apiActions";
import * as registrationActions from "../../../actions/registrationActions";
import * as userActions from "../../../actions/userActions";
import {GET} from "../../../actions/actionTypes.js";
import React, {Fragment, useEffect, useMemo, useState} from "react";
import BackButton from "../../BackButton.js";
import RegistrationActions from "./RegistrationActions";
import {useStudent} from "actions/hooks";
import "../../../theme/theme.scss";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ClassIcon from "@material-ui/icons/Class";
import {Divider, LinearProgress, TableBody, Typography} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Chip from "@material-ui/core/Chip";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import DownArrow from "@material-ui/icons/KeyboardArrowDown";
import UpArrow from "@material-ui/icons/KeyboardArrowUp";
import EmailIcon from "@material-ui/icons/Email";
import EditIcon from "@material-ui/icons/Edit";
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
import Button from "@material-ui/core/Button";
import Note from "../Notes/Notes";
import "./registration.scss"
import {Link, useRouteMatch} from "react-router-dom";
import {stringToColor} from "components/FeatureViews/Accounts/accountUtils";
import Loading from "../../Loading";

const dayConverter = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
};

const formatDate = (date) => {
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
};

const formatTime = (time) => {
    const [hrs, mins] = time.substring(1).split(":");
    const hours = parseInt(hrs, 10);
    return `${hours % 12 === 0 ? 12 : hours % 12}:${mins} ${hours >= 12 ? "PM" : "AM"}`
}

const TableToolbar = () => (
    <TableHead>
        <TableRow>
            {["Student", "Parent", "Phone", "Status", ""].map((heading) => (
                <TableCell
                    align="left"
                    key={heading}
                    padding="default">
                    {heading}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const styles = (username) => ({
    "backgroundColor": stringToColor(username),
    "color": "white",
    "width": 38,
    "height": 38,
    "fontSize": 14,
    "border": "1px solid white",
});

const formatPhone = (phone) => phone &&
    `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 15)}`;

const RegistrationCourse = () => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
        }),
        [dispatch]
    );
    const {"params": {courseID}} = useRouteMatch();
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);

    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const parents = useSelector(({"Users": {ParentList}}) => ParentList);
    const students = useSelector(({"Users": {StudentList}}) => StudentList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);
    // default to prevent error while fetching
    const course = courses[courseID] || {
        "roster": [],
        "schedule": {
            "days": [],
        },
        "notes": []
    };
    const instructor = instructors[course.instructor_id];
    const days = course.schedule.days.map((day) => dayConverter[day]);

    const [expanded, setExpanded] = useState({});
    const [value, setValue] = useState(0);

    const studentStatus = useStudent();

    useEffect(() => {
        api.fetchCourses(courseID);
        api.fetchCourseNotes(courseID);
        api.fetchStudents();
        api.fetchParents();
    }, [api, courseID]);

    useEffect(() => {
        if (course) {
            api.fetchEnrollments();
            api.fetchInstructors(course.instructor_id);
            setExpanded(course.roster.reduce((object, studentID) => ({
                ...object,
                [studentID]: false,
            }), {}));
        }
    }, [api, requestStatus.course[GET][courseID]]);

    if (!requestStatus.course[GET][courseID] ||
        requestStatus.course[GET][courseID] === apiActions.REQUEST_STARTED ||
        !requestStatus.instructor[GET][course.instructor_id] ||
        requestStatus.instructor[GET][course.instructor_id] === apiActions.REQUEST_STARTED ||
        !requestStatus.parent[GET][apiActions.REQUEST_ALL] ||
        requestStatus.parent[GET][apiActions.REQUEST_ALL] === apiActions.REQUEST_STARTED ||
        !requestStatus.student[GET][apiActions.REQUEST_ALL] ||
        requestStatus.student[GET][apiActions.REQUEST_ALL] === apiActions.REQUEST_STARTED) {
        return <Loading/>;
    }

    const startDate = new Date(course.schedule.start_date +
        course.schedule.start_time),
        endDate = new Date(course.schedule.end_date +
            course.schedule.end_time),
        startTime = formatTime(course.schedule.start_time),
        endTime = formatTime(course.schedule.end_time),
        startDay = formatDate(course.schedule.start_date),
        endDay = formatDate(course.schedule.end_date);

    // const rows = course.roster.map((student_id) => {
    //     // console.log(student_id, students);
    //     const student = students[student_id];
    //     const parent = parents[student.parent_id];
    //     const {notes, session_payment_status} = enrollments[student_id][course.course_id];
    //     const paymentStatus = Object.values(session_payment_status).every((status) => status !== 0);
    //     return [
    //         (
    //             <Link
    //                 key={student_id}
    //                 style={{
    //                     "textDecoration": "none",
    //                     "color": "inherit",
    //                 }}
    //                 to={`/accounts/student/${student_id}`}>
    //                 {student.name}
    //             </Link>
    //         ),
    //         (
    //             <Link
    //                 key={student_id}
    //                 style={{
    //                     "textDecoration": "none",
    //                     "color": "inherit",
    //                 }}
    //                 to={`/accounts/parent/${student.parent_id}`}>
    //                 {parent.name}
    //             </Link>
    //         ),
    //         formatPhone(parent.phone_number),
    //         (
    //             <div
    //                 key={student_id}
    //                 style={{
    //                     "padding": "5px 0",
    //                     "borderRadius": "10px",
    //                     "backgroundColor": paymentStatus ? "#28D52A" : "#E9515B",
    //                     "textAlign": "center",
    //                     "width": "7vw",
    //                     "color": "white",
    //                 }}>
    //                 {paymentStatus ? "Paid" : "Unpaid"}
    //             </div>
    //         ),
    //         (
    //             <div
    //                 className="actions"
    //                 key={student_id}>
    //                 <a href={`mailto:${parent.email}`}>
    //                     <EmailIcon />
    //                 </a>
    //                 <span>
    //                     <EditIcon />
    //                 </span>
    //                 <span>
    //                     {expanded[student_id]
    //                         ? <UpArrow onClick={() => {
    //                             setExpanded({
    //                                 ...expanded,
    //                                 [student_id]: false,
    //                             });
    //                         }} />
    //                         : <DownArrow onClick={() => {
    //                             setExpanded({
    //                                 ...expanded,
    //                                 [student_id]: true,
    //                             });
    //                         }} />
    //                     }
    //                 </span>
    //             </div>
    //         ),
    //         {
    //             notes,
    //             student,
    //         },
    //     ];
    // });

    const handleChange = (event, value) => {
        setValue(value);
    }

    const displayComponent = () => {
        let component;
        switch (value) {
            case 0:
                component = (<div>
                    <Table>
                        <TableToolbar />
                        <TableBody>
                            {
                                // rows.map((row, i) => (
                                //     <Fragment key={i}>
                                //         <TableRow>
                                //             {
                                //                 row.slice(0, 5).map((data, j) => (
                                //                     <TableCell
                                //                         className={j === 0 ? "bold" : ""}
                                //                         key={j}>
                                //                         {data}
                                //                     </TableCell>
                                //                 ))
                                //             }
                                //         </TableRow>
                                //         {
                                //             expanded[course.roster[i]] &&
                                //             <TableRow align="left">
                                //                 <TableCell colSpan={5}>
                                //                     <Paper
                                //                         elevation={0}
                                //                         square>
                                //                         <Typography
                                //                             style={{
                                //                                 "padding": "10px",
                                //                             }}>
                                //                             <span style={{"padding": "5px"}}>
                                //                                 <b>School</b>: {
                                //                                     row[5].student.school
                                //                                 }
                                //                                 <br />
                                //                             </span>
                                //                             <span style={{"padding": "5px"}}>
                                //                                 <b>School Teacher</b>: {
                                //                                     row[5].notes["Current Instructor in School"]
                                //                                 }
                                //                                 <br />
                                //                             </span>
                                //                             <span style={{"padding": "5px"}}>
                                //                                 <b>Textbook:</b> {
                                //                                     row[5].notes["Textbook Used"]
                                //                                 }
                                //                                 <br />
                                //                             </span>
                                //                         </Typography>
                                //                     </Paper>
                                //                 </TableCell>
                                //             </TableRow>
                                //         }
                                //     </Fragment>
                                // ))
                            }
                        </TableBody>
                    </Table>
                </div>)
                break;
            case 1:
                component = (<div
                    style={{paddingTop: 30}}>
                    <Note
                        userID={courseID}
                        userRole="course"
                    />
                </div>)
                break;
            default:
                component = (<div>wee woo wee woo we have a problem in aisle 6</div>)

        }
        return component;
    }


    return (
        <Grid
            className={"registrationCourse"}
            item
            xs={12}>
            <Paper className="paper">
                <Grid
                    item
                    lg={12}>
                    <RegistrationActions courseTitle={course.course_title} />
                </Grid>
            </Paper>
            <Paper className="paper content">
                <Grid
                    container
                    justify="space-between">
                    <Grid
                        item
                        sm={3}>
                        <BackButton />
                    </Grid>
                    <Grid
                        item
                        sm={2}>
                        <Button
                            className="button"
                            style={{
                                "padding": "6px 10px 6px 10px",
                                "backgroundColor": "white",
                            }}
                            component={Link}
                            to={`/registration/form/course_details/${courseID}/edit`}>
                            <EditIcon style={{"fontSize": "16px"}} />
                            Edit Course
                        </Button>
                    </Grid>
                </Grid>
                <Divider className="top-divider" />
                <div className="course-heading">
                    <Typography
                        align="left"
                        style={{"fontWeight": "500"}}
                        variant="h3">
                        {course.title}
                    </Typography>
                    <div className="date">
                        <CalendarIcon
                            align="left"
                            className="icon"
                            style={{"fontSize": "16"}} />
                        <Typography
                            align="left"
                            style={{
                                "marginLeft": "5px",
                                "marginTop": "10px",
                            }}>
                            {startDay} - {endDay}
                        </Typography>
                    </div>
                    <div className="info-section">
                        <div className="first-line">
                            <ClassIcon
                                className="icon"
                                style={{"fontSize": "16"}} />
                            <Typography
                                align="left"
                                className="text">
                                Course Information
                            </Typography>
                        </div>
                        <div className="second-line">
                            <Chip
                                avatar={
                                    <Avatar style={styles(instructor.name)}>
                                        {instructor.name.match(/\b(\w)/g).join("")}
                                    </Avatar>
                                }
                                className="chip"
                                component={Link}
                                label={instructor.name}
                                to={`/accounts/instructor/${instructor.user_id}`} />
                            <Typography
                                align="left"
                                className="text">
                                {startTime} - {endTime}
                            </Typography>
                            <Typography
                                align="left"
                                className="text">
                                {days}
                            </Typography>
                            <Typography
                                align="left"
                                className="text">
                                Grade {course.grade}
                            </Typography>
                        </div>
                    </div>
                </div>
                <Typography
                    align="left"
                    className="description text">
                    {course.description}
                </Typography>
                <Tabs className={"registration-course-tabs"}
                      onChange={handleChange}
                      value={value}
                      indicatorColor="primary">
                    <Tab
                        label={<><RegistrationIcon className="NoteIcon" /> Registration</>}
                    />
                    <Tab
                        label={
                            course.notes && Object.values(course.notes).some(({important}) => important)
                                ? <><Avatar style={{width: 10, height: 10}} className="notificationCourse" /><NoteIcon className="TabIcon" />  Notes</>
                                : <><NoteIcon className="NoteIcon" /> Notes</>} />

                </Tabs>
                <div className="course-status">
                    <div className="status">
                        <div className="text">
                            {course.roster.length} / {course.capacity} Spaces Taken
                        </div>
                    </div>
                    <LinearProgress
                        color="primary"
                        value={course.roster.length / course.capacity * 100}
                        valueBuffer={100}
                        variant="buffer" />
                </div>
                {displayComponent()}
            </Paper>
        </Grid>
    );
};

export default RegistrationCourse;
