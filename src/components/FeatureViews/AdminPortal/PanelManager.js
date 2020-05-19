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
    const [directoryData, setDirectoryData] = useState({
        "ids": [],
        "editing" : []
    });

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
        let fieldsWithDefaults = {};
        Object.keys(fields).forEach((field) => {
            if (field !== "ids" && field !== "editing") {
                Object.keys(defaults).forEach((key) => {
                    if(fields[field].hasOwnProperty(key)) {
                        //Do nothing, property is already set
                    } else {
                        fields[field][key] = defaults[key];
                    }
                })
            }

        })
        
        return fields
    };

    // useEffect(() => {
    //     console.log("records: " + records)
    //     if(records.length !== recordList.length) {
    //         let parsedRecordList = records.map((record) => ({
    //             ...record,
    //             editing: false,
    //         }));
    //         setRecordList(parsedRecordList);
    //     }
    // }, [records]);

    const fieldsWithDefaults = addDefaults(props.fields);



    useEffect(() => {
        const constructDirectoryObject = (fieldInfo, recordArray) => {
            fieldInfo["ids"] = [];
            fieldInfo["editing"] = [];
            recordArray.forEach((record) => {
                Object.keys(record).forEach((key) => {
                    if (key !== "id") {
                        if(fieldInfo[key]["values"]){
                            fieldInfo[key]["values"].push(record[key])
                        } else {
                        fieldInfo[key]["values"] = [record[key]]
                        }
                    } else if (key === "id") {
                        fieldInfo["ids"].push(record[key])
                    }
                })
                fieldInfo["editing"].push(false);
            })
            console.log(fieldInfo)
            return fieldInfo
        }
        setDirectoryData(constructDirectoryObject(fieldsWithDefaults, records));
        
        
    }, [records, fieldsWithDefaults])

    useEffect(() => {
        const propRecords = [];
        for(let i = 0; i <= directoryData.length; i++){ 
            records.push(getRecord(i))
            
        }
        setRecordList(records)
    }, [directoryData])

    const getRecord = (index) => Object.values(directoryData).map((field) => {
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

    
    const viewRecordRow = (record, index) => {
        const recordElements = [];

        Object.values(directoryData).forEach((field, index) => {
            recordElements.push(
                <Grid item xs={field["col-width"]} md={field["col-width"]}>
                    <Typography align={field["align"]}>
                        {Object.values(record)[index]}
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
                        onClick={editRecord(record)}
                        >
                    <EditIcon/>
                    </IconButton>
                </Grid>
                </Grid>

            </Paper>
        )

};
// const editRecord = (id) => (e) => {
//     console.log("editRecord()")
//     console.log(id);
//     e.preventDefault();

//     let editingRecord = recordList.find((record) => {return record.id === id});
//     let recordToUpload = {};

//     if(editingRecord) {
//         Object.keys(editingRecord).forEach((key) => {
//             recordToUpload[key] = editingRecord[key]
//         });

        
//         props.updateFunction(id, recordToUpload);
//     }
//     editingRecord.editing = !editingRecord.editing;
//     let updatedRecordList = recordList.map((record) => {
//         if(record.id == id){
//             return editingRecord;
//         } else {
//             return record;
//         }
//     });
//     setRecordList(updatedRecordList);
// };

const editRecord = (index) => (e) => {
    console.log("editRecord()")
    console.log(index);
    e.preventDefault();

    // let editingRecord = recordList.find((record) => {return record.id === id});
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
    setDirectoryData(updatedRecordList);
};

const handleEditRecord = (type, id) => (e) => {
    console.log("handleEditRecord()")
    e.preventDefault();
    let editingRecord = recordList.find((record) => {return record.id === id});
    editingRecord[type] = e.target.label;

    //! RecordToUpdateIndex = recordList.indexOf(editingRecord)
    //! update record... => recordList[indexOf(editingRecord)] = editingRecord
    let updatedRecordList = recordList.map((record) => {
        if (record.id === id) {
            return editingRecord;
        } else {
            return record;
        }
    });
    setDirectoryData(updatedRecordList);
};

const editRecordRow = (record, index) => {
    console.log("record in editRecordRow: ")
    console.log(record)
    
    const editElements = [];
    Object.keys(directoryData).forEach((fieldKey) => {
        if (fieldKey !== "ids"){
            if (directoryData[fieldKey]["type"] === "text"){
                editElements.push(
    
                    <Grid item xs={directoryData[fieldKey]["col-width"]} md={directoryData[fieldKey]["col-width"]}>
                        <TextField
                            value={directoryData[fieldKey].values[index]}
                            defaultValue={directoryData[fieldKey].values[index]}
                            label={directoryData[fieldKey].label}
                            onChange={handleEditRecord(fieldKey, directoryData["ids"][index])}/>
                    </Grid>
                );
            } else if (directoryData[fieldKey]["type"] === "enumCollection"){
                editElements.push(
                    <Grid item xs={directoryData[fieldKey]["col-width"]} md={directoryData[fieldKey]["col-width"]}>
                        <Select
                            className={"tuition-field"} //! SWITCH CLASS NAME
                            value={directoryData[fieldKey].values[index]}
                            onChange={handleEditRecord(fieldKey, directoryData["ids"][index])}>
                             {
                                directoryData[fieldKey]["options"].map((option)=>
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
                        directoryData["ids"].length > 0 ? directoryData["ids"].map((id, index) => {
                            return (<Grid item xs={12} md={12} key={index}>
                                {
                                    // record.editing ? editRecordRow(record, index) : viewRecordRow(record, index)
                                    directoryData["editing"][index] ? 
                                    editRecordRow(Object.values(directoryData).map(value => {
                                        return value["values"][index]
                                    }), index)
                                    : viewRecordRow(Object.values(directoryData).map(value => {
                                        return value["values"][index]
                                    }), index)
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