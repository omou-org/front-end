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
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

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
}));

const CourseListOptions = ({sessionId, open, handleCloseForm}) => {
    console.log(sessionId)
    console.log(open)
  const classes = useStyles();
  const [readMore, setReadMore] = useState(false);
  // const [open, setOpen] = useState(false);
  // const handleOpenForm = () => {
    // handleOpen(true, id, subject, body);
    // setOpen(true);
  // };
  

  const handleDeleteForm = () => {
    //   handleDelete(subject)
  };

  const handleReadMoreClick = () => {
    setReadMore(true);
  };

  const string =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sed esse iste quisquam quidem, natus voluptatum ullam alias numquam harum, asperiores tempore doloribus qui. Ut neque commodi temporibus necessitatibus fugiat? Assumenda blanditiis ab unde libero molestias, quod voluptatibus iusto exercitationem neque, asperiores iste nostrum laboriosam atque eius distinctio quo pariatur ullam? Veritatis, omnis quae tempora aut incidunt eius natus non!";
  const hideString = string.substring(0, 110) + "...";

  return (
    <div className={classes.root}>
      <Accordion elevation={0} square classes={{ expanded: classes.expanded }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Notes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container justify="flex-start">
            <Grid item xs={6}>
              <Typography variant="h6" align="left">
                Test
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.buttons}>
              <Button>
                <Create style={{ color: "#43B5D9" }} />
              </Button>{" "}
              <Button onClick={handleDeleteForm}>
                <Cancel style={{ color: "#43B5D9" }} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              {readMore === false ? (
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
                <Typography variant="body1" align="left">
                  {string}
                </Typography>
              )}
            </Grid>
            <Grid item xs={3} style={{marginTop: "1.5em"}}>
              <Typography variant="subtitle2" align="left">
                Posted by:{" "}
                {/* <span style={{ color: "#43B5D9", fontWeight: "550" }}>{fullName}</span> -{" "} */}
                {/* {date} - {time} */}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Divider />
      <SessionEmailOrNotesModal open={open} handleCloseForm={handleCloseForm} />
    </div>
  );
};

export default CourseListOptions;
