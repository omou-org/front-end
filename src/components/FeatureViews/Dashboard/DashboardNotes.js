import React from "react";
// import {useSelector} from "react-redux";

import * as hooks from "actions/hooks";
import Loading from "components/Loading";
import Notes from "./../Notes/Notes";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const DashboardNotes = (owner) => {

    const ownerID = owner.id;
    const ownerType = 'receptionist'
    // const userList = useSelector(({Users}) => Users);
    const adminStatus = hooks.useAdmin();

if (hooks.isLoading(adminStatus)) {
    return (
        <Loading
            loadingText="NOTES ARE LOADING"
            small />
    );  
}
    return (
        <Paper className="db-notes-paper" style={{background: "rgba(255, 255, 255, 0.6)"}}>
            <Grid style={{margin:"10px"}}>
                <Notes
                    ownerID = {ownerID}
                    ownerType = {ownerType}
                    isDashboard = {true}>
                </Notes>
            </Grid>
        </Paper>
       
    );
};

export default DashboardNotes;