import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button"
import BackArrow from "@material-ui/icons/ArrowBack";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'; 
import "./scheduler.scss";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const NotEnrolledStudentsDialog = (props) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        props.history.goBack();
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="notEnrolledStudentDialog"
            >
                <ErrorOutlineIcon className="warningIcon"/>
                <DialogTitle id="alert-dialog-title">{"OOPS!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        It looks like there are no students Enrolled in that class. Please go back and choose another. (Clicking outside of the box will take you back)

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton 
                        onClick={handleClose}
                        startIcon={<BackArrow />}
                        variant='outlined'
                    >
                        back
                    </ ResponsiveButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default withRouter(NotEnrolledStudentsDialog)