/* eslint-disable max-statements */
/* eslint-disable react/no-multi-comp */
/* eslint-disable max-lines-per-function */
import {useSelector} from "react-redux";
import React, {useCallback, useMemo, useState} from "react";
import BackButton from "../../BackButton.js";
import RegistrationActions from "./RegistrationActions";
import * as hooks from "actions/hooks";
import "../../../theme/theme.scss";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ClassIcon from "@material-ui/icons/Class";
import {Divider, LinearProgress, Typography} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Chip from "@material-ui/core/Chip";
import RegistrationCourseEnrollments from "./RegistrationCourseEnrollments";
import EditIcon from "@material-ui/icons/Edit";
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
import Button from "@material-ui/core/Button";
import Note from "../Notes/Notes";
import "./registration.scss";
import {Link, Redirect, useRouteMatch} from "react-router-dom";
import {stringToColor} from "components/FeatureViews/Accounts/accountUtils";

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
    if (time) {
        const [hrs, mins] = time.substring(1).split(":");
        const hours = parseInt(hrs, 10);
        return `${hours % 12 === 0 ? 12 : hours % 12}:${mins} ${hours >= 12 ? "PM" : "AM"}`;
    }
    return null;
};

const styles = (username) => ({
    "backgroundColor": stringToColor(username),
    "border": "1px solid white",
    "color": "white",
    "fontSize": 14,
    "height": 38,
    "width": 38,
});

const RegistrationCourse = () => {
    const {"params": {courseID}} = useRouteMatch();

    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const course = courses[courseID];

    const [activeTab, setActiveTab] = useState(0);

    const courseStatus = hooks.useCourse(courseID);
    hooks.useStudent(course && course.roster);
    hooks.useInstructor(course && course.instructor_id);

    const handleChange = useCallback((_, value) => {
        setActiveTab(value);
    }, []);

    if (hooks.isLoading(courseStatus) && !course) {
        return "Loading...";
    }

    if (hooks.isFail(courseStatus) && !course) {
        return (
            <Redirect
                push
                to="/PageNotFound" />
        );
    }

    const instructor = instructors[course && course.instructor_id];
    const days = course.schedule.days.map((day) => dayConverter[day]);

    const endDay = formatDate(course.schedule.end_date),
        endTime = formatTime(course.schedule.end_time),
        startDay = formatDate(course.schedule.start_date),
        startTime = formatTime(course.schedule.start_time);

    return (
        <Grid
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
                            component={Link}
                            style={{
                                "padding": "6px 10px 6px 10px",
                                "backgroundColor": "white",
                            }}
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
                            {
                                instructor &&
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
                            }
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

                <Tabs
                    onChange={handleChange}
                    value={activeTab}>
                    <Tab label={
                        <>
                            <RegistrationIcon className="NoteIcon" /> Registration
                        </>
                    } />
                    <Tab label={
                        <>
                            <NoteIcon className="NoteIcon" /> Notes
                        </>
                    } />
                </Tabs>
                {activeTab === 0 && <RegistrationCourseEnrollments courseID={courseID} />}
                {activeTab === 1 &&
                    <div
                        style={{"paddingTop": 30}}>
                        <Note
                            ownerID={courseID}
                            ownerType="course" />
                    </div>
                }
            </Paper>
        </Grid>
    );
};

export default RegistrationCourse;
