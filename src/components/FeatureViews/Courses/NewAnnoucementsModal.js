import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import AddIcon from "@material-ui/icons/AddOutlined";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Loading from "components/OmouComponents/Loading";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { useQuery ,useMutation } from "@apollo/react-hooks";

const useStyles = makeStyles((theme) => ({}));

const NewAnnouncementsModal = ({ handleClose, open, subject, body, userId }) => {
  const classes = useStyles();
  const [sendEmailCheckbox, setSendEmailCheckbox] = useState(false);
  const [announcementBody, setAnnouncementBody] = useState(body);
  const [announcementSubject, setAnnouncementSubject] = useState(subject);
  const id = useParams();
  const user_id = userId.results[0].user.id
  console.log(userId)

//   useEffect(() => {
//       setAnnouncementBody(body);
//       setAnnouncementSubject(subject);
//   },[announcementBody, announcementSubject]);

  const GET_PARENT_INFO = gql`
  query getParentInfo($id: ID!) {
    __typename
    course(courseId: "$id") {
      enrollmentSet {
        student {
          primaryParent {
            user {
              email
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;  

  const CREATE_ANNOUNCEMENTS = gql`
    mutation CreateAnnouncement(
      $subject: String!,
      $body: String!,
      $courseId: ID!,
      $userId: ID!,
      $shouldEmail: Boolean,
    ) {
      __typename
      createAnnouncement(
        body: $body,
        course: $courseId,
        subject: $subject,
        user: $userId
        shouldEmail: $shouldEmail
      ) {
        created
        announcement {
            body
            id
            course {
              courseId
            }
            subject
            poster {
              id
            }
          }
      }
    }
  `;


  const [createAnnouncement, createAnnouncementResult] = useMutation(
    CREATE_ANNOUNCEMENTS, {
      submit: () => handleClose(false),
      error: err => console.error(err) 
    }
  );
  

  const handleCloseForm = () => {
    handleClose(false);
  };

  const handleCheckboxChange = e => setSendEmailCheckbox(e.target.checked)

  const handleSubjectChange = useCallback((event) => {
    setAnnouncementSubject(event.target.value);
}, []);

const handleBodyChange = useCallback((event) => {
    setAnnouncementBody(event.target.value);
}, []);

  const handlePostForm = async (event) => {
    event.preventDefault();
          const postAnnouncement = await createAnnouncement({
            variables: {
              subject: announcementSubject,
              body: announcementBody,
              userId: user_id,
              courseId: id.id,
              shouldEmail: sendEmailCheckbox,
            },
          });
         handleClose(false);
  };
  return (
    <Grid className="announcement-container" container item md={12} spacing={2}>
                <Dialog aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title" className="popup" fullWidth
                maxWidth="xs" onClose={handleCloseForm} open={open}>
                <DialogTitle>
                    <TextField className="textfield" id="standard-name"
                        onChange={handleSubjectChange} placeholder="Subject"
                        value={announcementSubject} />
                </DialogTitle>
                <DialogContent>
                    <InputBase className="note-body"
                        inputProps={{"aria-label": "naked"}} multiline
                        onChange={handleBodyChange}
                        placeholder="Body (required)" required rows={15}
                        value={announcementBody} variant="filled" />
                </DialogContent>
                <FormGroup>
                <FormControlLabel
        control={
          <Checkbox
            checked={sendEmailCheckbox}
            onChange={handleCheckboxChange}
            // name="checkedB"
            color="primary"
          />
        }
        label="Send as email to parents of students enrolled in class"
      />
                </FormGroup>
                <DialogActions>
                    <Button onClick={handleCloseForm} variant="outlined">
                        Cancel
                    </Button>
                    <Button color="primary"
                        // disabled={!announcementBody || createResults.loading}
                        onClick={handlePostForm} variant="outlined">
                            POST
                        {/* {createResults.loading ? "Saving..." : "Save"} */}
                    </Button>
                    {/* {createResults.error &&
                        <span style={{"float": "right"}}>
                            Error while saving!
                        </span>} */}
                </DialogActions>
            </Dialog>
      {/* <Dialog
        open={open}
        onClose={handleCloseForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePostForm} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog> */}
    </Grid>
  );
};

export default NewAnnouncementsModal;
