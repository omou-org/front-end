import {connect, useSelector} from 'react-redux';
import React, {Component, useState, useEffect, useMemo} from 'react';

import Grid from '@material-ui/core/Grid';
import {TableBody, TableHead} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {isFail, isLoading, usePaymentByParent, } from "../../../../actions/hooks";
import Loading from "../../../Loading";
import {Redirect} from "react-router-dom";
import NavLinkNoDup from "../../../Routes/NavLinkNoDup";
import Typography from "@material-ui/core/Typography";

function PaymentHistory({user_id})  {
    const Payments = useSelector(({Payments})=>Payments);
    const Courses = useSelector(({Course})=>Course.NewCourseList);
    const parentPayment = Payments[user_id];
    const paymentStatus = usePaymentByParent(user_id);
    let uniqueEnrolledCourses = parentPayment && [...new Set(Object.values(parentPayment).reduce((allEnrollments, payment)=> {
        if(Array.isArray(allEnrollments)){
            return allEnrollments.concat(payment.enrollments)
        } else {
            return payment.enrollments;
        }
    }).map(enrollment=>enrollment.course))];

    if(!paymentStatus || paymentStatus===1 ){
        if(isLoading(paymentStatus)){
            return <Loading/>;
        }

        if(isFail(paymentStatus)){
            return (
                <Redirect
                    push
                    to="/PageNotFound" />
            )
        }
    }
    const payments = parentPayment && Object.entries(parentPayment).map( ([paymentID, payment]) => {
        return payment;
    });

    if(payments && payments.length < 1){
        return <Loading/>
    } else if(!payments) {
        return <Grid
            item
            xs={12}>
            <Paper className="info">
                <Typography style={{"fontWeight": 700}}>
                    No Payments Yet!
                </Typography>
            </Paper>
        </Grid>
    }
    const numericDateString = (date) => {
        let DateObject = new Date(date),
            numericOptions = {year: "numeric", month: "numeric", day: "numeric"};
        return DateObject.toLocaleDateString("en-US", numericOptions);
    };

    const CourseLabel = (enrollments) => {
        return `${enrollments.length} Course${enrollments.length !== 1 ? "s" : ""}`
    };

    return (<Grid item md={12}>
        <Paper className={'payments-history'}>
            <Table>
                <TableHead>
                    <TableCell>ID</TableCell>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Method</TableCell>
                </TableHead>
                <TableBody>
                    {
                        payments.map((payment) => {
                            return <TableRow
                                component={NavLinkNoDup}
                                to={`/accounts/parent/payment/${payment.parent}/${payment.id}`}
                                key={payment.id}>
                                <TableCell>
                                    {payment.id}
                                </TableCell>
                                <TableCell>
                                    {numericDateString(payment.created_at)}
                                </TableCell>
                                <TableCell>
                                    {CourseLabel(payment.enrollments)}
                                </TableCell>
                                <TableCell>
                                    {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                                </TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </Paper>
    </Grid>)
}

PaymentHistory.propTypes = {};

function mapStateToProps(state) {
    return {
        payments: state.Payments,
        courses: state.Course.NewCourseList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentHistory);
