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
import { useMutation } from "@apollo/react-hooks";

const useStyles = makeStyles((theme) => ({}));

const NewAnnoucementsModal = ({ handleClose, open, subject, body, userId }) => {
  const classes = useStyles();
  const [sendEmailCheckbox, setSendEmailCheckbox] = useState(false);
  const [annoucementBody, setAnnoucementBody] = useState(body);
  const [annoucementSubject, setAnnoucementSubject] = useState(subject);
  const id = useParams();
  const user_id = userId.results[0].user.id

//   useEffect(() => {
//       setAnnoucementBody(body);
//       setAnnoucementSubject(subject);
//   },[annoucementBody, annoucementSubject]);

  const CREATE_ANNOUCEMENTS = gql`
    mutation CreateAnnoucement(
      $subject: String!,
      $body: String!,
      $courseId: ID!,
      $userId: ID!
    ) {
      __typename
      createAnnoucement(
        body: $body,
        courseId: $courseId,
        subject: $subject,
        userId: $userId
      ) {
        created
        annoucement {
            body
            id
            course {
              courseId
            }
            subject
            user {
              id
            }
          }
      }
    }
  `;

  //   mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  //     createReview(episode: $ep, review: $review) {
  //       stars
  //       commentary
  //     }
  //   }

  const [createAnnoucement, createAnnoucementResult] = useMutation(
    CREATE_ANNOUCEMENTS, {
      submit: () => handleClose(false),
      error: err => console.error(err) 
    }
  );

  const handleCloseForm = () => {
    handleClose(false);
  };

  const handleSubjectChange = useCallback((event) => {
    setAnnoucementSubject(event.target.value);
}, []);

const handleBodyChange = useCallback((event) => {
    setAnnoucementBody(event.target.value);
}, []);

console.log(annoucementBody)
console.log(annoucementSubject)
console.log(user_id)
console.log(id.id)

  const handlePostForm = async (event) => {
    event.preventDefault();
   
          const postAnnoucement = await createAnnoucement({
            variables: {
              subject: annoucementSubject,
              body: annoucementBody,
              userId: user_id,
              courseId: id.id
            },
          });
      
  };

  return (
    <Grid className="annoucement-container" container item md={12} spacing={2}>
                <Dialog aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title" className="popup" fullWidth
                maxWidth="xs" onClose={handleCloseForm} open={open}>
                <DialogTitle>
                    <TextField className="textfield" id="standard-name"
                        onChange={handleSubjectChange} placeholder="Subject"
                        value={annoucementSubject} />
                </DialogTitle>
                <DialogContent>
                    <InputBase className="note-body"
                        inputProps={{"aria-label": "naked"}} multiline
                        onChange={handleBodyChange}
                        placeholder="Body (required)" required rows={15}
                        value={annoucementBody} variant="filled" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm} variant="outlined">
                        Cancel
                    </Button>
                    <Button color="primary"
                        // disabled={!annoucementBody || createResults.loading}
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

export default NewAnnoucementsModal;
