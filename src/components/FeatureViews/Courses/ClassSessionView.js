import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Create, ExpandMore } from "@material-ui/icons";
import ModalTextEditor from "./ModalTextEditor";
import moment from "moment";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import AccessControlComponent from "../../OmouComponents/AccessControlComponent"
import { fullName, USER_TYPES, sortTime } from "../../../utils";
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

export const GET_SESSION_NOTES = gql`
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
      updatedAt
    }
  }
`;

const ClassSessionView = ({
  sessionId,
  loggedInUser,
}) => {
  const classes = useStyles();
  const [readMore, setReadMore] = useState(false);
  const [expand, setExpand] = useState(false);
  const [noteId, setNoteId] = useState();
  const [open, setOpen] = useState(false);
  const [noteBody, setNoteBody] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [buttonState, setButtonState] = useState("");

  const { data, loading, error } = useQuery(GET_SESSION_NOTES, {
    variables: { sessionId: sessionId, },
  });

  if (loading) return <Loading />;
  if (error) return console.error(error.message);

  const handleOpenForm = (e) => {
    e.preventDefault();
    setOpen(true);
    setButtonState("add")
  };

  const handleCloseForm = (boolean) => setOpen(boolean);

  const handleEdit = (e) => {
    e.preventDefault();
    const currentSubject = e.currentTarget.dataset.subject;
    const currentBody = e.currentTarget.dataset.body;
    const currentId = e.currentTarget.dataset.id;
    setNoteBody(currentBody);
    setNoteSubject(currentSubject);
    setNoteId(currentId);
    setOpen(true);
    setButtonState("edit");
  };

  const handleReadMoreClick = () => setReadMore(!readMore);

  const sessionNotesRender = data.sessionNotes
  .sort((firstVal, secondVal) => sortTime(firstVal.updatedAt, secondVal.updatedAt))

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
                setExpand(!expand)
              }
              className={expand && classes.accordionDivider}
            >
              <Typography className={classes.heading}>Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container justify="flex-start">
              <AccessControlComponent permittedAccountTypes={[USER_TYPES.admin, USER_TYPES.instructor, USER_TYPES.receptionist]}>
                  <Grid item xs={12} style={{ textAlign: "left" }}>
                    <Button
                      className={classes.newNoteButton}
                      onClick={handleOpenForm}
                    >
                      <span className={classes.plusSpan}>+</span> New Note
                    </Button>
                  </Grid>
                  </AccessControlComponent>

                {sessionNotesRender.map((note) => {
                  const { body, updatedAt, id, poster, subject } = note;
                  const hideString = body.substring(0, 60) + "...";
                  const date = moment(updatedAt).format("MM/DD");
                  const time = moment(updatedAt).format("h:mma");

                  return (
                    <>
                      <Grid item xs={6} style={{ marginTop: "1em" }}>
                        <Typography
                          variant="h6"
                          align="left"
                          value={subject}
                          key={id}
                        >
                          {subject}
                        </Typography>
                      </Grid>
                      <AccessControlComponent permittedAccountTypes={[USER_TYPES.admin, USER_TYPES.instructor, USER_TYPES.receptionist]}>
                        <Grid item xs={6} style={{ textAlign: "right" }}>
                          <Button
                            onClick={handleEdit}
                            data-subject={subject}
                            data-body={body}
                            data-id={id}
                          >
                            <Create style={{ color: "#43B5D9" }} />
                          </Button>
                        </Grid>
                      </AccessControlComponent>
                      <Grid item xs={12}>
                        <Typography variant="body1" align="left" style={{ wordBreak: "break-word" }}>
                        {
                          !readMore && body.length > 110 ? body.substring(0,60) + "..." : body
                        }
                        {body.length > 110 && (<a className={classes.anchorStyle} onClick={handleReadMoreClick}>
                          <span style={{ paddingRight: theme.spacing(1) }}>
                            { !readMore ? "Read More" : "Read Less" }
                          </span>
                        </a>)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: "1.5em" }}>
                        <Typography variant="subtitle2" align="left">
                          Posted by:
                          <span style={{ paddingRight: theme.spacing(1) }} />
                          <span
                            style={{
                              color: "#43B5D9",
                              fontWeight: "550",
                              padding: theme.spacing(1),
                            }}
                          >
                            {fullName(poster)}
                          </span>
                          •
                          <span style={{ padding: theme.spacing(1) }}>
                            {date}
                            <span style={{ padding: theme.spacing(1) }}>•</span>
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
          <ModalTextEditor
            open={open}
            handleCloseForm={handleCloseForm}
            posterId={loggedInUser}
            currentId={sessionId}
            origin="COURSE_SESSIONS"
            noteId={noteId}
            textSubject={noteSubject}
            textBody={{body: noteBody, setBody: setNoteBody}}
            buttonState={buttonState}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default ClassSessionView;
