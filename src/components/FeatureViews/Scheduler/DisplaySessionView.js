import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as userActions from "../../../actions/userActions.js"
import {connect, useDispatch, useSelector} from "react-redux";
import {Typography} from "@material-ui/core";
import {NavLink, withRouter} from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as apiActions from "../../../actions/apiActions";
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

function DisplaySessionView({course, session, handleToggleEditing}) {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const students = useSelector(({"Users": {StudentList}}) => StudentList);

    const [enrolledStudents, setEnrolledStudents] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editSelection, setEditSelection] = useState('current');

    useEffect(()=>{
        api.initializeRegistration();
        api.fetchCourses();
    },[api]);

    const enrollmentStatus = hooks.useEnrollmentByCourse(course.course_id);
    const reduxCourse = courses[course.course_id];
    const studentStatus = reduxCourse.roster.length > 0 && hooks.useStudent(reduxCourse.roster);

    const loadedStudents = useMemo(() =>
            reduxCourse.roster.filter((studentID) => students[studentID])
        , [reduxCourse.roster, students]);

    useEffect(()=>{
        if(studentStatus === 200){
            setEnrolledStudents(loadedStudents.map(studentID => ({
                ...students[studentID]
            })))
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

    let instructor = course && instructors[course.instructor_id] ? instructors[course.instructor_id] : { name: "N/A" };

    const styles = (username) => ({
        "backgroundColor": stringToColor(username),
        "color": "white",
        "width": "3vw",
        "height": "3vw",
        "fontSize": 15,
        "margin-right": 10,
    });

    const studentKeys = Object.keys(enrolledStudents);

    const currentAllInverse = {
        "current": "all",
        "all":"current",
    };

    const handleEditToggle = (cancel) => event =>{
        event.preventDefault();
        if(!cancel){
            // if we're applying to edit session then toggle to edit view
            handleToggleEditing(editSelection);
        } else {
            setEdit(!edit);
            setEditSelection(currentAllInverse[editSelection]);
        }
    };

    const handleEditSelection = event => {
        setEditSelection(event.target.value);
    };

    if(!course || !categories){
        return <Loading/>
    }

    let sessionStart = new Date(session.start_datetime);
    let day = sessionStart.getDate() !== new Date().getDate() ?
        (session.start-1 >= 0 ? session.start-1 : 6) :
        session.start;

    return (<>
        <Grid className="session-view"
            container spacing={2} direction={"row"}>
            <Grid item sm={12}>
                <Typography align="left" variant="h3"
                            className="session-view-title"
                >
                    {course && course.title}
                </Typography>
            </Grid>
            <Grid
                align="left"
                className="session-view-details"
                container spacing={16} xs={6}
            >
                <Grid item xs={6}>
                    <Typography variant="h5"> Subject </Typography>
                    <Typography varient="body1">
                        {
                            categories.length !== 0 &&
                            categories
                                .find(category => category.id === course.category)
                                .name
                        }
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5"> Room</Typography>
                    <Typography variant="body1">
                        {
                            course && (course.room_id || "TBA")
                        }
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5"> Instructor </Typography>
                    <NavLink to={`/accounts/instructor/${instructor.user_id}`}
                    >
                        <Typography variant="body1" color="primary">
                            {
                                course && instructor.name
                            }
                        </Typography>
                    </NavLink>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5"> Day(s)</Typography>
                    <Typography variant="body1">
                        {
                            course && dayOfWeek[day]
                        }
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}>
                    <Typography variant="h5"> Time </Typography>
                    <Typography variant="body1">
                        {
                            course &&
                            `${session.startTime} - ${session.endTime}`
                        }
                    </Typography>
                </Grid>

            </Grid>

            <Grid item xs={6}>
                <Typography variant="h5" align="left"> Students Enrolled  </Typography>
                <Grid container direction='row'>
                    { studentKeys.map(key =>
                        <NavLink to={`/accounts/student/${enrolledStudents[key].user_id}/${course.course_id}`}
                                 style={{ textDecoration: "none" }}>
                            <Avatar
                                style={styles(enrolledStudents[key].name)}>
                                {
                                    enrolledStudents ?
                                        enrolledStudents[key].name.match(/\b(\w)/g).join("")
                                    : hooks.isFail(enrollmentStatus)
                                    ? "Error!"
                                    : "Loading..."
                                }
                            </Avatar>
                        </NavLink>)}
                </Grid>
            </Grid>

        </Grid>

        <Grid className="session-detail-action-control"
              container direction="row" justify="flex-end">
            <Grid item>
                <Button
                    className="button"
                    color="secondary"
                    to="/"
                    onClick={handleEditToggle(true)}
                    variant="outlined">
                    Edit Session
                </Button>
            </Grid>
            {/*<Grid item>*/}
            {/*    <Button*/}
            {/*        className="button"*/}
            {/*        color="secondary"*/}
            {/*        onClick={handleEditToggle}*/}
            {/*        variant="outlined">*/}
            {/*        Delete*/}
            {/*    </Button>*/}
            {/*</Grid>*/}
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
                    value={editSelection}
                    onChange={handleEditSelection}>
                    <FormControlLabel
                        control={<Radio color="primary" />}
                        label="This Session"
                        labelPlacement="end"
                        value="current" />
                    <FormControlLabel
                        control={<Radio color="primary" />}
                        label="All Sessions"
                        labelPlacement="end"
                        value="all" />
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
    </>);
}

DisplaySessionView.propTypes = {
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
)(DisplaySessionView));
