import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/react-hooks";

import Button from "@material-ui/core/Button";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/EditOutlined";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/core/Menu";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Typography from "@material-ui/core/Typography";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import {useSearchParams} from "actions/hooks";
import "./Accounts.scss";
import { addDashes } from "./accountUtils";
import { ReactComponent as BirthdayIcon } from "../../birthday.svg";
import { ReactComponent as GradeIcon } from "../../grade.svg";
import { ReactComponent as IDIcon } from "../../identifier.svg";
import InstructorAvailability from "./InstructorAvailability";
import OutOfOffice from "./OutOfOffice";
import RoleChip from "./RoleChip";
import { ReactComponent as SchoolIcon } from "../../school.svg";
import { USER_TYPES } from "utils";
import { fullName } from "utils";

import generatePassword from "password-generator";
import ResetPassword from "components/Authentication/ResetPassword";

const ProfileHeading = ({ user }) => {
  console.log(user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openReset, setResetOpen] = useState(false);
  const [password, setPassword] = useState();

  const RESET_PASSWORD = gql`
    mutation ResetPassword($password: String!, $token: String!, $isParent: Boolean, $isInstructor: Boolean) {
        resetPassword(newPassword: $password, token: $token, setInstructor: $isInstructor, setParent: $isParent) {
            status
        }
    }`;

  const params = useSearchParams();

  const resetToken = params.get("token");
  console.log("resetToken", resetToken);

  const token = localStorage.getItem("token")
  console.log("token", token)

  const [resetPassword, resetStatus] = useMutation(RESET_PASSWORD); 

  const isAdmin =
    useSelector(({ auth }) => auth.accountType) === USER_TYPES.admin;

  const handleOpen = useCallback(({ currentTarget }) => {
    setAnchorEl(currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  //   const handleClickOpen = () => {
  //     seResetOpen(true);
  //   };

  const handleClosePassword = () => {
    setOpen(false);
    console.log("the password function");
  };

  const handleClosePasswordReset = () => {
    setOpen(false);
    setResetOpen(true);
	setPassword(generatePassword(8, false, /[\w\?\-]/));
	
	let isInstructor;
	let isParent;
	switch (user.role) {
		case "instructor":
			isInstructor = true;
			isParent = false;
			break;
		case "parent":
			isInstructor = false;
			isParent = true;
			break;
		default:
			break;
	}
	// resetPassword({
	// 	"variables": {
	// 		isInstructor,
	// 		isParent,
	// 		password: password,
	// 		"token": token 
	// 	},
	// });
  };

  const handleCloseReset = () => {
    setResetOpen(false);
    console.log("do I need");
  };

  console.log(user)

  const renderEditandAwayButton = () => (
    <Grid container item xs={4}>
      {user.role === "instructor" && (
        <Grid align="left" className="schedule-button" item xs={12}>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleOpen}
            variant="outlined"
          >
            <CalendarIcon />
            Schedule Options
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            onClose={handleClose}
            open={anchorEl !== null}
          >
            <InstructorAvailability
              button={false}
              instructorID={user.user_id}
            />
            <OutOfOffice button={false} instructorID={user.user_id} />
          </Menu>
        </Grid>
      )}
      {isAdmin && (
        <>
          <Grid component={Hidden} item mdDown xs={12}>
            <EditIcon
              className="editIcon" 
            />
            <div className = "editResetDiv">
            <Button
              className="edit"
              component={Link}
              to={`/form/${user.role}/${user.user_id}`}
            >
              Edit Profile
              {/* UPDATE */}
              {/* Only shows with hover */}
            </Button>
			{user.role === "student" ? (
            <Button
			  className="resetStudent"
			  disabled
              onClick={handleClickOpen}
            >
              Reset Password
            </Button>
			) : (
			<Button
              className="reset"
              onClick={handleClickOpen}
            >
              Reset Password
            </Button>
			)}
            </div>
            <Dialog
              open={open}
              onClose={handleClosePassword}
              maxWidth="xs"
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="center dialog-padding">
                {"Do you want to reset this user's password?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description"className ="center">
                  When you reset the password, a randomly generated password
                  will become the user's new password. This action cannot be
                  reverted. An automatic email will be sent out notifying the
                  user that their password has been reset. The user can also
                  reset their own password through the portal login page.
                </DialogContentText>
              </DialogContent>
              <DialogActions
			  	className = "dialog-actions"
			  >
				<Button 
				onClick={handleClosePassword} 
				variant="outlined">
                  cancel
                </Button>
                <Button
                  onClick={handleClosePasswordReset}
                  className="resetBtn"
                  autoFocus
                >
                  reset password
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openReset}
              onClose={handleCloseReset}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="center">
                {"Password has been reset."}
              </DialogTitle>
              <DialogContent className = "center dialog-padding">
                <DialogContentText id="alert-dialog-description">
                  The new password for {user.first_name} {user.last_name} ID #
                  {user.user_id} is
                </DialogContentText>
                <DialogContentText id="alert-dialog-description" className="passwordDisplay">
                  {password}
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                  Please write it down since you will not be able to access it
                  later
                </DialogContentText>
              </DialogContent>
              <DialogActions
			  className="dialog-actions"
			  >
				<Button 
				onClick={handleCloseReset}
				color="primary"
				>
                  done
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid component={Hidden} item lgUp xs={12}>
            <Button
              component={Link}
              to={`/form/${user.role}/${user.user_id}`}
              variant="outlined"
            ></Button>
          </Grid>
        </>
      )}
    </Grid>
  );

  const profileDetails = useMemo(() => {
    const IDRow = ({ width = 6 }) => (
      <>
        <Grid className="rowPadding" item xs={1}>
          <IDIcon className="iconScaling" />
        </Grid>
        <Grid className="rowPadding" item xs={width - 1}>
          <Typography className="rowText">
            #{user.summit_id || user.user_id}
          </Typography>
        </Grid>
      </>
    );

    //set up dialog like these
    const EmailRow = () => (
      <>
        <Grid className="emailPadding" item md={1}>
          <a href={`mailto:${user.email}`}>
            <EmailIcon />
          </a>
        </Grid>
        <Grid className="emailPadding" item md={5}>
          <a href={`mailto:${user.email}`}>
            <Typography className="rowText">{user.email}</Typography>
          </a>
        </Grid>
      </>
    );

    const PhoneRow = ({ width = 6 }) => (
      <>
        <Grid className="rowPadding" item xs={1}>
          <PhoneIcon className="iconScaling" />
        </Grid>
        <Grid className="rowPadding" item xs={width - 1}>
          <Typography className="rowText">
            {addDashes(user.phone_number)}
          </Typography>
        </Grid>
      </>
    );

    const BirthdayRow = () => (
      <>
        <Grid className="rowPadding" item xs={1}>
          <BirthdayIcon className="iconScaling" />
        </Grid>
        <Grid className="rowPadding" item xs={5}>
          <Typography className="rowText">{user.birthday}</Typography>
        </Grid>
      </>
    );

    switch (user.role) {
      case "student":
        return (
          <>
            <IDRow />
            <BirthdayRow />
            <Grid className="rowPadding" item xs={1}>
              <GradeIcon className="iconScaling" />
            </Grid>
            <Grid className="rowPadding" item xs={5}>
              <Typography className="rowText">Grade {user.grade}</Typography>
            </Grid>
            <PhoneRow />
            <Grid className="rowPadding" item xs={1}>
              <SchoolIcon className="iconScaling" />
            </Grid>
            <Grid className="rowPadding" item xs={5}>
              <Typography className="rowText">{user.school}</Typography>
            </Grid>
            <EmailRow />
          </>
        );
      case "instructor":
      case "receptionist":
        return (
          <>
            <IDRow width={12} />
            <PhoneRow width={12} />
            <EmailRow />
          </>
        );
      case "parent":
        return (
          <>
            <IDRow />
            <Grid className="rowPadding" item xs={1}>
              <MoneyIcon className="iconScaling" />
            </Grid>
            <Grid className="rowPadding" item xs={5}>
              <Typography className="rowText">${user.balance}</Typography>
            </Grid>
            <PhoneRow width={12} />
            <EmailRow />
          </>
        );
      default:
        return null;
    }
  }, [user]);

  return (
    <Grid alignItems="center" container item xs={12}>
      <Grid align="left" alignItems="center" container item xs={8}>
        <Grid className="profile-name" item style={{ paddingRight: 10 }}>
          <Typography variant="h4">{user.name}</Typography>
        </Grid>
        <Grid item>
          <Hidden smDown>
            <RoleChip role={user.role} />
          </Hidden>
        </Grid>
      </Grid>
      {renderEditandAwayButton()}
      <Grid
        container
        style={{
          margin: user.role === "instructor" ? "-10px 0" : "10px 0",
        }}
      >
        {profileDetails}
      </Grid>
    </Grid>
  );
};

ProfileHeading.propTypes = {
  user: PropTypes.shape({
    balance: PropTypes.string,
    birthday: PropTypes.string,
    email: PropTypes.string,
    grade: PropTypes.number,
    name: PropTypes.string,
    phone_number: PropTypes.string,
    role: PropTypes.oneOf(["instructor", "parent", "receptionist", "student"]),
    school: PropTypes.string,
    summit_id: PropTypes.string,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default ProfileHeading;
