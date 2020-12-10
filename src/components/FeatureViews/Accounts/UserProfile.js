import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import BioIcon from "@material-ui/icons/PersonOutlined";
import ContactIcon from "@material-ui/icons/ContactPhoneOutlined";
import CoursesIcon from "@material-ui/icons/SchoolOutlined";
import CurrentSessionsIcon from "@material-ui/icons/AssignmentOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Paper from "@material-ui/core/Paper";
import PastSessionsIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import PaymentIcon from "@material-ui/icons/CreditCardOutlined";
import ScheduleIcon from "@material-ui/icons/CalendarTodayOutlined";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { LabelBadge } from "../../../theme/ThemedComponents/Badge/LabelBadge";

import "./Accounts.scss";
import * as hooks from "actions/hooks";
import BackButton from "components/OmouComponents/BackButton";
import ComponentViewer from "./ComponentViewer.js";
import Loading from "components/OmouComponents/Loading";
import ProfileHeading from "./ProfileHeading.js";
import { useAccountNotes } from "actions/userActions";
import UserAvatar from "./UserAvatar";
import SettingsIcon from "@material-ui/icons/Settings"
import { USER_TYPES } from "../../../utils";
import moment from "moment";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { h2, white } from "theme/muiTheme";

const userTabs = {
	instructor: [
		{
			icon: <ScheduleIcon className="TabIcon" />,
			tab_heading: "Schedule",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			tab_id: 0,
		},
		{
			icon: <CoursesIcon className="TabIcon" />,
			tab_heading: "Courses",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			tab_id: 1,
		},
		{
			icon: <BioIcon className="TabIcon" />,
			tab_heading: "Bio",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.instructor, USER_TYPES.parent],
			tab_id: 2,
		},
		{
			icon: <NoteIcon className="TabIcon" />,
			tab_heading: "Notes",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.instructor],
			tab_id: 7,
		},
		{
			icon: <SettingsIcon className="SettingsIcon" />,
			tab_heading: "Notification Settings",
			access_permissions: [USER_TYPES.instructor],
			tab_id: 11,
		}
	],
	parent: [
		{
			icon: <CurrentSessionsIcon className="TabIcon" />,
			tab_heading: "Student Info",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.parent],
			tab_id: 8,
		},
		{
			icon: <PaymentIcon className="TabIcon" />,
			tab_heading: "Payment History",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.parent],
			tab_id: 5,
		},
		{
			icon: <NoteIcon className="TabIcon" />,
			tab_heading: "Notes",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.parent],
			tab_id: 7,
		},
		{
			icon: <SettingsIcon className="SettingsIcon" />,
			tab_heading: "Notification Settings",
			access_permissions: [USER_TYPES.parent],
			tab_id: 11,
		}
	],
	student: [
		{
			icon: <CurrentSessionsIcon className="TabIcon" />,
			tab_heading: "Current Course(s)",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			tab_id: 3,
		},
		{
			icon: <PastSessionsIcon className="TabIcon" />,
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			tab_heading: "Past Course(s)",
			tab_id: 4,
		},
		{
			icon: <ContactIcon className="TabIcon" />,
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.student, USER_TYPES.parent],
			tab_heading: "Parent Contact",
			tab_id: 6,
		},
		{
			icon: <NoteIcon className="TabIcon" />,
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.student, USER_TYPES.parent],
			tab_heading: "Notes",
			tab_id: 7,
		},
	],
	admin: [
		{
			icon: <ContactIcon className="TabIcon" />,
			tab_heading: "Action Log",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			tab_id: 10,
		},
		{
			icon: <NoteIcon className="TabIcon" />,
			tab_heading: "Notes",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			tab_id: 7,
		},
		{
			icon: <SettingsIcon className="SettingsIcon" />,
			tab_heading: "Notification Settings",
			access_permissions: [USER_TYPES.admin],
			tab_id: 11,
		}
	],
};

const GET_ACCOUNT_NOTES = `
	notes(userId: $ownerID) {
		id
		body
		complete
		important
		timestamp
		title
	}`;

const QUERIES = {
	"student": gql`query StudentInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on StudentType {
			birthDate
			grade
			phoneNumber
			user {
			  id
			  firstName
			  lastName
			  email
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	}
	`,
	"parent": gql`
	query ParentInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on ParentType {
			balance
			accountType
			phoneNumber
			user {
			  email
			  id
			  firstName
			  lastName
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`,
	"instructor": gql`query InstructorInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on InstructorType {
			userUuid
			phoneNumber
			birthDate
			accountType
			biography
		  	experience
			language
			 subjects {
			  name
			}
			user {
			  lastName
			  firstName
			  id
			  email
			}
			instructoravailabilitySet {
			  dayOfWeek
			  endDatetime
			  startDatetime
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`,
	"admin": gql`
	  query AdminInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on AdminType {
			birthDate
			phoneNumber
			adminType
			accountType
			user {
			  firstName
			  lastName
			  id
			  email
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`
}

const UserProfile = () => {
	
	const { accountType, accountID } = useParams();
	const [tabIndex, setTabIndex] = useState(0);
	const [displayTabs, setDisplayTabs] = useState(userTabs[accountType]);

	
	const AuthUser = useSelector(({ auth }) => auth);

	// check if user is viewing a differnt profile 

	// 


	// reset to first tab when profile changes
	useEffect(() => {
		setTabIndex(0);
	}, [accountType, accountID]);


	// reset tab list when profile type changes
	useEffect(() => {
		setDisplayTabs(userTabs[accountType]);
	}, [accountType]);

	const { loading, error, data } = useQuery(QUERIES[accountType], {
		variables: { ownerID: accountID },
	})

	if (loading ) return null;

	if (error ) return <Redirect to="/PageNotFound" />;

	const { notes } = data;
	const numImportantNotes = notes.filter(note => note.important).length;
	const importantNotesBadge = numImportantNotes > 0 ? numImportantNotes : null

	const handleTabChange = (_, newTabIndex) => {
		setTabIndex(newTabIndex);
	};

	const tabs = () => {

		return (
			<>
				<Tabs
					indicatorColor="primary"
					onChange={handleTabChange}
					textColor="primary"
					value={tabIndex}
				>
					{displayTabs
						.filter((tab) => (tab.access_permissions.includes(AuthUser.accountType)))
						.map((tab) => (
							tab.tab_id === 7 ?
								<Tab
									key={tab.tab_id}
									label={
										<>
											{tab.icon}{tab.tab_heading}{importantNotesBadge}
										</>
									}
								/>
								:
								<Tab
									key={tab.tab_id}
									label={
										<>
											{tab.tab_heading}
										</>
									}
								/>
						))}
				</Tabs>
				<ComponentViewer
					inView={displayTabs.filter((tab) => (tab.access_permissions.includes(AuthUser.accountType)))[tabIndex]?.tab_id}
					user={data}
					id={accountID}
					
				/>
			</>
		);
	};



	// useEffect(() => {
	// 	if (data) {
	// 		const numImportantNotes = Object.values(data.notes || {}).reduce(
	// 			(total, { important }) => (important ? total + 1 : total),
	// 			0
	// 		);
	// 		if (data.role !== "receptionist") {
	// 			setDisplayTabs((prevTabs) => {
	// 				const newTabs = [...prevTabs];
	// 				const notesIndex = newTabs.findIndex((tab) => tab.tab_id === 7);
	// 				newTabs[notesIndex] = {
	// 					...newTabs[notesIndex],
	// 					icon: (
	// 						<Badge badgeContent={numImportantNotes} color="primary">
	// 							<NoteIcon className="TabIcon" />
	// 						</Badge>
	// 					),
	// 				};
	// 				return newTabs;
	// 			});
	// 		}
	// 	}
	// }, [data]);




	return (
		<div className="UserProfile">
			<BackButton warn={false} />
			<hr />
			<Grid className="padding" container layout="row">
				<Grid item md={2}>
					<Hidden smDown>
						<UserAvatar
							name={`${data.userInfo.user.firstName} ${data.userInfo.user.lastName}`}
							margin="0"
                    		size="136px"
                    		style={{ ...h2, color: white }}
						/>
					</Hidden>
				</Grid>
				<Grid className="headingPadding" item md={6} xs={12}>
					<ProfileHeading  ownerID={accountID} />
				</Grid>
			</Grid>
			{tabs()}
		</div>
	);
};

UserProfile.propTypes = {};

export default UserProfile;
