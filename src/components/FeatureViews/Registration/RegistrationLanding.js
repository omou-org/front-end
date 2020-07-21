import React, { useCallback, useState } from "react";

import BackButton from "components/OmouComponents/BackButton";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import SearchSelect from "react-select";
import Button from "@material-ui/core/Button";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import Badge from "@material-ui/core/Badge";
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

import { distinctObjectArray, fullName, gradeOptions } from "utils";
import CourseList from "./CourseList";
import NavLinkNoDup from "components/Routes/NavLinkNoDup";
import Loading from "components/OmouComponents/Loading";
import RegistrationActions from "./RegistrationActions";
import TutoringList from "./TutoringList";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {SIMPLE_COURSE_DATA} from "queryFragments";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";

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
    const CurrentParent = useSelector(
        ({Registration}) => Registration.CurrentParent
    );
    const registeredCourses = useSelector(
        ({ Registration }) => Registration.registered_courses
    );
    const numToCheckout = Object.values(registeredCourses || {}).reduce(
        (count, studentCourses) => count + studentCourses.length,
        0
    );
    const {data, loading, error} = useQuery(GET_COURSES);

    const [view, setView] = useState(0);
    const [courseFilters, setCourseFilters] = useState({
        "grade": [],
        "instructor": [],
        "subject": [],
    });

    const updateView = useCallback(
        (newView) => () => {
            setView(newView);
        },
        [],
    );

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return (
            <Typography>
                There's been an error! Error: {error.message}
            </Typography>
        );
    }

    const {courses} = data;

    const renderCartItems = () =>{
        if(numToCheckout==null){
            return 0;
        }
        else{
            return numToCheckout;
        }
    }

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
                value={courseFilters[filterType]} />
        );
    };

    return (
        <BackgroundPaper className="RegistrationLanding" elevation={2}>
             <Grid container>
                <Grid item md={1}>
                    <BackButton />
                </Grid>
                <Grid item md={10}/>
                <Grid item md={1}>
                    <Button 
                    disabled={CurrentParent===null}
                    component={NavLinkNoDup}
				    to="/registration/cart">
                        <Badge badgeContent={renderCartItems()} showZero color="primary" >
                            <ShoppingCartOutlinedIcon style={{fontSize:30}} />
                        </Badge>
                    </Button>
                </Grid>
            </Grid>
            <hr />
            <RegistrationActions />
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
                        value={view}>
                        <Tab label="Courses" onClick={updateView(0)} />
                        <Tab label="Tutoring" onClick={updateView(1)} />
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
            <Grid className="registration-table" container spacing={5}>
                {view === 0 ?
                    <CourseList filteredCourses={filteredCourses} /> :
                    <TutoringList />}
            </Grid>
        </BackgroundPaper>
    );
};

export default RegistrationLanding;
