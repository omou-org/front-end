import React, {useEffect, useMemo, useState} from "react";
import * as adminActions from "../../../actions/adminActions";
import "./AdminPortal.scss";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

import Grid from "@material-ui/core/Grid";
import {Button, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { NoListAlert } from "components/NoListAlert";

/* Python-type zip util function

example:
zip([1, 2, 3], ['a', 'b', 'c']);
>> [[1, 'a'], [2, 'b'], [3, 'c']]

*/
const zip = (arrays) => {
    return arrays[0].map((_,i) => {
        return arrays.map((array) => {return array[i]})
    });
}

function PanelManager(props) {
/**
 * Fetches, configures, and displays a grid-structured panel for a given 
 * set in the store.
 * 
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

    const defaults = {
        "editable": "false",
        "align": "left"
    };

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

    const fieldsWithDefaults = addDefaults(props.fields);


    const zip = rows => rows[0].map((_, c) => rows.map(row=>row[c]));
    const viewRecordRow = (record) => {
        const recordElements = [];
        console.log("record.value");
        console.log(record.value);
        console.log("fieldsWithDefaults");
        console.log(fieldsWithDefaults.entries());

        // const recordWithFieldInfo = zip()



        //! Improper JS - use map or forEach
        // for (const [index, value] of fieldsWithDefaults.entries()) {
        //     console.log("fieldsWithDefaults");
        //     console.log(fieldsWithDefaults[index]["name"]);
        //     // console.log(record.value)
        //     recordElements.push(
        //     <Grid item xs={fieldsWithDefaults[index]["col-width"]} md={fieldsWithDefaults[index]["col-width"]} >
        //         <typography align={fieldsWithDefaults[index]["align"]}>
        //             {record.value.description}
        //         </typography>
        //     </Grid>
        //     )
        // };

        return (
        <Paper square={true} className={"category-row"} >
            <Grid container alignItems={"center"}>
            
                {recordElements}
            
            </Grid>

        </Paper>
        )

};
    const generateGrid = () => {
        /**
         * Generates header with fields
         */
        
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
        for (const [index, value] of props.records.entries()) {
            records.push(
                {value}
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
                    <Grid item xs={12}>
                        <Grid container spacing={8} alignItems={"center"}>
                            {
                                records.length > 0 ? records.map((record) => {
                                    return (<Grid item xs={12} md={12} key={record.id}>
                                        {
                                            viewRecordRow(record)
                                        }
                                    </Grid>);
                                }): <NoListAlert list={"Course Categories"} />
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    };

    const editRecord = (id) => (e) => {
        e.preventDefault();
        let editingRecord = props.records.find((record) => {return record.id === id});
    }


    return (
        <>
            {generateGrid()}
        </>
    )
}

export default PanelManager