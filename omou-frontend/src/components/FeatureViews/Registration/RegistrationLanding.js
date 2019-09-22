// react/redux imports
import * as apiActions from "../../../actions/apiActions";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

// material ui imports
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import SearchSelect from "react-select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {Typography} from "@material-ui/core";

// component imports
import CourseList from "./CourseList";
import TutoringList from "./TutoringList";

import {GET} from "../../../actions/actionTypes.js";

const NUM_GRADES = 10;

// eslint-disable-next-line max-statements
const RegistrationLanding = ({api, courses, instructors, requestStatus}) => {
    const [view, setView] = useState(0);
    const [courseFilters, setCourseFilters] = useState({
        "grade": [],
        "instructor": [],
        "subject": [],
    });

    const updateView = (newView) => () => {
        setView(newView);
    };

    useEffect(() => {
        api.fetchInstructors();
        api.fetchCourses();
    }, [api]);

    const handleFilterChange = (filterType) => (filters) => {
        setCourseFilters({
            ...courseFilters,
            [filterType]: filters || [],
        });
    };

    const renderFilter = (filterType) => {
        let options = [];
        switch (filterType) {
            case "instructor":
                options = Object.values(instructors)
                    .map(({name, user_id}) => ({
                        "label": name,
                        "value": user_id,
                    }));
                break;
            case "subject":
                options = [
                    {
                        "label": "Math",
                        "value": "Math",
                    },
                    {
                        "label": "Science",
                        "value": "Science",
                    },
                ];
                break;
            case "grade":
                options = [...Array(NUM_GRADES).keys()]
                    .map((i) => ({
                        "label": `${i + 1}`,
                        "value": i + 1,
                    }));
                break;
            default:
                return "";
        }

        const customStyles = {
            "clearIndicator": (base, state) => ({
                ...base,
                "color": state.isFocused ? "blue" : "black",
                "cursor": "pointer",
            }),
            "option": (base) => ({
                ...base,
                "textAlign": "left",
            }),
        };

        return (
            <SearchSelect
                className="filter-options"
                closeMenuOnSelect={false}
                isMulti
                onChange={handleFilterChange(filterType)}
                options={options}
                placeholder={`All ${filterType}s`}
                styles={customStyles} />
        );
    };

    let filteredCourses = Object.values(courses);
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

    if (typeof requestStatus.instructor[GET][apiActions.REQUEST_ALL] === "undefined") {
        return "HAVE NOT REQUESTED INSTRUCTORS YET";
    }

    if (typeof requestStatus.course[GET][apiActions.REQUEST_ALL] === "undefined") {
        return "HAVE NOT REQUESTED COURSES YET";
    }

    if (requestStatus.instructor[GET][apiActions.REQUEST_ALL] === apiActions.REQUEST_STARTED &&
        requestStatus.course[GET][apiActions.REQUEST_ALL] === apiActions.REQUEST_STARTED) {
        return "LOADING";
    }

    if (requestStatus.instructor[GET][apiActions.REQUEST_ALL] === apiActions.REQUEST_FAILED &&
        requestStatus.course[GET][apiActions.REQUEST_ALL] === apiActions.REQUEST_FAILED) {
        return "ERROR LOADING COURSES";
    }

    return (
        <>
            <Paper className="RegistrationLanding paper">
                <BackButton />
                <hr />
                <Grid
                    container
                    layout="row">
                    <Grid
                        item
                        md={7}
                        xs={12}>
                        <Typography
                            align="left"
                            className="heading"
                            variant="h3">
                            Registration Catalog
                        </Typography>
                    </Grid>
                    <Grid
                        className="catalog-setting-wrapper"
                        item
                        md={5}
                        xs={12}>
                        <Tabs
                            className="catalog-setting"
                            value={view}>
                            <Tab
                                label="Courses"
                                onClick={updateView(0)} />
                            <Tab
                                label="Tutoring"
                                onClick={updateView(1)} />
                        </Tabs>
                    </Grid>
                </Grid>
                <Grid
                    container
                    layout="row"
                    spacing={8}>
                    <Grid
                        item
                        md={4}
                        xs={12}>
                        {renderFilter("instructor")}
                    </Grid>
                    <Hidden xsDown>
                        <Grid
                            item
                            md={4}
                            xs={12}>
                            {renderFilter("subject")}
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={12}>
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
        </>
    );
};

RegistrationLanding.propTypes = {
    "api": PropTypes.object.isRequired,
    "courses": PropTypes.object.isRequired,
    "instructors": PropTypes.object.isRequired,
    "requestStatus": PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    "courses": state.Course.NewCourseList,
    "instructors": state.Users.InstructorList,
    "requestStatus": state.Api,
});

const mapDispatchToProps = (dispatch) => ({
    "api": bindActionCreators(apiActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationLanding);
