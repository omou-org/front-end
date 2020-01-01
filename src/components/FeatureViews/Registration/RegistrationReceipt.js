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

    const [transactionParent, setTransactionParent] = useState({
        user_id: 2,
        gender: "F",
        birthday: "12/12/1970",
        relationship: "Mother",
        first_name: "Elle",
        last_name: "Ho",
        name: "Elle Ho",
        email: "elle@ho.com",
        student_ids: [7],
        role: "parent",
    });

    const [payment, setPayment] = useState({
        parent:2,
        enrollments:[32, 24],
        payment: {
            received: 1000,
            method: "credit card",
        },
        disabled_discounts: [1],
        enabled_discounts: [3],
        date: "1/1/2020",
        id: 123,
    });

    const [enrollment, setEnrollment] = useState({
        32:{
            // course_id:
        }
    });

    const handleCloseReceipt = ()=> (e)=> {
        e.preventDefault();
        api.closeRegistration("");
        props.history.push("/registration");
    };

    return (
        <Paper className={"paper registration-receipt"} >
            <Grid container
                  direction={"row"}
                  spacing={16}
            >
                <Grid item>
                    <Typography variant={"h2"} align={"left"}>
                        Payment Confirmation
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant={"h5"} align={"left"}>
                        Thank you for your payment, {transactionParent.name}
                    </Typography>
                </Grid>
                <Grid item xs={12}
                    className={"receipt-info"}
                >
                    <Grid container direction={"column"}>
                        <Grid item xs={8}>
                            <Grid container direction={"row"}>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Order ID#:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {payment.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Paid By:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {`
                                        ${transactionParent.name} - ID#:
                                        ${transactionParent.user_id}
                                    `}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container direction={"row"}>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Order Date:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {payment.date}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Payment Method:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {payment.payment.method}
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
        </Paper>
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
