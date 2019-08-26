import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { Card, Paper, Typography } from "@material-ui/core";
import './Accounts.scss';

import BackButton from "../../BackButton";
import ComponentViewer from "./ComponentViewer.js";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ProfileHeading from "./ProfileHeading.js";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import BioIcon from "@material-ui/icons/PersonOutlined";
import CoursesIcon from "@material-ui/icons/SchoolOutlined";
import ScheduleIcon from "@material-ui/icons/CalendarTodayOutlined";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import CurrentSessionsIcon from "@material-ui/icons/AssignmentOutlined";
import PastSessionsIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import PaymentIcon from "@material-ui/icons/CreditCardOutlined"
import ContactIcon from "@material-ui/icons/ContactPhoneOutlined"

const userTabs = {
    "instructor": [
        {
            tab_heading: "Schedule",
            tab_id: 0,
            icon: <ScheduleIcon className="TabIcon"/>,
        },
        {
            tab_heading: "Courses",
            tab_id: 1,
            icon: <CoursesIcon className="TabIcon"/>,
        },
        {
            tab_heading: "Bio",
            tab_id: 2,
            icon: <BioIcon className="TabIcon"/>,
        },
        {
            tab_heading: "Notes",
            tab_id: 7,
            icon: <NoteIcon className="TabIcon"/>,
        },
        ],
    "student": [
        {
            tab_heading: "Current Sessions",
            tab_id: 3,
            icon: <CurrentSessionsIcon className="TabIcon"/>,
        },
        {
            tab_heading: "Past Sessions",
            tab_id: 4,
            icon: <PastSessionsIcon className="TabIcon"/>,
        },
        {
            tab_heading: "Payment History",
            tab_id: 5,
            icon: <PaymentIcon className="TabIcon"/>,
        },
        {
            tab_heading: "Parent Contact",
            tab_id: 6,
            icon: <ContactIcon className="TabIcon"/>,
        },
        {
            tab_heading: "Notes",
            tab_id: 7,
            icon: <NoteIcon className="TabIcon"/>,
        }],
}

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            tabs: [],
            value: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        let user;
        let accountType = this.props.computedMatch.params.accountType, accountID = this.props.computedMatch.params.accountID;
        switch (accountType) {
            case "student":
                user = this.props.students[accountID];
                break;
            case "parent":
                user = this.props.parents[accountID];
                break;
            case "instructor":
                user = this.props.instructors[accountID];
                break;
            default:
                user = -1;
        }
        // this.setState({ ...CourseInView });
        this.setState({
            user: user,
            tabs: userTabs[accountType],
        })
    }

    handleChange(e, newTabIndex) {
        e.preventDefault();
        this.setState({ value: newTabIndex });
    }

    stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let colour = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            colour += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return colour;
    }

    render() {
        let styles = {
            backgroundColor: this.stringToColor(this.state.user.name),
            color: "white",
            margin: 10,
            width: 150,
            height: 150,
            fontSize: 50,
        };
        return (<div className="UserProfile">
            <Paper className={'paper'}>
                <BackButton
                    warn={false}
                />
                <Grid container layout="row" className={'padding'}>
                    <Grid item md={2}>
                        <Avatar style={styles}>{this.state.user.name.match(/\b(\w)/g).join('')}</Avatar>
                    </Grid>
                    <Grid item md={8} >
                        <ProfileHeading user={this.state.user} />
                    </Grid>
                </Grid>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {this.state.tabs.map((tab) => { return <Tab 
                    label={<>{tab.icon} {tab.tab_heading}</>} /> })}
                </Tabs>
                <ComponentViewer user={this.state.user} inView={this.state.tabs[this.state.value].tab_id} />
            </Paper>
        </div>
        )
    }

}

UserProfile.propTypes = {};

function mapStateToProps(state) {
    return {
        students: state.Users.StudentList,
        parents: state.Users.ParentList,
        instructors: state.Users.InstructorList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfile);
