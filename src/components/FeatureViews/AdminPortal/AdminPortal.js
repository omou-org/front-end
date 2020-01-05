
import React from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";

import {connect} from "react-redux";
import {Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";

import BackButton from "../../BackButton";
import AdminActionCenter from "./AdminActionCenter";
import AdminViewsRoutes from "../../Routes/AdminViewsRoutes";


function AdminPortal() {
    return (
        <form>
            <Paper className={"registration-cart paper"}>
                <Grid container layout={"row"}>
                    <Grid item xs={12}>
                        <BackButton/>
                        <hr/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h3"} align={"left"}>Admin Portal</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <AdminActionCenter/>
                    </Grid>
                    <Grid item xs={12}>
                        <AdminViewsRoutes/>
                    </Grid>
                </Grid>
            </Paper>
        </form>

    );
}

AdminPortal.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
});

export default withRouter(connect(
    mapStateToProps
)(AdminPortal));
