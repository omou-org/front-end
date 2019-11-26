// React Imports
import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";

// Material UI Imports
import AccountsIcon from "@material-ui/icons/Contacts";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Drawer from "@material-ui/core/Drawer";
import EventIcon from "@material-ui/icons/Event";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";

// Local Component Imports
import "./Navigation.scss";
import CustomTheme from "../../theme/muiTheme";
import LoginPage from "../Authentication/LoginPage";
import NavBarRoutes from "../Routes/NavBarRoutes";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import Routes from "../Routes/rootRoutes";

const NavList = [
    {
        "name": "Dashboard",
        "link": "/",
        "icon": <DashboardIcon />,
    },
    {
        "name": "Scheduler",
        "link": "/scheduler",
        "icon": <EventIcon />,
    },
    // {name: "Courses", link: "/courses", icon: <CourseIcon/>},
    {
        "name": "Accounts",
        "link": "/accounts",
        "icon": <AccountsIcon />,
    },
    {
        "name": "Registration",
        "link": "/registration",
        "icon": <AssignmentIcon />,
    },
    // {name: "Attendance", link: "/attendance", icon: <AttendanceIcon/>},
    // {name: "Gradebook", link: "/gradebook", icon: <ClassIcon/>},
];

const drawer = (
    <div className="DrawerList">
        <List className="list">
            {NavList.map((NavItem) => (
                <ListItem
                    button
                    className="listItem"
                    component={NavLinkNoDup}
                    exact={NavItem.name === "Dashboard"}
                    key={NavItem.name}
                    to={NavItem.link}>
                    <ListItemIcon className="icon">{NavItem.icon}</ListItemIcon>
                    <ListItemText
                        className="text"
                        primary={NavItem.name} />
                </ListItem>
            ))}
        </List>
    </div>
);

const Navigation = () => {
    const authToken = useSelector(({auth}) => auth.token);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = useCallback((event) => {
        event.preventDefault();
        setMobileOpen((open) => !open);
    }, []);

    return (
        <MuiThemeProvider theme={CustomTheme}>
            <div className="Navigation">
                <NavBarRoutes toggleDrawer={handleDrawerToggle} />
                {
                    authToken
                        ? (
                            <>
                                <nav className="OmouDrawer">
                                    <div>
                                        <Hidden
                                            implementation="css"
                                            smUp>
                                            <Drawer
                                                onClose={handleDrawerToggle}
                                                open={mobileOpen}
                                                variant="temporary">
                                                {drawer}
                                            </Drawer>
                                        </Hidden>
                                        <Hidden
                                            implementation="css"
                                            mdDown>
                                            <Drawer
                                                open
                                                variant="permanent">
                                                {drawer}
                                            </Drawer>
                                        </Hidden>
                                    </div>
                                </nav>
                                <main className="OmouMain">
                                    <Routes />
                                </main>
                            </>
                        )
                        : <LoginPage />
                }
            </div>
        </MuiThemeProvider>
    );
};

export default Navigation;
