import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import './AdminPortal.scss';
import AdminActionCenter from './AdminActionCenter';
import AdminViewsRoutes from 'components/Routes/AdminViewsRoutes';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton'

const AdminPortal = () => (
    <form>
        <Grid container direction='row'>
            <Grid container direction='row'>
                <Grid item xs={6}>
                    <Typography align='left' variant='h1'>
                        Admin Portal
                    </Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign:'right'}}>
                    <ResponsiveButton variant='outlined' >Bulk Upload</ResponsiveButton>
                </Grid>
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
