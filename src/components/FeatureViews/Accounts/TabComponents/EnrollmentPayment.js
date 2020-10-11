import React from "react";
import PropTypes from "prop-types";
import Loading from "components/OmouComponents/Loading";
import PaymentTable from "./PaymentTable";
import {useQuery} from "@apollo/react-hooks";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";

export const GET_ENROLLMENT_PAYMENTS = gql`
    query EnrollmentPayments ($enrollmentId: ID!) {
        enrollment(enrollmentId: $enrollmentId) {
          paymentList {
            id
            createdAt
            total
            method
          }
        }
    }
`;

const EnrollmentPayment = ({user_id}) => {
	const {data, loading, error} = useQuery(GET_ENROLLMENT_PAYMENTS,
		{variables: {enrollmentId: user_id}}
	);
    
	if (loading) {
		return <Loading/>
	}
	if (error) {
		return <Typography>
			There's been an error! Error: {error.message}
		</Typography>
    }

	const payments = data.enrollment.paymentList;
    console.log(data);
    console.log(payments);
    return (
        <PaymentTable
            paymentList={payments}
            type="enrollment" />
    );
};

EnrollmentPayment.propTypes = {
    "user_id": PropTypes.number.isRequired,
};

export default EnrollmentPayment;
