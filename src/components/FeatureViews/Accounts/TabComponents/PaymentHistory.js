import React from "react";
import PropTypes from "prop-types";
import Loading from "components/Loading";
import PaymentTable from "./PaymentTable";
import {useQuery} from "@apollo/react-hooks";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";

export const GET_PARENT_PAYMENTS = gql`
    query ParentPayments($parentId: ID!) {
        payments(parentId: $parentId) {
            id
            createdAt
            registrationSet {
              id
            }
            total
            method
        }
    }
`;

const PaymentHistory = ({user_id}) => {
	const {data, loading, error} = useQuery(GET_PARENT_PAYMENTS,
		{variables: {parentId: user_id}}
	);

	if (loading) {
		return <Loading/>
	}
	if (error) {
		return <Typography>
			There's been an error! Error: {error.message}
		</Typography>
    }

	const {payments} = data;

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
