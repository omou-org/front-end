import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import BioIcon from "@material-ui/icons/PersonOutlined";
import ContactIcon from "@material-ui/icons/ContactPhoneOutlined";
import CoursesIcon from "@material-ui/icons/SchoolOutlined";
import CurrentSessionsIcon from "@material-ui/icons/AssignmentOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden/Hidden";
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
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.instructor],
			tab_id: 2,
		},
		{
			icon: <notificationIcon className="TabIcon" />,
			tab_heading: "Notes",
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.instructor],
			tab_id: 7,
		},
		{
			icon: <SettingsIcon className="SettingsIcon" />,
			tab_heading: "Notification Settings",
			access_permissions: [USER_TYPES.instructor],
			tab_id: 10,
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
			access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
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
			tab_id: 10,
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
};

const useUser = (id, type) => {
	switch (type) {
		case "student":
			return hooks.useStudent(id);
		case "parent":
			return hooks.useParent(id);
		case "instructor":
			return hooks.useInstructor(id);
		case "receptionist":
			// TODO: add receptionist fetching
			return 200;
		default:
			// can't find the user (invalid user type)
			return 404;
	}
};

const UserProfile = () => {
	const userList = useSelector(({ Users }) => Users);
	const { accountType, accountID } = useParams();
	const [tabIndex, setTabIndex] = useState(0);
	const [displayTabs, setDisplayTabs] = useState(userTabs[accountType]);

	const fetchStatus = useUser(accountID, accountType);
	const AuthUser = useSelector(({ auth }) => auth);

	useAccountNotes(accountID, accountType);
	const user = useMemo(() => {
		switch (accountType) {
			case "student":
				return userList.StudentList[accountID];
			case "parent":
				return userList.ParentList[accountID];
			case "instructor":
				return userList.InstructorList[accountID];
			case "receptionist":
				return userList.ReceptionistList[accountID];
			default:
				return null;
		}
	}, [userList, accountID, accountType]);
	const handleTabChange = useCallback((_, newTabIndex) => {
		setTabIndex(newTabIndex);
	}, []);

	const useStyles = makeStyles({
		MuiIndicator: {
			height: "1px"
		},
	});
	const classes = useStyles();

	const tabs = useMemo(() => {
		if (!user) {
			return null;
		}
		if (user.role === "receptionist") {
			return (
				<>
					<Typography align="left" variant="h6">
						Action Log
					</Typography>
					<Paper elevation={2} className="paper">
						<Table className="ActionTable">
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell>Time</TableCell>
									<TableCell>Description</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.entries(user.action_log).map(
									([key, { date, time, description }]) => (
										<TableRow key={key}>
											<TableCell>{date}</TableCell>
											<TableCell>{time}</TableCell>
											<TableCell>{description}</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</Paper>
				</>
			);
		}

		return (
			<>
				<Tabs
					classes={{indicator: classes.MuiIndicator}}
					onChange={handleTabChange}
					value={tabIndex}
				>
					{displayTabs
						.filter((tab) => (tab.access_permissions.includes(AuthUser.accountType)))
						.map((tab) => (
							tab.tab_id === 7 ?
								<Tab
									key={tab.tab_id}
									label={
										<span>
											{tab.tab_heading} {tab.icon}
										</span>										
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
					inView={displayTabs
						.filter((tab) =>
							(tab.access_permissions.includes(AuthUser.accountType)))[tabIndex].tab_id}
					user={user} />
			</>
		);
	}, [displayTabs, handleTabChange, tabIndex, user]);

	// reset to first tab when profile changes
	useEffect(() => {
		setTabIndex(0);
	}, [accountType, accountID]);

	// reset tab list when profile type changes
	useEffect(() => {
		setDisplayTabs(userTabs[accountType]);
	}, [accountType]);

	useEffect(() => {
		if (user) {
			const numImportantNotes = Object.values(user.notes || {}).reduce(
				(total, { important }) => (important ? total + 1 : total),
				0
			);
			if (user.role !== "receptionist") {
				setDisplayTabs((prevTabs) => {
					const newTabs = [...prevTabs];
					const notesIndex = newTabs.findIndex((tab) => tab.tab_id === 7);
					newTabs[notesIndex] = {
						...newTabs[notesIndex],
						icon: (
							numImportantNotes > 0 && <LabelBadge style={{marginLeft: '8px'}} label={numImportantNotes} variant="round-count"/> 
						),
					};
					return newTabs;
				});
			}
		}
	}, [user]);

	if (!user || Object.keys(user).length <= 1) {
		if (hooks.isLoading(fetchStatus)) {
			return <Loading />;
		} else if (hooks.isFail(fetchStatus)) {
			return <Redirect to="/PageNotFound" />;
		}
	}

	return (
		<div className="UserProfile">
			<BackButton warn={false} />
			<hr />
			<Grid className="padding" container layout="row">
				<Grid item md={2}>
					<Hidden smDown>
						<UserAvatar
							fontSize="3.5vw"
							margin={20}
							name={user.name}
							size="9vw"
						/>
					</Hidden>
				</Grid>
				<Grid className="headingPadding" item md={10} xs={12}>
					<ProfileHeading user={user} />
				</Grid>
			</Grid>
			{tabs}
		</div>
	);
};

UserProfile.propTypes = {};

export default UserProfile;
