import PropTypes from "prop-types";
import React, {useState} from "react";
import {connect} from "react-redux";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import {Typography} from "@material-ui/core";
import BackButton from "../../BackButton";
import FilterIcon from "@material-ui/icons/FilterList";
import Popover from "@material-ui/core/Popover";
import SearchSelect from "react-select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ForwardArrow from "@material-ui/icons/ArrowForward";
import Hidden from "@material-ui/core/Hidden";

import CourseList from "./CourseList";
import TutoringList from "./TutoringList";

const trimString = (string, maxLen) => {
    if (string.length > maxLen) {
        return `${string.slice(0, maxLen - 3).trim()}...`;
    } else {
        return string;
    }
};

const RegistrationLanding = (props) => {
    const [anchorEl, setAnchorEl] = useState("");
    const [view, setView] = useState(0);
    const [courseFilters, setCourseFilters] = useState({
        "instructor": [],
        "grade": [],
        "subject": [],
    });

    const handleFilterClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.preventDefault();
        setAnchorEl(null);
    };

    const handleFilterChange = (filters, filterType) => {
        setCourseFilters({
            ...courseFilters,
            [filterType]: filters ? filters : [],
        });
    };

    const renderFilter = (filterType) => {
        let options = [];
        switch (filterType) {
            case "instructor":
                options = Object.values(props.instructors).map(
                    ({name, user_id}) => ({
                        "label": name,
                        "value": user_id,
                    })
                );
                break;
            case "subject":
                options = [
                    {"label": "Math", "value": "Math"},
                    {"label": "Science", "value": "Science"},
                ];
                break;
            case "grade":
                options = [...Array(10).keys()].map((i) => ({
                    "label": `${i + 1}`,
                    "value": i + 1,
                }));
                break;
            default:
                return "";
        }
        const CustomClearText = () => "clear all";
        const ClearIndicator = (indicatorProps) => {
            const {
                children = <CustomClearText />,
                getStyles,
                "innerProps": {ref, ...restInnerProps},
            } = indicatorProps;
            return (
                <div
                    {...restInnerProps}
                    ref={ref}
                    style={getStyles("clearIndicator", indicatorProps)}>
                    <div style={{"padding": "0px 5px"}}>{children}</div>
                </div>
            );
        };

        const customStyles = {
            "clearIndicator": (base, state) => ({
                ...base,
                "cursor": "pointer",
                "color": state.isFocused ? "blue" : "black",
            }),
            "option": (base) => ({
                ...base,
                "textAlign": "left",
            }),
        };
        return <SearchSelect
            value={handleFilterClick[filterType]}
            onChange={(event) => {
                handleFilterChange(event, filterType);
            }}
            className="filter-options"
            closeMenuOnSelect={false}
            components={{ClearIndicator}}
            placeholder={`All ${filterType}s`}
            styles={customStyles}
            isMulti
            options={options}
        />;
    };

    let filteredCourses = Object.values(props.courses);
    Object.entries(courseFilters)
        .filter(([, filters]) => filters.length > 0)
        .forEach(([filterName, filters]) => {
            const mappedValues = filters.map(({value}) => value);
            switch (filterName) {
                case "instructor":
                    filteredCourses = filteredCourses.filter(({instructor_id}) =>
                        mappedValues.includes(instructor_id));
                    break;
                case "subject":
                    filteredCourses = filteredCourses.filter(({subject}) =>
                        mappedValues.includes(subject));
                    break;
                case "grade":
                    filteredCourses = filteredCourses.filter(({grade}) =>
                        mappedValues.includes(grade));
                    break;
                default:
                    console.warn(`Unhandled filter ${filterName}`);
            }
        });

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper className="RegistrationLanding paper">
                    <BackButton />
                    <hr />
                    <Grid container layout="row">
                        <Grid item md={7} xs={12}>
                            <Typography
                                variant="h3"
                                align="left"
                                className="heading">
                                Registration Catalog
                            </Typography>
                        </Grid>
                        <Grid item md={5} xs={12} className="catalog-setting-wrapper">
                            <Tabs value={view} className="catalog-setting">
                                <Tab label="Courses" onClick={() => {
                                    setView(0);
                                }} />
                                <Tab label="Tutoring" onClick={() => {
                                    setView(1);
                                }} />
                            </Tabs>
                        </Grid>
                        {/* <Grid item md={1} alignContent="space-between" style={{
                            "margin": "auto 0",
                        }}>
                            <FilterIcon
                                style={{"cursor": "pointer"}}
                                onClick={(event) => {
                                    handleFilterClick(event);
                                }}
                            />
                        </Grid> */}
                    </Grid>
                    <Grid container layout="row" spacing={8}>
                        <Grid item xs={12} md={4}>
                            {renderFilter("instructor")}
                        </Grid>
                        <Hidden xsDown>
                            <Grid item xs={12} md={4}>
                                {renderFilter("subject")}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {renderFilter("grade")}
                            </Grid>
                        </Hidden>
                    </Grid>
                    <div className="registration-table">
                        {
                            view === 0 &&
                            <CourseList filteredCourses={filteredCourses} />
                        }
                        {
                            view === 1 &&
                            <TutoringList filteredCourses={filteredCourses} />
                        }
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
};

const mapStateToProps = (state) => ({
    "courses": state.Course["NewCourseList"],
    "instructors": state.Users["InstructorList"],
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationLanding);
