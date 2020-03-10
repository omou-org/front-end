import React, {useEffect, useMemo, useState, Container} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";

import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";
import {connect, useDispatch, useSelector} from "react-redux";
import {Button, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import {NoListAlert} from "../../NoListAlert";
import {GET} from "../../../actions/actionTypes";
import Loading from "../../Loading";
import UnpaidSessions from "./UnpaidSessions";

function AdminPortalHome() {

    return (
        <>
            <Grid container>
                <UnpaidSessions></UnpaidSessions>
            </Grid>
        </>
    )
}

AdminPortalHome.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};

export default AdminPortalHome;