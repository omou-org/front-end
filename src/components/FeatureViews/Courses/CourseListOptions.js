import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Create, Cancel, ExpandMore } from "@material-ui/icons";
import SessionEmailOrNotesModal from "./SessionEmailOrNotesModal";
import moment from "moment";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import { fullName } from "../../../utils";
import theme from "../../../theme/muiTheme";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanded: {
    "&$expanded": {
      margin: "0px 0",
    },
  },
  anchorStyle: {
    marginLeft: ".25em",
    "&:hover": {
      textDecoration: "underline",
    },
    "&:focus": {
      color: "red",
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  accordionDivider: {
    borderBottom: "1px solid #C4C4C4",
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
  },
  plusSpan: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#666666",
    paddingRight: ".25em",
  },
}));

const CourseListOptions = ({ sessionId, loggedInUser }) => {
  const classes = useStyles();
  const [readMore, setReadMore] = useState(false);
  const [expand, setExpand] = useState(false);
  const [noteId, setNoteId] = useState();
  const [open, setOpen] = useState(false);
  const [noteBody, setNoteBody] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [buttonState, setButtonState] = useState("");

  const GET_SESSION_NOTES = gql`
    query getSessionNotes($sessionId: ID!) {
      __typename
      sessionNotes(sessionId: $sessionId) {
        id
        body
        subject
        poster {
          firstName
          lastName
          id
        }
        createdAt
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_SESSION_NOTES, {
    variables: {
      sessionId: sessionId,
    },
  });

  if (loading) return <Loading />;
  if (error) return console.error(error.message);
  console.log(data);

  const handleOpenForm = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleCloseForm = (boolean) => {
    console.log(boolean);
    setOpen(boolean);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const currentSubject = e.currentTarget.dataset.subject;
    const currentBody = e.currentTarget.dataset.body;
    const currentId = e.currentTarget.dataset.id;
    setNoteBody(currentBody);
    setNoteSubject(currentSubject);
    setNoteId(currentId);
    setOpen(true);
    setButtonState("edit")
  };

  const handleReadMoreClick = () => {
    setReadMore(true);
  };

  console.log(noteBody);
  console.log(noteId);
  console.log(noteSubject);

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={classes.root}>
          <Accordion
            elevation={0}
            square
            classes={{ expanded: classes.expanded }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              onClick={() =>
                expand === false ? setExpand(true) : setExpand(false)
              }
              className={expand ? classes.accordionDivider : null}
            >
              <Typography className={classes.heading}>Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container justify="flex-start">
                <Grid item xs={12} style={{ textAlign: "left" }}>
                  <Button
                    className={classes.newNoteButton}
                    onClick={handleOpenForm}
                  >
                    <span className={classes.plusSpan}>+</span> New Note
                  </Button>
                </Grid>

                {data.sessionNotes.map((note) => {
                  const { body, createdAt, id, poster, subject } = note;
                  const hideString = body.substring(0, 110) + "...";
                  const date = moment(createdAt).format("MM/DD");
                  const time = moment(createdAt).format("h:mma");

                  return (
                    <>
                      <Grid item xs={6} style={{ marginTop: "1em" }}>
                        <Typography variant="h6" align="left" value={subject}>
                          {subject}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: "right" }}>
                        <Button onClick={handleEdit} data-subject={subject} data-body={body} data-id={id}>
                          <Create style={{ color: "#43B5D9" }} />
                        </Button>{" "}
                      </Grid>
                      <Grid item xs={12}>
                        {readMore === false && body.length > 110 ? (
                          <Typography variant="body1" align="left">
                            {hideString}
                            <a
                              className={classes.anchorStyle}
                              onClick={handleReadMoreClick}
                            >
                              {" "}
                              Read More
                            </a>
                          </Typography>
                        ) : (
                          <Typography
                            variant="body1"
                            align="left"
                            style={{ wordBreak: "break-word" }}
                            value={body}
                          >
                            {body}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: "1.5em" }}>
                        <Typography variant="subtitle2" align="left">
                          Posted by:{" "}
                          <span
                            style={{
                              color: "#43B5D9",
                              fontWeight: "550",
                              padding: theme.spacing(1),
                            }}
                          >
                            {fullName(poster)}
                          </span>{" "}
                          •{" "}
                          <span style={{ padding: theme.spacing(1) }}>
                            {date}{" "}
                            <span style={{ padding: theme.spacing(1) }}>•</span>{" "}
                            {time}
                          </span>
                        </Typography>
                      </Grid>
                    </>
                  );
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Divider />
          <SessionEmailOrNotesModal
            open={open}
            handleCloseForm={handleCloseForm}
            posterId={loggedInUser}
            sessionId={sessionId}
            origin="COURSE_SESSIONS"
            noteId={noteId}
            noteSubject={noteSubject}
            noteBody={noteBody}
            buttonState={buttonState}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default CourseListOptions;
