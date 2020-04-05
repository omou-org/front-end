import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";

import ReactDOM from 'react-dom';

import PanelManager from "./PanelManager";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {Button, Typography} from "@material-ui/core";

function CustomTestPanel() {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );
    
    const fields = [
        {
            "name": "Discount Name",
            "col-width": 3,
            
        },
        {
            "name": "Description",
            "col-width": 7,
            "editable": "true"
        },
        {
            "name": "Active",
            "col-width": 2,
            "type": "toggle"
        }
    ];
    const fetchFunctions =[
    api.fetchMultiCourseDiscount(),
    api.fetchPaymentMethodDiscount(),
    api.fetchDateRangeDiscount()
    ]
    const statusFunction = () => {};

    const updateFunction = () => {};

    const customUseEffects = [];

    return (
        <>
        <Typography variant={"h4"} align={"left"}>Manage Discounts</Typography>
        <PanelManager 
        fields={fields}
        fetchFunction={fetchFunctions[0]}
        statusFunction={statusFunction}
        updateFunction={updateFunction} //! Should be updateFunction[0]
        customUseEffects={customUseEffects}
        />
        <PanelManager
        fields={fields}
        fetchFunction={fetchFunctions[1]}
        statusFunction={statusFunction}
        updateFunction={updateFunction} //! should be updateFunction[1]
        customUseEffects={customUseEffects}
        />
        <PanelManager
        fields={fields}
        fetchFunction={fetchFunctions[2]}
        statusFunction={statusFunction}
        updateFunction={updateFunction} //! should be updateFunctin[2]
        customUseEffects={customUseEffects}
        />
        </>
    )
    
}

export default CustomTestPanel