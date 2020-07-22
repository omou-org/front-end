import EventIcon from "@material-ui/icons/CalendarToday";
import React from "react";
import AccountsIcon from "@material-ui/icons/Contacts";
import AdminIcon from "@material-ui/icons/Face";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DashboardIcon from "@material-ui/icons/Dashboard"

/**
 * Various pages accessible by different users
 * */

export const NavList = {
	"ADMIN": [
		{
			"name": "Dashboard",
			"link": "/",
			"icon": <DashboardIcon/>,
		},
		{
			"name": "Scheduler",
			"link": "/scheduler",
			"icon": <EventIcon/>,
		},
		{
			"name": "Accounts",
			"link": "/accounts",
			"icon": <AccountsIcon/>,
		},
		{
			"name": "Registration",
			"link": "/registration",
			"icon": <AssignmentIcon/>,
		},
		{
			"name": "Admin",
			"link": "/adminportal",
			"icon": <AdminIcon/>,
		},
	],
	"RECEPTIONIST": [
		{
			"name": "Dashboard",
			"link": "/",
			"icon": <DashboardIcon/>,
		},
		{
			"name": "Scheduler",
			"link": "/scheduler",
			"icon": <EventIcon/>,
		},
		{
			"name": "Accounts",
			"link": "/accounts",
			"icon": <AccountsIcon/>,
		},
		{
			"name": "Registration",
			"link": "/registration",
			"icon": <AssignmentIcon/>,
		},
	],
	"INSTRUCTOR": [
		{
			"name": "Dashboard",
			"link": "/",
			"icon": <DashboardIcon/>,
		},
		{
			"name": "Scheduler",
			"link": "/scheduler",
			"icon": <EventIcon/>,
		},
		{
			"name": "My Availability",
			"link": "/availability",
			"icon": <EventIcon/>,
		},
		{
			"name": "Teaching Log",
			"link": "/teaching-log",
			"icon": <EventIcon/>,
		},
	]
};