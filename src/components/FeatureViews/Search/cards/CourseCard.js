import React from "react";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import "../Search.scss";
import {truncateStrings} from "utils";
import {LabelBadge} from "../../../../theme/ThemedComponents/Badge/LabelBadge";

const getLocaleDateString = (start, end) => {
    if (start && end) {
        const s1 = new Date(start.replace(/-/ug, "/"));
        const s2 = new Date(end.replace(/-/ug, "/"));
        return `${s1.toLocaleDateString()} - ${s2.toLocaleDateString()}`;
    }
};

const COURSE_QUERY = gql`
    query CourseFetch($courseID: ID!) {
        course(courseId: $courseID) {
            instructor {
                user {
                    firstName
                    lastName
                }
            }
            enrollmentSet {
                id
            }
            maxCapacity
            endDate
            title
            startDate
        }
    }
`;

const CourseCard = ({courseID, isLoading = false}) => {
    const {data, loading} = useQuery(COURSE_QUERY, {
        "variables": {courseID},
    });

    if (loading || isLoading) {
        return (
            <Grid item xs={3}>
                <Card style={{"height": "148px"}}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom
                            variant="h4">
                            Loading...
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    const {course} = data;
    const instructorName = `${course.instructor.user.firstName} ${course.instructor.user.lastName}`;

    return (
        <Link style={{
            "padding": "10px",
            "textDecoration": "none",
        }} to={`/registration/course/${courseID}`}>
            <Card className="CourseCard" style={{"height": "148px"}}>
                <Grid container>
                    <Grid align="left" item sm={12}>
                        <Typography
                            align="left"
                            variant="subtitle2">
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid align="left" item sm="auto">
                        {course.maxCapacity > course.enrollmentSet.length ?
                            <LabelBadge label="Open" variant="status-new"/> :
                            <LabelBadge label="Full" variant="status-past" />}
                    </Grid>
                    <Grid container item>
                        <Grid align="left" className="courseRow" item xs={12}>
                            <Typography className="courseText">
                                Dates: {getLocaleDateString(
                                    course.startDate,
                                    course.endDate,
                                )}
                            </Typography>
                        </Grid>
                        <Grid align="left" className="courseRow" item xs={12}>
                            <Tooltip title={course.title}>
                                <Typography className="courseText">
                                    Name: {truncateStrings(course.title, 20)}
                                </Typography>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid className="courseRow" item>
                        <Typography className="courseText">
                            Teacher: {instructorName}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        </Link>
    );
};

CourseCard.propTypes = {
    "courseID": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    "isLoading": PropTypes.bool,
};

export default CourseCard;
