import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import NavLinkNoDup from 'components/Routes/NavLinkNoDup';
import Grid from '@material-ui/core/Grid';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import AppBar from '@material-ui/core/AppBar';

const Request = () => {
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
{/*
            <AppBar>
                <Tabs value={value}>
                    <Tab label='Request Status' />
                    <Tab label='Request History' />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                Request Status
            </TabPanel>
            <TabPanel value={value} index={1}>
                Request History
            </TabPanel>
*/}
        </>
    );
};

export default Request;
