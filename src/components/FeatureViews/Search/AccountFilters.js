import React, {useState, useEffect, useMemo} from 'react';
import ReactSelect from 'react-select';
import { Grid, Select, Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import {connect, useDispatch} from "react-redux";

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

const BootstrapInput = withStyles(theme => ({
    input: {
        borderRadius: 10,
        position: 'relative',
        border: '1px solid #ced4da',
        fontSize: 16,
        minWidth: 80,
        paddingLeft: '1px',
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
    formControl: {
        top: -15,
        left: 5,
    }
}))(InputBase);





const SearchResultFilter = (props) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(searchActions, dispatch),
        }),
        [dispatch]
    );

    const [profileTypeFilter, setProfileTypeFilter] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");
    const [sortFilter, setSortFilter] = useState("");

    const handleFilterChange = event => {
        console.log(event);
        // props.onFilterChange(event.target.name)
        switch (event.target.name) {
            case "profileType":
                api.updateSearchFilter("account","profile",event.target.value);
                setProfileTypeFilter(event.target.value);
                break;
            case "gradeFilter":
                api.updateSearchFilter("account","grade",event.target.value);
                setGradeFilter(event.target.value);
                break;
            case "sortFilter":
                api.updateSearchFilter("account","sort",event.target.value);
                setSortFilter(event.target.value);
                break;
            default:
                return
        }
    };


    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <>
            <Grid item style={{ padding: "10px" }} className={"searchFilters"}>
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
            <Grid item>
                <FormControl className={""}>
                    <InputLabel htmlFor="gradeFilter" className="input-title" > Grade </InputLabel>
                    <Select
                        value={gradeFilter}
                        onChange={handleFilterChange}
                        input={<BootstrapInput />}
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
        </>
    )
};




export default SearchResultFilter;