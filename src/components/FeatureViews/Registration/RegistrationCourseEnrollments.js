import React, { Fragment, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
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
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClassEnrollmentList from '../Courses/ClassEnrollmentList';

import 'theme/theme.scss';
import './registration.scss';
import { addDashes } from 'components/FeatureViews/Accounts/accountUtils';
import { deleteEnrollment } from 'actions/registrationActions';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_COURSES } from './RegistrationLanding';
import { fullName } from '../../../utils';

export const DELETE_ENROLLMENT = gql`
    mutation DeleteEnrollment($enrollmentId: ID) {
        __typename
        deleteEnrollment(id: $enrollmentId) {
            id
            deleted
            parent
            parentBalance
        }
    }
`;

const useStyles = makeStyles({
  MuiTableCell: {
    root: {
      borderBottom: "none",
    },
  },
  MuiTableCell: {
    borderBottom: "none",
  },

  accordionNotes: {
    textAlign: "left",
    fontSize: "12 px !important",
    display: "inline-block",
  },
  accordionNotesBorder: {
    border: "1px #E0E0E0 solid",
    borderRadius: "25px",
    margin: "0px 24px 25px 24px",
    paddingTop: "0px",
  },
  studentAccordionSpacing: {
    width: "320px!important",
    height: "30px!important",
    textAlign: "left",
  },
  parentAccordionSpacing: {
    height: "30px!important",
    textAlign: "left",
  },
  actionsAccordionSpacing: {
    width: "309px!important",
    height: "30px!important",
    textAlign: "left",
  },
  iconsAccordionSpacing: {
    height: "60px!important",
    paddingLeft: "25px",
  },
  arrowIcon: {
    color: "#43B5D9",
  },
});

export const GET_ENROLLMENT_DETAILS = gql`
  query EnrollmentDetails($courseId: ID!) {
    enrollments(courseId: $courseId) {
      student {
        primaryParent {
          user {
            firstName
            lastName
            email
            id
          }
          accountType
          phoneNumber
        }
        user {
          firstName
          lastName
          email
          id
        }
        accountType
        phoneNumber
        studentschoolinfoSet {
          textbook
          teacher
          name
        }
      }
      id
    }
  }
`;

// const TableToolbar = (
//   <TableHead>
//     <TableRow>
//       {["Student", "Parent", "Phone", "", "", "", "", ""].map((heading) => (
//         <TableCell align="left" color="color" key={heading} padding="default">
//           {heading}
//         </TableCell>
//       ))}
//     </TableRow>
//   </TableHead>
// );

const RegistrationCourseEnrollments = ({
  courseID,
  maxCapacity,
  courseTitle,
}) => {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState({});

  const [studentMenuAnchorEl, setStudentMenuAnchorEl] = useState(null);
  const [unenroll, setUnenroll] = useState({
    enrollment: null,
    open: false,
  });

  const { data, loading, error } = useQuery(GET_ENROLLMENT_DETAILS, {
    variables: { courseId: courseID },
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
        open: true,
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
        enrollment: null,
        open: false,
      });
      setStudentMenuAnchorEl(null);
    },
    [dispatch, unenroll.enrollment]
  );

  const classes = useStyles();
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <Typography>There's been an error! Error: {error.message}</Typography>
    );
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
        <LinearProgress
          color="primary"
          value={(enrollments.length / maxCapacity) * 100}
          valueBuffer={100}
          variant="buffer"
        />
      </div>
      {/* <Table>{TableToolbar}</Table>
      <Table>
        <TableBody>
          {enrollments.map(({ student, id }) => {
            const { primaryParent } = student;
            return (
              <Fragment key={student.user.id}>
                <Accordion
                  classes={{
                    root: classes.MuiAccordionroot,
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon className={classes.arrowIcon} />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <GridList cols={1}>
                      <Grid
                        item
                        xs={3}
                        className={classes.studentAccordionSpacing}
                      >
                        <Link
                          className="no-underline"
                          to={`/accounts/student/${student.user.id}`}
                        >
                          {fullName(student.user)}
                        </Link>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={classes.parentAccordionSpacing}
                      >
                        <Link
                          className="no-underline"
                          to={`/accounts/parent/${primaryParent.user.id}`}
                        >
                          {fullName(primaryParent.user)}
                        </Link>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={classes.actionsAccordionSpacing}
                      >
                        {addDashes(primaryParent.phoneNumber)}
                      </Grid> */}
                      {/* <Grid item xs={3}> */}
                      {/* <div style={{ "width": "40px" }}> */}
                      {/*<SessionPaymentStatusChip className="session-status-chip"*/}
                      {/*    enrollment={enrollment}*/}
                      {/*    session={upcomingSess} />*/}
                      {/* </div> */}
                      {/* </Grid> */}
                    {/* </GridList>
                    <div className={classes.iconsAccordionSpacing}>
                      <div className="actions" key={student.user.id}>
                        <IconButton
                          component={Link}
                          to={`mailto:${primaryParent.user.email}`}
                        >
                          <EmailIcon />
                        </IconButton>
                        <IconButton
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={handleClick}
                        >
                          <MobileMenu />
                        </IconButton>
                        <Menu
                          anchorEl={studentMenuAnchorEl}
                          id="simple-menu"
                          keepMounted
                          onClose={handleClose}
                          open={studentMenuAnchorEl !== null}
                        >
                          <MenuItem
                            component={Link}
                            onClick={handleClose}
                            to={`/accounts/student/${student.user.id}/${courseID}`}
                          >
                            View Enrollment
                          </MenuItem>
                          <MenuItem onClick={handleUnenroll(id)}>
                            Unenroll
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </AccordionSummary>
                  
                  <AccordionDetails className={classes.accordionNotesBorder}>
                    <Typography
                      className={classes.accordionNotes}
                      variant="body"
                    >
                      <p>
                        <b>School:</b> {student.studentschoolinfoSet.school}
                      </p>
                      <p>
                        <b>School Teacher:</b>{" "}
                        {student.studentschoolinfoSet.teacher}
                      </p>
                      <p>
                        <b>Textbook used:</b>{" "}
                        {student.studentschoolinfoSet.textbook}
                      </p>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Fragment>
            );
          })}
        </TableBody>
      </Table> */}
      <ClassEnrollmentList
        enrollmentList={enrollments}
      />
      <Dialog
        aria-describedby="unenroll-dialog-description"
        aria-labelledby="unenroll-dialog-title"
        className="session-view-modal"
        fullWidth
        maxWidth="xs"
        onClose={closeUnenrollDialog(false)}
        open={unenroll.open}
      >
        <DialogTitle id="unenroll-dialog-title">
          Unenroll in {courseTitle}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            You are about to unenroll in <b>{courseTitle}</b> for{" "}
            <b>
              {unenroll.enrollment &&
                fullName(
                  enrollments.find(({ id }) => id == unenroll.enrollment)
                    .student.user
                )}
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
  courseID: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default RegistrationCourseEnrollments;
