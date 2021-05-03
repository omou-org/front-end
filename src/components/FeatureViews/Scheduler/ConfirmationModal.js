import React from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/client';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";

const UPDATE_SESSION_MUTATION = gql`
mutation updateSessionMutation($courseId: ID!, $endDateTime: DateTime!, $sessionId: ID!, $instructorId: ID!, $isConfirmed: Boolean, $startDateTime: DateTime!) 
{
    createSession(
      course: $courseId
      endDatetime: $endDateTime
      id: $sessionId
      instructor: $instructorId
      isConfirmed: $isConfirmed
      startDatetime: $startDateTime
    ) {
      created
      session {
        endDatetime
        id
        instructor {
          user {
            lastName
            id
            firstName
          }
        }
        isConfirmed
        startDatetime
        title
        details
      }
    }
  }
`;

const ConfirmationModal = ({
                               openState,
                               setOpenState,
                               instructor,
                               student,
                               courseId,
                               sessionId,
                               startDateTime,
                               endDateTime
                           }) => {

    const [updateSession] = useMutation(UPDATE_SESSION_MUTATION, {
        onError: (err) => console.error(err),
        onCompleted: () => setOpenState({...openState, confirmationState: false})
    });

    const handleUpdateSession = () => {
        updateSession({
            variables: {
                courseId,
            endDateTime,
            sessionId,
            instructorId: instructor.user.id,
            isConfirmed: true,
            startDateTime,
        },
      });
  };

  const handleClose = () => {
    setOpenState({ ...openState, confirmationState: false });
  };

  return (
      <Dialog
        open={openState.confirmationState}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Summary of our updated session for ${student}:`}
          </DialogContentText>
        </DialogContent>
        <DialogTitle>
            {"Schedule update:"}
        </DialogTitle>
        <DialogContent>
            <Grid container>
                <Grid item xs={2}>
                    <DialogContentText>{'hello world'}</DialogContentText>
                </Grid>
                <Grid item xs={3}>
                    <DialogContentText>{'hello world'}</DialogContentText>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                {'CANCEL'}
            </Button>
            <Button onClick={handleUpdateSession} color="primary" autoFocus>
                {'CONTINUE'}
            </Button>
        </DialogActions>
      </Dialog>
  );
};

ConfirmationModal.propTypes = {
    openState: PropTypes.any,
    setOpenState: PropTypes.any,
    instructor: PropTypes.any,
    student: PropTypes.any,
    courseId: PropTypes.any,
    sessionId: PropTypes.any,
    startDateTime: PropTypes.any,
    endDateTime: PropTypes.any,
};

export default ConfirmationModal;