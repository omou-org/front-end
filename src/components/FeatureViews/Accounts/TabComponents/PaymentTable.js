import PropTypes from "prop-types";
import {connect} from 'react-redux';
import React from 'react';

import Grid from '@material-ui/core/Grid';
import {TableBody, TableHead} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loading from "../../../Loading";
import NavLinkNoDup from "../../../Routes/NavLinkNoDup";
import {NoListAlert} from "../../../NoListAlert";

function PaymentTable({paymentList, type, enrollmentID})  {

    if(paymentList && paymentList.length < 1){
        return <Loading/>
    } else if(!paymentList) {
        return <NoListAlert list={"Payments"}/>
    }

    let paidSessionsByPayment = () => {
        let sessNumEnrollment = {};
        if(type === "enrollment"){
            paymentList.forEach(payment => {
                payment.registrations.forEach(registration => {
                    if(registration.enrollment === enrollmentID)
                        sessNumEnrollment[payment.id] = registration.num_sessions;
                });
            });
            return sessNumEnrollment;
        }
    };

    const numericDateString = (date) => {
        let DateObject = new Date(date),
            numericOptions = {year: "numeric", month: "numeric", day: "numeric"};
        return DateObject.toLocaleDateString("en-US", numericOptions);
    };

    const CourseLabel = (enrollments) => {
        return enrollments && `${enrollments.length} Course${enrollments.length !== 1 ? "s" : ""}`
    };

    return (<Grid item md={12}>
        <Paper elevation={2} className={'payments-history'}>
            <Table>
                <TableHead>
                    <TableCell>ID</TableCell>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell>{ type === "enrollment"? "Paid Sessions" : "Course"}</TableCell>
                    <TableCell>Method</TableCell>
                </TableHead>
                <TableBody>
                    {
                        paymentList.length > 0 ? paymentList.map((payment) => {
                            return <TableRow
                                hover
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
                                    {
                                        type === "enrollment" ?
                                            paidSessionsByPayment()[payment.id] :
                                            CourseLabel(payment.registrations)
                                    }
                                </TableCell>
                                <TableCell>
                                    {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                                </TableCell>
                            </TableRow>
                        }) : <NoListAlert/>
                    }
                </TableBody>
            </Table>
        </Paper>
    </Grid>)
}

PaymentTable.propTypes = {
    paymentList: PropTypes.array.isRequired,
};

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
)(PaymentTable);
