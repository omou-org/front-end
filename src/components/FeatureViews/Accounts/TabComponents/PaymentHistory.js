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
    // let uniqueEnrolledCourses = parentPayment && [...new Set(Object.values(parentPayment).reduce((allEnrollments, payment)=> {
    //     if(Array.isArray(allEnrollments)){
    //         return allEnrollments.concat(payment.enrollments)
    //     } else {
    //         return payment.enrollments;
    //     }
    // }).map(enrollment=>enrollment.course))];

    if(!paymentStatus || paymentStatus===1){
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
