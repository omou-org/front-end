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
import MenuIcon from '@material-ui/icons/Menu'
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Hidden from "@material-ui/core/Hidden";
import CustomTheme from "../../theme/muiTheme"

//Local Component Imports
import './Navigation.scss'
import {MuiThemeProviderOld} from "@material-ui/core/es/styles/MuiThemeProvider";
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
            { name: 'Dashboard', link: '/'},
            { name: 'Scheduler', link: '/scheduler'},
            { name: 'Courses', link: '/courses'},
            { name: 'Registration', link: '/registration'},
            { name: 'Attendance', link: '/attendance'},
            { name: 'Gradebook', link: '/gradebook'},
            { name: 'Directory', link: '/directory'},
        ];

        const drawer = (
            <div className="DrawerList">
                <div
                    // className={classes.toolbar}
                />
                <List>
                    {NavList.map((NavItem, index) => (
                        <NavLink to={NavItem.link}>
                            <ListItem button key={index}>
                                <ListItemText primary={NavItem.name} />
                            </ListItem>
                        </NavLink>
                    ))}
                </List>
            </div>
        );

        return (
            <MuiThemeProvider theme={CustomTheme}>
                <div className={`Navigation`}>
                    <AppBar position="relative" className="OmouBar"
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
                            <NavLink to="/">
                                <Typography variant="title" color="inherit">
                                    Omou
                                </Typography>
                            </NavLink>
                        </Toolbar>
                    </AppBar>
                    <nav
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