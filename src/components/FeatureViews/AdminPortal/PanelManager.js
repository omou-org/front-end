/*
TODO: Change scss classes to general classes - reminder, this will break old
*/

import React, {useEffect, useMemo, useState} from "react";
import * as adminActions from "../../../actions/adminActions";
import "./AdminPortal.scss";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {GET} from "../../../actions/actionTypes";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import {Button, Typography, TextField, Select} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { NoListAlert } from "components/NoListAlert";
import { FETCH_CATEGORIES_FAILED } from "actions/actionTypes";

import Loading from "../../Loading";
import {isLoading} from "../../../actions/hooks.js"
import IconButton from "@material-ui/core/IconButton/IconButton";
import EditIcon from "@material-ui/icons/Edit";

function PanelManager(props) {
/**
 * Fetches, configures, and displays a grid-structured panel for a given 
 * set in the store.
 * 
 * ! IMPORTANT: This component depends on the fields being ordered in the object...
 * ! it uses an index to differentiate fields in the record...
 * ! id must ALWAYS be the first field, then it identifies fields from left to right
 * 
 * @prop {array} fields list of objects
 * ex.
 * const fields = [
        {
            "name": "Category Name",
            "col-width": 3,
        },
        {
            "name": "Description",
            "col-width": 7,
            "editable": "true"
        },
            "name": "Active",
            "col-width": "2",
            "type": "toggle"
        },
        {
            "name": "Discount",
            "col-width": 5,
            "type": "enumCollection",
            "fetch": fetchFunction,
            "update": updateFunction
        }
    ];
    Possible Field Types: 
        text, active, toggle, daterange, integer, money, enumText, enumCollection
        ...
        for enumCollection, the object needs "fetch" and "update" attributes 

    @prop {function} fetchFunction array of functions for fetching records.
    ex. api.fetchCategories
    
    @prop {function} statusFunction function which returns fetch? status
    ex. useSelector(({RequestStatus}) => RequestStatus.category)

    @prop {function} updateFunction update 

    @prop {function} selectorHook selector that gets records from store

    @prop {array} recordArray
 *    
 **/
    const zip = rows => rows[0].map((_, c) => rows.map(row=>row[c]));

    //recordState
    const [recordList, setRecordList] = useState([]);

    const records = props.collectionData

    const dispatch = useDispatch();

    const api = useMemo(
        () => bindActionCreators(adminActions, dispatch),
    [dispatch]
    ); 
  
    const constructDirectoryObject = (fieldInfo, recordArray) => {
        console.log("construcing object..");
        console.log(recordArray)
        console.log(fieldInfo)
        Object.keys(fieldInfo).forEach((key) => {

            records.forEach((record) => {
                if (fieldInfo[key]["values"] === undefined){
                    fieldInfo[key]["values"] = [record[key]];
                } else {
                    fieldInfo[key]["values"].push(record[key])
                }
            })
        })
        console.log("recordObjectWithFieldData")
        console.log(fieldInfo)



    }
    useEffect(() => {
        // console.log(records);
        if(records.length !== recordList.length) {
            let parsedRecordList = records.map((record) => ({
                ...record,
                editing: false,
            }));
            setRecordList(parsedRecordList);
        }
    }, [records]);

    useEffect(() => {
        constructDirectoryObject(fieldsWithDefaults, records);
    }, [records]);

    const defaults = {
        "editable": "false",
        "align": "left",
        "type": "text"
    };

    // const addDefaults = (fields) => props.fields.map((field) => {
    //     //Add defaults field properties to the props.fields object
    //     Object.keys(defaults).forEach((key) => {
    //         if(field.hasOwnProperty(key)) {
    //             //Do nothing, property is already set
    //         } else {
    //             field[key] = defaults[key];
    //         }
    //     });
    //     return field;
    // });

    const addDefaults = (fields) => {
        let fieldsWithDefualts = {};
        Object.keys(fields).forEach((field) => {
            Object.keys(defaults).forEach((key) => {
                if(fields[field].hasOwnProperty(key)) {
                    //Do nothing, property is already set
                } else {
                    fields[field][key] = defaults[key];
                }
            })
            console.log(fields)
            return fields
        })
    }
    const fieldsWithDefaults = addDefaults(props.fields);
    const viewRecordRow = (record) => {
        const recordElements = [];
        
        fieldsWithDefaults.forEach((field, index) => {
            recordElements.push(
                    <Grid item xs={field["col-width"]} md={field["col-width"]}>
                        <Typography align={field["align"]}>
                            {Object.values(record)[index + 1]}
                        </Typography>
                    </Grid>

            );
        })

        return (
            <Paper square={true} className={"category-row"} >
                <Grid container alignItems={"center"}>
                
                    {recordElements}
                    <Grid item xs md>
                    <IconButton
                        onClick={editRecord(record.id)}
                        >
                    <EditIcon/>
                    </IconButton>
                </Grid>
                </Grid>

            </Paper>
        )

};
const editRecord = (id) => (e) => {
    e.preventDefault();
    let editingRecord = recordList.find((record) => {return record.id === id});
    console.log("editing: ");
    let recordToUpload = {};
    if(editingRecord) {
        Object.keys(editingRecord).forEach((key) => {
            // console.log("editingRecord[key]=> " + key + ": " + editingRecord[key])
            // console.log("recordToUpload[key] => " + key + ": " + recordToUpload[key] )
            recordToUpload[key] = editingRecord[key]
        });

        
        props.updateFunction(id, recordToUpload);
    }
    editingRecord.editing = !editingRecord.editing;
    let updatedRecordList = recordList.map((record) => {
        if(record.id == id){
            return editingRecord;
        } else {
            return record;
        }
    });
    console.log(recordToUpload)
    setRecordList(updatedRecordList);
};

const handleEditRecord = (type, id) => (e) => {
    e.preventDefault();
    let editingRecord = recordList.find((record) => {return record.id === id});
    console.log(e.target);
    editingRecord[type] = e.target.label; //value
    console.log("handleEditRecord")

    //! RecordToUpdateIndex = recordList.indexOf(editingRecord)
    //! update record... => recordList[indexOf(editingRecord)] = editingRecord
    let updatedRecordList = recordList.map((record) => {
        if (record.id === id) {
            return editingRecord;
        } else {
            return record;
        }
    });
    setRecordList(updatedRecordList);
};

const editRecordRow = (record) => {
    console.log("record")
    console.log(record)
    const editElements = [];
    fieldsWithDefaults.forEach((field, index) => {
        if (field["type"] === "text"){
            editElements.push(

                <Grid item xs={field["col-width"]} md={field["col-width"]}>
                    <TextField
                        value={Object.values(record)[index + 1]}
                        defaultValue={Object.values(record)[index + 1]}
                        label={field.label}
                        onChange={handleEditRecord(Object.keys(record)[index + 1], record.id)}/>
                </Grid>
            );
        } else if (field["type"] === "enumCollection"){
            editElements.push(
                <Grid item xs={field["col-width"]} md={field["col-width"]}>
                    <Select
                        className={"tuition-field"} //! SWITCH CLASS NAME
                        value={Object.values(record)[index + 1]}
                        onChange={handleEditRecord(Object.keys(record)[index + 1], record.id)}>
                         {
                            field["options"].map((option)=>
                                <MenuItem className={"menu-item"}
                                    value={option} key={option.id}>
                                    {option.label}
                                </MenuItem>
                            )
                        }
                    </Select>
                </Grid>
            )
        }

    })
    return (
        <Paper square={true} className={"category-row"} >
            <Grid container alignItems={"left"}>
                {editElements}
                <Grid item xs={2} md={2}>
                    <Button
                        onClick={editRecord(record.id)}
                        className={"button"}>
                            UPDATE
                        </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

    const headerElements = [];
    for (const [index, value] of fieldsWithDefaults.entries()) {

        headerElements.push(
            <Grid item xs={value["col-width"]} md={value["col-width"]} >
                <Typography align={value["align"]} style={{color: 'white', fontWeight: '500'}}>
                    {value["label"]}
                </Typography>
            </Grid>
        )
    }


    return (
        <Grid container>
            {/* header */}
            <Grid item xs={12}>
                
                <Grid container className={'accounts-table-heading'}>
                {headerElements}
                <Grid item xs md>
                    <Typography align={'center'} style={{color: 'white', fontWeight: '500'}}>
                        Edit
                    </Typography>
                </Grid>
                </Grid>
            </Grid>

            {/* Directory */}
            <Grid item xs={12} md={12}>
                <Grid container spacing={8} alignItems={"center"}>
                    {
                        recordList.length > 0 ? recordList.map((record) => {
                            return (<Grid item xs={12} md={12} key={record.id}>
                                {
                                    record.editing ? editRecordRow(record) : viewRecordRow(record)
                                }
                            </Grid>);
                        }): <NoListAlert list={"Course Categories"} />
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export default PanelManager