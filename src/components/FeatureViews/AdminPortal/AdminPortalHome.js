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
import Card from "@material-ui/core/Card";
import {NoListAlert} from "../../NoListAlert";
import {GET} from "../../../actions/actionTypes";
import Loading from "../../Loading";
import UnpaidSessions from "./UnpaidSessions";



function AdminPortalHome() {


const style ={
    card:{
        width:"auto",
        textAlign:"left",
        padding: "50px"
    }
}    

return (
    <div>
        <Card style={style.card}>
            <h1>Outstanding Payments</h1>
            <UnpaidSessions></UnpaidSessions>
        {/* {this.state.sample.map(us=>(
            <UnpaidSessions
                fName={us.fName}
            ></UnpaidSessions>
        ))} */}
        </Card>
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