import {connect} from "react-redux";
import React, {Component} from "react";
import {Typography} from "@material-ui/core";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import {ReactComponent as IDIcon} from "../../identifier.svg";
import {ReactComponent as BirthdayIcon} from "../../birthday.svg";
import {ReactComponent as GradeIcon} from "../../grade.svg";
import {ReactComponent as SchoolIcon} from "../../school.svg";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import {NavLink} from "react-router-dom";
import {addDashes} from "./accountUtils";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import OutOfOffice from "./OutOfOffice";
import "./Accounts.scss";

class ProfileHeading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "open": false,
        };
    }


    renderStudentProfile() {
        return (
            <Grid
                item
                xs={12}>
                <Grid container>
                    <Grid
                        className="rowPadding"
                        item
                        md={1}
                        xs={1}>
                        <IDIcon className="iconScaling" />
                    </Grid>

                    <Grid
                        className="rowPadding"
                        item
                        md={5}
                        xs={5}>
                        <Typography className="rowText">
                            #{this.props.user.summit_id ? this.props.user.summit_id : this.props.user.user_id}
                        </Typography>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={1}
                        xs={1}>
                        <BirthdayIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={5}
                        xs={5}>
                        <Typography className="rowText">
                            {this.props.user.birthday}
                        </Typography>
                    </Grid>

                    <Grid
                        className="rowPadding"
                        item
                        md={1}
                        xs={1}>
                        <GradeIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={5}
                        xs={5}>
                        <Typography className="rowText">
                            Grade {this.props.user.grade}
                        </Typography>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={1}
                        xs={1}>
                        <PhoneIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={5}
                        xs={5}>
                        <Typography className="rowText">
                            {addDashes(this.props.user.phone_number)}
                        </Typography>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={1}
                        xs={1}>
                        <SchoolIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={5}
                        xs={5}>
                        <Typography className="rowText">
                            {this.props.user.school}
                        </Typography>
                    </Grid>
                    <Grid
                        className="emailPadding"
                        item
                        md={1}
                        xs={1}>
                        <a href={`mailto:${this.props.user.email}`}>
                            <EmailIcon />
                        </a>
                    </Grid>
                    <Grid
                        className="emailPadding"
                        item
                        md={5}
                        xs={5}>
                        <a href={`mailto:${this.props.user.email}`}>
                            <Typography className="rowText" >
                                {this.props.user.email}
                            </Typography>
                        </a>
                    </Grid>
                </Grid>
            </Grid>);
    }

    renderTeacherProfile() {
        return (
            <Grid
                item
                xs={12}>
                <Grid container>
                    <Grid
                        className="rowPadding"
                        item
                        md={1}>
                        <IDIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        md={11}>
                        <Typography className="rowText">
                            #{this.props.user.user_id}
                        </Typography>
                    </Grid>
                    <Grid container>
                        <Grid
                            className="rowPadding"
                            item
                            md={1}>
                            <PhoneIcon className="iconScaling" />
                        </Grid>
                        <Grid
                            className="rowPadding"
                            item
                            md={11}>
                            <Typography className="rowText">
                                {addDashes(this.props.user.phone_number)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid
                        className="emailPadding"
                        item
                        md={1}>
                        <a href={`mailto:${this.props.user.email}`}>
                            <EmailIcon />
                        </a>
                    </Grid>
                    <Grid
                        className="emailPadding"
                        item
                        md={11}>
                        <a href={`mailto:${this.props.user.email}`}>
                            <Typography className="rowText" >
                                {this.props.user.email}
                            </Typography>
                        </a>
                    </Grid>
                </Grid>
            </Grid>);
    }

    renderParentProfile() {
        return (
            <Grid
                item
                xs={12}>
                <Grid container>
                    <Grid
                        className="rowPadding"
                        item
                        xs={1}>
                        <IDIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        xs={5}>
                        <Typography className="rowText">
                            #{this.props.user.user_id}
                        </Typography>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        xs={1}>
                        <MoneyIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        xs={5}>
                        <Typography className="rowText">
                            ${this.props.user.balance}
                        </Typography>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        xs={1}>
                        <PhoneIcon className="iconScaling" />
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        xs={5}>
                        <Typography className="rowText">
                            {addDashes(this.props.user.phone_number)}
                        </Typography>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        xs={6} />
                    <Grid
                        className="emailPadding"
                        item
                        xs={1}>
                        <a href={`mailto:${this.props.user.email}`}>
                            <EmailIcon />
                        </a>
                    </Grid>
                    <Grid
                        className="emailPadding"
                        item
                        xs={5}>
                        <a href={`mailto:${this.props.user.email}`}>
                            <Typography className="rowText" >
                                {this.props.user.email}
                            </Typography>
                        </a>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        item
                        xs={6} />
                </Grid>
            </Grid>);
    }

    handleClose = () => {
        this.setState({
            "open": false,
        });
    };

    renderEditandAwayButton() {
        if (this.props.user.role != "receptionist") {
            return (
                <>
                    <Grid container align="right" item md={9}>
                    <Grid item md={4} align= "right" className="editPadding">
                        {
                            this.props.user.role === "instructor" && <OutOfOffice
                                instructorID={this.props.user.user_id}
                            />
                        }
                    </Grid>
                    <Grid item md={1}>
                    </Grid>
                    <Grid item md={4} align="right" component={Hidden} mdDown className="editPadding">
                        <Button
                            className="editButton"
                            component={NavLink}
                            to={`/registration/form/${this.props.user.role}/${this.props.user.user_id}/edit`}>
                            <EditIcon />
                            Edit Profile
                        </Button>
                    </Grid>
                    <Grid item md={4} align="right" component={Hidden} lgUp className="editPadding">
                        <Button
                            className="editButton"
                            component={NavLink}
                            to={`/registration/form/${this.props.user.role}/${this.props.user.user_id}/edit`}>
                            <EditIcon />
                        </Button>
                    </Grid>

                    </Grid>
                </>
            );
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
                break;
            case "receptionist":
                profileDetails = this.renderTeacherProfile();
                break;
            default:
        }
        return (

            <div>
                <Grid
                    alignItems="center"
                    container
                    item
                    xs={12}>
                    <Grid
                        align="left"
                        item
                        xs={6}>
                        <Grid
                            alignItems="center"
                            container>

                            <h1 className="ProfileName">
                                {this.props.user.name}
                            </h1>
                            <div style={{"paddingLeft": 30}}>
                                <Hidden smDown>
                                    <Chip
                                        className={`userLabel ${this.props.user.role}`}
                                        label={this.props.user.role.charAt(0).toUpperCase() + this.props.user.role.slice(1)} />
                                </Hidden>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid
                        align="right"
                        item
                        xs={6}>
                        {this.props.isAdmin && this.renderEditandAwayButton()}
                    </Grid>
                </Grid>
                {profileDetails}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    "isAdmin": state.auth.isAdmin,
});

export default connect(mapStateToProps)(ProfileHeading);
