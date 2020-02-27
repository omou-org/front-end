import * as hooks from "actions/hooks";
import React, {useCallback, useMemo, useState} from "react";
// react/redux imports
import {useSelector} from "react-redux";

import BackButton from "components/BackButton";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import SearchSelect from "react-select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import Loading from "../../Loading";
import CourseList from "./CourseList";
import TutoringList from "./TutoringList";
import RegistrationActions from "./RegistrationActions";

const NUM_GRADES = 13;

const gradeOptions = Array(NUM_GRADES).map((_, gradeNum) => ({
    "label": `${gradeNum + 1}`,
    "value": gradeNum + 1,
}));

const RegistrationLanding = () => {
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const courseStatus = hooks.useCourse();
    hooks.useInstructor();

    const [view, setView] = useState(0);
    const [courseFilters, setCourseFilters] = useState({
        "grade": [],
        "instructor": [],
        "subject": [],
    });

    const updateView = useCallback((newView) => () => {
        setView(newView);
    }, []);

    const instructorOptions = useMemo(() => Object.values(instructors)
        .map(({name, user_id}) => ({
            "label": name,
            "value": user_id,
        })), [instructors]);

    const filteredCourses = useMemo(
        () => Object.entries(courseFilters)
            .filter(([, filters]) => filters.length > 0)
            .reduce((courseList, [filterName, filters]) => {
                const mappedValues = filters.map(({value}) => value);
                switch (filterName) {
                    case "instructor":
                        return courseList.filter(({instructor_id}) =>
                            mappedValues.includes(instructor_id));
                    case "subject":
                        return courseList.filter(({subject}) =>
                            mappedValues.includes(subject));
                    case "grade":
                        return courseList.filter(({grade}) =>
                            mappedValues.includes(grade));
                    default:
                        return courseList;
                }
            }, Object.values(courses))
        , [courses, courseFilters]
    );

    const handleFilterChange = useCallback((filterType) => (filters) => {
        setCourseFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: filters || [],
        }));
    }, []);

    if (hooks.isLoading(courseStatus) && Object.entries(courses).length === 0) {
        return <Loading />;
    }

    if (hooks.isFail(courseStatus) && Object.entries(courses).length) {
        return "Unable to load courses!";
    }

    const renderFilter = (filterType) => {
        let options = [];
        switch (filterType) {
            case "instructor":
                options = instructorOptions;
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
                options = gradeOptions;
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
                "color": state.isFocused
                    ? "blue"
                    : "black",
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
                components={{ClearIndicator}}
                isMulti
                onChange={handleFilterChange(filterType)}
                options={options}
                placeholder={`All ${filterType}s`}
                styles={customStyles}
                value={courseFilters[filterType]} />
        );
    };

    return (
        <Paper elevation={2} className="RegistrationLanding paper">
            <BackButton />
            <hr />
            <RegistrationActions/>
            <Grid
                container
                layout="row">
                <Grid
                    item
                    md={8}
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
                    md={4}
                    xs={12}
                    >
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
    );
};

export default RegistrationLanding;
