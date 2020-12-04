import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
import Chip from "@material-ui/core/Chip";
import ClassIcon from "@material-ui/icons/Class";
import ConfirmIcon from "@material-ui/icons/CheckCircle";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Notes from "../Notes/Notes";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import UnconfirmIcon from "@material-ui/icons/Cancel";
import Moment from "react-moment";
import { makeStyles } from "@material-ui/core/styles";
import { LabelBadge } from "../../../theme/ThemedComponents/Badge/LabelBadge";


import "./registration.scss";
import { Link, useRouteMatch } from "react-router-dom";
import BackButton from "../../OmouComponents/BackButton.js";
import Loading from "components/OmouComponents/Loading";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import RegistrationActions from "./RegistrationActions";
import RegistrationCourseEnrollments from "./RegistrationCourseEnrollments";
import UserAvatar from "../Accounts/UserAvatar";
import { weeklySessionsParser } from "components/Form/FormUtils";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {SIMPLE_COURSE_DATA} from "queryFragments";
import {fullName, USER_TYPES, gradeLvl} from "utils";

export const GET_COURSE_DETAILS = gql`
	query CourseDetails($courseId: ID!){
		course(courseId: $courseId) {
			endDate
			startDate
			availabilityList {
				endTime
				startTime
			  }
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

	const useStyles = makeStyles({
		MuiIndicator: {
			height: "1px"
		},
		wrapper: {
			flexDirection: "row"
		}
	});
	const classes = useStyles();

	const {
		params: { courseID },
	} = useRouteMatch();
	const isAdmin =
		useSelector(({ auth }) => auth.accountType) === USER_TYPES.admin;

	const [activeTab, setActiveTab] = useState(0);

	const { data, loading, error } = useQuery(GET_COURSE_DETAILS, {
		variables: { courseId: courseID }
	});

	const handleTabChange = useCallback((_, newTab) => {
		setActiveTab(newTab);
	}, []);

	if (loading) {
		return <Loading />
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
			availabilityList,
			description,
			academicLevel,
			maxCapacity,
			instructor,
			isConfirmed,
		},
		courseNotes
	} = data;

	const hasImportantNotes = Object.values(courseNotes || {}).some(
		({ important }) => important
	);

	const numImportantNotes = Object.values(courseNotes || {}).filter(
		({important}) => important
	).length;

	const instructorName = fullName(instructor.user);

	return (
		<Grid className="registrationCourse" item xs={12}>
			<Grid container justify="space-between">
				<Grid item sm={3}>
					<BackButton />
				</Grid>
				<Grid item sm={2} />
			</Grid>
			<Divider className="top-divider" />
			<Grid item lg={12}>
				<RegistrationActions courseTitle={title} />
			</Grid>
			<div className="course-heading">
				<Typography align="left" variant="h1">
					{title}
					{isAdmin && (
						<ResponsiveButton
							className="button"
							variant='outlined'
							component={Link}
							to={`/registration/form/course_details/${courseID}`}
						>
							edit course
						</ ResponsiveButton>
					)}
				</Typography>
				<div className="date">
					<CalendarIcon align="left" className="icon" />
					<Typography align="left" className="sessions-text">
						<Moment format="MMM D YYYY" date={startDate} />
						{" - "}
						<Moment format="MMM D YYYY" date={endDate} /> (
							{weeklySessionsParser(startDate, endDate)} sessions)
						</Typography>
				</div>
				<div className="info-section">
					<div className="course-info-header">
						<ClassIcon className="icon" />
						<Typography align="left" className="text">
							Course Information
							</Typography>
					</div>
					<div className="course-info-details">
						{instructor && (
							<>
								{isConfirmed ? (
									<ConfirmIcon className="confirmed course-icon" />
								) : (
										<UnconfirmIcon className="unconfirmed course-icon" />
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
								date={startDate + "T" + availabilityList[0].startTime}
							/>
							{" - "}
							<Moment
								format="h:mm a"
								date={endDate + "T" + availabilityList[0].endTime}
							/>
						</Typography>
						<Typography align="left" className="text">
							<Moment format="dddd" date={startDate} />
						</Typography>
						<Typography align="left" className="text">
							Grade {gradeLvl(academicLevel)}
						</Typography>
					</div>
				</div>
				<Typography align="left" className="description text">
					{description}
				</Typography>
				<Tabs
					className="registration-course-tabs"
					classes={{indicator: classes.MuiIndicator}}
					onChange={handleTabChange}
					value={activeTab}
				>
					<Tab
						label="Registration"
						/>
					<Tab
						classes={{wrapper: classes.wrapper}}
						label={
							numImportantNotes ? (
								<>
									 Notes 
									 <LabelBadge style={{marginLeft: '8px'}} variant="round-count">{numImportantNotes}</LabelBadge>
								</>
							) : <> Notes </>
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
			</div>
	</Grid>
	);
};

export default RegistrationCourse;
