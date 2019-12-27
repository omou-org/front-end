// React Imports
import React, {useCallback, useState, useEffect, useMemo} from "react";
import {Redirect, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import PropTypes from "prop-types";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import {FormControl} from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/es/Typography/Typography";
import Remove from "@material-ui/icons/Cancel"
import Add from "@material-ui/icons/CheckCircle";

// Local Component Imports
import "./Form.scss"
import TextField from "@material-ui/core/es/TextField/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {bindActionCreators} from "redux";
import * as adminActions from "../../actions/adminActions";
import {GET} from "../../actions/actionTypes";
import {REQUEST_ALL} from "../../actions/apiActions";


const TutoringPriceQuote = ({courses, tutoring, students, disablePay}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );
    const [priceQuote, setPriceQuote] = useState({
        sub_total: 1000,
        total: 980,
    });
    const [category, setCategory] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [academic_level, setAcademicLevel] = useState("");
    const [academicList, setAcademicList] = useState([]);
    const [priceRules, setPriceRules] = useState([]);

    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const adminPriceRules = useSelector(({"Admin": {PriceRules}}) => PriceRules);
    const categories = useSelector(({"Course":CourseCategories}) => CourseCategories);

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
            setPriceRules(adminPriceRules.map((rule) =>({
                ...rule,
                category: categories.find((category) => {return category.id === rule.category}),
            })));
        }
    },[requestStatus.priceRule[GET][REQUEST_ALL], api]);

    useEffect(()=>{
        if(priceRules && priceRules.length > 0){
            setCategoryList(()=>{
                let uniqueCategories = [...new Set(categoryList.map( category => category.category))];
                console.log(uniqueCategories, priceRules);
                return uniqueCategories.map((rule) => ({
                   name: rule.category.name,
                   id: rule.category.id,
                }));
            });
            // setAcademicList(()=>{
            //     let uniqueAcademicGrades = priceRules
            // })
        }
    },[priceRules]);

    const onCategoryChange = () => event => {
        setCategory(event.target.value);
        // console.log(cat)
    };

    const onAcademicLevelChange = () => event => {
        setAcademicLevel(event.target.value)
    }

    return (
        <Grid container className={"tutoring-price-quote"} direction={"column"}>
            <Grid item>
                <Grid container direction={"row"}>
                    <Grid item>
                        <Select
                            value={category}
                            onChange={onCategoryChange()}
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
                    <Grid item>
                        <Select
                            value={academic_level}
                            onChange={onAcademicLevelChange()}
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
                </Grid>
            </Grid>
        </Grid>
    );
};

TutoringPriceQuote.propTypes = {
    // "courses": PropTypes.array.isRequired,
};

export default TutoringPriceQuote;