import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";

import {fullName} from "utils";
import {useCourse} from "actions/hooks";

const useStyles = makeStyles((theme) => ({
  courseTitle: {
    color: theme.palette.common.black,
    textDecoration: "none",
  },
}));

const CourseList = ({filteredCourses}) => {
  const currentParent = useSelector(
      ({Registration}) => Registration.CurrentParent
  );
  const {courseTitle} = useStyles();
	const courseStatus = useCourse();

  return filteredCourses
	  .filter((course) => course.maxCapacity > 1)
      .map((course) => {
        return (
			<Grid item xs={12} key={course.id}>
              <Paper className="row">
                <Grid alignItems="center" container layout="row">
                  <Grid
                      className={courseTitle}
                      component={Link}
                      item
                      md={3}
                      to={`/registration/course/${course.id}`}
                      xs={12}
                  >
                    <Typography align="left" className="course-heading">
                      {course.title}
                    </Typography>
                  </Grid>
                  <Grid
					  className="no-underline"
					  component={Link}
					  item
					  md={5}
					  to={`/registration/course/${course.id}`}
					  xs={12}
                  >
                    <Grid className="course-detail" container>
                      <Grid align="left" className="heading-det" item md={4} xs={3}>
                        Date
                      </Grid>
                      <Grid align="left" item md={8} xs={9}>
                        <Moment
							format="MMM D YYYY"
							date={course.startDate}
                        />
                        {" - "}
                        <Moment
							format="MMM D YYYY"
							date={course.endDate}
                        />
                      </Grid>
                    </Grid>
                    <Grid className="course-detail" container>
                      <Grid align="left" className="heading-det" item md={4} xs={3}>
                        Time
                      </Grid>
                      <Grid align="left" item md={8} xs={9}>
                        <Moment
							format="dddd h:mm a"
							date={course.startDate + "T" + course.startTime}
                        />
                        {" - "}
                        <Moment
							format="dddd h:mm a"
							date={course.startDate + course.endTime}
                        />
                      </Grid>
                    </Grid>
                    <Grid className="course-detail" container>
                      <Grid align="left" className="heading-det" item md={4} xs={3}>
                        Instructor
                      </Grid>
                      <Grid align="left" item md={8} xs={9}>
						  {fullName(course.instructor.user)}
                      </Grid>
                    </Grid>
                    <Grid className="course-detail" container>
                      <Grid align="left" className="heading-det" item md={4} xs={3}>
                        Tuition
                      </Grid>
                      <Grid align="left" item md={8} xs={9}>
						  ${course.totalTuition}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                      alignItems="center"
                      className="course-action"
                      container
                      item
                      layout="row"
                      md={4}
                      xs={12}
                  >
                    <Grid className="course-status" item xs={6}>
						{course.enrollmentSet.length} / {course.maxCapacity}
                      <span className="label">Enrolled</span>
                    </Grid>
                    <Grid item xs={6}>
                      {currentParent && (
                          <Button
							  className="button primary"
							  component={Link}
							  disabled={course.maxCapacity <= course.enrollmentSet.length}
							  to={`/registration/form/course/${course.id}`}
							  variant="contained"
                          >
                            + REGISTER
                          </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
			</Grid>
        );
    });
};

CourseList.propTypes = {
  filteredCourses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CourseList;
