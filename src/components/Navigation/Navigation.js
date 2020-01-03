// React Imports
import {connect, useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import {useLocation, withRouter} from "react-router-dom";
import React, {useCallback, useState, useEffect} from "react";
import NavLinkNoDup from "../Routes/NavLinkNoDup";

// Material UI Imports
import AccountsIcon from "@material-ui/icons/Contacts";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AdminIcon from "@material-ui/icons/Face"
import ListItemText from "@material-ui/core/ListItemText";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EventIcon from "@material-ui/icons/Event";

// Local Component Imports
import "./Navigation.scss";
import CustomTheme from "../../theme/muiTheme";
import LoginPage from "../Authentication/LoginPage";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../actions/registrationActions";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "material-ui-pickers";
import Routes from "../Routes/rootRoutes";
import NavBarRoutes from "../Routes/NavBarRoutes";

const Navigation = (props) => {
    const {pathname} = useLocation();
    const dispatch = useDispatch();
    const {token, isAdmin} = useSelector(({auth}) => auth);
    console.log(token);
    // const isAdmin = useSelector(({auth}) => auth).isAdmin;
    const NavList = isAdmin ? [
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
                    "icon": <AdminIcon/>,
                }
            ] :
        [{
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
                        className="listItem"
                        component={NavLinkNoDup}
                        isActive={(match, location) => match
                            // || (NavItem.name === "Accounts" && location.pathname === "/")
                        }
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


    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);

    return (
        <MuiThemeProvider theme={CustomTheme}>
            <div className="Navigation">
                <NavBarRoutes toggleDrawer={handleDrawerToggle} />
                {
                    pathname !== "/login" && (
                        <nav className="OmouDrawer">
                            {
                                token ? <>
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
                                </> : ""
                            }
                        </nav>
                    )
                }
                {
                    token ? <main className="OmouMain">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Routes />
                        </MuiPickersUtilsProvider>
                    </main> : <LoginPage/>

                }

            </div>
        </MuiThemeProvider>
    );
};
const mapStateToProps = (state) => ({
    "isAdmin":state.auth.isAdmin,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation));
