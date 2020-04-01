import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment"

import {capitalizeString, courseDateFormat} from "utils";

const useStyles = makeStyles((theme) => ({
	courseTitle: {
		color: theme.palette.common.black,
		textDecoration: "none",
	},
}));

const CourseList = ({filteredCourses}) => {
	const instructors = useSelector(({Users}) => Users.InstructorList);
	const currentParent = useSelector(
		({Registration}) => Registration.CurrentParent
	);
	const {courseTitle} = useStyles();
	return filteredCourses
		.filter((course) => course.capacity > 1)
		.map((course) => {
			const {
				start_date,
				end_date,
				start_time,
				end_time,
				days,
			} = courseDateFormat(course);
			const date = `${start_date} - ${end_date}`,
				time = `${start_time} - ${end_time}`;
				console.log(course)
			return (
				<Grow in key={course.course_id}>
					<Paper className="row">
						<Grid alignItems="center" container layout="row">
							<Grid
								className={courseTitle}
								component={Link}
								item
								md={3}
								to={`/registration/course/${course.course_id}`}
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
								to={`/registration/course/${course.course_id}`}
								xs={12}
							>
								<Grid className="course-detail" container>
									<Grid align="left" className="heading-det" item md={4} xs={3}>
										Date
									</Grid>
									<Grid align="left" item md={8} xs={9}>
										<Moment format="MMM D YYYY" date={course.schedule.start_date}/>
										{" - "}
										<Moment format="MMM D YYYY" date={course.schedule.end_date}/>
									</Grid>
								</Grid>
								<Grid className="course-detail" container>
									<Grid align="left" className="heading-det" item md={4} xs={3}>
										Time
									</Grid>
									<Grid align="left" item md={8} xs={9}>
										<Moment format="dddd h:mm a"date={course.schedule.start_date+course.schedule.start_time}/>
										{" - "}
										<Moment format="dddd h:mm a"date={course.schedule.end_date+course.schedule.end_time}/>
									</Grid>
								</Grid>
								<Grid className="course-detail" container>
									<Grid align="left" className="heading-det" item md={4} xs={3}>
										Instructor
									</Grid>
									<Grid align="left" item md={8} xs={9}>
										{instructors[course.instructor_id] &&
										instructors[course.instructor_id].name}
									</Grid>
								</Grid>
								<Grid className="course-detail" container>
									<Grid align="left" className="heading-det" item md={4} xs={3}>
										Tuition
									</Grid>
									<Grid align="left" item md={8} xs={9}>
										{course.total_tuition && `$${course.total_tuition}`}
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
									{course.roster.length} / {course.capacity}
									<span className="label">Enrolled</span>
								</Grid>
								<Grid item xs={6}>
									{currentParent && (
										<Button
											className="button primary"
											component={Link}
											disabled={course.capacity <= course.roster.length}
											to={`/registration/form/course/${course.course_id}`}
											variant="contained"
										>
											+ REGISTER
										</Button>
									)}
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grow>
			);
    });
};

CourseList.propTypes = {
	filteredCourses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CourseList;
