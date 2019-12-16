import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect, useDispatch} from "react-redux";
import {Button, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

function RegistrationReceipt(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    const handleCloseReceipt = ()=> (e)=> {
        e.preventDefault();
        api.closeRegistration("");
        props.history.push("/registration");
    }

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
            <Grid item xs={12}>
                <Grid item xs={8}/>
                <Grid item xs={4}>
                    <Button onClick={handleCloseReceipt()} className={"button"}>
                        End Registration
                    </Button>
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
