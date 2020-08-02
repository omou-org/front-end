import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import { omouBlue } from "../../../theme/muiTheme";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    width: "37%",
  },
  inputUnderline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
  textFieldStyle: {
    border: "1px solid #666666",
    borderRadius: "5px",
  },
  textBox: {
    paddingTop: ".625em",
    paddingLeft: ".625em",
    paddingRight: ".625em",
  },
  cancelButton: {
    color: "#747D88",
    border: "1px solid #747D88",
    borderRadius: "5px",
    fontSize: ".75rem",
    fontFamily: "Roboto",
    fontWeight: 500,
    width: "17%",
    marginRight: ".75em",
  },
  submitButton: {
    backgroundColor: omouBlue,
    borderRadious: "5px",
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: ".75rem",
    width: "17%",
    color: "#FFFFFF",
    marginRight: "4em",
  },
  textArea: {
    padding: "56px 56px 120px 56px",
  },
  subjectUnderline: {
    marginBottom: ".75em", 
    borderBottom: "1px solid #666666",
    paddingRight: "3em" 
 },
}));

const SessionEmailOrNotesModal = ({ open, handleCloseForm }) => {
  const classes = useStyles();
  console.log(open);
  const handleClose = () => {
    handleCloseForm(false);
  };

  return (
    <Dialog
      PaperProps={{ classes: { root: classes.rootContainer }, square: true }}
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
    >
      <DialogContent classes={{ root: classes.textArea }}>
        <Input
          placeholder="Subject"
          className={classes.subjectUnderline}
          disableUnderline
        />
        <TextField
          InputProps={{
            disableUnderline: true,
            classes: { inputMarginDense: classes.textBox },
          }}
          autoFocus
          className={classes.textFieldStyle}
          margin="dense"
          id="name"
          placeholder="Body"
          type="email"
          fullWidth
          multiline
          rows={12}
        />
      </DialogContent>
      <DialogActions style={{marginBottom: "2em"}}>
        <Button className={classes.cancelButton} onClick={handleClose}>
          Cancel
        </Button>
        <Button className={classes.submitButton} onClick={handleClose}>
          Add Note
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionEmailOrNotesModal;
