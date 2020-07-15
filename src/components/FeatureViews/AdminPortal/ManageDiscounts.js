import React from "react";
import {useSelector} from "react-redux";

import Typography from "@material-ui/core/Typography";

import "./AdminPortal.scss";
import * as adminActions from "actions/adminActions";
import DiscountList from "./DiscountList";
import {isLoading} from "actions/hooks";
import Loading from "components/OmouComponents/Loading";

const ManageDiscounts = () => {
	const discountList = useSelector(({Admin: {Discounts}}) => Discounts);
	const multiCourseStatus = adminActions.useMultiCourseDiscount();
	const paymentMethodStatus = adminActions.usePaymentMethodDiscount();
	const dateRangeStatus = adminActions.useDateRangeDiscount();

	if (isLoading(multiCourseStatus, paymentMethodStatus, dateRangeStatus)) {
		return <Loading/>;
	}

	return (
		<div>
			<Typography align="left" variant="h4">
				Manage Discounts
			</Typography>
			{Object.entries(discountList).map(([type, list]) => (
				<DiscountList discountList={list} discountType={type} key={type}/>
			))}
		</div>
	);
};

ManageDiscounts.propTypes = {};

export default ManageDiscounts;
