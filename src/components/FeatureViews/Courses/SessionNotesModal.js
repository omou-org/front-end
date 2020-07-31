import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme) => ({
    rootContainer: {
        width: "37%",
    },
    inputUnderline: {
        "&after": {
            borderBottom: "0px"
        }
    }
}));


const SessionNotesModal = ({open, handleCloseForm}) => {
    const classes = useStyles();
    // console.log(handleCloseForm)
    console.log(open)
    const handleClose = () => {
        handleCloseForm(false)
    }


    return (
      <Dialog PaperProps={{classes: {root: classes.rootContainer}}} open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
          {/* <Grid container justify="flex-start">
              <Grid item xs={6}>
              </Grid>
          </Grid> */}
        <DialogContent>
         <Input placeholder="Subject" />
          <TextField
            InputProps={{classes: {underline: classes.inputUnderline}}}
            autoFocus
            margin="dense"
            id="name"
            placeholder="Body"
            type="email"
            fullWidth
            multiline
            rows={12}
            style={{border: "1px solid black"}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    )
};

export default SessionNotesModal;