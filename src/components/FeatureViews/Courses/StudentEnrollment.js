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
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import { fullName } from "../../../utils";
import { omouBlue, highlightColor } from "../../../theme/muiTheme"

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

const Studentenrollment = ({ enrollmentList }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                const parentAccountType = primaryParent.accountType.toLowerCase();
                const phoneNumber = primaryParent.phoneNumber;
                const parentId = primaryParent.user.id;

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
                      to={`/accounts/${parentAccountType}/${parentId}`}
                      style={{ textDecoration: "none" }}
                    >
                      {concatFullParentName}
                    </TableCell>
                    <TableCell>{phoneNumber}</TableCell>
                    <TableCell align="right" padding="none" size="small">
                      <Button>
                      <MailOutlineIcon style={{color: "rgb(112,105,110)"}}/>
                      </Button>
                    </TableCell>
                    <TableCell
                      align="right"
                      padding="none"
                      size="small"
                      className={classes.icon}
                    >
                      <Button>
                      <ChatOutlinedIcon style={{color: "rgb(112,105,110)"}}/>
                      </Button>
                    </TableCell>
                    <TableCell
                      align="right"
                      padding="none"
                      size="small"
                      className={classes.carrot}
                    >
                      <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <ExpandMoreIcon style={{color: omouBlue}} fontSize="large"/>
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        classes={{list: classes.dropdown}}
                      >
                        <MenuItem onClick={handleClose} className={classes.menuSelected}>Email Student</MenuItem>
                        <MenuItem onClick={handleClose} className={classes.menuSelected}>Email Parent</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default Studentenrollment;
