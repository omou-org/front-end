import { connect } from "react-redux";
import React, { Component } from "react";
import { Card, Paper, Typography } from "@material-ui/core";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as IDIcon } from "../../identifier.svg";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import './Accounts.scss';

class ProfileHeading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    addDashes(string) {
        return (
            `(${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 15)})`);
    }

    iconScaling() {
        let iconStyles;
        return (iconStyles = {
            fontSize: "24",
        })
    }

    renderStudentProfile() {
        return (
            <Grid container>
                <Grid item md={6}>
                    <Grid container>
                        <Grid item xs={6} md={6} className="rowPadding">
                            <Typography className="rowText">
                                {this.props.user.birthday}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={1} className="rowPadding">
                            <IDIcon display="block" viewBox="0 0 10 10" />
                        </Grid>
                        <Grid item xs={5} md={5} className="rowPadding">
                            <Typography className="rowText">
                                #{this.props.user.user_id}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6} className="rowPadding">
                            <Typography className="rowText">
                                Grade {this.props.user.grade}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={1} className="rowPadding">
                            <PhoneIcon style={this.iconScaling()} />
                        </Grid>
                        <Grid item xs={5} md={5} className="rowPadding">
                            <Typography className="rowText">
                                {this.addDashes(this.props.user.phone_number)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6} className="rowPadding">
                            <Typography className="rowText">
                                {this.props.user.school}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={1} className="rowPadding">
                            <EmailIcon style={this.iconScaling()} />
                        </Grid>
                        <Grid item xs={5} md={5} className="rowPadding">
                            <Typography className="rowText">
                                {this.props.user.email}
                            </Typography>
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
                            <IDIcon height={"24px"} width={"24px"} />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            <Typography className="rowText">
                                #{this.props.user.user_id}
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item md={1} className="rowPadding">
                                <PhoneIcon style={this.iconScaling()} />
                            </Grid>
                            <Grid item md={5} className="rowPadding">
                                <Typography className="rowText">
                                    {this.addDashes(this.props.user.phone_number)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item md={1} className="rowPadding">
                            <EmailIcon />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            <Typography className="rowText">
                                {this.props.user.email}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>);
    }

    renderParentProfile() {
        return (
            <Grid container>
                <Grid item xs={1} md={1} className="rowPadding">
                    <IDIcon height={"24px"} width={"24px"}  />
                </Grid>
                <Grid item xs={5} md={5} className="rowPadding">
                    <Typography className="rowText">
                        #{this.props.user.user_id}
                    </Typography>
                </Grid>
                <Grid item xs={1} md={1} className="rowPadding">
                    <MoneyIcon style={this.iconScaling()} />
                </Grid>
                <Grid item xs={5} md={5} className="rowPadding">
                    <Typography className="rowText">
                        0
                    </Typography>
                </Grid>
                <Grid item xs={1} md={1} className="rowPadding">
                    <PhoneIcon style={this.iconScaling()} />
                </Grid>
                <Grid item xs={5} md={5} className="rowPadding">
                    <Typography className="rowText">
                        {this.addDashes(this.props.user.phone_number)}
                    </Typography>
                </Grid>
                <Grid item xs={6} md={6} className="rowPadding">
                </Grid>
                <Grid item xs={1} md={1} className="rowPadding">
                    <EmailIcon style={this.iconScaling()} />
                </Grid>
                <Grid item xs={5} md={5} className="rowPadding">
                    <Typography className="rowText">
                        {this.props.user.email}
                    </Typography>
                </Grid>
                <Grid item xs={6} md={6} className="rowPadding">
                </Grid>
            </Grid>);
    }

    renderEditButton() {
        if (this.props.user.role != "receptionist") {
            return (<div>
                <Grid component={Hidden} xsUp align="right" className="editPadding">
                    <Button
                        className="editButton"
                        component={NavLink}
                        to={`/registration/form/${this.getURL(this.props.user.role)}/${this.props.user.user_id}/edit`}>
                        <EditIcon />
                        Edit Profile
                    </Button>
                </Grid>
                <Grid component={Hidden} xsDown align="right" className="editPadding">
                    <Button
                        className="editButton"
                        component={NavLink}
                        to={`/registration/form/${this.getURL(this.props.user.role)}/${this.props.user.user_id}/edit`}>
                        <EditIcon />
                    </Button>
                </Grid>
            </div>);
        }
    }

    getURL(role) {
        switch (role) {
            case "parent":
                return "student";
            default:
                return role;
        }
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
            case "parent":
                profileDetails = this.renderParentProfile();
            case "receptionist":
                profileDetails = this.renderTeacherProfile();
            default:
        }
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid align="left" item md={5} xs={7}>
                                <h1 className="ProfileName">
                                    {this.props.user.name}
                                </h1>
                            </Grid>
                            <Grid align="left" item md={7} xs={4}>
                                <Chip
                                    className={`userLabel ${this.props.user.role}`}
                                    label={this.props.user.role.charAt(0).toUpperCase() + this.props.user.role.slice(1)}
                                />
                            </Grid>
                            <Grid item md={1} xs={4}>
                                {this.renderEditButton()}
                            </Grid>
                        </Grid>
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
