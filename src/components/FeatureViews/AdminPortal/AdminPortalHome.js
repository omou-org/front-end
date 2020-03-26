import React from "react";
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

AdminPortalHome.propTypes = {};

export default AdminPortalHome;
