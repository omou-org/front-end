import React, { useState, useEffect, useMemo } from 'react';
import ReactSelect from 'react-select';
import { Grid, Select, Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect, useDispatch } from "react-redux";

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import BackButton from '../../BackButton';
import { ReactComponent as FilterIcon } from "./filter.svg";

//Material-ui Select 
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, withStyles } from '@material-ui/styles';
import "./Search.scss";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as registrationActions from "../../../actions/registrationActions";



const customSelect = makeStyles(theme => ({
    outlined: {
        border: '1px solid #ced4da',
        marginTop: 0,
        paddingLeft: "10px"
    },
    label: {

    }
}))



const SearchResultFilter = (props) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(searchActions, dispatch),
        }),
        [dispatch]
    );

    const classes = customSelect();
    const [profileTypeFilter, setProfileTypeFilter] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");
    const [sortFilter, setSortFilter] = useState("");

    const handleFilterChange = () => (event) => {
        switch (event.target.name) {
            case "profileType":
                api.updateSearchParam("account", "profile", event.target.value);
                setProfileTypeFilter(event.target.value);
                break;
            case "gradeFilter":
                api.updateSearchParam("account", "grade", event.target.value);
                setGradeFilter(event.target.value);
                break;
            case "sortFilter":
                api.updateSearchParam("account", "sort", event.target.value);
                setSortFilter(event.target.value);
                break;
            default:
                return
        }
    };

    return (
        <>
            <Grid item xs={12} md={6} >
                <Grid container>
                    <Grid item sm={1} style={{ marginTop: "1em" }}>
                        <FilterIcon />
                    </Grid>
                    <Grid item sm={1} style={{ marginTop: "1em" }}>
                        <Typography variant={"subtitle1"} align="left"> Filter | </Typography>
                    </Grid>
                    <Grid item sm={2} style={{ marginRight: "10px" }}>
                        <FormControl className="search-filter-wrapper" >
                            <InputLabel >Profile Type</InputLabel>
                            <Select
                                value={profileTypeFilter}
                                onChange={handleFilterChange()}
                                // input={<BootstrapInput />}
                                className={classes.outlined}
                                name={"profileType"}
                                variant='outlined'
                                MenuProps={{
                                    getContentAnchorEl: null,
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }
                                }}>
                                <MenuItem value={"STUDENT"}>Student</MenuItem>
                                <MenuItem value={"INSTRUCTOR"}>Instructor</MenuItem>
                                <MenuItem value={"receptionist"}>Receptionist</MenuItem>
                                <MenuItem value={"administrator"}>Administrator</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={2}>
                        <FormControl className="search-filter-wrapper">
                            <InputLabel htmlFor="gradeFilter" className="input-title" > Grade </InputLabel>
                            <Select
                                value={gradeFilter}
                                onChange={handleFilterChange()}
                                // input={<BootstrapInput />}
                                className={classes.outlined}
                                variant='outlined'
                                name={"gradeFilter"}
                                MenuProps={{
                                    getContentAnchorEl: null,
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }
                                }}
                            >
                                <MenuItem value={"1"}>1</MenuItem>
                                <MenuItem value={"2"}>2</MenuItem>
                                <MenuItem value={"3"}>3</MenuItem>
                                <MenuItem value={"4"}>4</MenuItem>
                                <MenuItem value={"5"}>5</MenuItem>
                                <MenuItem value={"6"}>6</MenuItem>
                                <MenuItem value={"7"}>7</MenuItem>
                                <MenuItem value={"8"}>8</MenuItem>
                                <MenuItem value={"9"}>9</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={"11"}>11</MenuItem>
                                <MenuItem value={"12"}>12+</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item style={{ margin: '1em 20px 0px 20px' }}>
                        <Typography variant={"subtitle1"}> Sort | </Typography>
                    </Grid>
                    <Grid item sm={2}>
                        <FormControl className="search-filter-wrapper">
                            <InputLabel htmlFor="sortFilter" className="input-title" >Relevance</InputLabel>
                            <Select
                                value={sortFilter}
                                onChange={handleFilterChange()}
                                className={classes.outlined}
                                variant='outlined'
                                // input={<BootstrapInput />}
                                name={"sortFilter"}
                                MenuProps={{
                                    getContentAnchorEl: null,
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }
                                }}
                            >
                                <MenuItem value={"relevance"}>Relevance</MenuItem>
                                <MenuItem value={"a-z"}>Name: A - Z</MenuItem>
                                <MenuItem value={"z-a"}>Name: Z - A</MenuItem>
                                <MenuItem value={"desc"}>ID: Descending </MenuItem>
                                <MenuItem value={"asce"}>ID: Ascending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
};




export default SearchResultFilter;