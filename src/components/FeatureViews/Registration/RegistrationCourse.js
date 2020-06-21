import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
import Chip from "@material-ui/core/Chip";
import ClassIcon from "@material-ui/icons/Class";
import ConfirmIcon from "@material-ui/icons/CheckCircle";
import Divider from "@material-ui/core/Divider";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Notes from "../Notes/Notes";
import Paper from "@material-ui/core/Paper";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import UnconfirmIcon from "@material-ui/icons/Cancel";
import Moment from "react-moment";

import "./registration.scss";
import {Link, useRouteMatch} from "react-router-dom";
import BackButton from "../../BackButton.js";
import Loading from "components/Loading";
import RegistrationActions from "./RegistrationActions";
import RegistrationCourseEnrollments from "./RegistrationCourseEnrollments";
import UserAvatar from "../Accounts/UserAvatar";
import {weeklySessionsParser} from "components/Form/FormUtils";
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {SIMPLE_COURSE_DATA} from "queryFragments";
import {fullName, USER_TYPES} from "utils";

export const GET_COURSE_DETAILS = gql`
	query CourseDetails($courseId: ID!){
		course(courseId: $courseId) {
			endDate
			startDate
			startTime
			endTime
			description
			academicLevel
			maxCapacity
			instructor {
			  user {
				id
				firstName
				lastName
			  }
			}
			isConfirmed
			...SimpleCourse
		}
		courseNotes(courseId: $courseId) {
		    body
			complete
			id
			important
			timestamp
			title
		}
	}
	${SIMPLE_COURSE_DATA}
	`;

const RegistrationCourse = () => {
	const {
		params: {courseID},
	} = useRouteMatch();
	const isAdmin =
		useSelector(({auth}) => auth.accountType) === USER_TYPES.admin;

	const [activeTab, setActiveTab] = useState(0);

	const {data, loading, error} = useQuery(GET_COURSE_DETAILS, {
		variables: {courseId: courseID}
	});

	const handleTabChange = useCallback((_, newTab) => {
		setActiveTab(newTab);
	}, []);

	if (loading) {
		return <Loading/>
	}
	if (error) {
		return <Typography>
			There's been an error! Error: {error.message}
		</Typography>
	}
	const {
		"course": {
			title,
			endDate,
			startDate,
			startTime,
			endTime,
			description,
			academicLevel,
			maxCapacity,
			instructor,
			isConfirmed,
		},
		courseNotes
	} = data;

	const hasImportantNotes = Object.values(courseNotes || {}).some(
		({important}) => important
	);

	const instructorName = fullName(instructor.user);

	return (
		<Grid className="registrationCourse" item xs={12}>
			<Paper className="paper content" elevation={2}>
				<Grid container justify="space-between">
					<Grid item sm={3}>
						<BackButton/>
					</Grid>
					<Grid item sm={2}/>
				</Grid>
				<Divider className="top-divider"/>
				<Grid item lg={12}>
					<RegistrationActions courseTitle={title}/>
				</Grid>
				<div className="course-heading">
					<Typography align="left" variant="h3">
						{title}
						{isAdmin && (
							<Button
								className="button"
								component={Link}
								to={`/registration/form/course_details/${courseID}/edit`}
							>
								<EditIcon className="icon"/>
								Edit Course
							</Button>
						)}
					</Typography>
					<div className="date">
						<CalendarIcon align="left" className="icon"/>
						<Typography align="left" className="sessions-text">
							<Moment format="MMM D YYYY" date={startDate}/>
							{" - "}
							<Moment format="MMM D YYYY" date={endDate}/> (
							{weeklySessionsParser(startDate, endDate)} sessions)
						</Typography>
					</div>
					<div className="info-section">
						<div className="course-info-header">
							<ClassIcon className="icon"/>
							<Typography align="left" className="text">
								Course Information
							</Typography>
						</div>
						<div className="course-info-details">
							{instructor && (
								<>
									{isConfirmed ? (
										<ConfirmIcon className="confirmed course-icon"/>
									) : (
										<UnconfirmIcon className="unconfirmed course-icon"/>
									)}
									<Chip
										avatar={
											<UserAvatar
												fontSize={20}
												name={instructorName}
												size={38}
											/>
										}
										className="chip"
										component={Link}
										label={instructorName}
										to={`/accounts/instructor/${instructor.user.id}`}
									/>
								</>
							)}
							<Typography align="left" className="text">
								<Moment
									format="h:mm a"
									date={startDate + "T" + startTime}
								/>
								{" - "}
								<Moment
									format="h:mm a"
									date={endDate + "T" + endTime}
								/>
							</Typography>
							<Typography align="left" className="text">
								<Moment format="dddd" date={startDate}/>
							</Typography>
							<Typography align="left" className="text">
								Grade {academicLevel}
							</Typography>
						</div>
					</div>
				</div>
				<Typography align="left" className="description text">
					{description}
				</Typography>
				<Tabs
					className="registration-course-tabs"
					indicatorColor="primary"
					onChange={handleTabChange}
					value={activeTab}
				>
					<Tab
						label={
							<>
								<RegistrationIcon className="NoteIcon"/> Registration
							</>
						}
						/>
					<Tab
						label={
							hasImportantNotes ? (
								<>
									<Avatar className="notificationCourse"/>
									<NoteIcon className="TabIcon"/> Notes
								</>
							) : (
								<>
									<NoteIcon className="NoteIcon"/> Notes
								</>
							)
						}
					/>
				</Tabs>
				{activeTab === 0 && (
					<RegistrationCourseEnrollments
						courseID={courseID}
						maxCapacity={maxCapacity}
						courseTitle={title}
					/>
				)}
				{activeTab === 1 && (
					<div className="notes-container">
						<Notes ownerID={courseID} ownerType="course"/>
					</div>
				)}
			</Paper>
		</Grid>
	);
};

export default RegistrationCourse;
