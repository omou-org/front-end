import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Create, Cancel } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { highlightColor } from "../../../theme/muiTheme";
import NewAnnoucementModal from "./NewAnnoucementsModal";

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
});

const announcementData = [
  {
    user: "Katie Ho",
    title: "Updated Business Hours",
    body: "Due to COVID-19 situation, we have a new schedule",
    date: "2/12",
    time: "10:24a",
  },
  {
    user: "Katie Ho",
    title: "Parking Area",
    body: "Due to temporary construction that is happening on Joy St.",
    date: "1/10",
    time: "8:04a",
  },
  {
    user: "Katie Ho",
    title: "New Year Gathering",
    body: "Join us with other tutors and staff for early New Year",
    date: "12/28",
    time: "9:03a",
  },
];

const AnnouncementCard = ({ id, user, title, body, date, time, handleOpen, handleDelete }) => {
  const classes = useStyles();
  const handleOpenForm = () => {
    handleOpen(true, id, title, body);
  };

  const handleDeleteForm = () => {
      handleDelete(title)
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
          {title}
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
          <span style={{ color: "#43B5D9", fontWeight: "550" }}>{user}</span> -{" "}
          {date} - {time}
        </Typography>
      </Grid>
    </Grid>
  );
};

const Announcements = () => {
  const [openNewAnnoucementForm, setNewAnnoucementForm] = useState(false);
  const [annoucementId, setAnnoucementId] = useState();
  const [annoucementTitle, setAnnoucementTitle] = useState("");
  const [annoucementBody, setAnnoucementBody] = useState("");

  const handleOpen = (boolean, id, title, body) => {
    setAnnoucementId(id);
    setNewAnnoucementForm(boolean);
    setAnnoucementTitle(title);
    setAnnoucementBody(body);
  };

  const handleClose = (boolean) => {
    setNewAnnoucementForm(boolean);
  };

  const removeAnnoucement = (title) => {
      announcementData.indexOf(title)
    };
  

  const handleDeleteAnnoucement = (id) => {
      removeAnnoucement(id);
      console.log("does this run?")
      console.log(announcementData)
  };

  return (
    <Grid container justify="flex-start" data-active="inactive">
      {announcementData.map(({ user, title, body, date, time }, i) => (
        <>
          <AnnouncementCard
            key={i}
            id={i}
            user={user}
            title={title}
            body={body}
            date={date}
            time={time}
            handleOpen={handleOpen}
            handleDelete={handleDeleteAnnoucement}
          />
        </>
      ))}
      <NewAnnoucementModal
        handleClose={handleClose}
        open={openNewAnnoucementForm}
        id={annoucementId}
        title={annoucementTitle}
        body={annoucementBody}
      />
    </Grid>
  );
};

export default Announcements;
