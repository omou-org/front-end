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

const CourseFilters = (props) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(searchActions, dispatch),
        }),
        [dispatch]
    );

    const [classFilter, setClassFilter] = useState("Course Type");
    const [availability, setAvailability] = useState("both");
    const [sortFilter, setSortFilter] = useState("relevance");

    const handleFilterChange = () => (event) => {
        switch (event.target.name) {
            case "classFilter":
                api.updateSearchParam("course", "courseType", event.target.value);
                setClassFilter(event.target.value);
                break;
            // case "subjectFilter":
            //     api.updateSearchFilter("course", "subject", event.target.value)
            //     setSubjectFilter(event.target.value);
            //     break;
            case "availability":
                api.updateSearchParam("course", "availability", event.target.value);
                setAvailability(event.target.value);
                break;
            case "sortFilter":
                api.updateSearchParam("course", "sortCourse", event.target.value);
                setSortFilter(event.target.value);
                break;
            default:
                return;
        }
    };

    return (
        <div className="courseFilters">
            <Grid item style={{ paddingTop: '5px', marginRight: '10px' }}>
                <Typography variant={"subtitle1"}> Filter | </Typography>
            </Grid>
            <Grid item className="spacing">
                <FormControl>
                    <Select
                        value={classFilter}
                        onChange={handleFilterChange()}
                        input={<BootstrapInput name={"classFilter"}/>}
                    >
                        <MenuItem value={"Course Type"}>Course Type</MenuItem>
                        <MenuItem value={"class"}>Class</MenuItem>
                        <MenuItem value={"group"}>Group</MenuItem>
                        <MenuItem value={"tutoring"}>Tutoring</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                <FormControl className={""}>
                    <Select
                        value={availability}
                        onChange={handleFilterChange()}
                        input={<BootstrapInput name={"availability"}/>}
                    >
                        <MenuItem value={"both"}>Open & Full</MenuItem>
                        <MenuItem value={"filled"}>Full</MenuItem>
                        <MenuItem value={"open"}>Open</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item style={{ paddingTop: '5px', margin: '0px 20px 0px 20px' }}>
                <Typography variant={"subtitle1"}> Sort | </Typography>
            </Grid>
            <Grid item>
                <FormControl className={""}>
                    <Select
                        value={sortFilter}
                        onChange={handleFilterChange()}
                        input={<BootstrapInput name={"sortFilter"}/>}
                    >
                        <MenuItem value={"relevance"}>Relevance</MenuItem>
                        <MenuItem value={"dateAsc"}>Recent - Future</MenuItem>
                        <MenuItem value={"dateDesc"}>Future - Recent</MenuItem>
                        <MenuItem value={"timeDesc"}>Later Time - Earlier Time </MenuItem>
                        <MenuItem value={"timeAsc"}>Earlier Time - Later Time</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </div>
    )
};




export default CourseFilters;