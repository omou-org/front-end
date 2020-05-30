import React from "react";
// import {useSelector} from "react-redux";

import * as hooks from "actions/hooks";
import Loading from "components/Loading";
import Notes from "./../Notes/Notes";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('md')]: {
            height: "68vh",
            overflowY: "scroll",
            marginTop: "72px",
        }
    }
}))

const DashboardNotes = (owner) => {
    const classes = useStyles();

    const ownerID = owner.id;
    const ownerType = 'receptionist'
    const adminStatus = hooks.useAdmin();

if (hooks.isLoading(adminStatus)) {
    return (
        <Loading
            loadingText="NOTES ARE LOADING"
            small />
    );  
}
    return (
        <Paper className={`db-notes-paper ${classes.root}`}>
            <Grid>
                <Notes
                    ownerID = {ownerID}
                    ownerType = {ownerType}
                    isDashboard = {true}
                    >
                </Notes>
            </Grid>
        </Paper>
       
    );
};

export default DashboardNotes;