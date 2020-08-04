import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import ChatIcon from "@material-ui/icons/Chat";
import ChatOutlinedIcon from "@material-ui/icons/ChatOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import { fullName } from "../../../utils";
import { omouBlue, highlightColor } from "../../../theme/muiTheme";
import SessionEmailOrNotesModal from "./SessionEmailOrNotesModal";

const useStyles = makeStyles({
  table: {
    minWidth: 1460,
  },
  carrot: {
    width: "4vw",
  },
  icon: {
    width: "3vw",
  },
  variablesInfo: {
    width: "15vw",
    color: "#666666",
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: ".875rem",
  },
  menuSelected: {
    "&:hover": { backgroundColor: highlightColor, color: "#28ABD5" },
    "&:focus": { backgroundColor: highlightColor },
  },
  dropdown: {
    border: "1px solid #43B5D9",
    borderRadius: "5px",
  },
});

const StudentEnrollmentList = ({
  fullStudentName,
  accountType,
  studentId,
  parentAccountType,
  parentId,
  concatFullParentName,
  phoneNumber,
  handleOpenModal,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  

  const handleClose = () => setAnchorEl(null);
  

  const handleOpen = (e) => {
    e.preventDefault();
    const currentValue = e.currentTarget.value;
    const dataType = e.currentTarget.dataset.type;
    handleOpenModal(currentValue, dataType);
    setAnchorEl(null);
  };

  return (
    <TableRow key={fullStudentName}>
      <TableCell
        component="th"
        scope="row"
        component={Link}
        to={`/accounts/${accountType.toLowerCase()}/${studentId}`}
        style={{ textDecoration: "none", fontWeight: 700 }}
      >
        {fullStudentName}
      </TableCell>
      <TableCell
        component={Link}
        to={`/accounts/${parentAccountType.toLowerCase()}/${parentId}`}
        style={{ textDecoration: "none" }}
      >
        {concatFullParentName}
      </TableCell>
      <TableCell>{phoneNumber}</TableCell>
      <TableCell align="right" padding="none" size="small">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MailOutlineIcon style={{ color: "rgb(112,105,110)" }} />
        </Button>
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
      </TableCell>
      <TableCell
        align="right"
        padding="none"
        size="small"
        className={classes.icon}
      >
        <Button disabled>
          <ChatOutlinedIcon style={{ color: "rgb(112,105,110)" }} />
        </Button>
      </TableCell>
      <TableCell
        align="right"
        padding="none"
        size="small"
        className={classes.carrot}
      >
        <Button>
          <ExpandMoreIcon style={{ color: omouBlue }} fontSize="large" />
        </Button>
      </TableCell>
    </TableRow>
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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSendEmail = () => {};

  return (
    <Grid item xs={12}>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.variablesInfo} align="left">
                Student
              </TableCell>
              <TableCell className={classes.variablesInfo} align="left">
                Parent
              </TableCell>
              <TableCell className={classes.variablesInfo} align="left">
                Phone
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollmentList
              .sort((firstStudent, secondStudent) =>
                firstStudent.student.user.lastName <
                secondStudent.student.user.lastName
                  ? -1
                  : 0
              )
              .map((students) => {
                const { accountType, primaryParent, user } = students.student;
                const fullStudentName = fullName(user);
                const studentId = user.id;
                const concatFullParentName = fullName(primaryParent.user);
                const parentAccountType = primaryParent.accountType;
                const phoneNumber = primaryParent.phoneNumber;
                const parentId = primaryParent.user.id;
                const parentEmail = primaryParent.user.email;

                return (
                  <StudentEnrollmentList
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
