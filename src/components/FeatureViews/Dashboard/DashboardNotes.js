import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import * as hooks from "actions/hooks";
import Dashboard from "./Dashboard";
import Loading from "components/Loading";


const DashboardNotes = () => {

//need to get receptionist notes
//posting receptionist doesn't worK?!?


const parent = useSelector(({Users}) => Users.ParentList);

const parentStatus = hooks.useParent();

if (hooks.isLoading(parentStatus)) {
    return (
        <Loading
            loadingText="NOTES ARE LOADING"
            small />
    );
}

    return (
        <Grid>
                Notes
        </Grid>
    )
}


export default DashboardNotes;