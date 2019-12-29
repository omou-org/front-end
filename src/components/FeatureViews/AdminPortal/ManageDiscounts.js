import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";
import "./AdminPortal.scss";

import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";
import {connect, useDispatch, useSelector} from "react-redux";
import {Button, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import {DELETE, GET, PATCH, POST} from "../../../actions/actionTypes";
import Loading from "../../Loading";
import {REQUEST_ALL} from "../../../actions/apiActions";
import Switch from "@material-ui/core/es/Switch/Switch";
import Options from "@material-ui/icons/MoreVert"
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Menu from "@material-ui/core/es/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DiscountRow from "./DiscountRow";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

function ManageDiscounts(props) {
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
            (requestStatus.discount["dateRange"][GET][REQUEST_ALL]  == 200 ||
            requestStatus.discount[PATCH]  == 200 ||
            requestStatus.discount[DELETE] == 200)
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
        return <Grid container>
            <Grid item xs={12}>
                <Typography variant={"h6"} align={"left"}>
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
                <Grid container spacing={8} alignItems={"center"}>
                    {
                        // display discounts with name + description
                        discountList.map(discount =>
                            <DiscountRow discount={discount} type={discountType}/>)
                    }
                </Grid>
            </Grid>
        </Grid>
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
