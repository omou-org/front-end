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
import PropTypes from 'prop-types';

const AdminPortal = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const { match, history } = props;
    const { params } = match;
    const { page } = params;

    const tabNameToIndex = {
        overview: 0,
        topics: 1,
        'tuition-rules': 2,
        'access-control': 3,
        'admin-log': 4,
        'business-details': 5,
    };

    const indexToTabName = {
        0: 'overview',
        1: 'topic',
        2: 'tuition-rules',
        3: 'access-control',
        4: 'admin-log',
        5: 'business-details',
    };

    const [selectedTabIndex, setSelectedTabIndex] = useState(
        tabNameToIndex[page]
    );

    const handleTabSelect = (event, index) => {
        history.push(`/adminportal/${indexToTabName[index]}`);
        setSelectedTabIndex(index);
    };

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
                    <AdminPortalTabs
                        selectedTabIndex={selectedTabIndex}
                        handleTabSelect={handleTabSelect}
                    />
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

AdminPortal.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
};

export default AdminPortal;
