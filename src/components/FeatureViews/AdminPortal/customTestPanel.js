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
    
    const fields = {

    };
    const fetchFunction =[
    api.fetchMultiCourseDiscount(),
    api.fetchPaymentMethodDiscount(),
    api.fetchDateRangeDiscount()
    ]
    const statusFunction = () => {};

    const updateFunction = () => {};

    const customUseEffects = [];

    return (
        <PanelManager 
        fields={fields}
        fetchFunction={fetchFunction}
        statusFunction={statusFunction}
        updateFunction={updateFunction}
        customUseEffects={customUseEffects}
        />
    )
}

export default CustomTestPanel