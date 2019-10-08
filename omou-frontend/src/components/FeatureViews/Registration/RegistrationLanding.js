import {connect} from "react-redux";
import React, {useMemo, useState} from "react";
import PropTypes from "prop-types";

// material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SearchSelect from "react-select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import BackButton from "../../BackButton";
import CourseList from "./CourseList";
import TutoringList from "./TutoringList";

const RegistrationLanding = ({courses, instructors}) => {
    const [view, setView] = useState(0);
    const [courseFilters, setCourseFilters] = useState({
        "instructor": [],
        "grade": [],
        "subject": [],
    });

    const changeView = (viewIndex) => () => {
        setView(viewIndex);
    };

    const handleFilterChange = (filterType) => (filters) => {
        setCourseFilters({
            ...courseFilters,
            [filterType]: filters ? filters : [],
        });
    };

    const instructorOptions = useMemo(() =>
        Object.values(instructors).map(({name, user_id}) => ({
            "label": name,
            "value": user_id,
        })), [instructors]);

    const renderFilter = (filterType) => {
        let options = [];
        switch (filterType) {
            case "instructor":
                options = instructorOptions;
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

    return (
        <Paper className="RegistrationLanding paper">
            <BackButton />
            <hr />
            <Grid
                alignContent="flex-start"
                alignItems="center"
                container
                layout="row">
                <Typography
                    align="left"
                    className="heading"
                    component={Grid}
                    item
                    sm={6}
                    variant="h3"
                    xs={12}>
                    Registration Catalog
                </Typography>
                <Tabs
                    className="catalog-setting"
                    component={Grid}
                    item
                    sm={6}
                    value={view}
                    xs={12}>
                    <Tab
                        label="Courses"
                        onClick={changeView(0)} />
                    <Tab
                        label="Tutoring"
                        onClick={changeView(1)} />
                </Tabs>
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
    );
};

RegistrationLanding.propTypes = {
    "courses": PropTypes.object.isRequired,
    "instructors": PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    "courses": state.Course.NewCourseList,
    "instructors": state.Users.InstructorList,
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationLanding);
