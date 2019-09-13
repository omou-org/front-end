import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import PropTypes from "prop-types";
import React, {useState, Fragment} from "react";
import BackButton from "../../BackButton.js";
import RegistrationActions from "./RegistrationActions";
import "../../../theme/theme.scss";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ClassIcon from "@material-ui/icons/Class";
import {Divider, LinearProgress, TableBody, Typography} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
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
import {NavLink} from "react-router-dom";

const TableToolbar = () => (
    <TableHead>
        <TableRow>
            {["Student", "Parent", "Phone", "Status", ""].map((heading) => (
                <TableCell
                    key={heading}
                    align="left"
                    padding="default">
                    {heading}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }

    return color;
};

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

const RegistrationCourse = (props) => {
    const course = props.courses[props.computedMatch.params.courseID];
    const [expanded, setExpanded] = useState(
        course.roster.reduce((object, studentID) =>
            ({...object, [studentID]: false})), {}
    );

    const dayConverter = {
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
    };

    const days = course.schedule.days.map((day) => dayConverter[day]);

    const timeOptions = {"hour": "2-digit", "minute": "2-digit"};
    const dateOptions = {"year": "numeric", "month": "short", "day": "numeric"};

    const startDate = new Date(course.schedule.start_date +
        course.schedule.start_time),
        endDate = new Date(course.schedule.end_date +
            course.schedule.end_time),
        startTime = startDate.toLocaleTimeString("en-US", timeOptions),
        endTime = endDate.toLocaleTimeString("en-US", timeOptions),
        startDay = startDate.toLocaleDateString("en-US", dateOptions),
        endDay = endDate.toLocaleDateString("en-US", dateOptions);

    const instructor = props.instructors[course.instructor_id];

    const rows = course.roster.map((student_id) => {
        const student = props.students[student_id];
        const parent = props.parents[student.parent_id];
        const {notes, session_payment_status} = props.enrollments[student_id][course.course_id];
        const paymentStatus = Object.values(session_payment_status).every((status) => status !== 0);
        return [
            (
                <NavLink key={student_id}
                    isActive={() => false}
                    style={{
                        "textDecoration": "none",
                        "color": "inherit",
                    }}
                    to={`/accounts/student/${student_id}`}>
                    {student.name}
                </NavLink>
            ),
            (
                <NavLink key={student_id}
                    isActive={() => false}
                    style={{
                        "textDecoration": "none",
                        "color": "inherit",
                    }}
                    to={`/accounts/parent/${student.parent_id}`}>
                    {parent.name}
                </NavLink>
            ),
            formatPhone(parent.phone_number),
            (
                <div
                    key={student_id}
                    style={{
                        "padding": "5px 0",
                        "borderRadius": "10px",
                        "backgroundColor": paymentStatus ? "#28D52A" : "#E9515B",
                        "textAlign": "center",
                        "width": "7vw",
                        "color": "white",
                    }}>
                    {paymentStatus ? "Paid" : "Unpaid"}
                </div>
            ),
            (
                <div key={student_id} className="actions">
                    <a href={`mailto:${parent.email}`}>
                        <EmailIcon />
                    </a>
                </div>
            ),
            {
                notes,
                student,
            },
        ];
    });

    return (
        <Grid item xs={12}>
            <Paper className="paper">
                <Grid item lg={12}>
                    <RegistrationActions courseTitle={course.course_title} />
                </Grid>
            </Paper>
            <Paper className="paper content">
                <Grid container justify="space-between">
                    <Grid item sm={3}>
                        <BackButton />
                    </Grid>
                    <Grid item sm={2}>
                        <Button
                            className="button"
                            style={{
                                "padding": "6px 10px 6px 10px",
                                "backgroundColor": "white",
                            }}>
                            <EditIcon style={{"fontSize": "16px"}} />
                            Edit Course
                        </Button>
                    </Grid>
                </Grid>
                <Divider className="top-divider" />
                <div className="course-heading">
                    <Typography
                        align="left"
                        variant="h3"
                        style={{"fontWeight": "500"}}>
                        {course.title}
                    </Typography>
                    <div className="date">
                        <CalendarIcon
                            style={{"fontSize": "16"}}
                            align="left"
                            className="icon" />
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
                            <ClassIcon style={{"fontSize": "16"}} className="icon" />
                            <Typography align="left" className="text">
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
                                label={instructor.name}
                                component={NavLink}
                                to={`/accounts/instructor/${instructor.user_id}`}
                                className="chip" />
                            <Typography align="left" className="text">
                                {startTime} - {endTime}
                            </Typography>
                            <Typography align="left" className="text">
                                {days}
                            </Typography>
                            <Typography align="left" className="text">
                                {course.grade} Grade
                            </Typography>
                        </div>
                    </div>
                </div>
                <Typography align="left" className="description text">
                    {course.description}
                </Typography>
                <div className="course-status">
                    <div className="status">
                        <div className="text">
                            {course.roster.length} / {course.capacity} Spaces Taken
                        </div>
                    </div>
                    <LinearProgress
                        color="primary"
                        value={(course.roster.length / course.capacity) * 100}
                        valueBuffer={100}
                        variant="buffer" />
                </div>
                <Table>
                    <TableToolbar />
                    <TableBody>
                        {
                            rows.map((row, i) => (
                                <Fragment key={i}>
                                    <TableRow>
                                        {
                                            row.slice(0, 5).map((data, j) => (
                                                <TableCell
                                                    key={j}
                                                    className={j === 0 ? "bold" : ""}>
                                                    {data}
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                    {
                                        expanded[course.roster[i]] &&
                                        <TableRow align="left">
                                            <TableCell component={Typography} style={{
                                                "padding": "10px 0 10px 20px",
                                            }}>
                                                <span style={{"padding": "5px"}}>
                                                    <b>School</b>: {
                                                        row[5].student.school
                                                    }
                                                    <br />
                                                </span>
                                                <span style={{"padding": "5px"}}>
                                                    <b>School Teacher</b>: {
                                                        row[5].notes["Current Instructor in School"]
                                                    }
                                                    <br />
                                                </span>
                                                <span style={{"padding": "5px"}}>
                                                    <b>Textbook:</b> {
                                                        row[5].notes["Textbook Used"]
                                                    }
                                                    <br />
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    }
                                </Fragment>
                            ))
                        }
                    </TableBody>
                </Table>
            </Paper>
        </Grid>
    );
};

RegistrationCourse.propTypes = {
    "stuffActions": PropTypes.object,
    "RegistrationForms": PropTypes.array,
};

const mapStateToProps = (state) => ({
    "courses": state.Course["NewCourseList"],
    "courseCategories": state.Course["CourseCategories"],
    "students": state.Users["StudentList"],
    "instructors": state.Users["InstructorList"],
    "parents": state.Users["ParentList"],
    "courseRoster": state.Course["CourseRoster"],
    "enrollments": state.Enrollments,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationCourse);
