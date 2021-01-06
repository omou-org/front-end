import React, {useState} from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { ResponsiveButton } from "../../../theme/ThemedComponents/Button/ResponsiveButton";
import { fullName } from "utils";
import generatePassword from "password-generator";


const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $userId: ID!) {
    resetPassword(newPassword: $password, userId: $userId) {
      status
    }
  }
`;

const ResetPasswordDialogs = ({ userInfo, isStudentProfile }) => {
  const [open, setOpen] = useState(false);
  const [openReset, setResetOpen] = useState(false);
  const [password, setPassword] = useState();

  const [resetPassword, resetStatus] = useMutation(RESET_PASSWORD);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClosePassword = () => {
    setOpen(false);
  };

  const handleCloseReset = () => {
    setResetOpen(false);
  };

  const handleClosePasswordReset = () => {
    setOpen(false);
    setResetOpen(true);
    const newPassword = generatePassword(8, false, /[\w\?\-]/);
    setPassword(newPassword);

    resetPassword({
      variables: {
        password: newPassword,
        userId: userInfo.user.id,
      },
    });
  };

  return (
    <>
      <ResponsiveButton
        className="reset"
        disabled={isStudentProfile}
        onClick={handleClickOpen}
      >
        Reset Password
      </ResponsiveButton>
      <Dialog
        open={open}
        onClose={handleClosePassword}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          disableTypography
          id="alert-dialog-title"
          className="center dialog-padding"
        >
          Do you want to reset this user's password?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="center">
            When you reset the password, a randomly generated password will
            become the user's new password. This action cannot be reverted. An
            automatic email will be sent out notifying the user that their
            password has been reset. The user can also reset their own password
            through the portal login page.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <ResponsiveButton
            onClick={handleClosePassword}
            variant="outlined"
            className="cancelBtn"
          >
            cancel
          </ResponsiveButton>
          <ResponsiveButton
            onClick={handleClosePasswordReset}
            className="resetBtn"
            autoFocus
          >
            reset password
          </ResponsiveButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReset}
        onClose={handleCloseReset}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          disableTypography
          id="alert-dialog-title"
          className="center"
        >
          Password has been reset.
        </DialogTitle>
        <DialogContent className="center dialog-padding">
          <DialogContentText id="alert-dialog-description">
            The new password for {fullName(userInfo.user)} ID #
            {userInfo.user.id} is
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-description"
            className="passwordDisplay"
          >
            {password}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Please write it down since you will not be able to access it later
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <ResponsiveButton onClick={handleCloseReset} className="doneBtn">
            done
          </ResponsiveButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetPasswordDialogs;
