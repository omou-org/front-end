import React, {useEffect, useMemo, useState} from "react";
import * as adminActions from "../../../actions/adminActions";
import "./AdminPortal.scss";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {GET} from "../../../actions/actionTypes";

import Grid from "@material-ui/core/Grid";
import {Button, Typography, TextField} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { NoListAlert } from "components/NoListAlert";
import { FETCH_CATEGORIES_FAILED } from "actions/actionTypes";

import Loading from "../../Loading";

import IconButton from "@material-ui/core/IconButton/IconButton";
import EditIcon from "@material-ui/icons/Edit";

const zip = (arrays) => {
    /* Python-type zip util function

    example:
    zip([1, 2, 3], ['a', 'b', 'c']);
    >> [[1, 'a'], [2, 'b'], [3, 'c']]

    */

    return arrays[0].map((_,i) => {
        return arrays.map((array) => {return array[i]})
    });
}

function PanelManager(props) {
/**
 * Fetches, configures, and displays a grid-structured panel for a given 
 * set in the store.
 * 
 * ! IMPORTANT: This component depends on the fields being ordered in the object...
 * ! it uses an index to differentiate fields in the record...
 * ! id must ALWAYS be the first field, then it identifies fields from left to right
 * 
 * @prop {array} fields list of objects. Required field is name, col-width, optional params are editable, align
 * ex.
 * fields =     const fields = [
        {
            "name": "Category Name",
            "col-width": 3,
            
        },
        {
            "name": "Description",
            "col-width": 7,
            "editable": "true"
        }
    ];
    @prop {function} fetchFunction function which fetches records.
    ex. api.fetchCategories
 */
    const zip = rows => rows[0].map((_, c) => rows.map(row=>row[c]));

    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    //recordState
    const [recordList, setRecordList] = useState([]);

    const records = useSelector(({Course}) => Course.CourseCategories);
    const categoryStatus = useSelector(({RequestStatus}) => RequestStatus.category)

    const dispatch = useDispatch();

    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );
    
    useEffect(() => {
        props.fetchFunction();
    }, [api]);
    
    useEffect(() => {
        if(records.length !== recordList.length) {
            let parsedRecordList = records.map((record) => ({
                ...record,
                editing: false,
            }));
            setRecordList(parsedRecordList);
        }
    }, [records]);

    if(props.statusFunction[GET] !== 200){
        return <Loading />
    }

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
                    <Grid item xs={2} md={2}>
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
    console.log("it worked");
    let editingRecord = recordList.find((record) => {return record.id === id});
    let recordToUpload;
    if(editingRecord) {
        recordToUpload = {
            id: editingRecord.id,
            name: editingRecord.name,
            description: editingRecord.description,
        };

        //! Should be updateRecord...ideally takes this as a prop
        
        props.updateFunction(id, recordToUpload);
    }
    editingRecord.editing = !editingRecord.editing;
    let updatedRecordList = recordList.map((record) => {
        if(record.id === id){
            return editingRecord;
        } else {
            return record;
        }
    });
    console.log(updatedRecordList);
    setRecordList(updatedRecordList);
};

const handleEditRecord = (type, id) => (e) => {
    let editingRecord = recordList.find((record) => {return record.id === id});
    switch(type) {
        case "name":
            editingRecord.name = e.target.value;
            break;
        case "description":
            editingRecord.description = e.target.value;
            break;
    }
    

    //! RecordToUpdateIndex = recordList.indexOf(editingRecord)
    //! update record... => recordList[indexOf(editingRecord)] = editingRecord
    let updatedRecordList = recordList.map((record) => {
        if (record.id == id) {
            return editingRecord;
        } else {
            return record;
        }
    });
    setRecordList(updatedRecordList);
};

const editRecordRow = (record) => {
    console.log("edit");
    return (
        <Paper square={true} className={"category-row"} >
            <Grid container alignItems={"center"}>
                <Grid item xs={3} md={3} >
                    <TextField
                        value={record.name}
                        defaultValue={record.name}
                        label={"Name"}
                        onChange={handleEditRecord("name", record.id)}
                    />
                </Grid>
                <Grid item xs={7} md={7}>
                    <TextField
                        value={record.description}
                        defaultValue={record.description}
                        label={"Description"}
                        onChange={handleEditRecord("description", record.id)}
                    />
                </Grid>
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
    const generateGrid = () => {
        /**
         * Generates header with fields
         */
        
        const headerElements = [];
        for (const [index, value] of fieldsWithDefaults.entries()) {

            headerElements.push(
                <Grid item xs={value["col-width"]} md={value["col-width"]} >
                    <Typography align={value["align"]} style={{color: 'white', fontWeight: '500'}}>
                        {value["name"]}
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
                    <Grid item xs={2} md={2}>
                        <Typography align={'center'} style={{color: 'white', fontWeight: '500'}}>
                            Edit
                        </Typography>
                    </Grid>
                    </Grid>
                </Grid>

                {/* Directory */}
                <Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={8} alignItems={"center"}>
                            {
                                recordList.length > 0 ? recordList.map((record) => {
                                    console.log(record);
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
            </Grid>
        )
    };

    // const editRecord = (id) => (e) => {
    //     e.preventDefault();
    //     let editingRecord = records.find((record) => {return record.id === id});
    // }

    return (
        <>
            {generateGrid()}
        </>
    )
}

export default PanelManager