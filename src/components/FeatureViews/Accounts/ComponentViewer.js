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

const ComponentViewer = ({inView, user}) => {

	const componentsArray = useMemo(
		() => [
			<InstructorSchedule instructorID={user.user_id} key={0}/>,
			<InstructorCourses instructorID={user.user_id} key={1}/>,
			<Bio background={user.background} key={2}/>,
			<StudentCourseViewer current key={3} studentID={user.user_id}/>,
			<StudentCourseViewer current={false} key={4} studentID={user.user_id}/>,
			<PaymentHistory key={5} user_id={user.user_id}/>,
			<ParentContact key={6} parent_id={user.parent_id}/>,
			<Notes key={7} ownerID={user.user_id} ownerType="account"/>,
			<StudentInfo key={8} user={user}/>,
			<PayCourses key={9} user={user}/>,
			<NotificationSettings key={10} user={user}/>
		],
		[user]
	);

	return (
		<Grid className="profile-component-container">
			{componentsArray[inView]}
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
