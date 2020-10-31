import React, { useMemo } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import Bio from "./TabComponents/Bio";
import InstructorCourses from "./TabComponents/InstructorCourses";
import InstructorSchedule from "./TabComponents/InstructorSchedule";
import Notes from "../Notes/Notes";
import ParentContact from "./TabComponents/ParentContact";
import PayCourses from "./TabComponents/PayCourses";
import PaymentHistory from "./TabComponents/PaymentHistory";
import ActionLog from "./TabComponents/ActionLog";
import StudentCourseViewer from "./TabComponents/StudentCourseViewer";
import StudentInfo from "./TabComponents/StudentInfo";
import NotificationSettings from "./TabComponents/NotificationSettings";
import UserAccessControl from "./UserAccessControl";
import { useSelector } from "react-redux";
import { USER_TYPES } from "../../../utils";

const ComponentViewer = ({ inView, user, log ,id}) => {
	const AuthUser = useSelector(({ auth }) => auth);
	


	// All components should take an user id. Components will do all the gql calls  
	/**
	 * [x]Bio
	 * []StudentCourseViewer
	 * []
	 */

	const componentsArray = useMemo(
		() => [
			{
				component: <InstructorSchedule instructorID={id} key={0} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
				id: 0,
			},
			{
				component: <InstructorCourses instructorID={id} key={1} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
				id: 1,
			},
			{
				component: <Bio ownerID={id} key={2} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.instructor],
				id: 2,
			},
			{
				component: <StudentCourseViewer current key={3} studentID={id} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
				id: 3,
			},
			{
				component: <StudentCourseViewer current={false} key={4} studentID={id} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
				id: 4,
			},
			{
				component: <PaymentHistory key={5} user_id={id} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.parent],
				id: 5,
			},
			{
				component: <ParentContact key={6} parent_id={id} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.student,],
				id: 6,
			},
			{
				component: <Notes key={7} ownerID={id} ownerType="account" />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.student, USER_TYPES.parent, USER_TYPES.instructor],
				id: 7,
			},
			{
				component: <StudentInfo key={8} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.parent],
				id: 8,
			},
			{
				component: <PayCourses key={9} user={user} />,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
				id: 9,
			},
			{
				component: <ActionLog key={10} ownerID={id} />,
				access_permissions: [USER_TYPES.admin, USER_TYPES.receptionist],
				id: 10,
			},
			{
				component: <UserAccessControl key={11} userID={id}>
					<NotificationSettings user={user} />
				</UserAccessControl>,
				access_permissions: [USER_TYPES.student, USER_TYPES.parent, USER_TYPES.instructor],
				id: 11,
			}
		].filter((tab) => (tab.access_permissions.includes(AuthUser.accountType))),
		[user]
	);

	return (
		<Grid className="profile-component-container">
			{componentsArray.find(({ id }) => id == inView).component}
		</Grid>
	);
};

ComponentViewer.propTypes = {
	inView: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).isRequired,
	user: PropTypes.shape({
		background: PropTypes.object,
		parent_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		role: PropTypes.oneOf(["instructor", "parent", "receptionist", "student"])
			.isRequired,
		user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
	}).isRequired,
};

export default ComponentViewer;
