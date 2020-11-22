import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import React, {useCallback} from "react";

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import {paymentToString, tuitionAmount} from "utils";
import Loading from "components/OmouComponents/Loading";
import NavLinkNoDup from "components/Routes/NavLinkNoDup";
import NoListAlert from "components/OmouComponents/NoListAlert";
import Moment from "react-moment";

const numericDateString = (date) => {
    const DateObject = new Date(date);
    return DateObject.toLocaleDateString("en-US", {
        "day": "numeric",
        "month": "numeric",
        "year": "numeric",
    });
};

const courseLabel = (enrollments) => enrollments &&
    `${enrollments.length} Course${enrollments.length !== 1 ? "s" : ""}`;

const PaymentTable = ({paymentList, type, enrollmentID, courseID, rootRoute = "/accounts/parent/payment/"}) => {
    const course = useSelector(({Course}) => Course.NewCourseList[courseID]);

    const numPaidSessionsByPayment = useCallback((paymentID) => {
        const payment = paymentList.find(({id}) => id === paymentID);
        if (!payment) {
            return null;
        }
        const registration = payment.registrations.find(({enrollment}) =>
            enrollment === enrollmentID);
        if (!registration) {
            return null;
        }
        return registration.num_sessions;
    }, [paymentList, enrollmentID]);


    if (!paymentList) {
        return <Loading />;
    } else if (paymentList.length === 0) {
        return <NoListAlert list="Payments" />;
    }

    return (
        <Grid
            className="payments-history"
            item md={12}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h4">ID</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h4">Transaction Date</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h4">{type === "enrollment" ? "Paid Sessions" : "Course"}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h4">Amount Paid</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h4">Method</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        paymentList.map((payment) => (
                            <TableRow
                                component={NavLinkNoDup}
                                hover
                                key={payment.id}
                                to={`${rootRoute}${payment.id}`}>
                                <TableCell>
                                    <Typography variant="body2">{payment.id}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1">
                                        <Moment date={payment.created_at} format="M/DD/YYYY"/>
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {
                                            type === "enrollment"
                                                ? numPaidSessionsByPayment(payment.id)
                                                : courseLabel(payment.registrationSet)
                                        }
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {
                                            type === "enrollment"
                                                ? tuitionAmount(
                                                course,
                                                numPaidSessionsByPayment(payment.id)
                                                )
                                                : `$${payment.total}`
                                        }
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{paymentToString(payment.method)}</Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Grid>
    );
};

PaymentTable.propTypes = {
    "courseID": PropTypes.number.isRequired,
    "enrollmentID": PropTypes.number.isRequired,
    "paymentList": PropTypes.array.isRequired,
    "type": PropTypes.oneOf(["enrollment", "parent"]).isRequired,
};


export default PaymentTable;
