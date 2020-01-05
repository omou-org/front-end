import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";
import "./AdminPortal.scss";

import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import { connect } from "react-redux";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withRouter } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import AdminActionCenter from "./AdminActionCenter";
import AdminViewsRoutes from "../../Routes/AdminViewsRoutes";

const useStyles = makeStyles({
    setParent: {
        backgroundColor: "#39A1C2",
        color: "white",
        // padding: "",
    }
})

function AdminPortal(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <form>
            <Paper className={"registration-cart paper"}>
                <Grid container layout={"row"}>
                    <Grid item xs={12}>
                        <BackButton />
                        <hr />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h3"} align={"left"} style={{ paddingBottom: "20px" }}>Admin Portal</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <AdminActionCenter />
                    </Grid>
                    <Grid item xs={12}>
                        <AdminViewsRoutes />
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
