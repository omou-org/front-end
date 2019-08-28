import { connect } from 'react-redux';
import React, { Component } from 'react';
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import {NavLink} from "react-router-dom";

class ProfileHeading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    addDashes(f) {
        return ("(" + f.slice(0, 3) + "-" + f.slice(3, 6) + "-" + f.slice(6, 15) + ")");
    }

    renderStudentProfile() {
        return (
            <Grid container >
                <Grid item md={10}>
                    <Grid container >
                        <Grid item md={6} className="rowPadding">
                            {this.props.user.birthday}
                        </Grid>
                        <Grid item md={1} className="rowPadding">
                            <PhoneIcon />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            {this.addDashes(this.props.user.phone_number)}
                        </Grid>
                        <Grid item md={6} className="rowPadding">
                            Grade {this.props.user.grade}
                        </Grid>
                        <Grid item md={1} className="rowPadding">
                            <EmailIcon />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            {this.props.user.email}
                        </Grid>
                        <Grid item md={6} className="rowPadding">
                            {this.props.user.school}
                        </Grid>
                        <Grid item md={1} className="rowPadding">
                            <MoneyIcon />
                        </Grid>
                        <Grid item md={5} align="left">
                            ${this.props.user.balance}
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
                        <Grid item md={1} className="rowPadding">
                            <PhoneIcon />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            {this.addDashes(this.props.user.phone_number)}
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item md={1} className="rowPadding">
                            <EmailIcon />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
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
        return (
            <div>
                <Grid container>
                    <Grid item md={6}>
                        <h1 className="left-align">{this.props.user.name}</h1>
                    </Grid>
                    <Grid item md={3}>
                        <Chip
                            className={`userLabel ${this.props.user.role}`}
                            label={this.props.user.role.charAt(0).toUpperCase() + this.props.user.role.slice(1)}
                        />
                    </Grid>
                    <Grid item md={3} align="right">
                        <Button
                            component={NavLink}
                            to={`/registration/form/student/${this.props.user.user_id}/edit`}>
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
                {profileDetails}
            </div>
        );
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
