import {connect, useSelector} from 'react-redux';
import React from 'react';
import {isFail, isLoading, usePaymentByParent,} from "../../../../actions/hooks";
import Loading from "../../../Loading";
import {Redirect} from "react-router-dom";
import PaymentTable from "./PaymentTable";

function PaymentHistory({user_id})  {
    const Payments = useSelector(({Payments})=>Payments);
    const parentPayment = Payments[user_id];
    const paymentStatus = usePaymentByParent(user_id);

    if(!paymentStatus || paymentStatus===1){
        if(isLoading(paymentStatus)){
            return <Loading small loadingText="LOADING PAYMENTS"/>;
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

    return (<PaymentTable
            type={"parent"}
            paymentList={payments}/>)
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
