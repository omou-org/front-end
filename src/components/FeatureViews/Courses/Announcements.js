import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Create, Cancel } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import Editor from "draft-js-plugins-editor";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import StrikethroughSIcon from "@material-ui/icons/StrikethroughS";
import ListIcon from "@material-ui/icons/List";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { highlightColor } from "../../../theme/muiTheme";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import moment from "moment";
import ModelTextEditor from "./ModalTextEditor";
import AccessControlComponent from "../../OmouComponents/AccessControlComponent";

import  AddIcon from '@material-ui/icons/Add';
import { GET_ANNOUNCEMENTS } from "./CourseClasses";
import { fullName, USER_TYPES, sortTime } from "../../../utils";
import theme, { omouBlue } from "../../../theme/muiTheme";
import Loading from "components/OmouComponents/Loading";

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';


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
  const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(body)));
  const classes = useStyles();
  const date = moment(updatedAt).format("MM/DD");
  const time = moment(updatedAt).format("h:mma");
  const subjectRef = useRef();
  const handleOpenForm = () => {
    handleEdit(true, id);
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
      <Editor editorState={editorState} customStyleMap={styleMap} readOnly/>
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
  const [editOrPost, setEditOrPost] = useState("post");
  const classes = useStyles();
  const { id } = useParams();
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

  const editAnnouncementQuery = {
    editGqlQuery: gql`
    query EditAnnouncement($announcementId: ID!) {
      announcement(announcementId: $announcementId) {
        body
        subject
        id
      }
    }`,
    editQueryVariables: {
      announcementId
    }
  }

  const announcementQuery = {
    gqlquery: GET_ANNOUNCEMENTS,
    queryVariables: {
      id,
    },
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
      courseId: id,
      shouldEmail: false,
    },
  };

  const skipConditionCheck = (query, queryVariable) => {
    return typeof query === "undefined" || typeof queryVariable.announcementId === "undefined" || queryVariable.announcementId === null
  };

  const { data, loading, error, refetch} = useQuery(GET_ANNOUNCEMENTS, {
    variables: {
      id,
    },
  });

  const icons = [
    {
      "name": "bold",
      "style": "BOLD",
      "icon": <FormatBoldIcon />
    },
    {
      "name": "italic",
      "style": "ITALIC",
      "icon": <FormatItalicIcon />
    },
    {
      "name": "underline",
      "style": "UNDERLINE",
      "icon": <FormatUnderlinedIcon />
    },
    {
      "name": "strikethrough",
      "style": "STRIKETHROUGH",
      "icon": <StrikethroughSIcon />
    },
    {
      "name": "unordered-list-item",
      "style": "unordered-list-item",
      "icon": <ListIcon />
    },
    {
      "name": "ordered-list-item",
      "style": "ordered-list-item",
      "icon": <FormatListNumberedIcon />
    },
    {
      "name": "highlight",
      "style": "HIGHLIGHT",
      "icon": <BorderColorIcon />
    },
  ];

  const [deleteAnnouncement, deleteAnnouncementResult] = useMutation(
    DELETE_ANNOUNCEMENT,
    {
      error: (err) => console.error(err),
      update: (cache, { data: { deleteAnnouncement: { id } }}) => {
        const cachedAnnouncement = cache.readQuery({
          query: GET_ANNOUNCEMENTS,
          variables: { id },
        })["announcements"];
        let updatedAnnouncements = [...cachedAnnouncement];
        const removedIndex = updatedAnnouncements.findIndex(announcement => announcement.id === id);
        updatedAnnouncements.splice(removedIndex, 1)
        cache.writeQuery({
          data: {
            ["announcements"]: updatedAnnouncements,
          },
          query: GET_ANNOUNCEMENTS,
          variables: { id },
        });
      },
    }
  );

  const handleEdit = (boolean, id, subject, body) => {
    setEditOrPost("edit");
    setAnnouncementId(id);
    setNewAnnouncementForm(boolean);
  };

  const handleClose = (boolean) => {
    setNewAnnouncementForm(boolean)
    setAnnouncementId(null)
    refetch()
  };

  const handleDeleteAnnouncement = async (id) => {
    const deletedAnnouncement = await deleteAnnouncement({
      variables: { id: id },
    });
  };
  
  const announcementRender = announcementsData
  .sort((firstVal, secondVal) => sortTime(firstVal.updatedAt, secondVal.updatedAt))

  if(loading) return <Loading />

  return (
    <Grid container justify="flex-start" data-active="inactive">
      <AccessControlComponent
        permittedAccountTypes={[
          USER_TYPES.admin,
          USER_TYPES.receptionist,
          USER_TYPES.instructor,
        ]}
      >
        <ResponsiveButton
          variant="outlined"
          className={classes.newNoteButton}
          onClick={() => {setNewAnnouncementForm(true, setEditOrPost("post")); setAnnouncementId(null)}}
          value="post"
          name="post"
          data-cy="new-announcement-button"
          startIcon={<AddIcon />}
        >
           New Announcement
        </ResponsiveButton>
      </AccessControlComponent>
      {announcementRender.map(({ poster, subject, body, updatedAt, id }) => (
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
      ))}
      <ModelTextEditor 
        handleCloseForm={handleClose}
        open={openNewAnnouncementForm}
        announcementId={announcementId}
        editPost={editAnnouncementQuery}
        origin="ANNOUNCEMENTS"
        posterId={loggedInUser}
        buttonState={editOrPost}
        mutation={announcementMutation}
        query={announcementQuery}
        iconArray={icons}
        shouldSkip={skipConditionCheck(editAnnouncementQuery.editGqlQuery, editAnnouncementQuery.editQueryVariables)}        
      />
    </Grid>
  );
};

export default Announcements;
