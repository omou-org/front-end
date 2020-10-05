import React, { Fragment, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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
import Loading from "components/OmouComponents/Loading";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MobileMenu from "@material-ui/icons/MoreVert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import "theme/theme.scss";
import "./registration.scss";
import { addDashes } from "components/FeatureViews/Accounts/accountUtils";
import { deleteEnrollment } from "actions/registrationActions";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { fullName } from "../../../utils";

export const GET_ENROLLMENT_DETAILS = gql`
	query EnrollmentDetails($courseId: ID!){
		enrollments(courseId: $courseId) {
            student {
              primaryParent {
                user {
                  firstName
                  lastName
                  email
                  id
                }
                phoneNumber
              }
              user {
                firstName
                lastName
                email
                id
              }
              school {
                name
              }
            }
            id
         }
	}
	`;

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

const RegistrationCourseEnrollments = ({ courseID, maxCapacity, courseTitle }) => {
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState({});

    const [studentMenuAnchorEl, setStudentMenuAnchorEl] = useState(null);
    const [unenroll, setUnenroll] = useState({
        "enrollment": null,
        "open": false,
    });

    const { data, loading, error } = useQuery(GET_ENROLLMENT_DETAILS, {
        variables: { courseId: courseID }
    });
    

    // TODO: need to update when Session queries are live
    // const sessionStatus = useSessions("month", 0)
    // const currentMonthSessions = sessionArray(sessions);
    // const upcomingSess = upcomingSession(currentMonthSessions || [], courseID);

    const handleClick = useCallback(({ currentTarget }) => {
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

    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Typography>
            There's been an error! Error: {error.message}
        </Typography>
    }

    const { enrollments } = data;

    return (
        <>
            <div className="course-status">
                <div className="status">
                    <div className="text">
                        {enrollments.length} / {maxCapacity} Spaces Taken
                    </div>
                </div>
                <LinearProgress color="primary"
                    value={(enrollments.length / maxCapacity) * 100}
                    valueBuffer={100}
                    variant="buffer" />
            </div>
            <Table>
                {TableToolbar}
                <TableBody>
                    {enrollments.map(({ student, id }) => {
                        const { primaryParent } = student;
                        return (
                            <Fragment key={student.user.id}>
                                <TableRow>
                                    <TableCell className="bold">
                                        <Link className="no-underline"
                                            to={`/accounts/student/${student.user.id}`}>
                                            {fullName(student.user)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link className="no-underline"
                                            to={`/accounts/parent/${primaryParent.user.id}`}>
                                            {fullName(primaryParent.user)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {addDashes(primaryParent.phoneNumber)}
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ "width": "40px" }}>
                                            {/*<SessionPaymentStatusChip className="session-status-chip"*/}
                                            {/*    enrollment={enrollment}*/}
                                            {/*    session={upcomingSess} />*/}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="actions" key={student.user.id}>
                                            <IconButton component={Link}
                                                to={`mailto:${primaryParent.user.email}`}>
                                                <EmailIcon />
                                            </IconButton>
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
                                                    to={`/accounts/student/${student.user.id}/${courseID}`}>
                                                    View Enrollment
                                                </MenuItem>
                                                <MenuItem onClick={handleUnenroll(id)}>
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
                                {/*{expanded[studentID] && (*/}
                                {/*    <TableRow align="left">*/}
                                {/*        <TableCell colSpan={5}>*/}
                                {/*            <Paper elevation={2} square>*/}
                                {/*                <Typography className="expanded-container">*/}
                                {/*                    <span className="expanded-text">*/}
                                {/*                        <b>School</b>: {student.school}*/}
                                {/*                        <br />*/}
                                {/*                    </span>*/}
                                {/*                    <span className="expanded-text">*/}
                                {/*                        <b>School Teacher</b>:{" "}*/}
                                {/*                        {notes["Current Instructor in School"]}*/}
                                {/*                        <br />*/}
                                {/*                    </span>*/}
                                {/*                    <span className="expanded-text">*/}
                                {/*                        <b>Textbook:</b> {notes["Textbook Used"]}*/}
                                {/*                        <br />*/}
                                {/*                    </span>*/}
                                {/*                </Typography>*/}
                                {/*            </Paper>*/}
                                {/*        </TableCell>*/}
                                {/*    </TableRow>*/}
                                {/*)}*/}
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
                    Unenroll in {courseTitle}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{courseTitle}</b> for{" "}
                        <b>
                            {unenroll.enrollment && fullName(enrollments.find(({ id }) => id == unenroll.enrollment).student.user)}
                        </b>
                        . Performing this action will credit the remaining enrollment
                        balance back to the parent's account balance. Are you sure you want
                        to unenroll?
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
        </>
    );
};

RegistrationCourseEnrollments.propTypes = {
    "courseID": PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
};

export default RegistrationCourseEnrollments;
