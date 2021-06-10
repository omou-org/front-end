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
            setIntegrationSucceeded(success === 'true');
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
                Congratulations! 
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='dialog-description'>
                    Your business is now accepting credit card payments through Omou powered by Stripe. Please contact support if there are any issues.
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
                Whoops
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='dialog-description'>
                    Something went wrong when we were connecting to Stripe!
                    Please try again without refreshing or taking too long to complete the connection.
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