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

function ManageTuitionTest() {
    const dispatch = useDispatch();
    const api = useMemo(
        () => bindActionCreators(adminActions, dispatch),
        [dispatch]
    );
    const fetchFunction = api.fetchPriceRules;
    const statusFunction = useSelector(({RequestStatus}) => RequestStatus);
    const fields = [
        {
            "name": "Category",
            "col-width": "3"
        },
        {
            "name": "Grade",
            "col-width": "3"
        },
        {
            "name": "Course Size",
            "col-width": "3"
        },
        {
            "name": "Hourly Tuition",
            "col-width": "2",
            "type": "money"
        }
    ]
    return (
        <>
        <h1>Manage Tuition Test</h1>
        <PanelManager
        fields={fields}
        fetchFunction={fetchFunction}
        statusFunction={statusFunction}

        />
        </>
    )
}
export default ManageTuitionTest