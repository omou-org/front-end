import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import NoListAlert from "../../../OmouComponents/NoListAlert";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Paper from "@material-ui/core/Paper";
import PaymentIcon from "@material-ui/icons/CreditCardOutlined";
import PaymentTable from "./PaymentTable";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import SessionPaymentStatusChip from "components/OmouComponents/SessionPaymentStatusChip";
import Switch from "@material-ui/core/Switch";
import LoadingError from "./LoadingCourseError"
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import * as hooks from "actions/hooks";
import { upcomingSession, useGoToRoute } from "utils";
import { deleteEnrollment, initializeRegistration } from "actions/registrationActions";
import AddSessions from "components/OmouComponents/AddSessions";
import BackButton from "components/OmouComponents/BackButton";
import Loading from "components/OmouComponents/Loading";
import Notes from "components/FeatureViews/Notes/Notes";
import { useEnrollmentNotes } from "actions/userActions";
import { useSessionsWithConfig } from "actions/calendarActions";
import Moment from "react-moment";
import EnrollmentPayment from "./EnrollmentPayment";

const timeOptions = {
    "hour": "2-digit",
    "minute": "2-digit",
};
const dateOptions = {
    "day": "numeric",
    "month": "numeric",
    "year": "numeric",
};

const CourseSessionStatus = () => {
    const dispatch = useDispatch();
    const goToRoute = useGoToRoute();
    const { "accountID": studentID, courseID } = useParams();
    const courseSessions = useSelector(({ Calendar }) => Calendar.CourseSessions);
    const usersList = useSelector(({ Users }) => Users);
    const courses = useSelector(({ Course }) => Course.NewCourseList);
    const enrollments = useSelector(({ Enrollments }) => Enrollments);
    console.log(enrollments);
    const course = courses[courseID];

    const [activeTab, setActiveTab] = useState(0);
    const [highlightSession, setHighlightSession] = useState(false);
    const [unenrollWarningOpen, setUnenrollWarningOpen] = useState(false);

    const sessionConfig = useMemo(
        () => ({
            "params": {
                "course_id": courseID,
            },
        }),
        [courseID]
    );

    const sessionStatus = useSessionsWithConfig(sessionConfig);
    const studentStatus = hooks.useStudent(studentID);
    const courseStatus = hooks.useCourse(courseID);
    const instructorStatus = hooks.useInstructor(
        course && course.instructor_id,
        true
    );
    const enrollmentStatus = hooks.useEnrollmentByCourse(courseID);

    const enrollment = useMemo(
        () => (enrollments[studentID] && enrollments[studentID][courseID]) || {},
        [enrollments, studentID, courseID]
    );

    const noteInfo = useMemo(
        () => ({
            courseID,
            "enrollmentID": enrollment.enrollment_id,
            studentID,
        }),
        [courseID, enrollment.enrollment_id, studentID]
    );

    const sessions = useMemo(
        () =>
            Object.values(courseSessions || {})
                .map((instructorSessions) => Object.values(instructorSessions))
                .flat()
                .filter((session) => session.course == courseID),
        [courseSessions, courseID]
    );

    const upcomingSess = upcomingSession(sessions, courseID) || {};

    const studentParent =
        usersList.StudentList[studentID] &&
        usersList.StudentList[studentID].parent_id;

    const sessionDataParse = useCallback(
        ({ start_datetime, end_datetime, course, status, id, instructor }) => {
            if (start_datetime && end_datetime && course) {
                const startDate = new Date(start_datetime);
                const endDate = new Date(end_datetime);
                return {
                    "course_id": course,
                    "date": startDate,
                    "endTime": endDate,
                    id,
                    instructor,
                    "startTime": start_datetime,
                    status,
                    "tuition": course && courses[course].hourly_tuition,
                };
            }
            return {};
        },
        [courses]
    );

    const handleTabChange = useCallback((_, newTab) => {
        setActiveTab(newTab);
    }, []);

    const handleHighlightSwitch = useCallback(() => {
        setHighlightSession((prevHighlight) => !prevHighlight);
    }, []);

    const openUnenrollDialog = useCallback(() => {
        setUnenrollWarningOpen(true);
    }, []);

    const closeUnenrollDialog = useCallback(
        (toUnenroll) => () => {
            setUnenrollWarningOpen(false);
            if (toUnenroll) {
                deleteEnrollment(enrollment)(dispatch);
                goToRoute(`/accounts/student/${studentID}`);
            }
        },
        [dispatch, enrollment, goToRoute, studentID]
    );

    useEffect(() => {
        dispatch(initializeRegistration());
    }, [dispatch]);

    // either doesn't exist or only has notes defined
    if (
        !enrollment ||
        Object.keys(enrollment).length <= 1 ||
        hooks.isLoading(
            courseStatus,
            enrollmentStatus,
            studentStatus,
            instructorStatus,
            sessionStatus
        )
    ) {
        return <Loading paper />;
    }

    if (
        hooks.isFail(
            courseStatus,
            enrollmentStatus,
            studentStatus,
            instructorStatus,
            sessionStatus
        )
    ) {
        return <LoadingError error="data" />;
    }

    const mainContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <>
                        <Grid className="accounts-table-heading" container item xs={12}>
                            <Grid item xs={1} />
                            <Grid item xs={2}>
                                <Typography align="left" className="table-text">
                                    Session Date
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align="left" className="table-text">
                                    Day
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography align="left" className="table-text">
                                    Time
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography align="left" className="table-text">
                                    Tuition
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align="center" className="table-text">
                                    Status
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            {sessions.length !== 0 ?
                                sessions.map((session) => {
                                    const {
                                        date,
                                        startTime,
                                        endTime,
                                        tuition,
                                        id,
                                        course_id,
                                        instructor,
                                    } = sessionDataParse(session);
                                    return (
                                        <Grid className="accounts-table-row"
                                            component={Link}
                                            item
                                            key={id}
                                            to={
                                                course.course_type === "tutoring"
                                                    ? `/scheduler/view-session/${course_id}/${id}/${instructor}`
                                                    : `/registration/course/${course_id}`
                                            }
                                            xs={12}>
                                            <Paper className={`session-info
                                                ${highlightSession && " active"}
                                                ${
                                                upcomingSess.id == id &&
                                                " upcoming-session"
                                                }`}
                                                component={Grid}
                                                container
                                                square>
                                                <Grid item xs={1} />
                                                <Grid item xs={2}>
                                                    <Typography align="left">
                                                        <Moment
                                                            date={date}
                                                            format="M/D/YYYY"
                                                        />
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography align="left">
                                                        <Typography align="left">
                                                            <Moment
                                                                date={date}
                                                                format="dddd"
                                                            />
                                                        </Typography>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography align="left">
                                                        <Moment
                                                            date={startTime}
                                                            format="h:mm A"
                                                        />
                                                        {" - "}
                                                        <Moment
                                                            date={endTime}
                                                            format="h:mm A"
                                                        />
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Typography align="left">${tuition}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <SessionPaymentStatusChip enrollment={enrollment}
                                                        session={session}
                                                        setPos />
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    );
                                })
                                : (
                                    <NoListAlert list="Course" />
                                )}
                        </Grid>
                    </>
                );
            case 1:
                return (
                    <Notes ownerID={enrollment.enrollment_id}
                        ownerType="enrollment" />
                );
            case 2:
                return (
                    <div>
                        <PaymentTable courseID={course.course_id}
                        enrollmentID={enrollment.enrollment_id}
                        paymentList={enrollment.payment_list}
                        type="enrollment" />
                        <EnrollmentPayment
                            courseID={course.course_id}
                            enrollmentID={enrollment.enrollment_id}
                            paymentList={enrollment.payment_list}
                            type="enrollment"
                        />
                    </div>
                    );
            default:
                return null;
        }
    };

    return (
        <Paper className="paper" elevation={2}>
            <Grid className="course-session-status" container>
                <Grid item xs={12}>
                    <BackButton />
                    <hr />
                </Grid>
                <Grid item xs={12}>
                    <Typography align="left"
                        className="course-session-title"
                        variant="h3">
                        {course.title}
                    </Typography>
                </Grid>
                <Grid item md={12}>
                    <Grid alignItems="center"
                        className="session-actions"
                        container
                        direction="row"
                        justify="flex-start"
                        spacing={2}>
                        <Grid item>
                            <AddSessions componentOption="button"
                                enrollment={enrollment}
                                parentOfCurrentStudent={studentParent} />
                        </Grid>
                        <Grid item>
                            <Button className="button unenroll" onClick={openUnenrollDialog}>
                                Unenroll Course
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid className="participants" item xs={12}>
                        <Typography align="left">
                            Student:{" "}
                            <Link to={`/accounts/student/${studentID}`}>
                                {usersList.StudentList[studentID].name}
                            </Link>
                        </Typography>
                        <Typography align="left">
                            Instructor:{" "}
                            <Link to={`/accounts/instructor/${course.instructor_id}`}>
                                {usersList.InstructorList[course.instructor_id].name}
                            </Link>
                        </Typography>
                        <Typography align="left">
                            Enrollment Balance Left: ${enrollment.balance}
                        </Typography>
                    </Grid>
                    {activeTab === 0 && (
                        <Grid alignItems="flex-start" container item xs={3}>
                            <Grid item>
                                <FormControl component="fieldset">
                                    <FormGroup>
                                        <FormControlLabel control={
                                            <Switch checked={highlightSession}
                                                color="primary"
                                                onChange={handleHighlightSwitch}
                                                value="upcoming-session" />
                                        }
                                            label="Highlight Upcoming Session" />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Tabs className="enrollment-tabs"
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    value={activeTab}>
                    <Tab label={
                        <>
                            <RegistrationIcon className="NoteIcon" /> Registration
                        </>
                    } />
                    <Tab label={
                        Object.values(enrollment.notes).some(
                            ({ important }) => important
                        ) ? (
                                <>
                                    <Avatar className="notificationCourse" />
                                    <NoteIcon className="TabIcon" /> Notes
                            </>
                            ) : (
                                <>
                                    <NoteIcon className="NoteIcon" /> Notes
                                </>
                            )
                    } />
                    <Tab label={
                        <>
                            <PaymentIcon className="TabIcon" /> Payments
                        </>
                    } />
                </Tabs>
                <br />
                {mainContent()}
            </Grid>
            <Dialog aria-labelledby="warn-unenroll"
                onClose={closeUnenrollDialog(false)}
                open={unenrollWarningOpen}>
                <DialogTitle id="warn-unenroll">Unenroll in {course.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{course.title}</b> for{" "}
                        <b>{usersList.StudentList[studentID].name}</b>. Performing this
                        action will credit <b>${enrollment.balance}</b> back to the parent's
                        account balance. Are you sure you want to unenroll?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={closeUnenrollDialog(true)}
                    >
                        Yes, unenroll
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={closeUnenrollDialog(false)}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

CourseSessionStatus.propTypes = {};

export default CourseSessionStatus;
