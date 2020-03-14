// React Imports
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
// Local Component Imports
import "./Form.scss"
import TextField from "@material-ui/core/es/TextField/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {bindActionCreators} from "redux";
import * as adminActions from "../../actions/adminActions";
import {GET} from "../../actions/actionTypes";
import {durationParser, REQUEST_ALL} from "../../actions/apiActions";
import {academicLevelParse} from "../../reducers/registrationReducer";
import InputLabel from "@material-ui/core/InputLabel";
import {OutlinedSelect} from "../FeatureViews/Scheduler/SchedulerUtils";

const TutoringPriceQuote = ({courseType, handleUpdatePriceFields,  tutoringCategory}) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );
    const [priceQuote, setPriceQuote] = useState(null);
    const [hourlyTuition, setHourlyTuition] = useState(null);
    const [duration, setDuration] = useState(null);
    const [sessions, setSessions] = useState(null);
    const [category, setCategory] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [academic_level, setAcademicLevel] = useState(null);
    const [academicList, setAcademicList] = useState([]);
    const [priceRules, setPriceRules] = useState(null);

    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const adminPriceRules = useSelector(({"Admin": {PriceRules}}) => PriceRules);
    const categories = useSelector(({"Course":{CourseCategories}}) => CourseCategories);

    useEffect(()=>{
        api.fetchCategories();
    },[api]);

    useEffect(()=>{
        if(requestStatus.category[GET] === 200){
            api.fetchPriceRules();
        }
    }, [requestStatus.category[GET]]);

    useEffect(()=>{
        if(requestStatus.priceRule[GET][REQUEST_ALL] === 200 &&
        requestStatus.category[GET] === 200){
            setPriceRules(adminPriceRules
                .filter(rule => rule.course_type === courseType)
                .map((rule) =>({
                ...rule,
                category: categories.find((category) => {return category.id === rule.category}),
            })));
        }
    },[requestStatus.priceRule[GET][REQUEST_ALL], api]);

    // get list of unique category objects from price rules
    const uniqueCategories = (rules) => Array.from(new Set(rules.map(rule => rule.category.id)))
        .map(id => {
            return {
                ...priceRules.find(rule => rule.category.id === id).category
            }
        });
    // get list of unique academic grades from price rules
    const uniqueAcademicGrades = (rules, categoryID) => {
        let filteredCategoryRules = rules.filter( rule => rule.category.id === categoryID);
        return Array.from(new Set(filteredCategoryRules.map(rule => rule.academic_level)))
            .map(grade => academicLevelParse[grade]);
    };

    useEffect(()=>{
        if(priceRules && priceRules.length > 0){
            setCategoryList(uniqueCategories(priceRules));
        }
    },[priceRules]);

    useEffect(()=>{
        if(category === null && academic_level === null &&
            categoryList.length > 0){
            if(tutoringCategory){
                setCategory(categoryList.find(category => category.id == tutoringCategory));
            } else {
                setCategory(categoryList[0]);
            }
            // set tuition
            setHourlyTuition(()=>{
                let matchingPriceRule = priceRules.find(rule => rule.category.id === categoryList[0].id);
                return matchingPriceRule.hourly_tuition;
            });
        }
    },[academicList, categoryList]);

    useEffect(()=>{
        if(category){
            let uniqueGradesList = uniqueAcademicGrades(priceRules, category.id);
            setAcademicList(uniqueGradesList);
            setAcademicLevel(uniqueGradesList[0]);
        }
    },[category]);

    const generatePriceQuote = ({tuition, duration, sessions}) => {
        if(tuition && duration && sessions){
            setPriceQuote(()=>{
                let quote = duration * sessions * tuition;
                return `$ ${quote.toString()}`
            });
        }
    };

    const onCategoryChange = () => event => {
        setCategory(event.target.value);

        handleUpdatePriceFields({
            value: event.target.value.id,
            label: event.target.value.name
        }, academic_level, durationParser[event.target.value], sessions);

        // filter academic levels so only academic levels with the current category get displayed
        setAcademicList(()=>{
            let filteredByCategoryPriceRules = priceRules.filter(rule => rule.category.id === event.target.value.id);
            let filteredAcademicLevels = uniqueAcademicGrades(filteredByCategoryPriceRules, event.target.value.id);

            // if current academic level is unavailable, default to first one
            let academicLevel;
            if(filteredAcademicLevels.indexOf(academic_level) < 0){
                setAcademicLevel(filteredAcademicLevels[0]);
                academicLevel = filteredAcademicLevels[0];
            } else {
                academicLevel = academic_level;
            }
            setHourlyTuition(()=>{
                let matchingPriceRule = priceRules.find(rule => {
                    return rule.category.id === event.target.value.id &&
                        rule.academic_level === academicLevelParse[academicLevel]
                });
                generatePriceQuote(
                    {
                        duration: duration,
                        sessions: sessions,
                        tuition: matchingPriceRule.hourly_tuition
                    }
                );
                return matchingPriceRule.hourly_tuition;
            });

            return filteredAcademicLevels;
        });
    };

    const onAcademicLevelChange = () => event => {
        setAcademicLevel(event.target.value);
        setHourlyTuition(()=>{
            let matchingPriceRule = priceRules.find(rule =>
                rule.category.id === category.id &&
                rule.academic_level === academicLevelParse[event.target.value]);
            generatePriceQuote(
                {
                    duration: duration,
                    sessions: sessions,
                    tuition: matchingPriceRule.hourly_tuition
                }
            );
            handleUpdatePriceFields({
                value: category.id,
                label: category.name
            }, event.target.value, durationParser[duration], sessions);
            return matchingPriceRule.hourly_tuition;
        });
    };

    const onDurationChange = () => event => {
        setDuration(event.target.value);
        generatePriceQuote(
            {
                duration: event.target.value,
                sessions: sessions,
                tuition: hourlyTuition
            }
        );
        handleUpdatePriceFields({
            value: category.id,
            label: category.name
        }, academic_level, durationParser[event.target.value], sessions);
    };

    const onSessionsChange = () => event => {
        setSessions(event.target.value);
        generatePriceQuote(
            {
                duration: duration,
                sessions: event.target.value,
                tuition: hourlyTuition,
            }
        );
        handleUpdatePriceFields({
            value: category.id,
            label: category.name
        }, academic_level, durationParser[duration], event.target.value);
    };

    const onUpdateFields = event => {
        event.preventDefault();
        let formattedCategory = {
            value: category.id,
            label: category.name
        };
        handleUpdatePriceFields({
            value: category.id,
            label: category.name
        }, academic_level, durationParser[duration], sessions);
    };

    const validFields = duration && sessions && academic_level && category;
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography>
                    Use the Tuition Quote Tool to give the customer an estimate of how much the total tuition
                    will be. This tool will set the final tuition of the course.
                </Typography>
                <Grid container
                      className={"tutoring-price-quote"}
                      direction={"column"}
                      justify={"flex-end"}
                      spacing={32}>
                    <Grid item>
                        <Grid container direction={"row"} justify={"flex-end"}>
                            <Grid item xs={3}>
                                <InputLabel htmlFor={"category"}>Category</InputLabel>
                                <Select
                                    value={category}
                                    onChange={onCategoryChange()}
                                    className={"field"}
                                    inputProps={{
                                        id:"category"
                                    }}
                                    input={
                                        <OutlinedSelect
                                            id="select-category"
                                            name="category"
                                        />
                                    }
                                >
                                    {
                                        categoryList.map((category) =>
                                            <MenuItem
                                                value={category}
                                                key={category.id}
                                            >
                                                {category.name}
                                        </MenuItem>)
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={3}>
                                <InputLabel htmlFor={"academic-level"}>Grade Level</InputLabel>
                                <Select
                                    value={academic_level}
                                    onChange={onAcademicLevelChange()}
                                    className={"field"}
                                    inputProps={{
                                        id:"academic-level"
                                    }}
                                    input={
                                        <OutlinedSelect
                                            id="select-academic"
                                            name="academic"
                                        />
                                    }
                                >
                                    {
                                        academicList.map((grade) =>
                                            <MenuItem
                                                value={grade}
                                                key={grade}
                                            >
                                                {grade}
                                            </MenuItem>)
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={3}>
                                    <InputLabel htmlFor={"hourly-tuition"}>Hourly Tuition</InputLabel>
                                <div
                                    style={{
                                        padding: '10px 26px 10px 12px',
                                    }}
                                >
                                    <Typography variant="h6">
                                        {hourlyTuition}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={"row"} justify={"flex-end"}>
                            <Grid item xs={3}>
                                <InputLabel htmlFor={"duration"}>Duration</InputLabel>
                                <Select
                                    value={duration}
                                    onChange={onDurationChange()}
                                    className={"field"}
                                    inputProps={{
                                        id:"academic-level"
                                    }}
                                >
                                    <MenuItem
                                        value={1}
                                        key={1}
                                    >
                                        1 Hour
                                    </MenuItem>
                                    <MenuItem
                                        value={1.5}
                                        key={2}
                                    >
                                        1.5 Hours
                                    </MenuItem>
                                    <MenuItem
                                        value={2}
                                        key={3}
                                    >
                                        2 Hours
                                    </MenuItem>
                                    <MenuItem
                                        value={0.5}
                                        key={4}
                                    >
                                        0.5 Hour
                                    </MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={"row"} justify={"flex-end"}>
                            <Grid item xs={3}>
                                <TextField
                                    className={"field"}
                                    label="Sessions"
                                    value={sessions}
                                    onChange={onSessionsChange()}
                                    type={"number"}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container
                              direction={"row"}
                              justify={"flex-end"}>
                            <Grid item xs={3}>
                                <TextField
                                    label={"Total Tuition"}
                                    value={priceQuote || ''}
                                    InputProps={{readOnly:true}}
                                    variant={"outlined"}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

TutoringPriceQuote.propTypes = {
    "courseType": PropTypes.string.isRequired,
};

export default TutoringPriceQuote;