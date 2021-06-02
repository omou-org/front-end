import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { Typography, Box } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
// import {darkBlue, darkGrey} from "../../../theme/muiTheme";
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';

const useStyles = makeStyles({
    dialogDimensions: {
        height: '28.125rem'
    },
    dialogContentDimensions: {
        margin: '1.25em'
    }
  });

const SaveSessionEditsButton = ({
    children,
    courseConfirmationData,
    updateSession,
    isAll,
}) => {
    let history = useHistory();
    const { session_id } = useParams();
    const classes = useStyles();

    const [modalState, setModalState] = useState({
        leaveState: false,
        confirmationState: false,
    });

    const handleClose = () => {
        setModalState({ ...modalState, confirmationState: false });
        if (isAll) {
            history.push(`/scheduler`);
        } else {
            history.push(`/scheduler/session/${session_id}`);
        }
    };

    const handleSave = () => {
        updateSession();
        handleClose();
    };

    const handleOpenModal = (e) => {
        const { value } = e.currentTarget;
        if (value === 'confirm') {
            setModalState({ ...modalState, confirmationState: true });
        }

        if (value === 'cancel') {
            setModalState({ ...modalState, leaveState: true });
        }
    };

    return (
        <>
            <ResponsiveButton
                variant='contained'
                onClick={handleOpenModal}
                value='confirm'
                // disabled={!checkAllFields}
            >
                Save
            </ResponsiveButton>
            <Dialog
                open={modalState.confirmationState}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                maxWidth='xs'
                classes={{ paperWidthXs: classes.dialogDimensions }}
            >
                <Grid item xs={12} className={classes.dialogContentDimensions}>
                <DialogTitle id='alert-dialog-title'>
                    <Typography variant='h3' align='left'>
                        Are you sure?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography align='left'>
                    {`Summary of our updated session(s)`} <Box component='span' fontWeight='fontWeightMedium'>{courseConfirmationData}</Box>{':'}
                    </Typography>
                </DialogContent>
				<DialogTitle style={{ padding: '.25em 1.5em', marginTop: '1em' }}>
					<Typography variant='h4'>
					{"Schedule update:"}
					</Typography>
				</DialogTitle>
                <DialogContent>{children}</DialogContent>
                <DialogContent>
                    <Typography variant='h4' style={{ marginBottom: '.5em', marginTop: '1em'}}>
                        {"Balance update:"}
                    </Typography>
                    <Typography variant='body1'>
                        {"There will not be any balance adjustment to the student's account."}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        {'CANCEL'}
                    </Button>
                    <Button onClick={handleSave} color='primary' autoFocus>
                        {'CONTINUE'}
                    </Button>
                </DialogActions>
                </Grid>
            </Dialog>
        </>
    );
};

SaveSessionEditsButton.propTypes = {
    children: PropTypes.any,
    courseConfirmationData: PropTypes.string,
    updateSession: PropTypes.func,
    isAll: PropTypes.bool,
};

export default SaveSessionEditsButton;
