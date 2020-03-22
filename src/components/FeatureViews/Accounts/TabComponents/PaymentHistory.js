import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import {isFail, isLoading, usePaymentByParent} from "actions/hooks";
import Loading from "components/Loading";
import PaymentTable from "./PaymentTable";

const PaymentHistory = ({user_id}) => {
    const parentPayment = useSelector(({Payments}) => Payments[user_id]);
    const paymentStatus = usePaymentByParent(user_id);

    const payments = useMemo(() =>
        parentPayment && Object.values(parentPayment), [parentPayment]);

    if (!parentPayment) {
        if (isLoading(paymentStatus)) {
            return (
                <Loading
                    loadingText="LOADING PAYMENTS"
                    small />
            );
        } else if (isFail(paymentStatus)) {
            return "Error loading payments!";
        }
    }

    return (
        <PaymentTable
            paymentList={payments}
            type="parent" />
    );
};

PaymentHistory.propTypes = {
    "user_id": PropTypes.number.isRequired,
};

export default PaymentHistory;
