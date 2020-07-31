import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";

import {fullName} from "utils";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import {getRegistrationCart, useValidateRegisteringParent} from "../../OmouComponents/RegistrationUtils";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    "courseTitle": {
        "color": theme.palette.common.black,
        "textDecoration": "none",
    },
    "courseRow": {
        textDecoration: "none"
    }
}));

const CourseList = ({filteredCourses}) => {
    const {currentParent} = getRegistrationCart();
    const {parentIsLoggedIn} = useValidateRegisteringParent();
    const {courseTitle, courseRow} = useStyles();

    return <Table>
        <TableBody>
            {
                filteredCourses
                    .filter(({courseType, endDate}) => (courseType === "CLASS") &&
                        moment().diff(moment(endDate), 'days') < 0)
                    .map((course) => (
                        <TableRow
                            key={course.id}
                            component={Link} to={`/registration/course/${course.id}`}
                            className={courseRow}
                        >
                            <TableCell
                                style={{padding: "3%"}}
                            >
                                <Grid className={courseTitle}
                                      item md={10} xs={12}
                                      container
                                      direction="column"
                                >
                                    <Grid item>
                                        <Typography align="left"
                                                    className="course-heading"
                                                    style={{fontSize: "1.5em", fontWeight: 550, margin: "10px 0"}}
                                        >
                                            {course.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography align="left">
                                            By: {fullName(course.instructor.user)}
                                            {" | "}
                                            <Moment
                                                date={course.startDate}
                                                format="MMM D YYYY"/>
                                            {" - "}
                                            <Moment
                                                date={course.endDate}
                                                format="MMM D YYYY"/> {" "}
                                            <Moment date={`${course.startDate}T${course.startTime}`}
                                                    format="dddd h:mm a"/>
                                            {" - "}
                                            <Moment
                                                date={`${course.startDate}T${course.endTime}`}
                                                format="dddd h:mm a"/>
                                            {" | "}
                                            ${course.totalTuition}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <span style={{margin: "5px", display: "block"}}>
                                    {course.enrollmentSet.length} / {course.maxCapacity}
                                    <span className="label">Enrolled</span>
                                </span>

                                {(currentParent || parentIsLoggedIn) && (
                                    <Button component={Link}
                                            disabled={course.maxCapacity <= course.enrollmentSet.length}
                                            to={`/registration/form/course/${course.id}`}
                                            variant="contained"
                                            color="primary"
                                    >
                                        + REGISTER
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
            }
        </TableBody>
    </Table>
};

CourseList.propTypes = {
    "filteredCourses": PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CourseList;
