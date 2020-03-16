import React from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";

import UnpaidSessions from "./UnpaidSessions";

function AdminPortalHome() {

    return (
            <Grid container>
                <UnpaidSessions/>
            </Grid>
    )
}   

AdminPortalHome.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};

export default AdminPortalHome;