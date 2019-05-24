import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import BackArrow from "@material-ui/icons/ArrowBack";
import {Typography} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import {NavLink} from "react-router-dom";
import ListItem from "../../Navigation/Navigation";

class FormSection extends Component {
    constructor(){
        super();
        this.state = {
            exitPopup:false,
        }
    }

    backToggler(){
        this.setState({exitPopup:!this.state.exitPopup});
    }

    render(){
        console.log(this.props.section);
        return (
            <Grid item xs={12}>

            </Grid>
        )
    }
}

FormSection.propTypes = {
    stuffActions: PropTypes.object,
    FormSectionFormSections: PropTypes.array
};

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"],
        courseCategories: state.Registration["categories"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormSection);