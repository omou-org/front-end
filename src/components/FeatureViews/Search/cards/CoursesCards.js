import React, {useCallback} from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import "../Search.scss";
import * as hooks from "actions/hooks";
import {truncateStrings} from "utils";

const handleLocaleDateString = (start, end) => {
    if (start && end) {
        const s1 = new Date(start.replace(/-/ug, "/"));
        const s2 = new Date(end.replace(/-/ug, "/"));
        return `${s1.toLocaleDateString()} - ${s2.toLocaleDateString()}`;
    }
};

const CourseCards = ({course, isLoading = false}) => {
    const history = useHistory();
    const instructors = useSelector(({Users}) => Users.InstructorList);
    hooks.useInstructor(course && course.instructor);

    const goToCoursePage = useCallback((event) => {
        event.preventDefault();
        const courseID = course.course_id || course.id;
        history.push(`/registration/course/${courseID}/${course.subject}`);
    }, [course, history]);

    if (!course || isLoading) {
        return (
            <Grid
                item
                xs={3}>
                <Card style={{"height": "148px"}}>
                    <CardContent>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h4">
                            Loading...
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    return (
        <Grid
            item
            onClick={goToCoursePage}
            sm={3}
            style={{"padding": "10px"}}
            xs={12}>
            <Card
                className="CourseCards"
                style={{
                    "cursor": "pointer",
                    "height": "148px",
                }}>
                <Grid container>
                    <Grid
                        item
                        align="left"
                        sm={12}>
                        <Typography
                            align="left"
                            variant="subtitle2">
                            {course.subject}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        align="left"
                        sm="auto">
                        {
                            course.max_capacity > course.enrollment_list.length
                                ? <Chip
                                    color="primary"
                                    label="Open"
                                    style={{
                                        "color": "white",
                                        "cursor": "pointer",
                                        "height": "15px",
                                        "width": "9rem",
                                    }} />
                                : <Chip
                                    color="secondary"
                                    label="Full"
                                    style={{
                                        "color": "white",
                                        "cursor": "pointer",
                                        "height": "15px",
                                        "width": "9rem",
                                    }} />
                        }
                    </Grid>
                    <Grid
                        container
                        item>
                        <Grid 
                        item align="left" xs={12}
                            className="courseRow">
                            <Typography className="courseText">
                                Dates: {
                                    handleLocaleDateString(
                                        course.start_date,
                                        course.end_date
                                    )
                                }
                            </Typography>
                        </Grid>
                        <Grid
                            item align="left" xs={12}
                            className="courseRow">
                            <Tooltip title={course.subject}>
                                <Typography className="courseText">
                                    Name: {truncateStrings(course.subject, 20)}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid
                            item align="left" xs={12}
                            className="courseRow">
                            <Typography className="courseText">
                                    Teacher: {
                                    instructors[course.instructor]
                                        ? instructors[course.instructor].name
                                        : "Loading..."
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
};

CourseCards.propTypes = {
    "course": PropTypes.object.isRequired,
    "isLoading": PropTypes.bool,
};

export default CourseCards;
