import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import AccountsIcon from "@material-ui/icons/Contacts";
import AdminIcon from "@material-ui/icons/Face";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Drawer from "@material-ui/core/Drawer";
import EventIcon from "@material-ui/icons/Event";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import "./Navigation.scss";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import OmouTheme from "../../theme/muiTheme";
import { RootRoutes } from "../Routes/RootRoutes";

import AuthenticatedNav from "../Navigation/AuthenticatedNav";
import UnauthenticatedNav from "../Navigation/UnauthenticatedNav";

import { USER_TYPES } from "utils";

const useStyles = makeStyles({
    "navigationIconStyle": {
        "height": "50px",
    },
    "navigationLeftList": {
        "width": "23%",
    },
});

const Navigation = () => {
    const classes = useStyles();
    const { token } = useSelector(({ auth }) => auth);

    const isAdmin =
        useSelector(({ auth }) => auth.accountType) === USER_TYPES.admin;

    const NavList = isAdmin ?
        [
            // {
            //     "name": "Dashboard",
            //     "link": "/",
            //     "icon": <DashboardIcon />,
            // },
            {
                "name": "Scheduler",
                "link": "/scheduler",
                "icon": <EventIcon />,
            },
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
            {
                "name": "Admin",
                "link": "/adminportal",
                "icon": <AdminIcon />,
            },
        ] :
        [
            {
                "name": "Scheduler",
                "link": "/scheduler",
                "icon": <EventIcon />,
            },
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
        ];

    const [mobileOpen, setMobileOpen] = useState(false);

    const drawer = (
        <div className="DrawerList">
            <List className="list">
                {NavList.map((NavItem) => (
                    <ListItem
                        button
                        className={`listItem ${classes.navigationIconStyle}`}
                        component={NavLinkNoDup}
                        isActive={(match, location) => match ||
                            (NavItem.name === "Scheduler" &&
                                location.pathname === "/")}
                        key={NavItem.name}
                        to={NavItem.link}>
                        <ListItemIcon className="icon">
                            {NavItem.icon}
                        </ListItemIcon>
                        <ListItemText className="text" primary={NavItem.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);

    const matches = useMediaQuery('(margin-left: 233px)');
    console.log(useMediaQuery("margin-left:233px"))

    return (
        <ThemeProvider theme={OmouTheme}>
            <div className="Navigation">
                {token ?
                    <AuthenticatedNav
                        toggleDrawer={handleDrawerToggle} /> :
                    <UnauthenticatedNav />}
                {token && (
                    <nav className="OmouDrawer">
                        <Hidden implementation="css" smUp>
                            <Drawer
                                classes={{ "paper": classes.navigationLeftList }}
                                onClose={handleDrawerToggle}
                                open={mobileOpen}
                                variant="temporary">
                                {drawer}
                            </Drawer>
                        </Hidden>
                        <Hidden implementation="css" mdDown>
                            <Drawer open variant="permanent">
                                {drawer}
                            </Drawer>
                        </Hidden>
                    </nav>
                )}
                {token ?
                <main className="OmouMain">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <RootRoutes />
                    </MuiPickersUtilsProvider>
                </main>
                : <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <RootRoutes />
                    </MuiPickersUtilsProvider>}
            </div>
        </ThemeProvider>
    );
};

export default Navigation;
