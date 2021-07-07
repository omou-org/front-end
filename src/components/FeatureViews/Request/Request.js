import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import NavLinkNoDup from 'components/Routes/NavLinkNoDup';
import Grid from '@material-ui/core/Grid';
import RequestTabs from './RequestTabs';

const Request = () => {

    // Make query for requests here
    const testRequestData = [
        {
            ID: "12345",
            createdAt: "May 25, 2021",
            status: "submitted",
            dates: "July 15 - August 15",
            times: "Wednesdays, Saturdays at 2:00 pm - 3:00 pm",
            subject: "Math",
            instructor: "Tim Yang",
            student: "Ben Miller"
        },
        {
            ID: "12346",
            createdAt: "May 26, 2021",
            status: "instructorApproved",
            dates: "July 15 - August 15",
            times: "Wednesdays, Saturdays at 2:00 pm - 3:00 pm",
            subject: "Math",
            instructor: "Tim Yang",
            student: "Ben Miller"
        },
        {
            ID: "12347",
            createdAt: "May 27, 2021",
            status: "verified",
            dates: "July 15 - August 15",
            times: "Wednesdays, Saturdays at 2:00 pm - 3:00 pm",
            subject: "Math",
            instructor: "Tim Yang",
            student: "Ben Miller"
        }
    ]

    return (
        <>
            <Grid container justify='space-between'>
                <Grid item>
                    <Typography variant='h1'>
                        Manage Tutoring Requests
                    </Typography>
                </Grid>
                <Grid item>
                    <ResponsiveButton
                        variant='outlined'
                        value='cancel'
                        component={NavLinkNoDup}
                        to={`/manage-tutoring-requests/schedule`}
                    >
                        Submit Request
                    </ResponsiveButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <RequestTabs requests={testRequestData}/>
            </Grid>
        </>
    );
};

export default Request;
