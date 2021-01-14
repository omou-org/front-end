import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import { TableHeadSecondary } from "theme/ThemedComponents/Table/TableHeadSecondary";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import ChatOutlinedIcon from "@material-ui/icons/ChatOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import { fullName, USER_TYPES } from "../../../utils";
import { omouBlue, highlightColor } from "../../../theme/muiTheme";
import SessionEmailOrNotesModal from "./ModalTextEditor";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";

import AccessControlComponent from "../../OmouComponents/AccessControlComponent";
import ClassEnrollmentAccordion from "./ClassEnrollmentAccordion";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 1460,
    [theme.breakpoints.between("md", "lg")]: {
      minWidth: 910,
    },
    [theme.breakpoints.between("sm", "md")]: {
      minWidth: 677,
    },
  },
  carrot: {
    width: "4vw",
  },
  menuSelected: {
    "&:hover": { backgroundColor: highlightColor, color: "#28ABD5" },
    "&:focus": { backgroundColor: highlightColor },
  },
  dropdown: {
    border: "1px solid #43B5D9",
    borderRadius: "5px",
  },
  arrowIcon: {
    color: "#43B5D9",
    fontSize: "large",
  },
  noBorderBottom: {
    borderBottom: "none"
  },
  borderBottom: {
    borderBottom: "1px solid rgba(224, 224, 224, 1);"
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
  },
  studentAccordionSpacing: {
    width: "220px",
    paddingLeft: "31px",
  },
  studentRenderAccordionSpacing: {
    width: "202px",
  },
  parentAccordionSpacing: {
    width: "200px",
  },
  parentRenderAccordionSpacing: {
    width: "200px"
  },
  actionsRenderAccordionSpacing: {
    width: "200px!important",
    position: "relative",
    left: "2.5em",
  },
  emailRenderAccordionSpacing: {
    position: "relative",
    left: "9.5em",
  },
  notesRenderAccordionSpacing: {
    position: "relative",
    left: "10.5em",
    width: "3vw",
  },
}));

const ClassEnrollmentList = ({
  fullStudentName,
  accountType,
  studentId,
  studentInfo,
  parentAccountType,
  parentId,
  concatFullParentName,
  phoneNumber,
  handleOpenModal,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = React.useState(false);


  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleOpen = (e) => {
    e.preventDefault();
    const currentValue = e.currentTarget.value;
    const dataType = e.currentTarget.dataset.type;
    handleOpenModal(currentValue, dataType);
    setAnchorEl(null);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion
      expanded={expanded === `${studentId}`}
      onChange={handleChange(`${studentId}`)}
      classes={{root: classes.MuiAccordionroot}}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon style={{ color: omouBlue }} fontSize="large" />
        }
        aria-controls="panel1a-content"
        id={"studentinfo-" + studentId + "-details"}
        eventKey={"studentinfo-" + studentId + "-details"}
      >
        <TableRow key={fullStudentName} style={{ wordBreak: "break-word" }}>
          <TableCell
            component="th"
            scope="row"
            component={Link}
            to={`/accounts/${accountType.toLowerCase()}/${studentId}`}
            style={{ textDecoration: "none", fontWeight: 700 }}
            className={`${classes.studentRenderAccordionSpacing} ${classes.noBorderBottom}`}
          >
            {fullStudentName}
          </TableCell>
          <TableCell
            component={Link}
            to={`/accounts/${parentAccountType.toLowerCase()}/${parentId}`}
            style={{ textDecoration: "none" }}
            className={`${classes.parentRenderAccordionSpacing} ${classes.noBorderBottom}`}
          >
            {concatFullParentName}
          </TableCell>
          <TableCell
            className={classes.actionsRenderAccordionSpacing, classes.noBorderBottom}
          >{phoneNumber}</TableCell>
          <TableCell align="right" padding="none" size="small"
            className={classes.noBorderBottom}
          >
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              className={classes.emailRenderAccordionSpacing, classes.noBorderBottom}
            >
              <MailOutlineIcon style={{ color: "rgb(112,105,110)" }} />
            </Button>
            <AccessControlComponent
              permittedAccountTypes={[
                USER_TYPES.admin,
                USER_TYPES.instructor,
                USER_TYPES.receptionist,
              ]}
            >
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ list: classes.dropdown }}
              >
                <MenuItem
                  onClick={handleOpen}
                  className={classes.menuSelected}
                  value={studentId}
                  data-type={accountType}
                >
                  Email Student
                </MenuItem>
                <MenuItem
                  onClick={handleOpen}
                  className={classes.menuSelected}
                  value={parentId}
                  data-type={parentAccountType}
                >
                  Email Parent
                </MenuItem>
              </Menu>
            </AccessControlComponent>
          </TableCell>
          <TableCell
            align="right"
            padding="none"
            size="small"
            className={classes.emailRenderAccordionSpacing, classes.noBorderBottom}

          >
            <Button disabled>
              <ChatOutlinedIcon style={{ color: "rgb(112,105,110)" }} />
            </Button>
          </TableCell>
          <TableCell
            align="right"
            padding="none"
            size="small"
            className={classes.carrot, classes.noBorderBottom}
          >
          </TableCell>
        </TableRow>
      </AccordionSummary>
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
                <b>School:</b> Add a school to {fullStudentName}'s info!
              </p>
              <p>
                <b>School Teacher:</b> Add a school to your student's info!
              </p>
              <p>
                <b>Textbook used:</b> Add a school to your student's info!
              </p>
            </>
          )}
          </Typography>
          </AccordionDetails>
    </Accordion>
  );
};

const Studentenrollment = ({ enrollmentList, loggedInUser }) => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [typeOfAccount, setTypeOfAccount] = useState();
  const [userId, setUserId] = useState();

  const handleOpenModal = (currentValue, dataType) => {
    setUserId(currentValue);
    setTypeOfAccount(dataType);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <Grid item xs={12}>
      <TableContainer>
        <Table>
          <TableHeadSecondary>
            <TableRow className={classes.borderBottom} >
              <TableCell className={`${classes.studentAccordionSpacing} ${classes.noBorderBottom}`}>Student</TableCell>
              <TableCell className={`${classes.parentAccordionSpacing} ${classes.noBorderBottom}`}>Parent</TableCell>
              <TableCell className={classes.noBorderBottom}>Phone</TableCell>
            </TableRow>
          </TableHeadSecondary>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table className={classes.table}>   
          <TableBody>
            {enrollmentList
              .sort((firstStudent, secondStudent) =>
                firstStudent.student.user.lastName <
                secondStudent.student.user.lastName
                  ? -1
                  : 0
              )
              .map((students) => {
                const {
                  accountType,
                  primaryParent,
                  user,
                  studentschoolinfoSet,
                } = students.student;
                const fullStudentName = fullName(user);
                const studentId = user.id;
                const concatFullParentName = fullName(primaryParent.user);
                const parentAccountType = primaryParent.accountType;
                const phoneNumber = primaryParent.phoneNumber;
                const parentId = primaryParent.user.id;
                const parentEmail = primaryParent.user.email;
                const studentInfo = studentschoolinfoSet;

                return (
                 
                    <ClassEnrollmentList
                      fullStudentName={fullStudentName}
                      accountType={accountType}
                      studentId={studentId}
                      parentAccountType={parentAccountType}
                      parentId={parentId}
                      concatFullParentName={concatFullParentName}
                      phoneNumber={phoneNumber}
                      handleOpenModal={handleOpenModal}
                    />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <SessionEmailOrNotesModal
        open={modalOpen}
        handleCloseForm={handleCloseModal}
        accountType={typeOfAccount}
        userId={userId}
        origin="STUDENT_ENROLLMENT"
        posterId={loggedInUser}
      />
    </Grid>
  );
};

export default Studentenrollment;
