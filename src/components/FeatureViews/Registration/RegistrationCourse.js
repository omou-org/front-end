import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import BackButton from "../../BackButton.js";
import RegistrationActions from "./RegistrationActions";
import * as hooks from "actions/hooks";
import * as userActions from "actions/userActions";
import {bindActionCreators} from "redux";
import "../../../theme/theme.scss";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ClassIcon from "@material-ui/icons/Class";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
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
import Loading from "../../Loading";
import {DayConverter} from "../Accounts/TabComponents/CourseSessionStatus";
import ConfirmIcon from "@material-ui/icons/CheckCircle";
import UnconfirmIcon from "@material-ui/icons/Cancel"
import {courseDateFormat} from "../../../utils";

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
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(userActions, dispatch),
        }),
        [dispatch]
    );

    const isAdmin = useSelector(({auth}) => auth.isAdmin);
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const course = courses[courseID];

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        api.fetchCourseNotes(courseID);
    }, [api, courseID]);

    const courseStatus = hooks.useCourse(courseID);
    hooks.useInstructor(course && course.instructor_id);

    const handleTabChange = useCallback((_, newTab) => {
        setActiveTab(newTab);
    }, []);

    // either doesn't exist or only has notes defined
    if (!course || Object.keys(course).length <= 1) {
        if (hooks.isLoading(courseStatus)) {
            return <Loading />;
        }

        if (hooks.isFail(courseStatus)) {
            return (
                <Redirect
                    push
                    to="/PageNotFound" />
            );
        }
    }

    const instructor = instructors[course && course.instructor_id];

    const {start_date, end_date, start_time, end_time, days} = courseDateFormat(course);

    return (
        <Grid
            className="registrationCourse"
            item
            xs={12}>
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
                    </Grid>
                </Grid>
                <Divider className="top-divider" />
                <Grid
                    item
                    lg={12}>
                    <RegistrationActions courseTitle={course.course_title} />
                </Grid>
                <div className="course-heading">
                    <Typography
                        align="left"
                        style={{"fontWeight": "500"}}
                        variant="h3">
                        {course.title}
                        {isAdmin && <Button
                            className="button"
                            component={Link}
                            style={{
                                "padding": "6px 10px 6px 10px",
                                "backgroundColor": "white",
                            }}
                            to={`/registration/form/course_details/${courseID}/edit`}>
                            <EditIcon style={{"fontSize": "16px"}} />
                        Edit Course
                        </Button>}
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
                            {start_date} - {end_date}
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
                                <>
                                    {course.is_confirmed ?
                                        <ConfirmIcon className="confirmed course-icon"/> :
                                        <UnconfirmIcon className="unconfirmed course-icon"/>}
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
                                </>
                            }
                            <Typography
                                align="left"
                                className="text">
                                {start_time} - {end_time}
                            </Typography>
                            <Typography
                                align="left"
                                className="text">
                                {DayConverter[new Date(start_date).getDay()]}
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
                <Tabs
                    className="registration-course-tabs"
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    value={activeTab}>
                    <Tab
                        label={<><RegistrationIcon className="NoteIcon" /> Registration</>} />
                    <Tab
                        label={
                            course.notes && Object.values(course.notes).some(({important}) => important)
                                ? <>
                                    <Avatar
                                        className="notificationCourse"
                                        style={{"width": 10,
                                            "height": 10}} /><NoteIcon className="TabIcon" />  Notes
                                  </>
                                : <>
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
