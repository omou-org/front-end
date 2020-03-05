import React, {useEffect, useMemo, useState} from "react";
import * as adminActions from "../../../actions/adminActions";
import "./AdminPortal.scss";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

import Grid from "@material-ui/core/Grid";
import {Button, Typography} from "@material-ui/core";

function PanelManager(props) {
/**
 * Fetches, configures, and displays a grid-structured panel for a given 
 * set in the store.
 * 
 * 
 * Example: 
 * { TODO}
 * 
 * @prop {array} operations List of operation types (i.e ["READ", "UPDATE" ) => options are: READ, UPDATE, DELETE 
 */
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );

    let [records, setRecords] = useState({});

    const addDefaults = (fields) => props.fields.map((field) => {
        //Add defaults field properties to the props.fields object
        Object.keys(defaults).forEach((key) => {
            if(field.hasOwnProperty(key)) {
                //Do nothing, property is already set
            } else {
                field[key] = defaults[key];
            }
        });
        return field;
    });

    const defaults = {
        "editable": "false",
        "align": "left"
    };


    const generateGrid = () => {
        /**
         * Generates header with fields
         */
        const fieldsWithDefaults = addDefaults(props.fields);
        const headerElements = [];
        const records = [];

        for (const [index, value] of fieldsWithDefaults.entries()) {

            headerElements.push(
                <Grid item xs={value["col-width"]} md={value["col-width"]} >
                    <Typography align={value["align"]} style={{color: 'white', fontWeight: '500'}}>
                        {value["name"]}
                    </Typography>
                </Grid>
            )
        }
        for (const [index, value] of props.categories.entries()) {
            records.push(
                <li>{value["name"]}</li>
            )
        };

        return (
            <Grid container>
                {/* header */}
                <Grid item xs={12}>
                    <Grid container className={'accounts-table-heading'}>
                    {headerElements}
                    </Grid>
                </Grid>

                {/* Directory */}
                <Grid>
                    <ul>
                    {records}
                    </ul>
                </Grid>
            </Grid>
        )
    };


    return (
        <div>
            {generateGrid()}
        </div>
    )
}

export default PanelManager