import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Create, Cancel } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import Editor from "draft-js-plugins-editor";
import { highlightColor } from "../../../theme/muiTheme";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import moment from "moment";
import ModelTextEditor from "./ModalTextEditor";
import AccessControlComponent from "../../OmouComponents/AccessControlComponent";
import { GET_ANNOUNCEMENTS } from "./CourseClasses";
import { fullName, USER_TYPES, sortTime } from "../../../utils";
import theme, { omouBlue } from "../../../theme/muiTheme";

const useStyles = makeStyles({
  announcementContainer: {
    padding: "10px",
    fontFamily: "Arial",
    fontStyle: "normal",
    "&:hover": {
      backgroundColor: highlightColor,
    },
  },
  announcementBody: {
    paddingTop: "10px",
    paddingBottom: "20px",
  },
  newNoteButton: {
    marginBottom: "2em",
    border: "1px solid #999999",
    borderRadius: "5px",
    fontSize: ".75rem",
    fontWeight: 300,
    fontFamily: "Roboto",
    height: "2.5em",
    marginTop: "2em",
    marginLeft: ".75em",
  },
  plusSpan: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#666666",
    paddingRight: ".25em",
  },
});

const styleMap = {
  HIGHLIGHT: {
    backgroundColor: "yellow",
  },
};

const AnnouncementCard = ({
  id,
  fullName,
  subject,
  body,
  updatedAt,
  handleEdit,
  handleDelete,
}) => {
  const decode = EditorState.createWithContent(convertFromRaw(JSON.parse(body)))
  const [editorState] = useState(decode);
  const classes = useStyles();
  const date = moment(updatedAt).format("MM/DD");
  const time = moment(updatedAt).format("h:mma");
  const subjectRef = useRef();
  const handleOpenForm = () => {
    const currentSubject = subjectRef.current.textContent;
    const currentBody = convertToRaw(editorState.getCurrentContent())
    handleEdit(true, id, currentSubject, currentBody);
  };
  const handleDeleteForm = () => handleDelete(id);

  return (
    <Grid
      className={classes.announcementContainer}
      container
      justify="flex-start"
      data-active="inactive"
    >
      <Grid item xs={6}>
        <Typography variant="h6" align="left" gutterBottom ref={subjectRef}>
          {subject}
        </Typography>
      </Grid>
      <Grid item xs={6} style={{textAlign: "end"}}>
      <AccessControlComponent
        permittedAccountTypes={[
          USER_TYPES.admin,
          USER_TYPES.receptionist,
          USER_TYPES.instructor,
        ]}
      >
        <Button onClick={handleOpenForm} name="edit" value="edit">
          <Create style={{ color: omouBlue }} />
        </Button>
        <Button onClick={handleDeleteForm}>
          <Cancel style={{ color: omouBlue }} />
        </Button>
      </AccessControlComponent>
      </Grid>
      <Grid item xs={12} className={classes.announcementBody}>
      <Editor editorState={editorState} customStyleMap={styleMap} readOnly />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" align="left">
          Posted by:
          <span
            style={{
              color: omouBlue,
              fontWeight: "550",
              padding: theme.spacing(1),
            }}
          >
            {fullName}
          </span>
          <span style={{ padding: theme.spacing(1) }}>• </span>
          <span style={{ padding: theme.spacing(1) }}>
            {date} <span style={{ padding: theme.spacing(1) }}>•</span> {time}
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
};

const Announcements = ({
  announcementsData,
  loggedInUser,
}) => {
  const [openNewAnnouncementForm, setNewAnnouncementForm] = useState(false);
  const [announcementId, setAnnouncementId] = useState();
  const [announcementSubject, setAnnouncementSubject] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [editOrPost, setEditOrPost] = useState("post");
  const classes = useStyles();
  const courseId = useParams();
  const userId = loggedInUser.results[0].user.id;

  const DELETE_ANNOUNCEMENT = gql`
    mutation removeAnnouncement($id: ID!) {
      __typename
      deleteAnnouncement(id: $id) {
        deleted
        id
      }
    }
  `;

  const announcementQuery = {
    gqlquery: GET_ANNOUNCEMENTS,
    queryVariables: {
      id: courseId.id,
    },
    queryTitle: "announcements"
  };

  const announcementMutation = {
    gqlmutation: gql`mutation CreateAnnouncement(
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
    mutationVariables: {
      id: announcementId,
      userId,
      courseId: courseId.id,
      shouldEmail: false,
    },
    mutationTitle: "createAnnouncement",
  }

  const [deleteAnnouncement, deleteAnnouncementResult] = useMutation(
    DELETE_ANNOUNCEMENT,
    {
      error: (err) => console.error(err),
      update: (cache, { data: { deleteAnnouncement: { id } }}) => {
        const cachedAnnouncement = cache.readQuery({
          query: GET_ANNOUNCEMENTS,
          variables: { id: courseId.id },
        })["announcements"];
        let updatedAnnouncements = [...cachedAnnouncement];
        const removedIndex = updatedAnnouncements.findIndex(announcement => announcement.id === id);
        updatedAnnouncements.splice(removedIndex, 1)
        cache.writeQuery({
          data: {
            ["announcements"]: updatedAnnouncements,
          },
          query: GET_ANNOUNCEMENTS,
          variables: { id: courseId.id },
        });
      },
    }
  );

  const handleEdit = (boolean, id, subject, body) => {
    setEditOrPost("edit");
    setAnnouncementId(id);
    setNewAnnouncementForm(boolean);
    setAnnouncementSubject(subject);
    setAnnouncementBody(body);
  };

  const handleClose = (boolean) => setNewAnnouncementForm(boolean);

  const handleDeleteAnnouncement = async (id) => {
    const deletedAnnouncement = await deleteAnnouncement({
      variables: { id: id },
    });
  };

  const announcementRender = announcementsData
  .sort((firstVal, secondVal) => sortTime(firstVal.updatedAt, secondVal.updatedAt))

  return (
    <Grid container justify="flex-start" data-active="inactive">
      <AccessControlComponent
        permittedAccountTypes={[
          USER_TYPES.admin,
          USER_TYPES.receptionist,
          USER_TYPES.instructor,
        ]}
      >
        <Button
          className={classes.newNoteButton}
          onClick={() => setNewAnnouncementForm(true, setEditOrPost("post"))}
          value="post"
          name="post"
          data-cy="new-announcement-button"
        >
          <span className={classes.plusSpan}>+</span> New Announcement
        </Button>
      </AccessControlComponent>
      {announcementRender.map(({ poster, subject, body, updatedAt, id }) => (
        <>
          <AnnouncementCard
            key={id}
            id={id}
            fullName={fullName(poster)}
            subject={subject}
            body={body.replace(/'/g, '"')}
            updatedAt={updatedAt}
            handleEdit={handleEdit}
            handleDelete={handleDeleteAnnouncement}
          />
        </>
      ))}
      <ModelTextEditor 
        handleCloseForm={handleClose}
        open={openNewAnnouncementForm}
        announcementId={announcementId}
        textSubject={announcementSubject}
        textBody={announcementBody}
        origin="ANNOUNCEMENTS"
        posterId={loggedInUser}
        buttonState={editOrPost}
        mutation={announcementMutation}
        query={announcementQuery}        
      />
    </Grid>
  );
};

export default Announcements;
