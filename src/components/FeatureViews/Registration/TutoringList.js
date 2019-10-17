import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import {NavLink} from "react-router-dom";
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

const renderTutoring = (props) => (
    <Grid container spacing={8} alignItems="center" direction="row">
        {
            props.filteredCourses.map((course) => (
                <Grid
                    item
                    xs={12} sm={6} md={4}
                    key={course.course_id}
                    alignItems="center">
                    <Card
                        className="tutoring-card"
                        component={NavLink}
                        to={`/registration/form/tutoring/${course.course_id}`}>
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
            ))
        }
    </Grid>
);

const mapStateToProps = (state) => ({
    "instructors": state.Users["InstructorList"],
    "courses": state.Course["NewCourseList"],
    "courseCategories": state.Course["CourseCategories"],
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(renderTutoring);
