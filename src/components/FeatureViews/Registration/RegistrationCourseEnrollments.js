import * as hooks from "actions/hooks";
import {useSessionsInPeriod} from "actions/hooks";
import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {addDashes} from "components/FeatureViews/Accounts/accountUtils";
import {Link, NavLink} from "react-router-dom";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import EmailIcon from "@material-ui/icons/Email";
import LinearProgress from "@material-ui/core/LinearProgress";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import "theme/theme.scss";
import "./registration.scss";
import MobileMenu from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as calendarActions from "../../../actions/calendarActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {NoListAlert} from "../../NoListAlert";
import {sessionArray} from "../Scheduler/SchedulerUtils";
import {SessionPaymentStatusChip} from "../../SessionPaymentStatusChip";
import {upcomingSession} from "../../../utils";

const TableToolbar = (
    <TableHead>
        <TableRow>
            {["Student", "Parent", "Phone", "Upcoming Status", ""].map((heading) => (
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

const RegistrationCourseEnrollments = ({courseID}) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(calendarActions, dispatch),
        }),
        [dispatch]
    );

    const [expanded, setExpanded] = useState({});
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const parents = useSelector(({"Users": {ParentList}}) => ParentList);
    const students = useSelector(({"Users": {StudentList}}) => StudentList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);
    const sessions = useSelector(({Calendar}) => Calendar.CourseSessions);

    const [studentMenuAnchorEl, setStudentMenuAnchorEl] = useState(null);
    const [unenroll, setUnenroll] = useState({
        open: false,
        enrollment: null,
    });

    const toggleExpanded = useCallback((studentID) => () => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [studentID]: !prevExpanded[studentID],
        }));
    }, []);

    const enrollmentStatus = hooks.useEnrollmentByCourse(courseID);
    const course = courses[courseID];
    const studentStatus = hooks.useStudent(course.roster);

    const parentList = useMemo(() => course.roster
        .filter((studentID) => students[studentID])
        .map((studentID) => students[studentID].parent_id)
    , [course.roster, students]);
    const parentStatus = hooks.useParent(parentList);

    useEffect(() => {
        setExpanded((prevExpanded) =>
            course.roster.reduce((object, studentID) => ({
                ...object,
                [studentID]: prevExpanded[studentID] || false,
            }), {}));
    }, [course.roster]);

    const sessionStatus = useSessionsInPeriod("month",0);

    const loadedStudents = useMemo(() =>
        course.roster.filter((studentID) => students[studentID])
    , [course.roster, students]);

    const currentMonthSessions = sessionArray(sessions);

    // no students enrolled
    if (course.roster.length === 0) {
        return <NoListAlert list={"Enrolled Students"}/>;
    }

    if (loadedStudents.length === 0 || !currentMonthSessions || hooks.isLoading(sessionStatus)) {
        if (hooks.isLoading(studentStatus) || !currentMonthSessions) {
            return <Loading small />;
        }
        if (hooks.isFail(studentStatus)) {
            return "Error loading enrollment details!";
        }
    }

    const upcomingSess = upcomingSession(currentMonthSessions, courseID);

    const handleClick = event => {
        setStudentMenuAnchorEl(event.currentTarget);
    };
    const handleClose = event => {
        setStudentMenuAnchorEl(null);
    };

    const handleUnenroll = (enrollment) => event => {
        event.preventDefault();
        setUnenroll({
            open: true,
            enrollment: enrollment,
        });
    };
    const closeUnenrollDialog = (toUnenroll) => event => {
        event.preventDefault();
        if(toUnenroll){
            api.deleteEnrollment(unenroll.enrollment);
        }
        setUnenroll({
            open: false,
            enrollment: null,
        });
        setStudentMenuAnchorEl(null);
    };

    return (
        <>
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
            <Table>
                {TableToolbar}
                <TableBody>
                    {
                        loadedStudents.map((studentID) => {
                            const student = students[studentID];
                            const parent = parents[student.parent_id];
                            const enrollment =
                                enrollments[studentID] && enrollments[studentID][courseID];
                            const notes = (enrollment && enrollment.notes) || {};
                            return (
                                <Fragment key={studentID}>
                                    <TableRow>
                                        <TableCell className="bold">
                                            <Link
                                                className="no-underline"
                                                to={`/accounts/student/${studentID}`}>
                                                {student.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                parent ?
                                                    <Link
                                                        className="no-underline"
                                                        to={`/accounts/parent/${student.parent_id}`}>
                                                        {parent.name}
                                                    </Link>
                                                    : hooks.isLoading(parentStatus) ?
                                                        "Loading..." : "Error"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                parent ?
                                                    addDashes(parent.phone_number)
                                                    : hooks.isLoading(parentStatus) ?
                                                        "Loading..." : "Error"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                enrollment
                                                    ? <div
                                                        key={studentID}
                                                        style={{"width": "40px",}}>
                                                        <SessionPaymentStatusChip
                                                            style={{
                                                                "width": "50px",
                                                                "padding": "7px 0 0 10px",
                                                                "borderRadius": "15px"
                                                            }}
                                                            session={upcomingSess}
                                                            enrollment={enrollment} />
                                                      </div>
                                                    : hooks.isFail(enrollmentStatus)
                                                        ? "Error!"
                                                        : "Loading..."
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="actions"
                                                key={studentID}>
                                                {
                                                    parent &&
                                                        <IconButton
                                                            component={NavLink}
                                                            to={`mailto:${parent.email}`}>
                                                            <EmailIcon />
                                                        </IconButton>
                                                }
                                                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                                    <MobileMenu/>
                                                </IconButton>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={studentMenuAnchorEl}
                                                    keepMounted
                                                    open={Boolean(studentMenuAnchorEl)}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem
                                                        component={NavLink}
                                                        to={`/accounts/student/${studentID}/${courseID}`}
                                                        onClick={handleClose}>View Enrollment</MenuItem>
                                                    <MenuItem onClick={handleUnenroll(enrollment)}>Unenroll</MenuItem>
                                                </Menu>
                                                {/*<span>*/}
                                                {/*    {expanded[studentID]*/}
                                                {/*        ? <UpArrow onClick={toggleExpanded(studentID)} />*/}
                                                {/*        : <DownArrow onClick={toggleExpanded(studentID)} />*/}
                                                {/*    }*/}
                                                {/*</span>*/}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {
                                        expanded[studentID] &&
                                            <TableRow align="left">
                                                <TableCell colSpan={5}>
                                                    <Paper
                                                        elevation={0}
                                                        square>
                                                        <Typography
                                                            style={{
                                                                "padding": "10px",
                                                            }}>
                                                            <span style={{"padding": "5px"}}>
                                                                <b>School</b>: {
                                                                    student.school
                                                                }
                                                                <br />
                                                            </span>
                                                            <span style={{"padding": "5px"}}>
                                                                <b>School Teacher</b>: {
                                                                    notes["Current Instructor in School"]
                                                                }
                                                                <br />
                                                            </span>
                                                            <span style={{"padding": "5px"}}>
                                                                <b>Textbook:</b> {
                                                                    notes["Textbook Used"]
                                                                }
                                                                <br />
                                                            </span>
                                                        </Typography>
                                                    </Paper>
                                                </TableCell>
                                            </TableRow>
                                    }
                                </Fragment>
                            );
                        })
                    }
                </TableBody>
            </Table>
            <Dialog
                aria-describedby="unenroll-dialog-description"
                aria-labelledby="unenroll-dialog-title"
                className="session-view-modal"
                fullWidth
                maxWidth="xs"
                onClose={closeUnenrollDialog(false)}
                open={unenroll.open}>
                <DialogTitle id="unenroll-dialog-title">Unenroll in {course.title}</DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{course.title}</b> for
                        <b>{ unenroll.enrollment && students[unenroll.enrollment.student_id].name}</b>.
                        Performing this action will credit the remaining enrollment balance back to the parent's account balance.
                        Are you sure you want to unenroll?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        onClick={closeUnenrollDialog(true)}>
                        Yes, unenroll
                    </Button>
                    <Button
                        color="primary"
                        onClick={closeUnenrollDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

RegistrationCourseEnrollments.propTypes = {
    "courseID": PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};

export default RegistrationCourseEnrollments;
