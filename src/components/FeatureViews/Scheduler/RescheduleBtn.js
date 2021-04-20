import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { NavLink, useParams } from 'react-router-dom';
import React, { useState } from 'react';

const EDIT_ALL_SESSIONS = 'all';
const EDIT_CURRENT_SESSION = 'current';

export const RescheduleBtn = () => {
    const { session_id } = useParams();
    const [edit, setEdit] = useState(false);
    const [editSelection, setEditSelection] = useState(EDIT_CURRENT_SESSION);

    const handleEditToggle = (cancel) => (event) => {
        event.preventDefault();
        if (!cancel && edit) {
            handleToggleEditing(editSelection);
        } else {
            setEdit(!edit);
        }
    };

    const handleToggleEditing = (editSelection) => {
        this.setState((oldState) => {
            return {
                ...oldState,
                editing: !oldState.editing,
                editSelection: editSelection,
            };
        });
    };

    const handleEditSelection = (event) => {
        setEditSelection(event.target.value);
    };

    return (
        <>
            <ResponsiveButton
                color='primary'
                onClick={handleEditToggle(true)}
                variant='contained'
            >
                Reschedule
            </ResponsiveButton>
            <Dialog
                aria-describedby='form-dialog-description'
                aria-labelledby='form-dialog-title'
                className='session-view-modal'
                fullWidth
                maxWidth='xs'
                onClose={handleEditToggle(true)}
                open={edit}
            >
                <DialogTitle disableTypography id='form-dialog-title'>
                    Edit Session
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <RadioGroup
                        aria-label='delete'
                        name='delete'
                        onChange={handleEditSelection}
                        value={editSelection}
                    >
                        <FormControlLabel
                            control={<Radio color='primary' />}
                            label='This Session'
                            labelPlacement='end'
                            value={EDIT_CURRENT_SESSION}
                        />
                        <FormControlLabel
                            control={<Radio color='primary' />}
                            label='All Sessions'
                            labelPlacement='end'
                            value={EDIT_ALL_SESSIONS}
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={handleEditToggle(true)}>
                        Cancel
                    </Button>
                    <Button
                        color='primary'
                        component={NavLink}
                        to={{
                            pathname: `/scheduler/session/${session_id}/edit`,
                            state: { allOrCurrent: editSelection },
                        }}
                    >
                        Confirm to Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
