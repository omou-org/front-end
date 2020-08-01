import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Create, Cancel } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { highlightColor } from "../../../theme/muiTheme";
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import NewAnnouncementModal from "./NewAnnoucementsModal";
import { fullName } from "../../../utils";


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
    marginTop: "2em"
  },
  plusSpan: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#666666",
    paddingRight: ".25em",
  },
});

// const announcementData = [
//   {
//     user: "Katie Ho",
//     title: "Updated Business Hours",
//     body: "Due to COVID-19 situation, we have a new schedule",
//     date: "2/12",
//     time: "10:24a",
//   },
//   {
//     user: "Katie Ho",
//     title: "Parking Area",
//     body: "Due to temporary construction that is happening on Joy St.",
//     date: "1/10",
//     time: "8:04a",
//   },
//   {
//     user: "Katie Ho",
//     title: "New Year Gathering",
//     body: "Join us with other tutors and staff for early New Year",
//     date: "12/28",
//     time: "9:03a",
//   },
// ];

const AnnouncementCard = ({ id, fullName, subject, body, createdAt, handleOpen, handleDelete }) => {
  const classes = useStyles();
  const date = moment(createdAt).format("MM/DD")
  const time = moment(createdAt).format("h:mma")
  const handleOpenForm = () => {
    handleOpen(true, id, subject, body);
  };

  const handleDeleteForm = () => {
      handleDelete(subject)
  }
  
  return (
    <Grid
      className={classes.announcementContainer}
      container
      justify="flex-start"
      data-active="inactive"
    >
      <Grid item xs={6}>
        <Typography variant="h6" align="left" gutterBottom>
          {subject}
        </Typography>
      </Grid>
      <Grid item xs={6} style={{ textAlign: "right" }}>
        <Button onClick={handleOpenForm}>
          <Create style={{ color: "#43B5D9" }} />
        </Button>{" "}
        <Button onClick={handleDeleteForm}>
          <Cancel style={{ color: "#43B5D9" }} />
        </Button>
      </Grid>
      <Grid item xs={12} className={classes.announcementBody}>
        <Typography variant="body1" align="left">
          {body}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle2" align="left">
          Posted by:{" "}
          <span style={{ color: "#43B5D9", fontWeight: "550" }}>{fullName}</span> -{" "}
          {date} - {time}
        </Typography>
      </Grid>
    </Grid>
  );
};

const Announcements = ({announcementsData, loggedInUser, classTitle}) => {
  const [openNewAnnouncementForm, setNewAnnouncementForm] = useState(false);
  const [announcementId, setAnnouncementId] = useState();
  const [announcementSubject, setAnnouncementSubject] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementsRender, setAnnouncementsRender] = useState();
  const classes = useStyles();
  
  useEffect(() => {
    setAnnouncementsRender(announcementsData)
  }, [openNewAnnouncementForm]);
  
  // console.log(announcementsData)

  const handleOpen = (boolean, id, subject, body) => {
    setAnnouncementId(id);
    setNewAnnouncementForm(boolean);
    setAnnouncementSubject(subject);
    setAnnouncementBody(body);
  };

  const handleClose = (boolean) => {
    setNewAnnouncementForm(boolean);
  };

  const removeAnnouncement = (subject) => {

    };
  

  const handleDeleteAnnouncement = (id) => {
      removeAnnouncement(id);
      console.log("does this run?")
    //   console.log(announcementData)
  };

  return (
    <Grid container justify="flex-start" data-active="inactive">
      <Button className={classes.newNoteButton} onClick={() => setNewAnnouncementForm(true)}><span className={classes.plusSpan}>+</span> New Announcement</Button>
      {announcementsRender?.map(({ poster, subject, body, createdAt, id,  }) => (
        <>
          <AnnouncementCard
            key={id}
            id={id}
            fullName={fullName(poster)}
            subject={subject}
            body={body}
            createdAt={createdAt}
            handleOpen={handleOpen}
            handleDelete={handleDeleteAnnouncement}
          />
        </>
      ))}
      <NewAnnouncementModal
        handleClose={handleClose}
        open={openNewAnnouncementForm}
        id={announcementId}
        subject={announcementSubject}
        body={announcementBody}
        userId={loggedInUser}
      />
    </Grid>
  );
};

export default Announcements;
