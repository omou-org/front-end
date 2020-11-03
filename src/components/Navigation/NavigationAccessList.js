import EventIcon from "@material-ui/icons/CalendarToday";
import React from "react";
import AccountsIcon from "@material-ui/icons/Contacts";
import AdminIcon from "@material-ui/icons/Face";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PaymentIcon from "@material-ui/icons/Payment";

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
			"name": "Registration",
			"link": "/registration",
			"icon": <AssignmentIcon/>,
		},
		{
			"name": "Courses",
			"link": "/coursemanagement",
			"icon": <MenuBookIcon />
		},
		{
			"name": "Accounts",
			"link": "/accounts",
			"icon": <AccountsIcon/>,
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
			"name": "Registration",
			"link": "/registration",
			"icon": <AssignmentIcon/>,
		},
		{
			"name": "Courses",
			"link": "/coursemanagement",
			"icon": <MenuBookIcon />
		},
		{
			"name": "Accounts",
			"link": "/accounts",
			"icon": <AccountsIcon/>,
		},
	],
	"INSTRUCTOR": [
		// {
		// 	"name": "Dashboard",
		// 	"link": "/",
		// 	"icon": <DashboardIcon/>,
		// },
		{
			"name": "Schedule",
			"link": "/scheduler",
			"icon": <EventIcon/>,
		},
		{
			"name": "Courses",
			"link": "/coursemanagement",
			"icon": <MenuBookIcon />
		},
		{
			"name": "Availability",
			"link": "/availability",
			"icon": <EventIcon/>,
		},
		{
			"name": "Teaching Log",
			"link": "/teaching-log",
			"icon": <EventIcon/>,
		},
	],
	"PARENT": [
		// {
		// 	"name": "Dashboard",
		// 	"link": "/",
		// 	"icon": <DashboardIcon/>,
		// },

		{
			"name": "Schedule",
			"link": "/scheduler",
			"icon": <EventIcon/>,
		},
		{
			"name": "Courses",
			"link": "/coursemanagement",
			"icon": <MenuBookIcon />
		},
		{
			"name": "Payments",
			"link": "/my-payments",
			"icon": <PaymentIcon/>,
		},
		{
			"name": "Registration",
			"link": "/registration",
			"icon": <AssignmentIcon/>,
		},
	],
    "STUDENT": [],
};
