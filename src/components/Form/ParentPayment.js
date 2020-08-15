import {connect} from "react-redux";
import PropTypes from "prop-types";
import React, {useState} from "react";

import BackButton from "../OmouComponents/BackButton";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import {Button} from "@material-ui/core";

const msPerWeek = 1000 * 60 * 60 * 24 * 7;

const renderDate = (date) => {
	const [year, month, day] = date.split("-");
	return `${month}/${day}/${year}`;
};

const calcSessionCost = ({
							 schedule: {start_date, end_date, days},
							 tuition,
}) => {
	const startDate = new Date(start_date);
	const endDate = new Date(end_date);
	const numWeeks = (endDate - startDate) / msPerWeek;
	const numSessions = numWeeks * days.length;
	return tuition / numSessions;
};

const ParentPayment = (props) => {
	const parent = props.parents[props.computedMatch.params.parentID];

	const sessionsMax = {};
	const initialSelectedRows = {};
	parent.student_ids.forEach((studentID) => {
		sessionsMax[studentID] = {};
		initialSelectedRows[studentID] = {};
		Object.entries(props.enrollments[studentID]).forEach(
			([courseID, {session_payment_status}]) => {
				const unpaidCount = Object.values(session_payment_status).reduce(
					(total, paymentStatus) => total + (paymentStatus === 0),
					0
				);
				if (unpaidCount !== 0) {
					sessionsMax[studentID][courseID] = unpaidCount;
					initialSelectedRows[studentID][courseID] = false;
				}
			}
		);
	});

	const [sessionFields, setSessionFields] = useState(sessionsMax);
	const [selectedRows, setSelectedRows] = useState(initialSelectedRows);
	const [paymentType, setPaymentType] = useState();
	const [enteredDiscountCode, setEnteredDiscountCode] = useState();

	const getPaymentInfo = (student) => {
		const unpaidCourses = Object.keys(props.enrollments[student.user_id])
			.filter((courseID) =>
				// only use courses that need to be paid
				Object.values(
					props.enrollments[student.user_id][courseID].session_payment_status
				).some((paymentStatus) => paymentStatus === 0)
			)
			.map((courseID) => props.courses[courseID]);

		return unpaidCourses.map((course) => {
			const numSessions = sessionFields[student.user_id][course.course_id];
			return {
				course,
				sessions: numSessions,
				tuition: numSessions * calcSessionCost(course),
			};
		});
	};

	const getTotalCost = () => {
		let total = 0;

		Object.entries(sessionFields).forEach(([studentID, studentCourses]) => {
			Object.entries(studentCourses).forEach(([courseID, sessionCount]) => {
				if (
					selectedRows[studentID][courseID] &&
					sessionCount > 0 &&
					sessionCount <= sessionsMax[studentID][courseID]
				) {
					total += sessionCount * calcSessionCost(props.courses[courseID]);
				}
			});
		});

		return total;
	};

	const renderStudentPayments = (student) => {
		const rows = getPaymentInfo(student);
		return (
			<div key={student.user_id}>
				<h3 align="left">{student.name}</h3>
				<Table padding="default">
					<colgroup>
						<col width="0%"/>
						<col width="100%"/>
						<col width="0%"/>
						<col width="0%"/>
						<col width="0%"/>
						<col width="0%"/>
					</colgroup>
					<TableHead>
						<TableRow>
							<TableCell/>
							<TableCell align="left">Session</TableCell>
							<TableCell align="left">Dates</TableCell>
							<TableCell align="left">Sessions</TableCell>
							<TableCell align="left">Tuition</TableCell>
							<TableCell align="left">Material Fee</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map(({course, tuition}) => {
							const validSessions =
								sessionFields[student.user_id][course.course_id] > 0 &&
								sessionFields[student.user_id][course.course_id] <=
								sessionsMax[student.user_id][course.course_id];
							return (
								<TableRow hover tabIndex={-1} key={course.course_id}>
									<TableCell padding="checkbox">
										<Checkbox
											checked={selectedRows[student.user_id][course.course_id]}
											onClick={() => {
												setSelectedRows({
													...selectedRows,
													[student.user_id]: {
														...selectedRows[student.user_id],
														[course.course_id]: !selectedRows[student.user_id][
															course.course_id
															],
													},
												});
											}}
										/>
									</TableCell>
									<TableCell align="left">
                    <span
						style={{
							width: "50%",
						}}
					>
                      {course.title}
                    </span>
									</TableCell>
									<TableCell align="left">
										{renderDate(course.schedule.start_date)}&nbsp;-&nbsp;
										{renderDate(course.schedule.end_date)}
									</TableCell>
									<TableCell align="left">
										<TextField
											id="standard-name"
											type="number"
											error={!validSessions}
											value={sessionFields[student.user_id][course.course_id]}
											onChange={({target: {value}}) => {
												setSessionFields({
													...sessionFields,
													[student.user_id]: {
														...sessionFields[student.user_id],
														[course.course_id]: value,
													},
												});
											}}
										/>
									</TableCell>
									<TableCell align="left">
										{validSessions && `$${Math.round(tuition)}`}
									</TableCell>
									<TableCell>$50</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		);
	};

	return (
		<Grid container className="">
			<Grid item xs={11} style={{padding: "20px"}}>
				<BackButton/>
				<h1 align="left">Pay for Course(s)</h1>
				{parent.student_ids.map((studentID) =>
					renderStudentPayments(props.students[studentID])
				)}
				<Grid
					container
					style={{
						paddingTop: "5vh",
					}}
				>
					<Grid item xs={6} align="left">
						<FormControl component="fieldset">
							<FormLabel component="legend">
								<b>Payment Method</b>
							</FormLabel>
							<RadioGroup
								aria-label="position"
								name="position"
								value={paymentType}
								onChange={({target: value}) => {
									setPaymentType(value);
								}}
								row
							>
								<FormControlLabel
									value="Credit Card"
									control={<Radio color="primary"/>}
									label="Credit Card"
									labelPlacement="end"
								/>
								<FormControlLabel
									value="Check"
									control={<Radio color="primary"/>}
									label="Check"
									labelPlacement="end"
								/>
								<FormControlLabel
									value="Cash"
									control={<Radio color="primary"/>}
									label="Cash"
									labelPlacement="end"
								/>
							</RadioGroup>
						</FormControl>
						<FormControl
							variant="outlined"
							style={{
								paddingTop: "2vh",
							}}
						>
							<div row>
								<OutlinedInput
									placeholder="Enter Discount Code"
									id="component-outlined"
									onChange={({target: {value}}) => {
										setEnteredDiscountCode(value);
									}}
									value={enteredDiscountCode}
									disabled
								/>
								<Button disabled>Apply</Button>
							</div>
						</FormControl>
					</Grid>
					<Grid item xs={5} align="right">
						<b>Total</b>
					</Grid>
					<Grid item xs={1}>
						${getTotalCost()}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

ParentPayment.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			parentID: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};

const mapStateToProps = (state) => ({
	payments: state.Payments,
	courses: state.Course.NewCourseList,
	parents: state.Users.ParentList,
	students: state.Users.StudentList,
	enrollments: state.Enrollments,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ParentPayment);
