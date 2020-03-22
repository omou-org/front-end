import React, {useEffect, useMemo, useState} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import "./AdminPortal.scss";

import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";
import {connect, useDispatch, useSelector} from "react-redux";
import {Typography} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import {DELETE, GET, PATCH} from "../../../actions/actionTypes";
import Loading from "../../Loading";
import {REQUEST_ALL} from "../../../actions/apiActions";
import DiscountRow from "./DiscountRow";
import {NoListAlert} from "../../NoListAlert";

function ManageDiscounts() {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );

    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const discountList = useSelector(({"Admin":{Discounts}}) => Discounts);
    const [stateDiscountList , setStateDiscountList ] = useState(null);

    useEffect(()=>{
        api.fetchMultiCourseDiscount();
        api.fetchPaymentMethodDiscount();
        api.fetchDateRangeDiscount();
    },[api]);

    useEffect(()=>{
        const reduxDiscounts = JSON.stringify(discountList);
        const stateDiscounts = JSON.stringify(stateDiscountList);
        if(reduxDiscounts !== stateDiscounts &&
            (requestStatus.discount["dateRange"][GET][REQUEST_ALL]  === 200 ||
            requestStatus.discount[PATCH]  === 200 ||
            requestStatus.discount[DELETE] === 200)
        ){
            setStateDiscountList(discountList);
        }
    }, [discountList, requestStatus.discount["dateRange"][GET][REQUEST_ALL],
        requestStatus.discount[PATCH],requestStatus.discount[DELETE]]);

    if(requestStatus.discount["dateRange"][GET][REQUEST_ALL]  !== 200 &&
        requestStatus.discount["multiCourse"][GET][REQUEST_ALL]  !== 200 &&
        requestStatus.discount["paymentMethod"][GET][REQUEST_ALL]  !== 200
    ){
        return <Loading/>
    }

    const discountTypeParser = {
        "MultiCourse": "Bulk Order Discount",
        "DateRange": "Date Range Discount",
        "PaymentMethod": "Payment Method Discount",
        "Bulk Order Discount": "MultiCourse",
        "Date Range Discount": "DateRange",
        "Payment Method Discount": "PaymentMethod",
    };

    const displayDiscountType = (discountType, discountList) => {
        return <div className="discount-type-wrapper">
            <Grid
                container
                key={discountType}>
                <Grid item xs={12}>
                    <Typography
                        gutterBottom
                        variant={"h6"}
                        align={"left"}>
                        {discountTypeParser[discountType]}
                    </Typography>
                    <Grid container className={'accounts-table-heading'}>
                        <Grid item xs={3} md={3}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Discount Name
                            </Typography>
                        </Grid>
                        <Grid item xs={5} md={5}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Description
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Typography align={'center'} style={{color: 'white', fontWeight: '500'}}>
                                Active
                            </Typography>
                        </Grid>
                        <Grid item xs={2} md={2}/>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems={"center"}>
                        {
                            // display discounts with name + description
                            discountList.length > 0 ?
                                discountList.map(discount =>
                                    <DiscountRow discount={discount} type={discountType}/>) :
                                <NoListAlert list={"Discounts"}/>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </div>
    };

    return (
        <div>
            <Typography variant={"h4"} align={"left"}>Manage Discounts</Typography>
            {
                stateDiscountList && Object.entries(stateDiscountList).map(([discountType, discountList]) =>
                    displayDiscountType(discountType, discountList))
            }
        </div>
    );
}

ManageDiscounts.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
    "categories": state.Course.CourseCategories,
});

export default withRouter(connect(
    mapStateToProps
)(ManageDiscounts));
