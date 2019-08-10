import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import MoneyIcon from "@material-ui/icons/Money";
import Grid from "@material-ui/core/Grid";
import BackButton from "../../BackButton";
import './ProfileHeading.scss'

class ProfileHeading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }



    render() {
        let grid;
        switch (this.props.user.type) {
            case "student":
                grid = (
                    <div class="grid">
                        <div>birthday</div>
                        <div>grade</div>
                        <div>highschool</div>
                        <Grid container>
                            <PhoneIcon />{this.props.user.phone_number}</Grid>
                        <Grid container>
                            <EmailIcon />{this.props.user.email}</Grid>
                        <Grid container>
                            <MoneyIcon />balance</Grid>
                    </div>);
                break;
            case "teacher":
                grid = (<div>
                    <Grid container>
                        <PhoneIcon />{this.props.user.phone_number}</Grid>
                    <Grid container>
                        <EmailIcon />{this.props.user.email}</Grid>
                </div>
                );
                break;
            default:
        }
        return (<div>
            <h1 className="left-align">{this.props.user.name}</h1>
            {grid}
        </div>)
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
