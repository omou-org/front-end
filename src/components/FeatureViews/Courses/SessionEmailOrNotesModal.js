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
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks"

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

const SessionEmailOrNotesModal = ({ open, handleCloseForm, accountType, userId, origin, posterId, sessionId }) => {
  const classes = useStyles();
  const [subject, setSubject] = useState();
  const [body, setBody] = useState();
  const poster_id = posterId.results[0].user.id


  const SEND_EMAIL = gql`
  mutation SendEmail(
    $body: String!,
    $subject: String!,
    $userId: ID!,
    $posterId: ID!,
  ) {
    __typename
    sendEmail(body: $body, posterId: $posterId, userId: $userId, subject: $subject) {
      created
    }
  }
  `;

  const CREATE_SESSION_NOTE = gql`
  mutation createSessionNote(
    $body: String!,
    $subject: String!,
    $user: ID!,
    $sessionId: ID!,
  ) {
    __typename
    createSessionNote(body: $body, user: $user, subject: $subject, sessionId: $sessionId) {
      created
      sessionNote {
        body
        subject
      }
    }
  }  
  `;

  const [sendEmail, sendEmailResult] = useMutation(
    SEND_EMAIL, {
      onCompleted: () => handleClose(false),
      error: err => console.error(err),
    }
  );

  const [createSessioNote, createSessionNoteResult] = useMutation(
    CREATE_SESSION_NOTE, {
      onCompleted: () =>  handleClose(false),
      error: err => console.error(err),
    }
  )

  const handleClose = () => {
    handleCloseForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(origin === "STUDENT_ENROLLMENT") {
          const sentEmail = await sendEmail({
            variables: {
              subject: subject,
              body: body,
              userId: userId,
              posterId: poster_id
            }
          });
    } else {
      const createdSessioNote = await createSessioNote({
        variables: {
          subject: subject,
          body: body,
          user: poster_id,
          sessionId: sessionId
        }
      });
    };
  };

  const handleSubjectChange = useCallback((event) => {
    setSubject(event.target.value);
}, []);

const handleBodyChange = useCallback((event) => {
    setBody(event.target.value);
}, []);


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
          onChange={handleSubjectChange}
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
          onChange={handleBodyChange}
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
        <Button className={classes.submitButton} onClick={handleSubmit}>
          {origin === "STUDENT_ENROLLMENT" ? "Send Email" : "ADD NOTE"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionEmailOrNotesModal;
