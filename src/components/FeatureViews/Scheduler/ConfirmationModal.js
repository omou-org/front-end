import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmationModal = ({ openState, setOpenState, subject, instructor, dateTime, room, student, courseId, sessionId }) => {
    console.log(courseId);
    console.log(sessionId);

  const handleClose = () => {
    setOpenState({ ...openState, confirmationState: false });
  };

  console.log({ subject, instructor, dateTime, room, student });

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
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default ConfirmationModal;