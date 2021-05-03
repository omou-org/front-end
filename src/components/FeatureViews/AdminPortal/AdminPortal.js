import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import './AdminPortal.scss';
// import AdminActionCenter from './AdminActionCenter';
// import AdminViewsRoutes from 'components/Routes/AdminViewsRoutes';
import AdminPortalTabs from './AdminPortalTabs';
import BulkUploadModal from './BulkUploadModal';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const AdminPortal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    return (
        <form>
            <Grid container direction='row'>
                <Grid container direction='row'>
                    <Grid item xs={6}>
                        <Typography align='left' variant='h1'>
                            Admin Portal
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <ResponsiveButton
                            variant='outlined'
                            onClick={handleModalOpen}
                        >
                            Bulk Upload
                        </ResponsiveButton>
                    </Grid>
                    <Modal
                        disableBackdropClick
                        open={modalOpen}
                        onClose={handleModalClose}
                    >
                        <BulkUploadModal closeModal={handleModalClose} />
                    </Modal>
                </Grid>
                <Grid item xs={12}>
                    <AdminPortalTabs />
                </Grid>
                {/* <Grid item xs={12}>
                    <AdminActionCenter />
                </Grid>
                <Grid item xs={12}>
                    <AdminViewsRoutes />
                </Grid> */}
            </Grid>
        </form>
    );
};

AdminPortal.propTypes = {};

export default AdminPortal;
