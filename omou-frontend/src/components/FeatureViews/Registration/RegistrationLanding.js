import PropTypes from "prop-types";
import React, {useState} from "react";

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

const trimString = (string, maxLen) => {
    if (string.length > maxLen) {
        return `${string.slice(0, maxLen - 3).trim()}...`;
    } else {
        return string;
    }
};

const RegistrationLanding = (props) => {
    const [courses, setCourses] = useState(
        Object.keys(props.courses).filter(
            (courseID) => props.courses[courseID].type === "C"
        ),
    );
    const [anchorEl, setAnchorEl] = useState("");
    const [view, setView] = useState(0);
    const [filter, setFilter] = useState({
        "instructor": [],
        "grade": [],
        "subject": [],
    });

    const goToRoute = (route) => {
        props.history.push(props.match.url + route);
    };

    const handleFilterClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.preventDefault();
        setAnchorEl(null);
    };

    const handleFilterChange = (filters, filterType) => {
        setCourses(filters
            ? Object.keys(props.courses).filter((courseID) => {
                const course = props.courses[courseID];
                switch (filterType) {
                    case "instructor":
                        return filters
                            .map(({value}) => value)
                            .includes(course.instructor_id);
                    case "subject":
                        return filters
                            .map(({value}) => value)
                            .includes(course.subject);
                    case "grade":
                        return filters
                            .map(({value}) => value)
                            .includes(course.grade);
                    default:
                        return true;
                }
            })
            : Object.keys(props.courses));
        setFilter({
            ...filter,
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
                    {"label": "Sat", "value": "Sat"},
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
            "option": (base, state) => ({
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

    const renderCourses = () => courses.map((courseID) => {
        let course = props.courses[courseID],
            start_date = new Date(course.schedule.start_date),
            end_date = new Date(course.schedule.end_date),
            start_time = course.schedule.start_time.substr(1),
            end_time = course.schedule.end_time.substr(1),
            days = course.schedule.days.map((day) => weekday[day].substr(0, 3));
        start_date = start_date.toDateString().substr(3);
        end_date = end_date.toDateString().substr(3);
        const date = `${start_date} - ${end_date}`,
            time = `${start_time} - ${end_time}`;
        return (
            <Paper className="row" key={courseID}>
                <Grid container alignItems="center" layout="row">
                    <Grid
                        item
                        md={3}
                        onClick={(event) => {
                            event.preventDefault();
                            goToRoute(`/course/${course.course_id}`);
                        }}
                        style={{"textDecoration": "none", "cursor": "pointer"}}>
                        <Typography className="course-heading" align="left">
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md={5}
                        onClick={(event) => {
                            event.preventDefault();
                            goToRoute(`/course/${course.course_id}`);
                        }}
                        style={{"textDecoration": "none", "cursor": "pointer"}}>
                        <Grid
                            container className="course-detail">
                            <Grid
                                item
                                md={4}
                                className="heading-det"
                                align="left">
                                Date
                            </Grid>
                            <Grid
                                item
                                md={8}
                                className="value"
                                align="left">
                                {date} | {days} {time}
                            </Grid>
                        </Grid>
                        <Grid container className="course-detail">
                            <Grid
                                item
                                md={4}
                                className="heading-det"
                                align="left">
                                Instructor
                            </Grid>
                            <Grid item md={8}
                                className="value"
                                align="left">
                                {props.instructors[course.instructor_id].name}
                            </Grid>
                        </Grid>
                        <Grid container className="course-detail">
                            <Grid
                                item
                                md={4}
                                className="heading-det"
                                align="left">
                                Tuition
                            </Grid>
                            <Grid
                                item
                                md={8}
                                className="value"
                                align="left">
                                ${course.tuition}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        md={4}
                        className="course-action">
                        <Grid
                            container
                            alignItems="center"
                            layout="row"
                            style={{"height": "100%"}}>
                            <Grid
                                item md={6}
                                className="course-status">
                                <span className="stats">
                                    {course.roster.length} / {course.capacity}
                                </span>
                                <span className="label">
                                    Status
                                </span>
                            </Grid>
                            <Grid item md={6}>
                                <Button
                                    onClick={(event) => {
                                        event.preventDefault();
                                        if (course.capacity > course.roster.length) {
                                            goToRoute(`/form/course/${course.course_id}`);
                                        } else {
                                            alert("The course is filled!");
                                        }
                                    }}
                                    variant="contained"
                                    disabled={course.capacity <= course.filled}
                                    className="button primary">+ REGISTER</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    });

    const renderTutoring = () => {
        const coursesPerRow = 3;
        const coursesSplit = [[]];
        courses.forEach((course) => {
            if (coursesSplit[coursesSplit.length - 1].length === coursesPerRow) {
                coursesSplit.push([course]);
            } else {
                coursesSplit[coursesSplit.length - 1].push(course);
            }
        });
        return (
            <Grid container spacing={8} alignItems="center" direction="row">
                {
                    courses.map((courseID) => {
                        const course = props.courses[courseID];
                        return (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={courseID}
                                onClick={() => {
                                    goToRoute(`/form/tutoring/${courseID}`);
                                }}
                                alignItems="center">
                                <Card className="tutoring-card">
                                    <Grid container>
                                        <Grid
                                            item
                                            xs={11}
                                            component={CardContent}
                                            align="left">
                                            {trimString(course.title, 20)}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={1}
                                            align="center"
                                            component={ForwardArrow}
                                            style={{
                                                "display": "inline",
                                                "margin": "auto 0",
                                            }} />
                                    </Grid>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        );
    };

    const weekday = {
        "0": "Sunday",
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper className="RegistrationLanding paper">
                    <BackButton />
                    <hr />
                    <Grid container layout="row">
                        <Grid item md={6}>
                            <Typography
                                variant="h3"
                                align="left"
                                className="heading">
                                Registration Catalog
                            </Typography>
                        </Grid>
                        <Grid item md={6} style={{
                            "margin": "auto 0",
                        }}>
                            <Tabs value={view} style={{
                                "marginLeft": "2vw",
                            }}>
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
                        <Grid item xs={4}>
                            {renderFilter("instructor")}
                        </Grid>
                        <Grid item xs={4}>
                            {renderFilter("subject")}
                        </Grid>
                        <Grid item xs={4}>
                            {renderFilter("grade")}
                        </Grid>
                    </Grid>
                    <div className="registration-table">
                        {view === 0 && renderCourses()}
                        {view === 1 && renderTutoring()}
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
};

RegistrationLanding.propTypes = {
    "stuffActions": PropTypes.object,
    "RegistrationForms": PropTypes.array,
};

export default withRouter(RegistrationLanding);
