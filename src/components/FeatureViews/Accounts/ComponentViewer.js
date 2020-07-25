import React, {useMemo} from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import Bio from "./TabComponents/Bio";
import InstructorCourses from "./TabComponents/InstructorCourses";
import InstructorSchedule from "./TabComponents/InstructorSchedule";
import Notes from "../Notes/Notes";
import ParentContact from "./TabComponents/ParentContact";
import PayCourses from "./TabComponents/PayCourses";
import PaymentHistory from "./TabComponents/PaymentHistory";
import StudentCourseViewer from "./TabComponents/StudentCourseViewer";
import StudentInfo from "./TabComponents/StudentInfo";
import NotificationSettings from "./TabComponents/NotificationSettings";
import UserAccessControl from "./UserAccessControl";
import {useSelector} from "react-redux";
import {USER_TYPES} from "../../../utils";

const ComponentViewer = ({inView, user}) => {
	const AuthUser = useSelector(({auth}) => auth);

	const componentsArray = useMemo(
		() => [
			{
				component: <InstructorSchedule instructorID={user.user_id} key={0}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			},
			{
				component: <InstructorCourses instructorID={user.user_id} key={1}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			},
			{
				component: <Bio background={user.background} key={2}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.instructor],
			},
			{
				component: <StudentCourseViewer current key={3} studentID={user.user_id}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			},
			{
				component: <StudentCourseViewer current={false} key={4} studentID={user.user_id}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			},
			{
				component: <PaymentHistory key={5} user_id={user.user_id}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			},
			{
				component: <ParentContact key={6} parent_id={user.parent_id}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.student, USER_TYPES.parent],
			},
			{
				component: <Notes key={7} ownerID={user.user_id} ownerType="account"/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin, USER_TYPES.student, USER_TYPES.parent, USER_TYPES.instructor],
			},
			{
				component: <StudentInfo key={8} user={user}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			},
			{
				component: <PayCourses key={9} user={user}/>,
				access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
			},
			{
				component: <UserAccessControl key={10} user={user}>
					<NotificationSettings user={user}/>
				</UserAccessControl>,
				access_permissions: [USER_TYPES.student, USER_TYPES.parent, USER_TYPES.instructor],
			}
		].filter((tab) => (tab.access_permissions.includes(AuthUser.accountType))),
		[user]
	);

	return (
		<Grid className="profile-component-container">
			{componentsArray[inView].component}
		</Grid>
	);
};

ComponentViewer.propTypes = {
	inView: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).isRequired,
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
