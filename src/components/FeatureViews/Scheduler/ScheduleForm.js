import PropTypes from 'prop-types';
import React from 'react';
import '../../../theme/theme.scss';
import './scheduler.scss';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
//Material UI Imports
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';

function ResourceForm({ onClose, selectedValue, open }) {
    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby='simple-dialog-title'
            open={open}
            maxWidth={'md'}
        >
            <FullCalendar
                timeZone='UTC'
                height={148}
                resourceLabelText='Instructor'
                plugins={[resourceTimelinePlugin]}
                defaultView='resourceTimeline'
                schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                resources={[
                    {
                        id: 'a',
                        title: 'Instructor Name',
                    },
                ]}
                events={[
                    {
                        id: '1',
                        resourceId: 'a', // matches resources id above
                        title: 'Some Event',
                        start: Date.now(),
                    },
                ]}
            />
        </Dialog>
    );
}

function ScheduleForm() {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>
            <Typography variant='body1'> {selectedValue}</Typography>
            <br />
            <ResponsiveButton
                variant='outlined'
                color='primary'
                onClick={handleClickOpen}
            >
                add more times
            </ResponsiveButton>
            <ResourceForm
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}

ScheduleForm.propTypes = {
    sessionView: PropTypes.string,
};

export default ScheduleForm;
