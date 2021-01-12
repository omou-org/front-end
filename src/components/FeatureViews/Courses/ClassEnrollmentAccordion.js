import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Typography from "@material-ui/core/Typography";
import { omouBlue } from "../../../theme/muiTheme";

const useStyles = makeStyles({
  MuiTableCell: {
    root: {
      borderBottom: "none",
    },
  },
  MuiTableCell: {
    borderBottom: "none",
  },

  accordionNotes: {
    textAlign: "left",
    fontSize: "12 px !important",
    display: "inline-block",
  },
  accordionNotesBorder: {
    border: "1px #E0E0E0 solid",
    borderRadius: "25px",
    margin: "0px 24px 25px 24px",
    paddingTop: "0px",
    position: "absolute",
    width: "500em"
  },
  studentAccordionSpacing: {
    width: "320px!important",
    height: "30px!important",
    textAlign: "left",
  },
  parentAccordionSpacing: {
    height: "30px!important",
    textAlign: "left",
  },
  actionsAccordionSpacing: {
    width: "309px!important",
    height: "30px!important",
    textAlign: "left",
  },
  iconsAccordionSpacing: {
    height: "60px!important",
    paddingLeft: "25px",
  },
  arrowIcon: {
    color: "#43B5D9",
  },
});

const ClassEnrollmentAccordion = ({ studentInfo }) => {
  const classes = useStyles();
  return (
    // <Accordion>
    <div>
      {/* <AccordionSummary
        expandIcon={
          <ExpandMoreIcon style={{ color: omouBlue }} fontSize="large" />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      ></AccordionSummary> */}
      <AccordionDetails className={classes.accordionNotesBorder}>
        <Typography className={classes.accordionNotes} variant="body">
          {studentInfo ? (
            <>
              <p>
                <b>School:</b> {studentInfo.studentschoolinfoSet.school}
              </p>
              <p>
                <b>School Teacher:</b>{" "}
                {studentInfo.studentschoolinfoSet.teacher}
              </p>
              <p>
                <b>Textbook used:</b>{" "}
                {studentInfo.studentschoolinfoSet.textbook}
              </p>
            </>
          ) : (
            <>
              <p>
                <b>School:</b> Add a school to your student's info!
              </p>
              <p>
                <b>School Teacher:</b> Add a school to your student's info!
              </p>
              <p>
                <b>Textbook used:</b> Add a school to your student's info!
              </p>
            </>
          )}
          {/* <p>
            <b>School:</b> {studentInfo.studentschoolinfoSet.school ? studentInfo.studentschoolinfoSet.school : "Add a school to your student's info!"}
          </p>
          <p>
            <b>School Teacher:</b> {studentInfo.studentschoolinfoSet.teacher ? studentInfo.studentschoolinfoSet.teacher : "Add a school to your student's info!"}
          </p>
          <p>
            <b>Textbook used:</b> {studentInfo.studentschoolinfoSet.textbook ? studentInfo.studentschoolinfoSet.textbook : "Add a school to your student's info!"}
          </p> */}
        </Typography>
      </AccordionDetails>
    {/* // </Accordion> */}
    </div>
  );
};

export default ClassEnrollmentAccordion;
