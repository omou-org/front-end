// React Imports
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import {useLocation} from "react-router-dom";
import React, {useCallback, useState} from "react";
import NavLinkNoDup from "../Routes/NavLinkNoDup";

// Material UI Imports
import AccountsIcon from "@material-ui/icons/Contacts";
import AppBar from "@material-ui/core/AppBar";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Drawer from "@material-ui/core/Drawer";
import EventIcon from "@material-ui/icons/Event";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// Local Component Imports
import "./Navigation.scss";
import Routes from "../Routes/rootRoutes";
import CustomTheme from "../../theme/muiTheme";
import Search from "../../components/FeatureViews/Search/Search";

const NavList = [
    // {
    //     "name": "Dashboard",
    //     "link": "/",
    //     "icon": <DashboardIcon />,
    // },
    // {
    //     "name": "Scheduler",
    //     "link": "/scheduler",
    //     "icon": <EventIcon />,
    // },
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
    // for (let i = 0; i < sessionStorage.length; i++){
    //     console.log(sessionStorage.key(i));
    // }
    const dispatch = useDispatch();
    const authToken = useSelector(({auth}) => auth).token;

    const [mobileOpen, setMobileOpen] = useState(false);
    const {pathname} = useLocation();

    const handleDrawerToggle = useCallback((event) => {
        event.preventDefault();
        setMobileOpen((open) => !open);
    }, []);

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return (
        <MuiThemeProvider theme={CustomTheme}>
            <div className="Navigation">
                <AppBar
                    className="OmouBar"
                    color="default"
                    position="sticky">
                    <Toolbar>
                        {
                            pathname === "/login" ? "" :
                                <Hidden lgUp>
                                    <IconButton
                                        aria-label="Open Drawer"
                                        color="inherit"
                                        onClick={handleDrawerToggle}>
                                        <MenuIcon />
                                    </IconButton>
                                </Hidden>
                        }
                        <Typography
                            className="title"
                            component={NavLinkNoDup}
                            to="/">
                            omou
                        </Typography>
                        <div style={{
                            "flex": 1,
                        }} />
                        { authToken ? <Search /> : ""}
                        {
                            pathname === "/login" ? "" : authToken
                                ? <Typography
                                    className="loginToggle"
                                    onClick={handleLogout}>
                                    logout
                                  </Typography>
                                : <Typography
                                    className="login"
                                    component={NavLinkNoDup}
                                    to="/login">
                                    login
                                  </Typography>
                        }
                    </Toolbar>
                </AppBar>
                {
                    pathname !== "/login" && (
                        <nav className="OmouDrawer">
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
                        </nav>
                    )
                }
                <main className="OmouMain">
                    <Routes />
                </main>
            </div>
        </MuiThemeProvider>
    );
};

export default Navigation;
