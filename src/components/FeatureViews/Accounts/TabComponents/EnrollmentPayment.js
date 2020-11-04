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
      __typename
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
    __typename
  }
}


`;
// Why is the map after the console log affecting the objects?
// const formatSets = (payments) => {
//   console.log("payments", payments);
//   return payments.map(payment => {
//     payment['registrations'] = payment['registrationSet'];
//     delete payment['registrationSet'];

//     payment.id = +payment.id;

//     payment.method = payment.method.toLowerCase();
//   })
// }

const EnrollmentPayment = ({enrollmentID, courseID, paymentList}) => {
	const {data, loading, error} = useQuery(GET_ENROLLMENT_PAYMENTS,
		{variables: {enrollmentId: enrollmentID}}
	);
    
	if (loading) {
		return <Loading/>
	}
	if (error) {
		return <Typography>
			There's been an error! Error: {error.message}
		</Typography>
    }

  console.log({data: data.enrollment.paymentList});
  //const payments = formatSets(data.enrollment.paymentList);
  
    //console.log("payments: ", payments);
    //console.log("paymentList: ", paymentList);
    return (
        <PaymentTable courseID={courseID}
        enrollmentID={enrollmentID}
        paymentList={data.enrollment.paymentList}
        type="enrollment" />
    );
};

EnrollmentPayment.propTypes = {
    "user_id": PropTypes.number.isRequired,
};

export default EnrollmentPayment;
