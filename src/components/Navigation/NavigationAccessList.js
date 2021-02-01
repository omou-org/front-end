import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import React from 'react';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import ContactsOutlinedIcon from '@material-ui/icons/ContactsOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PaymentIcon from '@material-ui/icons/Payment';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import { ReactComponent as NewAdminIcon } from './newadminicon.svg';

/**
 * Various pages accessible by different users
 * */

export const NavList = {
    ADMIN: [
        {
            name: 'Dashboard',
            link: '/',
            icon: <DashboardIcon />,
        },
        {
            name: 'Scheduler',
            link: '/scheduler',
            icon: <EventOutlinedIcon />,
        },
        {
            name: 'Registration',
            link: '/registration',
            icon: <AssignmentOutlinedIcon />,
        },
        {
            name: 'Courses',
            link: '/coursemanagement',
            icon: <MenuBookIcon />,
        },
        {
            name: 'Accounts',
            link: '/accounts',
            icon: <ContactsOutlinedIcon />,
        },
        {
            name: 'Admin',
            link: '/adminportal',
            icon: <NewAdminIcon />,
        },
    ],
    RECEPTIONIST: [
        {
            name: 'Dashboard',
            link: '/',
            icon: <DashboardIcon />,
        },
        {
            name: 'Scheduler',
            link: '/scheduler',
            icon: <EventOutlinedIcon />,
        },
        {
            name: 'Registration',
            link: '/registration',
            icon: <AssignmentOutlinedIcon />,
        },
        {
            name: 'Courses',
            link: '/coursemanagement',
            icon: <MenuBookIcon />,
        },
        {
            name: 'Accounts',
            link: '/accounts',
            icon: <ContactsOutlinedIcon />,
        },
    ],
    INSTRUCTOR: [
        // {
        // 	"name": "Dashboard",
        // 	"link": "/",
        // 	"icon": <DashboardIcon/>,
        // },
        {
            name: 'Schedule',
            link: '/scheduler',
            icon: <EventOutlinedIcon />,
        },
        {
            name: 'Courses',
            link: '/coursemanagement',
            icon: <MenuBookIcon />,
        },
        {
            name: 'Availability',
            link: '/availability',
            icon: <AccessTimeOutlinedIcon />,
        },
        {
            name: 'Teaching Log',
            link: '/teaching-log',
            icon: <ListAltOutlinedIcon />,
        },
    ],
    PARENT: [
        // {
        // 	"name": "Dashboard",
        // 	"link": "/",
        // 	"icon": <DashboardIcon/>,
        // },

        {
            name: 'Schedule',
            link: '/scheduler',
            icon: <EventOutlinedIcon />,
        },
        {
            name: 'Courses',
            link: '/coursemanagement',
            icon: <MenuBookIcon />,
        },
        {
            name: 'Payments',
            link: '/my-payments',
            icon: <PaymentIcon />,
        },
        {
            name: 'Registration',
            link: '/registration',
            icon: <AssignmentOutlinedIcon />,
        },
    ],
    STUDENT: [],
};
