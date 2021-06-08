import React, { useEffect, useState } from 'react';
 
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { useURLQuery } from 'utils';

const StripeResultPopup = () => {

    const urlParams = useURLQuery(); 
    const success = urlParams.get('success')

    const [displayPopup, setDisplayPopup] = useState(false);
    const [integrationSucceeded, setIntegrationSucceeded] = useState(success);

    useEffect(() => {
        if (integrationSucceeded !== null) {
            setIntegrationSucceeded(success);
            setDisplayPopup(true);
        }
    }, [integrationSucceeded]);

    const handleClose = () => {
        setDisplayPopup(false)
    }

    const successfulPopup = (
        <Dialog
            open={displayPopup}
            onClose={handleClose}
        >
            <DialogTitle disableTypography id='dialog-title'>
                Stripe Integration Successful!
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='dialog-description'>
                    You can now pay for sessions using Stripe on your account
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ResponsiveButton onClick={handleClose} color='primary'>
                    close
                </ResponsiveButton>
            </DialogActions>
        </Dialog>);

    const unsuccessfulPopup = (
        <Dialog
            open={displayPopup}
            onClose={handleClose}
        >
            <DialogTitle disableTypography id='dialog-title'>
                Stripe Integration Unsuccessful
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='dialog-description'>
                    Connection to Stripe timed out or was cancelled. If you still wish to set up Stripe with your account please try again.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ResponsiveButton onClick={handleClose} color='primary'>
                    close
                </ResponsiveButton>
            </DialogActions>
        </Dialog>);

    console.log(integrationSucceeded)
    return integrationSucceeded ? successfulPopup : unsuccessfulPopup;
}
export default StripeResultPopup;