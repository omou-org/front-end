import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import React from 'react';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import ContactsOutlinedIcon from '@material-ui/icons/ContactsOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import { ReactComponent as NewAdminIcon } from './newadminicon.svg';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

/**
 * @description Various pages accessible by different users
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
            link: '/courses',
            icon: <MenuBookIcon />,
        },
        {
            name: 'Accounts',
            link: '/accounts',
            icon: <ContactsOutlinedIcon />,
        },
        {
            name: 'Invoices',
            link: '/invoices',
            icon: <AttachMoneyIcon />,
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
            link: '/courses',
            icon: <MenuBookIcon />,
        },
        {
            name: 'Accounts',
            link: '/accounts',
            icon: <ContactsOutlinedIcon />,
        },
        {
            name: 'Invoices',
            link: '/invoices',
            icon: <AttachMoneyIcon />,
        },
        {
            name: 'Request',
            link: '/request',
            icon: <EventAvailableIcon />,
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
            link: '/courses',
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
            link: '/courses',
            icon: <MenuBookIcon />,
        },
        // {
        //     name: 'Payments',
        //     link: '/my-payments',
        //     icon: <PaymentIcon />,
        // },
        {
            name: 'Registration',
            link: '/registration',
            icon: <AssignmentOutlinedIcon />,
        },
        {
            name: 'Invoices',
            link: '/invoices',
            icon: <AttachMoneyIcon />,
        },
        {
            name: 'Request',
            link: '/request',
            icon: <EventAvailableIcon />,
        },
    ],
    STUDENT: [],
};
