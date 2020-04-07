import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";
import {GET} from "../../../actions/actionTypes";
import {REQUEST_ALL} from "../../../actions/apiActions";
import ReactDOM from 'react-dom';
import {academicLevelParse, courseTypeParse} from "../../../reducers/registrationReducer";

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
    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const [tuitionRules, setTuitionRules] = useState([]);
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const priceRules = useSelector(({"Admin": {PriceRules}}) => PriceRules);

    const fetchFunction = api.fetchPriceRules;
    const statusFunction = useSelector(({RequestStatus}) => RequestStatus);
    // const updateFunction = () => { console.log("hello world")}
    const selectorHook = priceRules;
    useEffect(()=>{
        api.fetchCategories();
    },[api]);

    useEffect(()=>{
        if(requestStatus.category[GET] === 200){
            api.fetchPriceRules();
        }
    },[requestStatus.category[GET]]);
    useEffect(()=>{
        if(requestStatus.priceRule[GET][REQUEST_ALL] === 200 && categories) {
            let parsedTuitionRulesList = priceRules.map((price)=>{
                let category = categories.find(({id}) => {return id === price.category});
                if(category){
                    return {
                        ...price,
                        editing: false,
                        category: category,
                        academic_level: academicLevelParse[price.academic_level],
                        course_type: courseTypeParse[price.course_type],
                    }
                }
            });
            setTuitionRules(parsedTuitionRulesList);
        }
    },[requestStatus.priceRule[GET][REQUEST_ALL], api]);

    const fields = [
        {
            "name": "Category",
            "col-width": 3,
            "type": "enumCollection"
            // "fetch": fetchCategory
        },
        {
            "name": "Grade",
            "col-width": 3
        },
        {
            "name": "Course Size",
            "col-width": 3
        },
        {
            "name": "Hourly Tuition",
            "col-width": 2,
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
        selectorHook = {selectorHook}
        />
        </>
    )
}
export default ManageTuitionTest