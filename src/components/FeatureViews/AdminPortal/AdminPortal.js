import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import './AdminPortal.scss';
import AdminActionCenter from './AdminActionCenter';
import AdminViewsRoutes from 'components/Routes/AdminViewsRoutes';
import BackButton from 'components/OmouComponents/BackButton';
import Box from '@material-ui/core/Box';

const AdminPortal = () => (
    <form>
        <Grid container layout='row'>
            <Grid item xs={12}>
                <Box paddingTop='16px'>
                    <Typography align='left' variant='h1'>
                        Admin Portal
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <AdminActionCenter />
            </Grid>
            <Grid item xs={12}>
                <AdminViewsRoutes />
            </Grid>
        </Grid>
    </form>
);

AdminPortal.propTypes = {};

export default AdminPortal;
