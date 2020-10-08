import React, {useCallback, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import SearchSelect from "react-select";
import Typography from "@material-ui/core/Typography";

import {distinctObjectArray, fullName, gradeOptions} from "utils";
import CourseList from "./CourseList";
import Loading from "components/OmouComponents/Loading";
import RegistrationActions from "./RegistrationActions";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {SIMPLE_COURSE_DATA} from "queryFragments";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import {getRegistrationCart} from "../../OmouComponents/RegistrationUtils";

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

const CustomClearText = () => "clear all";

const ClearIndicator = (indicatorProps) => {
    const {
        children = <CustomClearText />,
        getStyles,
        "innerProps": {ref, ...restInnerProps},
    } = indicatorProps;
    return (
        <div
            ref={ref}
            style={getStyles("clearIndicator", indicatorProps)}
            {...restInnerProps}>
            <div style={{"padding": "0px 5px"}}>{children}</div>
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
            title
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
            academicLevel
            courseCategory {
                name
                id
             }
          	...SimpleCourse
        }
    }
    ${SIMPLE_COURSE_DATA}`;

const RegistrationLanding = () => {
    const {data, loading, error} = useQuery(GET_COURSES);
    const {currentParent} = getRegistrationCart();
    const [view, setView] = useState(0);
    const [updatedParent, setUpdatedParent] = useState(false);
    const [courseFilters, setCourseFilters] = useState({
        "grade": [],
        "instructor": [],
        "subject": [],
    });
    const [sortType, setSortType] = useState(null);

    useEffect(() => {
        if (currentParent) {
            setUpdatedParent(true);
        }
    }, [])

    const updateView = useCallback(
        (newView) => () => {
            setView(newView);
        },
        [],
    );

    if (loading) {
        return <Loading/>;
    }
    if (error) {
        return (
            <Typography>
                There's been an error! Error: {error.message}
            </Typography>
        );
    }

    const {courses} = data;

    const instructorOptions = distinctObjectArray(
        Object.values(courses)
            .filter(({instructor}) => instructor)
            .map(({instructor}) => ({
                "label": fullName(instructor.user),
                "value": instructor.user.id,
            })),
    );

    const subjectOptions = distinctObjectArray(
        Object.values(courses)
            .filter(({courseCategory}) => courseCategory)
            .map(({courseCategory}) => ({
                "label": courseCategory.name,
                "value": courseCategory.id,
            })),
    );

    const filteredCourses = Object.entries(courseFilters)
        .filter(([, filters]) => filters.length > 0)
        .reduce((courses, [filterName, filters]) => {
            const mappedValues = filters.map(({value}) => value);
            switch (filterName) {
                case "instructor":
                    return courses.filter(({instructor}) => mappedValues.includes(instructor.user.id));
                case "subject":
                    return courses.filter(({courseCategory}) => mappedValues.includes(courseCategory.id));
                case "grade":
                    return courses.filter(({academicLevel}) => mappedValues.includes(academicLevel.toLowerCase()));
                default:
                    return courses;
            }
        }, Object.values(courses));
    
    const sortedCourses = filteredCourses.sort((firstCourse, secondCourse) => {
        switch (sortType) {
            case "title":
                if (firstCourse.title > secondCourse.title) return 1;
                if (firstCourse.title < secondCourse.title) return -1;
                return 0;
            case "seatsLeft":
                return (secondCourse.maxCapacity - secondCourse.enrollmentSet.id) - (firstCourse.maxCapacity - firstCourse.enrollmentSet.id);
            default:
                if (firstCourse.title > secondCourse.title) return 1;
                if (firstCourse.title < secondCourse.title) return -1;
                return 0;
        }
    })

    const handleSortChange = (inputValue) => {
        setSortType(inputValue.value)
    }

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
                value={courseFilters[filterType]}/>
        );
    };

    const handleUpdateParent = (status) => {
        setUpdatedParent(status);
    }
    return (
        <BackgroundPaper className="RegistrationLanding" elevation={2}>
            <Grid container>
                <RegistrationActions updateRegisteringParent={handleUpdateParent} updatedParent={updatedParent}/>
            </Grid>
            <hr/>
            <Grid container layout="row">
                <Grid item md={8} xs={12}>
                    <Typography align="left" className="heading" variant="h3" data-cy="registration-heading">
                        Registration Catalog
                    </Typography>
                </Grid>
                {/*<Grid className="catalog-setting-wrapper" item>*/}
                {/*    <Tabs*/}
                {/*        className="catalog-setting"*/}
                {/*        indicatorColor="primary"*/}
                {/*        value={view}>*/}
                {/*        <Tab label="Courses" onClick={updateView(0)} />*/}
                {/*        <Tab label="Tutoring" onClick={updateView(1)} />*/}
                {/*    </Tabs>*/}
                {/*</Grid>*/}
            </Grid>
            {view === 0 && (
				<Grid item container layout="row" spacing={1}>
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
                        <Grid item md={4} xs={12}>
                            <SearchSelect
                                className="sort-options"
                                closeMenuOnSelect={true}
                                components={{ClearIndicator}}
                                onChange={handleSortChange}
                                options={[
                                    {value: 'seatsLeft', label: 'Sort by: Seats Left'},
                                    {value: 'title', label: 'Sort by: Course Name'}
                                ]}
                                placeholder={'Sort by: Course Name'}
                                styles={customStyles}
                            />
                        </Grid>
                    </Hidden> 
                </Grid>
            )}
            <Grid item className="registration-table" container spacing={5}>
                <CourseList filteredCourses={sortedCourses}/>
                {/*{view === 0 ?*/}
                {/*    <CourseList filteredCourses={filteredCourses} updatedParent={updatedParent}/> :*/}
                {/*    <TutoringList />}*/}
            </Grid>
        </BackgroundPaper>
    );
};

export default RegistrationLanding;
