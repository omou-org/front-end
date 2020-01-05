import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";

import {bindActionCreators} from "redux";
import {connect, useDispatch, useSelector} from "react-redux";
import {Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import * as adminActions from "../../../actions/adminActions";
import {GET} from "../../../actions/actionTypes";
import {REQUEST_ALL} from "../../../actions/apiActions";
import {academicLevelParse, courseTypeParse} from "../../../reducers/registrationReducer";
import Edit from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CheckCircle from "@material-ui/core/es/internal/svg-icons/CheckCircle";

function TuitionRules() {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );
    const [tuitionRules, setTuitionRules] = useState([]);
    const priceRules = useSelector(({"Admin": {PriceRules}}) => PriceRules);
    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);

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

    const displayTuitionRules = () => {
        return <Grid container>
            <Grid item xs={12}>
                <Grid container className={'accounts-table-heading'}>
                    <Grid item xs={3} md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Category
                        </Typography>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Grade
                        </Typography>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Course Size
                        </Typography>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Hourly Tuition
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={8} alignItems={"center"}>
                    {
                        tuitionRules.map((tuition)=> {
                            return (tuition && <Grid item xs={12} md={12} key={tuition.id}>
                                {   tuition.editing ?
                                    editTuitionRow(tuition) :
                                    viewTuitionRow(tuition)
                                }
                            </Grid>)
                        })
                    }
                </Grid>
            </Grid>
        </Grid>
    };

    const editTuition = (id) => (e) => {
        e.preventDefault();
        let editingRule = tuitionRules.find((rule)=>{return rule.id === id });
        let ruleToUpload;
        if(editingRule.editing){ //if we're about to update/we were just editing
            ruleToUpload = {
                ...editingRule,
                category: editingRule.category.id,
                course_type: courseTypeParse[editingRule.course_type],
                academic_level: academicLevelParse[editingRule.academic_level],
                hourly_tuition: Number(editingRule.hourly_tuition),
            };
            delete ruleToUpload.editing;
            api.updatePriceRule(id, ruleToUpload);
        }
        editingRule.editing = !editingRule.editing;
        let updatedRuleList = tuitionRules.map((rule)=>{
            if(rule.id === id){
                return editingRule;
            } else {
                return rule;
            }
        });
        setTuitionRules(updatedRuleList);
    };

    const viewTuitionRow = ({id ,category, hourly_tuition, academic_level, course_type}) => {
        return (<Paper square={true} className={"category-row"} >
            <Grid container alignItems={"center"}>
                <Grid item xs={3} md={3}>
                    <Typography align={'left'} >
                        {category.name}
                    </Typography>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Typography align={'left'} >
                        {academic_level}
                    </Typography>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Typography align={'left'}>
                        {course_type}
                    </Typography>
                </Grid>
                <Grid item xs={2} md={2}>
                    <Typography align={'left'} >
                        ${hourly_tuition}
                    </Typography>
                </Grid>
                <Grid item xs={1} md={1}>
                    <Edit onClick={editTuition(id)}/>
                </Grid>
            </Grid>
        </Paper>)
    };

    const handleChange = (tuitionID, field) => event => {
        let updatedTuitionRules = tuitionRules.map((tuitionRule) => {
            if(tuitionRule.id === tuitionID){
                return {
                    ...tuitionRule,
                    [field]: event.target.value,
                }
            } else {
                return tuitionRule;
            }
        });
        setTuitionRules(updatedTuitionRules);
    };

    const editTuitionRow = ({id ,category, hourly_tuition, academic_level, course_type}) => {
        let academicLevelList = ["College", "Middle School", "Elementary School", "High School"];
        let classSize = ["Tutoring", "Small Group"];
        return <Paper square={true} className={"category-row"} >
            <Grid container alignItems={"center"}>
                <Grid item xs={3} md={3} >
                    <Select
                        className={"tuition-field"}
                        value={category}
                        onChange={handleChange(id, "category")}
                    >
                        {
                            categories.map((category)=>
                                <MenuItem className={"menu-item"}
                                    value={category} key={category.id}>
                                    {category.name}
                                </MenuItem>)
                        }
                    </Select>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Select
                        className={"tuition-field"}
                        value={academic_level}
                        onChange={handleChange(id, "academic_level")}
                    >
                        {
                            academicLevelList.map((grade, i)=>
                                <MenuItem value={grade} key={i}>
                                    {grade}
                                </MenuItem>)
                        }
                    </Select>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Select
                        className={"tuition-field"}
                        value={course_type}
                        onChange={handleChange(id, "course_type")}
                    >
                        {
                            classSize.map((size, i)=>
                                <MenuItem value={size} key={i}>
                                    {size}
                                </MenuItem>)
                        }
                    </Select>
                </Grid>
                <Grid item xs={2} md={2}>
                    <TextField
                        className={"tuition-field"}
                        value={hourly_tuition}
                        onChange={handleChange(id, "hourly_tuition")}
                        type="number"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={1} md={1}>
                    <CheckCircle onClick={editTuition(id)}/>
                </Grid>
            </Grid>
        </Paper>
    };

    return (
        <div>
            <h1>Manage Tuition</h1>
            {
                displayTuitionRules()
            }
        </div>
    );
}

TuitionRules.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
});

export default withRouter(connect(
    mapStateToProps
)(TuitionRules));
