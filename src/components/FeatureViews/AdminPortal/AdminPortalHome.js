import React, {useEffect, useMemo, useState} from "react";
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
import {NoListAlert} from "../../NoListAlert";
import {GET} from "../../../actions/actionTypes";
import Loading from "../../Loading";

function AdminPortalHome() {
return (
    <div>
        Admin portal home!
    </div>
)
}

AdminPortalHome.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "sessions": state.sessions,
});

export default withRouter(connect(
    mapStateToProps
)(AdminPortalHome));