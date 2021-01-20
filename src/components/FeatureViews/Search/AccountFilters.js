import React, {useCallback} from "react";
import {useHistory} from "react-router-dom";

import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

import "./Search.scss";
import {BootstrapInput} from "../Scheduler/SchedulerUtils";
import {useSearchParams} from "actions/hooks";

const AccountFilters = () => {
    const history = useHistory();
    const searchParams = useSearchParams();

    const handleFilterChange = useCallback(({"target": {name, value}}) => {
        const params = new URLSearchParams(searchParams);
        switch (name) {
            case "profileType":
                if (value === "user") {
                    params.delete("profile");
                } else {
                    params.set("profile", value);
                }
                break;
            case "gradeFilter":
                if (value === "grade") {
                    params.delete("grade");
                } else {
                    params.set("grade", value);
                }
                break;
            case "sortFilter":
                if (value === "relevance") {
                    params.delete("sort");
                } else {
                    params.set("sort", value);
                }
                break;
            // no default
        }
        history.push({
            "pathname": "/search/",
            "search": params.toString(),
        });
    }, [history, searchParams]);

    return (
        <Grid alignItems="center" container direction="row" item spacing={2}>
            <Grid item>
                <Typography align="left" variant="subtitle1">
                    Filter |
                </Typography>
            </Grid>
            <Grid item>
                <FormControl className="search-filter-wrapper">
                    <Select
                        input={<BootstrapInput id="filter-student"
                            name="profileType" />}
                        onChange={handleFilterChange}
                        value={searchParams.get("profile") || "user"}>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="parent">Parent</MenuItem>
                        <MenuItem value="instructor">Instructor</MenuItem>
                        <MenuItem value="receptionist">Receptionist</MenuItem>
                        <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            {/* <Grid item>
                <FormControl className="search-filter-wrapper">
                    <Select
                        disabled={searchParams.get("profile") !== "student"}
                        input={<BootstrapInput id="filter-grade"
                            name="gradeFilter" />}
                        onChange={handleFilterChange}
                        value={searchParams.get("grade") || "grade"}>
                        <MenuItem value="grade">Grade</MenuItem>
                        <MenuItem value="1">1st Grade</MenuItem>
                        <MenuItem value="2">2nd Grade</MenuItem>
                        <MenuItem value="3">3rd Grade</MenuItem>
                        <MenuItem value="4">4th Grade</MenuItem>
                        <MenuItem value="5">5th Grade</MenuItem>
                        <MenuItem value="6">6th Grade</MenuItem>
                        <MenuItem value="7">7th Grade</MenuItem>
                        <MenuItem value="8">8th Grade</MenuItem>
                        <MenuItem value="9">9th Grade</MenuItem>
                        <MenuItem value="10">10th Grade</MenuItem>
                        <MenuItem value="11">11th Grade</MenuItem>
                        <MenuItem value="12">12+ Grades</MenuItem>
                    </Select>
                </FormControl>
            </Grid> */}
            <Grid item>
                <Typography variant="subtitle1">Sort | </Typography>
            </Grid>
            <Grid item>
                <FormControl className="search-filter-wrapper">
                    <Select
                        input={<BootstrapInput id="filter-sort"
                            name="sortFilter" />}
                        onChange={handleFilterChange}
                        value={searchParams.get("sort") || "relevance"}>
                        <MenuItem value="relevance">Relevance</MenuItem>
                        <MenuItem value="alphaAsc">First Name: A - Z</MenuItem>
                        <MenuItem value="alphaDesc">First Name: Z - A</MenuItem>
                        <MenuItem value="updateDesc">Recently Updated</MenuItem>
                        <MenuItem value="updateAsc">Oldest Updated</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default AccountFilters;
