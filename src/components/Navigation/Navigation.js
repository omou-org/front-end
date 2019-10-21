// React Imports
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "../../actions/authActions";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Material UI Imports
// TODO: import each component individually (i.e. '@material-ui/core/AppBar') to reduce bundle size
import { AppBar, Drawer, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EventIcon from "@material-ui/icons/Event";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AccountsIcon from "@material-ui/icons/Contacts";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Hidden from "@material-ui/core/Hidden";
import Routes from "../Routes/rootRoutes"
import CustomTheme from "../../theme/muiTheme"
import ListItemIcon from "@material-ui/core/ListItemIcon";

// Local Component Imports
import "./Navigation.scss";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";

function Navigation(props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    function handleDrawerToggle(event) {
        event.preventDefault();
        setMobileOpen(!mobileOpen);
    }

    const NavList = [
        {name: "Accounts", link: "/", icon: <AccountsIcon/>},
        {name: "Registration", link: "/registration", icon: <AssignmentIcon/>},
    ];

    const drawer = (
        <div className="DrawerList">
            <List className={"list"}>
                {NavList.map((NavItem, index) => (
                    <ListItem button key={index} component={NavLink} exact={NavItem.name === "Accounts"} to={NavItem.link} className={"listItem"}>
                        <ListItemIcon className={"icon"}>{NavItem.icon}</ListItemIcon>
                        <ListItemText primary={NavItem.name} className={"text"} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <MuiThemeProvider theme={CustomTheme}>
            <div className={"Navigation"}>
                <AppBar color={"default"}
                    position="fixed"
                    className="OmouBar">
                    <Toolbar>
                        <Hidden >
                            <IconButton
                                color="inherit"
                                aria-label="Open Drawer"
                                onClick={handleDrawerToggle}>
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Typography component={NavLink} to="/" className="title">
                            omou
                        </Typography>
                        <div style={{
                            flex: 1,
                        }} />
                        {
                            props.auth.token
                                ? <Typography
                                    className="loginToggle"
                                    onClick={props.authActions.logout}>
                                    logout
                                </Typography>
                                : <Typography component={NavLink} to="/login" className="login">
                                    login
                                </Typography>
                        }
                    </Toolbar>
                </AppBar>
                {
                    !isLogin && (
                        <nav className="OmouDrawer">
                            <Hidden smUp implementation="css">
                                <Drawer
                                    container={props.container}
                                    variant="temporary"
                                    open={mobileOpen}
                                    onClose={handleDrawerToggle}>
                                    {drawer}
                                </Drawer>
                            </Hidden>
                            <Hidden mdDown implementation="css">
                                <Drawer
                                    variant="permanent"
                                    open>
                                    {drawer}
                                </Drawer>
                            </Hidden>
                        </nav>
                    )
                }
                <main className="OmouMain">
                    <Routes setLogin={(status) => {
                        setIsLogin(status);
                    }} />
                </main>
            </div>
        </MuiThemeProvider>
    );
}

Navigation.propTypes = {
    auth: PropTypes.shape({}),
    authActions: PropTypes.any,
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        authActions: bindActionCreators(authActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
