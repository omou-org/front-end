import React, {useEffect, useMemo, useState, Container} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";

import UnpaidSessions from "./UnpaidSessions";

function AdminPortalHome() {

    return (
            <Grid container style={{padding: "20px"}} >
                <UnpaidSessions/>
            </Grid>
    )
}   

AdminPortalHome.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};

export default AdminPortalHome;