import React from "react";
import {useSelector} from "react-redux";
import Dashboard from "./Dashboard";
import InstructorDashboard from "./InstructorDashboard";

export default function DashboardSwitch() {
	const AuthUser = useSelector(({auth}) => auth);
	const ACCOUNT_TYPE = AuthUser.accountType;
	return ({
		"ADMIN": <Dashboard/>,
		"RECEPTIONIST": <Dashboard/>,
		"INSTRUCTOR": <InstructorDashboard user={AuthUser}/>,
		"STUDENT": <div/>,
		"PARENT": <div>This is a parent's dashboard. This is a placeholder</div>
	}[ACCOUNT_TYPE])
}
