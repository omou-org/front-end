import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import MoneyIcon from "@material-ui/icons/Money";
import Grid from "@material-ui/core/Grid";
import BackButton from "../../BackButton";
import Chip from "@material-ui/core/Chip";
import './ProfileHeading.scss';
import { Card, Paper, Typography } from "@material-ui/core";

class ProfileHeading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderStudentProfile() {
        return (
            <Grid container>
                <Grid item md={6}>
                    <Grid container>
                        <Grid item md={6} align="left">
                            birthday
                        </Grid>
                        <Grid item md={1} align="left">
                            <PhoneIcon />
                        </Grid>
                        <Grid item md={5} align="left">
                            {this.props.user.phone_number}
                        </Grid>
                        <Grid item md={6} align="left">
                            grade
                        </Grid>
                        <Grid item md={1} align="left">
                            <EmailIcon />
                        </Grid>
                        <Grid item md={5} align="left">
                            {this.props.user.email}
                        </Grid>
                        <Grid item md={6} align="left">
                            highschool
                        </Grid>
                        <Grid item md={1} align="left">
                            <MoneyIcon />
                        </Grid>
                        <Grid item md={5} align="left">
                            balance
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>);
    }

    renderTeacherProfile() {
        return (
            <Grid container>
                <Grid item md={6}>
                    <Grid container>
                        <Grid item md={1} align="left">
                            <PhoneIcon />
                        </Grid>
                        <Grid item md={5} align="left">
                            {this.props.user.phone_number}
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item md={1} align="left">
                            <EmailIcon />
                        </Grid>
                        <Grid item md={5} align="left">
                            {this.props.user.email}
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>);
    }

    render() {
        let profileDetails;
        switch (this.props.user.role) {
            case "student":
                profileDetails = this.renderStudentProfile();
                break;
            case "instructor":
                profileDetails = this.renderTeacherProfile();
                break;
            default:
        }
        return (<div>
           <Grid container>
                <h1 className="left-align">{this.props.user.name}</h1>
            <Chip
                label={this.props.user.role}
            />
            </Grid>
            { profileDetails }
        </div >)
    }

}

ProfileHeading.propTypes = {};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileHeading);
