import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
import Chip from "@material-ui/core/Chip";
import ClassIcon from "@material-ui/icons/Class";
import ConfirmIcon from "@material-ui/icons/CheckCircle";
import Divider from "@material-ui/core/Divider";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Notes from "../Notes/Notes";
import Paper from "@material-ui/core/Paper";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import UnconfirmIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "react-moment"

import "./registration.scss";
import {capitalizeString, courseDateFormat, DayConverter} from "utils";
import {isFail, isLoading, useCourse, useInstructor} from "actions/hooks";
import {Link, Redirect, useRouteMatch} from "react-router-dom";
import BackButton from "../../BackButton.js";
import Loading from "components/Loading";
import RegistrationActions from "./RegistrationActions";
import RegistrationCourseEnrollments from "./RegistrationCourseEnrollments";
import {useCourseNotes} from "actions/courseActions";
import UserAvatar from "../Accounts/UserAvatar";
import {weeklySessionsParser} from "components/Form/FormUtils";


const useStyles = makeStyles(theme => ({
	editCourseBtn: {
        marginRight: "81px",
        [theme.breakpoints.down('md')]: {
            marginRight: "0"
        }
	}
}))

const RegistrationCourse = () => {
	const {
        params: {courseID},
	} = useRouteMatch();
    
	const isAdmin = useSelector(({auth}) => auth.isAdmin);
	const courses = useSelector(({Course}) => Course.NewCourseList);
	const instructors = useSelector(({Users}) => Users.InstructorList);
    const classes = useStyles();
	const course = courses[courseID];
    
	const [activeTab, setActiveTab] = useState(0);
    
	useCourseNotes(courseID);
	const courseStatus = useCourse(courseID);
	useInstructor(course && course.instructor_id);

	const handleTabChange = useCallback((_, newTab) => {
		setActiveTab(newTab);
	}, []);

	// either doesn't exist or only has notes defined
	if (!course || Object.keys(course).length <= 1) {
		if (isLoading(courseStatus)) {
			return <Loading paper/>;
		}

		if (isFail(courseStatus)) {
			return <Redirect push to="/PageNotFound"/>;
		}
    }
    
	const hasImportantNotes = Object.values(course.notes || {}).reduce(
		(total, {important}) => (important ? total + 1 : total), 0
	);

	const instructor = instructors[course.instructor_id];

	const {start_date, end_date, start_time, end_time} = courseDateFormat(
		course
    );
    

    return (
        <Grid className="registrationCourse" item xs={12}>
            <Paper className="paper content" elevation={2}>
                <Grid container justify="space-between">
                    <Grid item sm={3}>
                        <BackButton/>
                    </Grid>
                    <Grid item sm={2}/>
                </Grid>
                <Divider className="top-divider"/>
                <Grid item lg={12}>
                    <RegistrationActions courseTitle={course.course_title}/>
                </Grid>
                <div className="course-heading">
                    <Typography align="left" variant="h3">
                        {course.title}
                        {isAdmin && (
                            <Button
                                className={`button ${classes.editCourseBtn}`}
                                component={Link}
                                to={`/registration/form/course_details/${courseID}/edit`}
                            >
                                <EditIcon className="icon"/>
                                Edit Course
                            </Button>
                        )}
                    </Typography>
                    <div className="date">
                        <CalendarIcon align="left" className="icon"/>
                        <Typography align="left" className="sessions-text">
                            <Moment format="MMM D YYYY" date={course.schedule.start_date}/>
                            {" - "}
                            <Moment format="MMM D YYYY" date={course.schedule.end_date}/>
                            {" "}
                            (
                            {weeklySessionsParser(start_date, end_date)} sessions)
                        </Typography>
                    </div>
                    <div className="info-section">
                        <div className="course-info-header">
                            <ClassIcon className="icon"/>
                            <Typography align="left" className="text">
                                Course Information
                            </Typography>
                        </div>
                        <div className="course-info-details">
                            {instructor && (
                                <>
                                    {course.is_confirmed ? (
                                        <ConfirmIcon className="confirmed course-icon"/>
                                    ) : (
                                        <UnconfirmIcon className="unconfirmed course-icon"/>
                                    )}
                                    <Chip
                                        avatar={
                                            <UserAvatar
                                                fontSize={20}
                                                name={instructor.name}
                                                size={38}
                                            />
                                        }
                                        className="chip"
                                        component={Link}
                                        label={instructor.name}
                                        to={`/accounts/instructor/${instructor.user_id}`}
                                    />
                                </>
                            )}
                            <Typography align="left" className="text">
                                <Moment format="h:mm a" date={course.schedule.start_date+course.schedule.start_time}/>
                                {" - "}
                                <Moment format="h:mm a" date={course.schedule.end_date+course.schedule.end_time}/>
                            </Typography>
                            <Typography align="left" className="text">
                                <Moment format="dddd" date={course.schedule.start_date}/>
                            </Typography>
                            <Typography align="left" className="text">
                                Grade {course.grade}
                            </Typography>
                        </div>
                    </div>
                </div>
                <Typography align="left" className="description text">
                    {course.description}
                </Typography>
                <Tabs
                    className="registration-course-tabs"
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    value={activeTab}
                >
                    <Tab
                        label={
                            <>
                                <RegistrationIcon className="NoteIcon"/> Registration
                            </>
                        }
                    />
                    <Tab
                        label={
                            hasImportantNotes ? (
                                <>
                                    {/* <Avatar className="notificationCourse" data-cy="notification-course"/>
                                     */}
                                     <Badge badgeContent={hasImportantNotes} color="primary" data-cy="note-number-of-icons">
								        <NoteIcon className="TabIcon" />
							        </Badge>
                                    Notes
                                </>
                            ) : (
                                <>
                                    <NoteIcon className="NoteIcon" data-cy="note-number-of-icons"/> Notes
                                </>
                            )
                        }
                    />
                </Tabs>
                {activeTab === 0 && (
                    <RegistrationCourseEnrollments courseID={courseID}/>
                )}
                {activeTab === 1 && (
                    <div className="notes-container">
                        <Notes ownerID={courseID} ownerType="course"/>
                    </div>
                )}
            </Paper>
        </Grid>
    );
};

export default RegistrationCourse;
