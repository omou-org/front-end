import { connect } from "react-redux";
import React, { Component } from "react";
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
            svgIcon: "1.8vw",
        };
    }

    addDashes(string) {
        return (
            `(${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 15)})`);
    }

    iconScaling(){
        let iconStyles;
        return( iconStyles={
            fontSize:"1.8vw", 
        })
    }

    renderStudentProfile() {
        let iconStyles={
            fontSize:"1.8vw", 
        }
        return (
            <Grid container>
                <Grid item md={10}>
                    <Grid container>
                        <Grid item md={6} className="rowPadding">
                            {this.props.user.birthday}
                        </Grid>
                        <Grid item md={1} className="rowPadding">
                            <IDIcon height={this.state.svgIcon} width={this.state.svgIcon} />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            #{this.props.user.user_id}
                        </Grid>
                        <Grid item md={6} className="rowPadding">
                            Grade {this.props.user.grade}
                        </Grid>
                        <Grid item md={1} className="rowPadding">
                            <PhoneIcon style={this.iconScaling()}/>
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            {this.addDashes(this.props.user.phone_number)}
                        </Grid>
                        <Grid item md={6} className="rowPadding">
                            {this.props.user.school}
                        </Grid>
                        <Grid item md={1} className="rowPadding">
                            <EmailIcon style={this.iconScaling()}/>
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            {this.props.user.email}
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
                            <IDIcon height={this.state.svgIcon} width={this.state.svgIcon} />
                        </Grid>
                        <Grid item md={5} className="rowPadding">
                            #{this.props.user.user_id}
                        </Grid>
                        <Grid container>
                            <Grid item md={1} className="rowPadding">
                                <PhoneIcon style={this.iconScaling()}/>
                            </Grid>
                            <Grid item md={5} className="rowPadding">
                                {this.addDashes(this.props.user.phone_number)}
                            </Grid>
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

    renderParentProfile() {
        return (
            <Grid container>
                <Grid item xs={1} className="rowPadding">
                    <IDIcon height={this.state.svgIcon} width={this.state.svgIcon} />
                </Grid>
                <Grid item={5} className="rowPadding">
                    #{this.props.user.user_id}
                </Grid>
                <Grid item md={1} className="rowPadding">
                    <MoneyIcon style={this.iconScaling()}/>
                </Grid>
                <Grid item md={5} className="rowPadding">
                    0
                </Grid>
                <Grid item md={1} className="rowPadding">
                    <PhoneIcon style={this.iconScaling()}/>
                </Grid>
                <Grid item md={5} className="rowPadding">
                    {this.addDashes(this.props.user.phone_number)}
                </Grid>
                <Grid item md={6} className="rowPadding">
                </Grid>
                <Grid item md={1} className="rowPadding">
                    <EmailIcon style={this.iconScaling()}/>
                </Grid>
                <Grid item md={5} className="rowPadding">
                    {this.props.user.email}
                </Grid>
                <Grid item md={6} className="rowPadding">
                </Grid>
            </Grid>);
    }

    renderEditButton() {
        if (this.props.user.role != "receptionist") {
            return (
                <Grid component={Hidden} xsDown align="right" className="editPadding">
                    <Button
                        className="editButton"
                        component={NavLink}
                        to={`/registration/form/${this.getURL(this.props.user.role)}/${this.props.user.user_id}/edit`}>
                        <EditIcon />
                        Edit Profile
                    </Button>
                </Grid>);
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
                    <Grid align="left">
                        <h1>{this.props.user.name}</h1>
                    </Grid>
                    <Grid component={Hidden} xsDown>
                        <Chip
                            className={`userLabel ${this.props.user.role}`}
                            label={this.props.user.role.charAt(0).toUpperCase() + this.props.user.role.slice(1)}
                        />
                    </Grid>
                    <Grid component={Hidden} smUp xs={12}>
                        <Chip
                            className={`userLabel ${this.props.user.role}`}
                            label={this.props.user.role.charAt(0).toUpperCase() + this.props.user.role.slice(1)}
                        />
                    </Grid>
                    {this.renderEditButton()}
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
