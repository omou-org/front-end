import React from "react";
import PropTypes from "prop-types";

import {Link, useLocation} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {dateTimeToDate} from "utils";
import NoListAlert from "components/NoListAlert";
import Moment from "react-moment";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

const today = dateTimeToDate(new Date());

const paymentStatus = (numPaidCourses) => {
	if (numPaidCourses > 3) {
		return "good";
	} else if (0 < numPaidCourses && numPaidCourses <= 3) {
		return "warning";
	}
	return "bad";
};

export const GET_STUDENT_ENROLLMENTS = gql`
	query StudentEnrollments($studentId: ID!) { 
		enrollments(studentId: $studentId) {
			id
			enrollmentBalance
			sessionsLeft
			lastPaidSessionDatetime
			course {
			  title
			  endDate
			  startDate
			  endTime
			  startTime
			  id
			}
		}
	}
`;

const StudentCourseViewer = ({studentID, current}) => {
	const {pathname} = useLocation();

	const {data, loading, error} = useQuery(GET_STUDENT_ENROLLMENTS, {
		variables: {studentId: studentID}
	});

	if (loading) {
		return <Loading/>
	}
	if (error) {
		return <Typography>
			There's been an error! Error: {error.message}
		</Typography>
	}

	const {enrollments} = data;

	const filterCourseByDate = (endDate) => {
			const inputEndDate = dateTimeToDate(new Date(endDate));
			// see if course is current or not
			// and match it appropriately with the passed filter
		return current === (inputEndDate >= today);
	};

	const displayedEnrollments = enrollments.filter(({course}) => filterCourseByDate(course.endDate));

	return (
		<>
			<Grid className="accounts-table-heading" container>
				<Grid item xs={4}>
					<Typography align="left" className="table-header">
						Course
					</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography align="left" className="table-header">
						Dates
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography align="left" className="table-header">
						Class Day(s)
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography align="left" className="table-header">
						Time
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography align="left" className="table-header">
						Status
					</Typography>
				</Grid>
			</Grid>
			<Grid container spacing={1}>
				{displayedEnrollments.length !== 0 ? (
					displayedEnrollments.map((enrollment) => {
						return (
							<Grid
								className="accounts-table-row"
								component={Link}
								item
								key={enrollment.id}
								to={`${pathname}/${enrollment.course.id}`}
								xs={12}
							>
								<Paper square>
									<Grid container>
										<Grid item xs={4}>
											<Typography align="left" className="accounts-table-text">
												{enrollment.course.title}
											</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography align="left" className="accounts-table-text">
												<Moment
													format="MMM D YYYY"
													date={enrollment.course.startDate}
												/>
												{` - `}
												<Moment
													format="MMM D YYYY"
													date={enrollment.course.endDate}
												/>
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Typography align="left" className="accounts-table-text">
												<Moment
													format="dddd"
													date={enrollment.course.startDate}
												/>
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Typography align="left" className="accounts-table-text">
												<Moment
													format="h:mm a"
													date={
														enrollment.course.startDate
														+ "T" +
														enrollment.course.startTime
													}
												/>
												{` - `}
												<Moment
													format="h:mm a"
													date={
														enrollment.course.endDate
														+ "T" +
														enrollment.course.endTime
													}
												/>
											</Typography>
										</Grid>
										<Grid item xs={1}>
											<div
												className={`sessions-left-chip ${paymentStatus(
													enrollment.sessionsLeft ?
														Number(enrollment.sessionsLeft) : 4
												)}`}
											>
												{enrollment.sessionsLeft}
											</div>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						);
					})
				) : (
					<NoListAlert list="Course"/>
				)}
			</Grid>
		</>
	);
};

StudentCourseViewer.propTypes = {
	current: PropTypes.bool,
	studentID: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
		.isRequired,
};

export default StudentCourseViewer;
