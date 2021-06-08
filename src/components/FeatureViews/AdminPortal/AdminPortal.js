import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import './AdminPortal.scss';
import AdminActionCenter from './AdminActionCenter';
import AdminViewsRoutes from 'components/Routes/AdminViewsRoutes';
import Box from '@material-ui/core/Box';
import StripeButton from 'components/OmouComponents/3rdPartyCustomComponents/StripeButton';
import StripeResultPopup from 'components/OmouComponents/3rdPartyCustomComponents/StripeResultPopup';

const AdminPortal = () => (
    <form>
        <Grid container layout='row'>
            <Grid item xs={12} container justify="space-between" alignItems="center">
                <Box paddingTop='16px'>
                    <Typography align='left' variant='h1'>
                        Admin Portal
                    </Typography>
                </Box>
                <Grid item>
                    <StripeButton/>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AdminActionCenter />
            </Grid>
            <Grid item xs={12}>
                <AdminViewsRoutes />
            </Grid>
        </Grid>
        {/* <StripeResultPopup success={false}/> */}
    </form>
);

AdminPortal.propTypes = {};

export default AdminPortal;
