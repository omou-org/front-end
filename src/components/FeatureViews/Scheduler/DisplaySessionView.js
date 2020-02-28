import React, {useEffect, useMemo, useState} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import * as registrationActions from "../../../actions/registrationActions";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import {NavLink, useParams} from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Loading from "../../Loading";
import Avatar from "@material-ui/core/Avatar";
import {stringToColor} from "../Accounts/accountUtils";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import DialogContent from "@material-ui/core/DialogContent";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {dayOfWeek} from "../../Form/FormUtils";
import * as hooks from "actions/hooks";
import ConfirmIcon from "@material-ui/icons/CheckCircle";
import UnconfirmIcon from "@material-ui/icons/Cancel";
import {EDIT_ALL_SESSIONS, EDIT_CURRENT_SESSION} from "./SessionView";

import InstructorSchedule from "../Accounts/TabComponents/Schedule";

const styles = (username) => ({
    "backgroundColor": stringToColor(username),
    "color": "white",
    "width": "3vw",
    "height": "3vw",
    "fontSize": 15,
    "marginRight": 10,
});

const DisplaySessionView = ({course, session, handleToggleEditing}) => {
    const dispatch = useDispatch();
    const {instructor_id} = useParams();

    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const students = useSelector(({"Users": {StudentList}}) => StudentList);

    const [enrolledStudents, setEnrolledStudents] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editSelection, setEditSelection] = useState(EDIT_CURRENT_SESSION);

    useEffect(() => {
        dispatch(registrationActions.initializeRegistration());
    }, [dispatch]);

    const enrollmentStatus = hooks.useEnrollmentByCourse(course.course_id);
    const reduxCourse = courses[course.course_id];
    const studentStatus = reduxCourse.roster.length > 0 && hooks.useStudent(reduxCourse.roster);

    const loadedStudents = useMemo(() =>
        reduxCourse.roster.filter((studentID) => students[studentID])
    , [reduxCourse.roster, students]);

    useEffect(() => {
        if (studentStatus === 200) {
            setEnrolledStudents(loadedStudents.map((studentID) => ({
                ...students[studentID],
            })));
        }
    }, [loadedStudents, studentStatus, students]);

    if (loadedStudents.length === 0 && reduxCourse.roster.length > 1) {
        if (hooks.isLoading(studentStatus)) {
            return <Loading />;
        }
        if (hooks.isFail(studentStatus)) {
            return "Error loading enrollment details!";
        }
    }

    const instructor = instructors[instructor_id] || {"name": "N/A"};
    const studentKeys = Object.keys(enrolledStudents);

    const handleEditToggle = (cancel) => (event) => {
        event.preventDefault();
        if (!cancel && edit) {
            // if we're applying to edit session then toggle to edit view
            handleToggleEditing(editSelection);
        } else {
            setEdit(!edit);
        }
    };

    const handleEditSelection = (event) => {
        setEditSelection(event.target.value);
    };

    if (!course || !categories) {
        return <Loading />;
    }

    const sessionStart = new Date(session.start_datetime);
    const day = sessionStart.getDate() !== new Date().getDate()
        ? session.start - 1 >= 0 ? session.start - 1 : 6
        : session.start;
    return (
        <>
            <Grid
                className="session-view"
                container
                direction="row"
                spacing={8}>
                <Grid
                    item
                    sm={12}>
                    <Typography
                        align="left"
                        className="session-view-title"
                        variant="h3">
                        {course && course.title}
                    </Typography>
                </Grid>
                <Grid
                    align="left"
                    className="session-view-details"
                    container
                    item
                    spacing={16}
                    xs={6}>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Subject</Typography>
                        <Typography >
                            {
                                (categories.find(
                                    (category) => category.id === course.category
                                ) || {}).name
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Room</Typography>
                        <Typography >
                            {
                                course && (course.room_id || "TBA")
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        <Typography variant="h5">
                        Instructor
                            {
                                session.is_confirmed
                                    ? <ConfirmIcon className="confirmed course-icon" />
                                    : <UnconfirmIcon className="unconfirmed course-icon" />
                            }
                        </Typography>
                        {
                            course &&
                            <NavLink
                                style={{"textDecoration": "none"}}
                                to={`/accounts/instructor/${instructor.user_id}`}>
                                <Tooltip
                                    aria-label="Instructor Name"
                                    title={instructor.name}>
                                    <Avatar
                                        style={styles(instructor.name)}>
                                        {instructor.name.match(/\b(\w)/g).join("")}
                                    </Avatar>
                                </Tooltip>
                            </NavLink>
                        }
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        <Typography
                            align="left"
                            variant="h5">
                        Students Enrolled
                        </Typography>
                        <Grid
                            container
                            direction="row">
                            {studentKeys.map((key) =>
                                (
                                    <NavLink
                                        key={key}
                                        style={{"textDecoration": "none"}}
                                        to={`/accounts/student/${enrolledStudents[key].user_id}/${course.course_id}`}>
                                        <Tooltip title={enrolledStudents[key].name}>
                                            <Avatar
                                                style={styles(enrolledStudents[key].name)}>
                                                {
                                                    enrolledStudents
                                                        ? enrolledStudents[key].name.match(/\b(\w)/g).join("")
                                                        : hooks.isFail(enrollmentStatus)
                                                            ? "Error!"
                                                            : "Loading..."
                                                }
                                            </Avatar>
                                        </Tooltip>
                                    </NavLink>
                                ))}
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Day(s)</Typography>
                        <Typography>{dayOfWeek[day]}</Typography>
                        <Typography>
                            {
                                new Date(session.start_datetime).toLocaleDateString()
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Time</Typography>
                        <Typography>{session.startTime} - {session.endTime}</Typography>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={6}>
                    <InstructorSchedule instructorID={instructor_id} />
                </Grid>
            </Grid>
            <Grid
                className="session-detail-action-control"
                container
                direction="row"
                justify="flex-end">
                <Grid item>
                    <Button
                        className="button"
                        color="secondary"
                        variant="outlined">
                        Add Sessions
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        className="button"
                        color="secondary"
                        onClick={handleEditToggle(true)}
                        to="/"
                        variant="outlined">
                        Edit Session
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        className="button"
                        color="secondary"
                        component={NavLink}
                        to={`/registration/course/${course.course_id}`}
                        variant="outlined">
                        Course Page
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        className="button"
                        color="secondary"
                        component={NavLink}
                        to="/scheduler"
                        variant="outlined">
                        Return to scheduling
                    </Button>
                </Grid>

            </Grid>
            <Dialog
                aria-describedby="alert-dialog-description"
                aria-labelledby="alert-dialog-title"
                className="session-view-modal"
                fullWidth
                maxWidth="xs"
                onClose={handleEditToggle(true)}
                open={edit}>
                <DialogTitle id="form-dialog-title">Edit Session</DialogTitle>
                <Divider />
                <DialogContent>
                    <RadioGroup
                        aria-label="delete"
                        name="delete"
                        onChange={handleEditSelection}
                        value={editSelection}>
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="This Session"
                            labelPlacement="end"
                            value={EDIT_CURRENT_SESSION} />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="All Sessions"
                            labelPlacement="end"
                            value={EDIT_ALL_SESSIONS} />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={handleEditToggle(true)}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={handleEditToggle(false)}>
                        Confirm to Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default DisplaySessionView;
