import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect} from "react-redux";
import {Button, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

function RegistrationReceipt(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    // useEffect(()=>{
    //     return ()=>{
    //
    //     }
    // }, [])

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant={"h2"} align={"left"}>
                    Payment Confirmation
                </Typography>
                <Typography varient={"h4"} align={"left"}>
                    Thank you for your payment, //Temp Parent Name
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container>
                            <Grid item xs={2}>
                                <Typography align={"left"}>
                                    Order ID#:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align={"left"}>
                                    // future payment ID
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align={"left"}>
                                    Paid By:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align={"left"}>
                                    {/*{props.parent.name} */}
                                    - ID#:
                                    {/*{props.parent.user_id}*/}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

RegistrationReceipt.propTypes = {
    // parent: PropTypes.shape({
    //     user_id: PropTypes.string,
    //     name: PropTypes.string
    // }),
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
});

export default withRouter(connect(
    mapStateToProps
)(RegistrationReceipt));
