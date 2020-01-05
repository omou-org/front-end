import React, {useMemo, useState} from 'react';
import {Grid, Select} from "@material-ui/core";
import {bindActionCreators} from "redux";
import * as searchActions from "../../../actions/searchActions";
import {useDispatch} from "react-redux";

import Typography from "@material-ui/core/Typography"
//Material-ui Select
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import "./Search.scss";
import {BootstrapInput} from "../Scheduler/SchedulerUtils";

const SearchResultFilter = () => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(searchActions, dispatch),
        }),
        [dispatch]
    );
    const [profileTypeFilter, setProfileTypeFilter] = useState("User");
    const [gradeFilter, setGradeFilter] = useState("Grade");
    const [sortFilter, setSortFilter] = useState("Relevance");

    const handleFilterChange = () => (event) => {
        switch (event.target.name) {
            case "profileType":
                api.updateSearchParam("account", "profile", event.target.value);
                setProfileTypeFilter(event.target.value);
                break;
            case "gradeFilter":
                api.updateSearchParam("account", "gradeFilter", event.target.value);
                setGradeFilter(event.target.value);
                break;
            case "sortFilter":
                api.updateSearchParam("account", "sortAccount", event.target.value);
                setSortFilter(event.target.value);
                break;
            default:
                return
        }
    };

    return (
        <>
            <Grid item  >
                <Grid container
                      spacing={16}
                      direction="row"
                      alignItems="center">
                    <Grid item>
                        <Typography variant={"subtitle1"} align="left"> Filter | </Typography>
                    </Grid>
                    <Grid item>
                        <FormControl className="search-filter-wrapper" >
                            <Select
                                value={profileTypeFilter}
                                onChange={handleFilterChange()}
                                input={
                                    <BootstrapInput name={"profileType"} id={"filter-student"}/>
                                }
                            >
                                <MenuItem value={"User"}>User</MenuItem>
                                <MenuItem value={"student"}>Student</MenuItem>
                                <MenuItem value={"instructor"}>Instructor</MenuItem>
                                <MenuItem value={"receptionist"}>Receptionist</MenuItem>
                                <MenuItem value={"administrator"}>Administrator</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl className="search-filter-wrapper">
                            <Select
                                value={gradeFilter}
                                onChange={handleFilterChange()}
                                input={
                                    <BootstrapInput name={"gradeFilter"} id={"filter-grade"}/>
                                }
                            >
                                <MenuItem value={"Grade"}>Grade</MenuItem>
                                <MenuItem value={"1"}>1st Grade</MenuItem>
                                <MenuItem value={"2"}>2nd Grade</MenuItem>
                                <MenuItem value={"3"}>3rd Grade</MenuItem>
                                <MenuItem value={"4"}>4th Grade</MenuItem>
                                <MenuItem value={"5"}>5th Grade</MenuItem>
                                <MenuItem value={"6"}>6th Grade</MenuItem>
                                <MenuItem value={"7"}>7th Grade</MenuItem>
                                <MenuItem value={"8"}>8th Grade</MenuItem>
                                <MenuItem value={"9"}>9th Grade</MenuItem>
                                <MenuItem value={"10"}>10th Grade</MenuItem>
                                <MenuItem value={"11"}>11th Grade</MenuItem>
                                <MenuItem value={"12"}>12+ Grades</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Typography variant={"subtitle1"}> Sort | </Typography>
                    </Grid>
                    <Grid item>
                        <FormControl className="search-filter-wrapper">
                            <Select
                                value={sortFilter}
                                onChange={handleFilterChange()}
                                input={
                                    <BootstrapInput name={"sortFilter"} id={"filter-sort"}/>
                                }
                            >
                                <MenuItem value={"Relevance"}>Relevance</MenuItem>
                                <MenuItem value={"alphaAsc"}>First Name: A - Z</MenuItem>
                                <MenuItem value={"alphaDesc"}>First Name: Z - A</MenuItem>
                                <MenuItem value={"updateDesc"}>Recently Updated</MenuItem>
                                <MenuItem value={"updateAsc"}>Oldest Updated</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
};

export default SearchResultFilter;