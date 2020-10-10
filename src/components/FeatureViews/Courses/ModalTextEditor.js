import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Input from "@material-ui/core/Input";
import { omouBlue } from "../../../theme/muiTheme";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_SESSION_NOTES } from "./ClassSessionView";
import { GET_ANNOUNCEMENTS } from "./CourseClasses";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    width: "37%",
    [theme.breakpoints.between("md", "lg")]: {
      width: "60%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "100%",
    },
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
    paddingRight: "3em",
  },
}));



const MUTATIONS = {
  "ANNOUNCEMENTS": gql`
  mutation CreateAnnouncement(
    $subject: String!
    $body: String!
    $courseId: ID!
    $userId: ID!
    $shouldEmail: Boolean
    $id: ID
  ) {
    __typename
    createAnnouncement(
      body: $body
      course: $courseId
      subject: $subject
      user: $userId
      shouldEmail: $shouldEmail
      id: $id
    ) {
      announcement {
        subject
        id
        body
        createdAt
        updatedAt
        poster {
          firstName
          lastName
        }
      }
    }
  }`,
  "STUDENT_ENROLLMENT": gql`
  mutation SendEmail(
    $body: String!
    $subject: String!
    $userId: ID!
    $posterId: ID!
  ) {
    __typename
    sendEmail(
      body: $body
      posterId: $posterId
      userId: $userId
      subject: $subject
    ) {
      created
    }
  }`,
  "COURSE_SESSIONS": gql`
  mutation createSessionNote(
    $body: String!
    $subject: String!
    $user: ID!
    $sessionId: ID!
    $id: ID
  ) {
    __typename
    createSessionNote(
      body: $body
      user: $user
      subject: $subject
      sessionId: $sessionId
      id: $id
    ) {
      sessionNote {
        id
        body
        subject
        poster {
          firstName
          lastName
          id
        }
        createdAt
        updatedAt
      }
    }
  }`
};

const QUERY_KEY = {
  "ANNOUNCEMENTS": "announcements",
  "COURSE_SESSIONS": "sessionNotes"
};

const MUTATION_KEY = {
  "ANNOUNCEMENTS": "createAnnouncement",
  "COURSE_SESSIONS": "createSessionNote"
};


const ModalTextEditor = ({
  open,
  handleCloseForm,
  userId,
  origin,
  posterId,
  sessionId,
  noteId,
  textSubject,
  textBody,
  buttonState,
  announcementId
}) => {
  const classes = useStyles();
  const [sendEmailCheckbox, setSendEmailCheckbox] = useState(false);
  const [sendSMSCheckbox, setSendSMSCheckbox] = useState(false);
  const [subject, setSubject] = useState(textSubject);
  const [body, setBody] = useState(textBody);
  const courseId = useParams();
  const poster_id = posterId.results[0].user.id;
  const QUERIES = {
    "ANNOUNCEMENTS": GET_ANNOUNCEMENTS,
    "COURSE_SESSIONS": GET_SESSION_NOTES
  }

  const QUERY_VARAIBLES = {
    "ANNOUNCEMENTS": {
      id: courseId.id
    },
    "COURSE_SESSIONS": {
      sessionId
    }
  };

  const MUTATION_VARIABLES = {
    "ANNOUNCEMENTS": {
      subject,
      body,
      id: announcementId,
      userId: poster_id,
      courseId: courseId.id,
      shouldEmail: sendEmailCheckbox,
    },
    "STUDENT_ENROLLMENT": {
      subject: subject,
      body: body,
      userId,
      posterId: poster_id,
    },
    "COURSE_SESSIONS": {
      subject: subject,
      body: body,
      user: poster_id,
      sessionId: sessionId,
      id: noteId,
    }
  };

const [mutateTextEditor, createResults] = useMutation(MUTATIONS[origin], {
    onCompleted: () =>  handleClose(false),
    update: (cache, { data }) => {
      const [newTextData] = Object.values(data[MUTATION_KEY[origin]]);
      const cachedTextData = cache.readQuery({
        query: QUERIES[origin],
        variables: QUERY_VARAIBLES[origin]
      })[QUERY_KEY[origin]];
      let updatedTextData = [...cachedTextData];
      const matchingIndex = updatedTextData.findIndex(({ id }) => id === newTextData.id);
      if (matchingIndex === -1) {
        updatedTextData = [...cachedTextData, newTextData];
      } else {
        updatedTextData[matchingIndex] = newTextData;
      };

      cache.writeQuery({
        data: {
          [QUERY_KEY[origin]]: updatedTextData,
        },
        query: QUERIES[origin],
        variables: QUERY_VARAIBLES[origin] 
      });
    }
  },
  );

  const handleClose = () => handleCloseForm(false);

  const handleSubmit = async e => {
    e.preventDefault();
      const createTextData = await mutateTextEditor({
        variables: MUTATION_VARIABLES[origin]
      })
    
  }

  const handleSubjectChange = useCallback((event) => {
    setSubject(event.target.value);
  }, []);

  const handleBodyChange = useCallback((event) => {
    setBody(event.target.value);
  }, []);
  
  const renderButtonText = () => {
    switch(buttonState) {
      case "edit":
          return "EDIT";
      case "post":
          return "POST" ;
      default: 
        return "ADD NOTE"
    }
  }

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
          defaultValue={buttonState === "edit" ? textSubject : ""}
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
          defaultValue={buttonState === "edit" ? textBody : ""}
          multiline
          rows={12}
        />
      </DialogContent>
      <DialogActions style={{ marginBottom: "2em" }}>
        <Button className={classes.cancelButton} onClick={handleClose}>
          Cancel
        </Button>
        <Button className={classes.submitButton} onClick={handleSubmit}>
          {origin === "STUDENT_ENROLLMENT" ? "Send Email" : 
          renderButtonText()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalTextEditor;
