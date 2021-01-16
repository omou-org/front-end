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

import LinearProgress from "@material-ui/core/LinearProgress";
import Loading from "components/OmouComponents/Loading";

import Typography from "@material-ui/core/Typography";
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
      <ClassEnrollmentList
        enrollmentList={enrollments}
        courseID={courseID}
        enrollmentID={data.id}
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
