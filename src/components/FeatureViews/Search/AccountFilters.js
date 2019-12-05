import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { Grid, Select, Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect } from "react-redux";

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

const BootstrapInput = withStyles(theme => ({
    input: {
        // borderRadius: 10,
        border: '1px solid #ced4da',
        fontSize: 16,
        minWidth: 80,

        // padding: '4px 17px 7px',
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 10,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

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
    const classes = customSelect()
    const [profileTypeFilter, setProfileTypeFilter] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");
    const [sortFilter, setSortFilter] = useState("");
    console.log(props)
    const handleFilterChange = event => {
        console.log(props)
        // props.onFilterChange(event.target.name)
        switch (event.target.name) {
            case "profileType":
                setProfileTypeFilter(event.target.value);
                break;
            case "gradeFilter":
                setGradeFilter(event.target.value);
                break;
            case "sortFilter":
                setSortFilter(event.target.value);
                break;
            default:
                return
        }
    };


    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <>
            <Grid item sm={6} >
                <Grid container>
                    <Grid item sm={1} style={{}}>
                        <FilterIcon />
                    </Grid>
                    <Grid item sm={1} style={{ paddingTop: '5px' }}>
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
                                <MenuItem value={"student"}>Student</MenuItem>
                                <MenuItem value={"instructor"}>Instructor</MenuItem>
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
                    <Grid item style={{ paddingTop: '5px', margin: '0px 20px 0px 20px' }}>
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