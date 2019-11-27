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

// Local Component Imports
import "./Navigation.scss";
import Routes from "../Routes/rootRoutes";
import CustomTheme from "../../theme/muiTheme";
import Search from "../../components/FeatureViews/Search/Search";
import NavBarRoutes from "../Routes/NavBarRoutes";
import LoginPage from "../Authentication/LoginPage";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../actions/registrationActions";

// const NavList = [
//     // {
//     //     "name": "Dashboard",
//     //     "link": "/",
//     //     "icon": <DashboardIcon />,
//     // },
//     // {
//     //     "name": "Scheduler",
//     //     "link": "/scheduler",
//     //     "icon": <EventIcon />,
//     // },
//     {
//     "name": "Accounts",
//     "link": "/accounts",
//     "icon": <AccountsIcon />,
//     },
//     {
//         "name": "Registration",
//         "link": "/registration",
//         "icon": <AssignmentIcon />,
//     },
// ];

const Navigation = (props) => {

    const dispatch = useDispatch();
    const {token, isAdmin} = useSelector(({auth}) => auth);
    // const isAdmin = useSelector(({auth}) => auth).isAdmin;
    const NavList = isAdmin ? [{
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
    const {pathname} = useLocation();

    const drawer = (
        <div className="DrawerList">
            <List className="list">
                {NavList.map((NavItem) => (
                    <ListItem
                        button
                        className="listItem"
                        component={NavLinkNoDup}
                        isActive={(match, location) => match || (NavItem.name === "Accounts" && location.pathname === "/")}
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


    const handleDrawerToggle = useCallback((event) => {
        event.preventDefault();
        setMobileOpen((open) => !open);
    }, []);

    return (
        <MuiThemeProvider theme={CustomTheme}>
            <div className="Navigation">
                <NavBarRoutes/>
                {
                    pathname !== "/login" && (
                        <nav className="OmouDrawer">
                            {
                                token ? <div>
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
                                </div> : ""
                            }

                        </nav>
                    )
                }
                {
                    token ? <main className="OmouMain">
                        <Routes />
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
