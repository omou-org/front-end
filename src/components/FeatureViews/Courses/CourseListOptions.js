import React, { useState } from "react";
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
  },
  plusSpan: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#666666",
    paddingRight: ".25em",
  },
}));

const CourseListOptions = ({sessionId, loggedInUser}) => {
    // console.log(sessionId)
    // console.log(open)
    // console.log(loggedInUser)
  const classes = useStyles();
  const [readMore, setReadMore] = useState(false);
  const [expand, setExpand] = useState(false);
  const [noteId, setNoteId] = useState();
  const [open, setOpen] = useState(false);
  // const [open, setOpen] = useState(false);
  // const handleOpenForm = () => {
    // handleOpen(true, id, subject, body);
    // setOpen(true);
  // };

  const GET_SESSION_NOTES = gql`
  query getSessionNotes(
    $sessionId: ID!
  ) {
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

  const { data ,loading, error } = useQuery(GET_SESSION_NOTES, {
    variables: {
      sessionId: sessionId,
    }
  });

  if (loading) return <Loading />;
  if (error) return console.error(error.message);
  console.log(data)

  // const {} = data.sessio
  
  const handleOpenForm = (e) => {
    e.preventDefault();
    // handleOpen(true, id, subject, body);
    setOpen(true);
  };

  const handleCloseForm = (boolean) => {
    console.log(boolean)
    setOpen(boolean)
  }

  const handleDeleteForm = () => {
    //   handleDelete(subject)
  };

  const handleReadMoreClick = () => {
    setReadMore(true);
  };

  const string =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sed esse iste quisquam quidem, natus voluptatum ullam alias numquam harum, asperiores tempore doloribus qui. Ut neque commodi temporibus necessitatibus fugiat? Assumenda blanditiis ab unde libero molestias, quod voluptatibus iusto exercitationem neque, asperiores iste nostrum laboriosam atque eius distinctio quo pariatur ullam? Veritatis, omnis quae tempora aut incidunt eius natus non!";
  const hideString = string.substring(0, 110) + "...";
  console.log(expand)

  return (
    <div className={classes.root}>
      <Accordion elevation={0} square classes={{ expanded: classes.expanded }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick= {() => expand === false ? setExpand(true) : setExpand(false)}
          className={expand ? classes.accordionDivider : null}
        >
          <Typography className={classes.heading}>Notes</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container justify="flex-start">
        <Button className={classes.newNoteButton} onClick={handleOpenForm}><span className={classes.plusSpan}>+</span> New Note</Button>

        {data.sessionNotes.map(note => {
          const {body, createdAt, id, poster, subject} = note;
          const hideString = body.substring(0, 110) + "...";
            const date = moment(createdAt).format("MM/DD")
  const time = moment(createdAt).format("h:mma")

          return(
              <>
              <Grid item xs={12}>
                <Typography variant="h6" align="left">
                  {subject}
                </Typography>
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
                  <Typography noWrap variant="body1" align="left">
                    {body}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} style={{marginTop: "1.5em"}}>
                <Typography variant="subtitle2" align="left">
                  Posted by:{" "}
                  <span style={{ color: "#43B5D9", fontWeight: "550", padding: theme.spacing(1) }}>{fullName(poster)}</span> •{" "}
                  <span style={{padding: theme.spacing(1)}}>{date} <span style={{padding: theme.spacing(1)}}>•</span> {time}</span>
                </Typography>
              </Grid>
              </>
          )
        })}
                    </Grid>
                  </AccordionDetails>
      </Accordion>
      <Divider />
      <SessionEmailOrNotesModal open={open} handleCloseForm={handleCloseForm} posterId={loggedInUser} sessionId={sessionId} origin="COURSE_SESSIONS"/>
    </div>
  );
};

export default CourseListOptions;
