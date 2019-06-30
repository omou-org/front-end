//React Imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stuffActions from '../../actions/stuffActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavLink} from "react-router-dom";


//Material UI Imports
//TODO: import each component individually (i.e. '@material-ui/core/AppBar') to reduce bundle size
import {AppBar, Drawer, IconButton, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EventIcon from '@material-ui/icons/Event';
import CourseIcon from '@material-ui/icons/School'
import AssignmentIcon from '@material-ui/icons/Assignment';
import AttendanceIcon from '@material-ui/icons/ViewList';
import ClassIcon from '@material-ui/icons/Class';
import DirectoryIcon from '@material-ui/icons/Contacts';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Hidden from "@material-ui/core/Hidden";
import Routes from '../Routes/rootRoutes'
import CustomTheme from "../../theme/muiTheme"
import ListItemIcon from "@material-ui/core/ListItemIcon";

//Local Component Imports
import './Navigation.scss'
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";



class Navigation extends Component {
    state = {
        mobileOpen: false,
    };

    handleDrawerToggle = (e) => {
        e.preventDefault();
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };
    render(){
        let NavList = [
            { name: 'Dashboard', link: '/', icon: <DashboardIcon/> },
            { name: 'Scheduler', link: '/scheduler', icon: <EventIcon/> },
            // { name: 'Courses', link: '/courses', icon: <CourseIcon/>},
            { name: 'Registration', link: '/registration', icon: <AssignmentIcon/>},
            // { name: 'Attendance', link: '/attendance', icon: <AttendanceIcon/>},
            // { name: 'Gradebook', link: '/gradebook', icon:<ClassIcon/>},
            { name: 'Accounts', link: '/accounts', icon:<DirectoryIcon/>},
        ];

        const drawer = (
            <div className="DrawerList">
                <List className={"list"}>
                    {NavList.map((NavItem, index) => (
                        <ListItem button key={index} component={NavLink} exact={NavItem.name === "Dashboard"} to={NavItem.link} className={"listItem"}>
                            <ListItemIcon>{NavItem.icon}</ListItemIcon>
                            <ListItemText primary={NavItem.name} className={"text"}/>
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        return (
            <MuiThemeProvider theme={CustomTheme}>
                <div className={`Navigation`}>
                    <AppBar position="fixed" className="OmouBar"
                            // className={classes.appBar}
                    >
                        <Toolbar>
                            <Hidden smUp>
                                <IconButton
                                    color="inherit"
                                    aria-label="Open Drawer"
                                    onClick={this.handleDrawerToggle.bind(this)}
                                    // className={classes.menuButton}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            </Hidden>
                            <Typography component={NavLink} to="/" className={"title"}>
                                omou
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <nav className="OmouDrawer"
                        // className={classes.drawer}
                    >
                        <Hidden smUp implementation="css">
                            <Drawer
                                container={this.props.container}
                                variant="temporary"
                                // anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                open={this.state.mobileOpen}
                                onClose={this.handleDrawerToggle}
                            >
                                {drawer}
                            </Drawer>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                            <Drawer
                                classes={{
                                    // paper: classes.drawerPaper,
                                }}
                                variant="permanent"
                                open
                            >
                                {drawer}
                            </Drawer>
                        </Hidden>
                    </nav>
                    <main className="OmouMain">
                        <Routes/>
                    </main>

                </div>
            </MuiThemeProvider>
        )
    }
}

Navigation.propTypes = {
    stuffActions: PropTypes.object,
    stuffs: PropTypes.array
};

function mapStateToProps(state) {
    return {
        stuffs: state.stuff
    };
}

function mapDispatchToProps(dispatch) {
    return {
        stuffActions: bindActionCreators(stuffActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);