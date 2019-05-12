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
import './Form.scss'
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";



class Form extends Component {
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

        return (
            <div>

            </div>
        )
    }
}

Form.propTypes = {
    stuffActions: PropTypes.object,
    formType: PropTypes.string,
    filledFields: PropTypes.array,
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
)(Form);