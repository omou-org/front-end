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
    const [directoryData, setDirectoryData] = useState({});

    const records = props.collectionData

    const dispatch = useDispatch();

    const api = useMemo(
        () => bindActionCreators(adminActions, dispatch),
    [dispatch]
    ); 

    const defaults = {
        "editable": "false",
        "align": "left",
        "type": "text"
    };

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
        })
        return fields
    };

    useEffect(() => {
        if(records.length !== recordList.length) {
            let parsedRecordList = records.map((record) => ({
                ...record,
                editing: false,
            }));
            setRecordList(parsedRecordList);
        }
    }, [records]);
    const fieldsWithDefaults = addDefaults(props.fields);

    useEffect(() => {
        const constructDirectoryObject = (fieldInfo, recordArray) => {
            recordArray.forEach((record) => {
                Object.keys(record).forEach((key) => {
                    if (key !== "id") {
                        if(fieldInfo[key]["values"]){
                            fieldInfo[key]["values"].push(record[key])
                        } else {
                        fieldInfo[key]["values"] = [record[key]]
                        }
                    }
                })
            })
            return fieldInfo
        }

        setDirectoryData(constructDirectoryObject(fieldsWithDefaults, records));
    }, [records, fieldsWithDefaults])

    const getRecord = (index) => Object.values(directoryData).map((field) => {
        console.log("field")
        console.log(field)
        return field["values"][index]
    })
    
    const viewHeader = () => Object.values(directoryData).map((field) => {

        return (
            <Grid item xs={field["col-width"]} md={field["col-width"]} >
                <Typography align={field.align} style={{color: 'white', fontWeight: '500'}}>
                    {field.label}
                </Typography>
            </Grid>
        )
    })

    
    const viewRecordRow = (record) => {
        const recordElements = [];
        console.log("directorydata: ")
        console.log(directoryData)
        console.log("record")
        console.log(getRecord(0))
        Object.values(fieldsWithDefaults).forEach((field, index) => {
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
    let recordToUpload = {};
    if(editingRecord) {
        Object.keys(editingRecord).forEach((key) => {
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
    setRecordList(updatedRecordList);
};

const handleEditRecord = (type, id) => (e) => {
    e.preventDefault();
    let editingRecord = recordList.find((record) => {return record.id === id});
    editingRecord[type] = e.target.label; //value

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




    return (
        <Grid container>
            {/* header */}
            <Grid item xs={12}>
                
                <Grid container className={'accounts-table-heading'}>
                {viewHeader()}
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