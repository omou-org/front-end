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
        borderRadius: 10,
        position: 'relative',
        border: '1px solid #ced4da',
        fontSize: 16,
        minWidth: 80,
        // padding: '10px 26px 10px 12px',
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
    formControl: {
        top: -15,
        left: 5,
    }
}))(InputBase);





const SearchResultFilter = (props) => {

    const [profileTypeFilter, setProfileTypeFilter] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");
    const [sortFilter, setSortFilter] = useState("");

    const handleFilterChange = event => {
        console.log(event)
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
        <div>
            <Grid item xs={12}>
                <Typography variant={"h4"} align={"left"}>
                    <span style={{ fontFamily: "Roboto Slab", fontWeight: "500" }}>
                        15 Search Results for </span> "someone"
                </Typography>
            </Grid>

            <div className="searchFilters">
                <Grid item style={{ padding: "10px" }}>
                    <FilterIcon />
                </Grid>
                <Grid item style={{ paddingTop: '5px', marginRight: '10px' }}>
                    <Typography variant={"subtitle1"}> Filter | </Typography>
                </Grid>
                <Grid item style={{ marginRight: "10px" }}>
                    <FormControl>
                        <InputLabel htmlFor="ptf" className="input-title">Profile Type</InputLabel>
                        <Select
                            value={profileTypeFilter}
                            onChange={handleFilterChange}
                            input={<BootstrapInput />}
                            name={"profileType"}
                        >
                            <MenuItem value={"student"}>Student</MenuItem>
                            <MenuItem value={"instructor"}>Instructor</MenuItem>
                            <MenuItem value={"receptionist"}>Receptionist</MenuItem>
                            <MenuItem value={"administrator"}>Administrator</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl className={""}>
                        <InputLabel htmlFor="gradeFilter" className="input-title" > Grade </InputLabel>
                        <Select
                            value={gradeFilter}
                            onChange={handleFilterChange}
                            input={<BootstrapInput />}
                            name={"gradeFilter"}
                        >
                            <MenuItem value={"1"}>1</MenuItem>
                            <MenuItem value={"2"}>2</MenuItem>
                            <MenuItem value={"3"}>3</MenuItem>
                            <MenuItem value={"4"}>4</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item style={{ paddingTop: '5px', margin: '0px 20px 0px 20px' }}>
                    <Typography variant={"subtitle1"}> Sort | </Typography>
                </Grid>
                <Grid item>
                    <FormControl className={""}>
                        <InputLabel htmlFor="sortFilter" className="input-title" >Relevance</InputLabel>
                        <Select
                            value={sortFilter}
                            onChange={handleFilterChange}
                            input={<BootstrapInput />}
                            name={"sortFilter"}
                        >
                            <MenuItem value={"relevance"}>Relevance</MenuItem>
                            <MenuItem value={"a-z"}>Name: A - Z</MenuItem>
                            <MenuItem value={"z-a"}>Name: Z - A</MenuItem>
                            <MenuItem value={"desc"}>ID: Descending </MenuItem>
                            <MenuItem value={"asce"}>ID: Ascending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </div>
        </div>
    )
};




export default SearchResultFilter;