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
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import StrikethroughSIcon from "@material-ui/icons/StrikethroughS";
import ListIcon from "@material-ui/icons/List";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { fullName, USER_TYPES } from "../../../utils";
import { omouBlue, highlightColor } from "../../../theme/muiTheme";
import ModalTextEditor from "./ModalTextEditor";
import AccessControlComponent from "../../OmouComponents/AccessControlComponent";


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
  icon: {
    width: "3vw",
  },
  menuSelected: {
    "&:hover": { backgroundColor: highlightColor, color: "#28ABD5" },
    "&:focus": { backgroundColor: highlightColor },
  },
  dropdown: {
    border: "1px solid #43B5D9",
    borderRadius: "5px",
  },
}));

const ClassEnrollmentList = ({
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
    <TableRow key={fullStudentName} style={{ wordBreak: "break-word" }}>
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
        <AccessControlComponent 
        permittedAccountTypes={[USER_TYPES.admin, 
                                USER_TYPES.instructor, 
                                USER_TYPES.receptionist]}
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

const Studentenrollment = ({
  enrollmentList,
  loggedInUser,
}) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [typeOfAccount, setTypeOfAccount] = useState();
  const [recipientId, setRecipientId] = useState();
  const poster_id = loggedInUser.results[0].user.id
  
  const emailMutation = {
    gqlmutation: gql`
    mutation SendEmail(
      $body: String!
      $subject: String!
      $userId: ID!
      $posterId: ID!
    ) {
      __typename
      sendEmail(
        body: $body
        posterId: $posterId
        userId: $userId
        subject: $subject
      ) {
        created
      }
    }`,
    mutationVariables: {
      userId: recipientId,
      posterId: poster_id,
    }
  }

  const handleOpenModal = (currentValue, dataType) => {
    setRecipientId(currentValue);
    setTypeOfAccount(dataType);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const icons = [
    {
      "name": "bold",
      "style": "BOLD",
      "icon": <FormatBoldIcon />
    },
    {
      "name": "italic",
      "style": "ITALIC",
      "icon": <FormatItalicIcon />
    },
    {
      "name": "underline",
      "style": "UNDERLINE",
      "icon": <FormatUnderlinedIcon />
    },
    {
      "name": "strikethrough",
      "style": "STRIKETHROUGH",
      "icon": <StrikethroughSIcon />
    },
    {
      "name": "unordered-list-item",
      "style": "unordered-list-item",
      "icon": <ListIcon />
    },
    {
      "name": "ordered-list-item",
      "style": "ordered-list-item",
      "icon": <FormatListNumberedIcon />
    },
    {
      "name": "highlight",
      "style": "HIGHLIGHT",
      "icon": <BorderColorIcon />
    },
  ];

  return (
    <Grid item xs={12}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHeadSecondary>
            <TableRow>
              <TableCell>
                Student
              </TableCell>
              <TableCell>
                Parent
              </TableCell>
              <TableCell>
                Phone
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHeadSecondary>
          <TableBody>
            {enrollmentList
              .sort((firstStudent, secondStudent) =>
                firstStudent.student.user.lastName <
                secondStudent.student.user.lastName
                  ? -1 : 0
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
      <ModalTextEditor
        open={modalOpen}
        handleCloseForm={handleCloseModal}
        origin="STUDENT_ENROLLMENT"
        mutation={emailMutation}
        iconArray={icons}
      />
    </Grid>
  );
};

export default Studentenrollment;
