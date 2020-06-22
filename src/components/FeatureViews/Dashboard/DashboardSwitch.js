import React from "react";
import {useSelector} from "react-redux";
import Dashboard from "./Dashboard";
import InstructorDashboard from "./InstructorDashboard";

export default function DashboardSwitch() {
	const AuthUser = useSelector(({auth}) => auth);
	const ACCOUNT_TYPE = AuthUser.accountType;
	return ({
		"OWNER": <Dashboard/>,
		"RECEPTIONIST": <Dashboard/>,
		"INSTRUCTOR": <InstructorDashboard user={AuthUser}/>,
	}[ACCOUNT_TYPE])
}