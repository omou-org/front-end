import React, {useCallback, useState} from "react";

import BackButton from "components/BackButton";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import SearchSelect from "react-select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import {distinctObjectArray, fullName, gradeOptions} from "utils";
import CourseList from "./CourseList";
import Loading from "components/Loading";
import RegistrationActions from "./RegistrationActions";
import TutoringList from "./TutoringList";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

const customStyles = {
    clearIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? "blue" : "black",
        cursor: "pointer",
    }),
    option: (base) => ({
        ...base,
        textAlign: "left",
    }),
};

const CustomClearText = () => "clear all";

const ClearIndicator = (indicatorProps) => {
    const {
        children = <CustomClearText/>,
        getStyles,
        innerProps: {ref, ...restInnerProps},
    } = indicatorProps;
    return (
        <div
            ref={ref}
            style={getStyles("clearIndicator", indicatorProps)}
            {...restInnerProps}
        >
            <div style={{padding: "0px 5px"}}>{children}</div>
        </div>
    );
};

export const GET_COURSES = gql`
	query CourseList {
		courses {
            endDate
            endTime
            startTime
            startDate
            subject
            totalTuition
            instructor {
              user {
                firstName
                lastName
                id
              }
            }
            enrollmentSet {
              id
            }
            maxCapacity
            courseType
            academicLevel
            courseCategory { 
                name
                id
             }
          }
	}
	`;

const RegistrationLanding = () => {
	const {data, loading, error} = useQuery(GET_COURSES);

    const [view, setView] = useState(0);
    const [courseFilters, setCourseFilters] = useState({
        grade: [],
        instructor: [],
        subject: [],
    });

    const updateView = useCallback(
        (newView) => () => {
            setView(newView);
        },
        []
    );

	if (loading) {
		return <Loading/>
	}
	if (error) {
		return <Typography>
			There's been an error! Error: {error.message}
		</Typography>
	}

	const {courses} = data;


	const instructorOptions = distinctObjectArray(
		Object.values(courses).map(({instructor}) => ({
			label: fullName(instructor.user),
			value: instructor.user.id,
		})));

	const subjectOptions = distinctObjectArray(
        Object.values(courses)
        // prevent a crash if some categories are not loaded yet
			.filter(({courseCategory}) => courses.find(({courseCategory: {id}}) => courseCategory.id == id))
			.map(({courseCategory}) => ({
				label: courseCategory.name,
				value: courseCategory.id,
            }))
    );

	const filteredCourses = Object.entries(courseFilters)
        .filter(([, filters]) => filters.length > 0)
		.reduce((courses, [filterName, filters]) => {
            const mappedValues = filters.map(({value}) => value);
            switch (filterName) {
                case "instructor":
					return courses.filter(({instructor}) =>
						mappedValues.includes(instructor.user.id)
                    );
                case "subject":
					return courses.filter(({courseCategory}) =>
						mappedValues.includes(courseCategory.id)
                    );
                case "grade":
					return courses.filter(({academicLevel}) =>
						mappedValues.includes(academicLevel.toLowerCase())
                    );
                default:
					return courses;
            }
		}, Object.values(courses));

	const handleFilterChange = (filterType) => (filters) => {
            setCourseFilters((prevFilters) => ({
                ...prevFilters,
                [filterType]: filters || [],
            }));
	};

	const renderFilter = (filterType) => {
            let options = [];
            switch (filterType) {
                case "instructor":
                    options = instructorOptions;
                    break;
                case "subject":
                    options = subjectOptions;
                    break;
                case "grade":
                    options = gradeOptions;
                    break;
                // no default
            }

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
                    value={courseFilters[filterType]}
                />
            );
	};

    return (
        <Paper elevation={2} className="RegistrationLanding paper">
            <BackButton/>
            <hr/>
            <RegistrationActions/>
            <Grid container layout="row">
                <Grid item md={8} xs={12}>
                    <Typography align="left" className="heading" variant="h3">
                        Registration Catalog
                    </Typography>
                </Grid>
                <Grid className="catalog-setting-wrapper" item>
                    <Tabs
                        className="catalog-setting"
                        indicatorColor="primary"
                        value={view}
                    >
                        <Tab label="Courses" onClick={updateView(0)}/>
                        <Tab label="Tutoring" onClick={updateView(1)}/>
                    </Tabs>
                </Grid>
            </Grid>
            {view === 0 && (
                <Grid container layout="row" spacing={1}>
                    <Grid item md={4} xs={12}>
                        {renderFilter("instructor")}
                    </Grid>
                    <Hidden xsDown>
                        <Grid item md={4} xs={12}>
                            {renderFilter("subject")}
                        </Grid>
                        <Grid item md={4} xs={12}>
                            {renderFilter("grade")}
                        </Grid>
                    </Hidden>
                </Grid>
            )}
            <div className="registration-table">
				{view === 0 ? (
                    <CourseList filteredCourses={filteredCourses}/>
                ) : (
                    <TutoringList/>
                )}
            </div>
        </Paper>
    );
};

export default RegistrationLanding;
