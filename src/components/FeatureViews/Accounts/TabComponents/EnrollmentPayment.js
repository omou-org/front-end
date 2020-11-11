import React from "react";
import PropTypes from "prop-types";
import Loading from "components/OmouComponents/Loading";
import PaymentTable from "./PaymentTable";
import {useQuery} from "@apollo/react-hooks";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";

export const GET_ENROLLMENT_PAYMENTS = gql`
query EnrollmentPayments($enrollmentId: ID!) {
  enrollment(enrollmentId: $enrollmentId) {
    paymentList {
      accountBalance
      createdAt
      discountTotal
      id
      method
      priceAdjustment
      subTotal
      total
      updatedAt
      registrationSet {
        attendanceStartDate
        createdAt
        enrollment {
          id
        }
        id
        numSessions
        updatedAt
      }
      enrollments {
        id
      }
    }
  }
}
`;

const EnrollmentPayment = ({enrollmentID, courseID}) => {
	const {data, loading, error} = useQuery(GET_ENROLLMENT_PAYMENTS,
		{variables: {enrollmentId: enrollmentID}}
	);
    
	if (loading) 	return <Loading/>
	if (error) return <Typography>There's been an error! Error: {error.message}</Typography>
    
  return (
      <PaymentTable courseID={courseID}
      enrollmentID={enrollmentID}
      paymentList={data.enrollment.paymentList}
      type="enrollment" />
  );
};

EnrollmentPayment.propTypes = {
    "courseID": PropTypes.number.isRequired,
    "enrollmentID": PropTypes.number.isRequired,
};

export default EnrollmentPayment;
