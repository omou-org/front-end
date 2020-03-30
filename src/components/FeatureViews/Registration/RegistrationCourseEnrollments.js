import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import EmailIcon from "@material-ui/icons/Email";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Loading from "components/Loading";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MobileMenu from "@material-ui/icons/MoreVert";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError" 

import "theme/theme.scss";
import "./registration.scss";
import * as hooks from "actions/hooks";
import {addDashes} from "components/FeatureViews/Accounts/accountUtils";
import {deleteEnrollment} from "actions/registrationActions";
import NoListAlert from "../../NoListAlert";
import {sessionArray} from "../Scheduler/SchedulerUtils";
import SessionPaymentStatusChip from "components/SessionPaymentStatusChip";
import {upcomingSession} from "utils";
import {useSessions} from "actions/calendarActions";

const TableToolbar = (
    <TableHead>
        <TableRow>
            {["Student", "Parent", "Phone", "Upcoming Status", ""].map((heading) => (
                <TableCell align="left" key={heading} padding="default">
                    {heading}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const RegistrationCourseEnrollments = ({courseID}) => {
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState({});
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const parents = useSelector(({"Users": {ParentList}}) => ParentList);
    const students = useSelector(({"Users": {StudentList}}) => StudentList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);
    const sessions = useSelector(({Calendar}) => Calendar.CourseSessions);

    const [studentMenuAnchorEl, setStudentMenuAnchorEl] = useState(null);
    const [unenroll, setUnenroll] = useState({
        "enrollment": null,
        "open": false,
    });

    // TODO: for future release
    // const toggleExpanded = useCallback((studentID) => () => {
    //     setExpanded((prevExpanded) => ({
    //         ...prevExpanded,
    //         [studentID]: !prevExpanded[studentID],
    //     }));
    // }, []);

    const enrollmentStatus = hooks.useEnrollmentByCourse(courseID);
    const course = courses[courseID];
    const studentStatus = hooks.useStudent(course.roster);

    const parentList = useMemo(
        () => course.roster.filter((studentID) => students[studentID])
            .map((studentID) => students[studentID].parent_id),
        [course.roster, students]
    );
    const parentStatus = hooks.useParent(parentList);

    useEffect(() => {
        setExpanded((prevExpanded) =>
            course.roster.reduce(
                (object, studentID) => ({
                    ...object,
                    [studentID]: prevExpanded[studentID] || false,
                }),
                {}
            ));
    }, [course.roster]);

    const sessionStatus = useSessions("month", 0);

    const loadedStudents = useMemo(
        () => course.roster.filter((studentID) => students[studentID]),
        [course.roster, students]
    );

    const currentMonthSessions = sessionArray(sessions);
    const upcomingSess = upcomingSession(currentMonthSessions || [], courseID);

    const handleClick = useCallback(({currentTarget}) => {
        setStudentMenuAnchorEl(currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setStudentMenuAnchorEl(null);
    }, []);

    const handleUnenroll = useCallback(
        (enrollment) => () => {
            setUnenroll({
                enrollment,
                "open": true,
            });
        },
        []
    );

    const closeUnenrollDialog = useCallback(
        (toUnenroll) => () => {
            if (toUnenroll) {
                deleteEnrollment(unenroll.enrollment)(dispatch);
            }
            setUnenroll({
                "enrollment": null,
                "open": false,
            });
            setStudentMenuAnchorEl(null);
        },
        [dispatch, unenroll.enrollment]
    );

    // no students enrolled
    if (course.roster.length === 0) {
        return <NoListAlert list="Enrolled Students" />;
    }

    if (
        loadedStudents.length === 0 &&
        !currentMonthSessions &&
        hooks.isLoading(sessionStatus)
    ) {
        if (hooks.isLoading(studentStatus) || !currentMonthSessions) {
            return <Loading small />;
        }
        if (hooks.isFail(studentStatus)) {
            return <LoadingError error="enrollment details"/>;
        }
    }

    return (
        <>
            <div className="course-status">
                <div className="status">
                    <div className="text">
                        {course.roster.length} / {course.capacity} Spaces Taken
                    </div>
                </div>
                <LinearProgress color="primary"
                    value={(course.roster.length / course.capacity) * 100}
                    valueBuffer={100}
                    variant="buffer" />
            </div>
            <Table>
                {TableToolbar}
                <TableBody>
                    {loadedStudents.map((studentID) => {
                        const student = students[studentID];
                        const parent = parents[student.parent_id];
                        const enrollment =
                            enrollments[studentID] && enrollments[studentID][courseID];
                        const notes = enrollment ? enrollment.notes : {};
                        return (
                            <Fragment key={studentID}>
                                <TableRow>
                                    <TableCell className="bold">
                                        <Link className="no-underline"
                                            to={`/accounts/student/${studentID}`}>
                                            {student.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {parent ? (
                                            <Link className="no-underline"
                                                to={`/accounts/parent/${student.parent_id}`}>
                                                {parent.name}
                                            </Link>
                                        ) : hooks.isLoading(parentStatus) ?
                                            "Loading..."
                                            :
                                            "Error"}
                                    </TableCell>
                                    <TableCell>
                                        {parent
                                            ? addDashes(parent.phone_number)
                                            : hooks.isLoading(parentStatus)
                                                ? "Loading..."
                                                : "Error"}
                                    </TableCell>
                                    <TableCell>
                                        <div style={{"width": "40px"}}>
                                            <SessionPaymentStatusChip className="session-status-chip"
                                                enrollment={enrollment}
                                                session={upcomingSess} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="actions" key={studentID}>
                                            {parent && (
                                                <IconButton component={Link}
                                                    to={`mailto:${parent.email}`}>
                                                    <EmailIcon />
                                                </IconButton>
                                            )}
                                            <IconButton aria-controls="simple-menu"
                                                aria-haspopup="true"
                                                onClick={handleClick}>
                                                <MobileMenu />
                                            </IconButton>
                                            <Menu anchorEl={studentMenuAnchorEl}
                                                id="simple-menu"
                                                keepMounted
                                                onClose={handleClose}
                                                open={studentMenuAnchorEl !== null}>
                                                <MenuItem component={Link}
                                                    onClick={handleClose}
                                                    to={`/accounts/student/${studentID}/${courseID}`}>
                                                    View Enrollment
                                                </MenuItem>
                                                <MenuItem onClick={handleUnenroll(enrollment)}>
                                                    Unenroll
                                                </MenuItem>
                                            </Menu>
                                            {/* <span>
                                               {expanded[studentID]
                                                   ? <UpArrow onClick={toggleExpanded(studentID)} />
                                                   : <DownArrow onClick={toggleExpanded(studentID)} />
                                               }
                                            </span> */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expanded[studentID] && (
                                    <TableRow align="left">
                                        <TableCell colSpan={5}>
                                            <Paper elevation={2} square>
                                                <Typography className="expanded-container">
                                                    <span className="expanded-text">
                                                        <b>School</b>: {student.school}
                                                        <br />
                                                    </span>
                                                    <span className="expanded-text">
                                                        <b>School Teacher</b>:{" "}
                                                        {notes["Current Instructor in School"]}
                                                        <br />
                                                    </span>
                                                    <span className="expanded-text">
                                                        <b>Textbook:</b> {notes["Textbook Used"]}
                                                        <br />
                                                    </span>
                                                </Typography>
                                            </Paper>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </Table>
            <Dialog aria-describedby="unenroll-dialog-description"
                aria-labelledby="unenroll-dialog-title"
                className="session-view-modal"
                fullWidth
                maxWidth="xs"
                onClose={closeUnenrollDialog(false)}
                open={unenroll.open}>
                <DialogTitle id="unenroll-dialog-title">
                    Unenroll in {course.title}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{course.title}</b> for
                        <b>
                            {unenroll.enrollment &&
                            students[unenroll.enrollment.student_id].name}
                        </b>
                        . Performing this action will credit the remaining enrollment
                        balance back to the parent's account balance. Are you sure you want
                        to unenroll?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={closeUnenrollDialog(true)}>
                        Yes, unenroll
                    </Button>
                    <Button color="primary" onClick={closeUnenrollDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

RegistrationCourseEnrollments.propTypes = {
    "courseID": PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
};

export default RegistrationCourseEnrollments;
