import React, { useCallback, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { fullName } from '../../../utils';
import DialogActions from '@material-ui/core/DialogActions';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';

function UnenrollButton({ enrollment }) {
    const { course, student, enrollmentBalance } = enrollment;

    const [unenrollWarningOpen, setUnenrollWarningOpen] = useState(false);

    const openUnenrollDialog = useCallback(() => {
        setUnenrollWarningOpen(true);
    }, []);

    const closeUnenrollDialog = useCallback(
        () => () => {
            setUnenrollWarningOpen(false);
            //TODO: migrate unenroll to graph ql
            // if (toUnenroll) {
            //     deleteEnrollment(enrollment)(dispatch);
            //     goToRoute(`/accounts/student/${studentID}`);
            // }
        },
        [setUnenrollWarningOpen]
    );

    return (
        <>
            <ResponsiveButton onClick={openUnenrollDialog} variant='outlined'>
                Unenroll
            </ResponsiveButton>
            <Dialog
                aria-labelledby='warn-unenroll'
                onClose={closeUnenrollDialog(false)}
                open={unenrollWarningOpen}
            >
                <DialogTitle disableTypography id='warn-unenroll'>
                    Unenroll in {course.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`You are about to unenroll in ${course.title} for
                            ${fullName(student.user)}. Performing this action
                            will credit $${enrollmentBalance} back to the
                            parent's account balance. Are you sure you want to
                            unenroll?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton
                        variant='outlined'
                        color='secondary'
                        onClick={closeUnenrollDialog(true)}
                    >
                        Yes, unenroll
                    </ResponsiveButton>
                    <ResponsiveButton
                        variant='outlined'
                        color='primary'
                        onClick={closeUnenrollDialog(false)}
                    >
                        Cancel
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </>
    );
}

UnenrollButton.propTypes = {
    enrollment: PropTypes.shape({
        course: PropTypes.shape({
            title: PropTypes.string,
        }),
        student: PropTypes.shape({
            user: PropTypes.object,
        }),
        enrollmentBalance: PropTypes.any,
    }).isRequired,
};

export default UnenrollButton;
