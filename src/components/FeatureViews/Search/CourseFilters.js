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





const CourseFilters = (props) => {

    const [classFilter, setClassFilter] = useState("");
    const [subjectFilter, setSubjetFilter] = useState("")
    const [availability, setAvailability] = useState();
    const [sortFilter, setSortFilter] = useState("");

    const handleFilterChange = event => {
        console.log(event)
        props.onFilterChange(event.target.name)
        switch (event.target.name) {
            case "classFilter":
                setClassFilter(event.target.value);
                break;
            case "subjectFilter":
                setSubjetFilter(event.target.value);
                break;
            case "availability":
                setAvailability(event.target.value);
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

        <div className="courseFilters">
            <Grid item style={{ padding: "10px" }}>
                <FilterIcon />
            </Grid>
            <Grid item style={{ paddingTop: '5px', marginRight: '10px' }}>
                <Typography variant={"subtitle1"}> Filter | </Typography>
            </Grid>
            <Grid item className="spacing">
                <FormControl>
                    <InputLabel htmlFor="classFilter" className="input-title">Profile Type</InputLabel>
                    <Select
                        value={classFilter}
                        onChange={handleFilterChange}
                        input={<BootstrapInput />}
                        name={"classFilter"}
                        MenuProps={{
                            getContentAnchorEl: null,
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                            }
                        }}
                    >
                        <MenuItem value={"class"}>Classes</MenuItem>
                        <MenuItem value={"1x1"}>1 x 1 Session</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className="spacing">
                <FormControl className={""}>
                    <InputLabel htmlFor="subjectFilter" className="input-title" > Grade </InputLabel>
                    <Select
                        value={subjectFilter}
                        onChange={handleFilterChange}
                        input={<BootstrapInput />}
                        name={"subjectFilter"}
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
                    </Select>
                </FormControl>

            </Grid>
            <Grid item>
                <FormControl className={""}>
                    <InputLabel htmlFor="availability" className="input-title">Availability</InputLabel>
                    <Select
                        value={availability}
                        onChange={handleFilterChange}
                        input={<BootstrapInput />}
                        name={"availability"}
                        MenuProps={{
                            getContentAnchorEl: null,
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                            }
                        }}
                    >
                        <MenuItem value={false}>Full</MenuItem>
                        <MenuItem value={true}>Open</MenuItem>

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
        </div>
    )
};




export default CourseFilters;