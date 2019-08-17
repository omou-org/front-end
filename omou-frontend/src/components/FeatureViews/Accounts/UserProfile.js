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

const userTabs = {
    "instructor": [
        {
            tab_heading: "Schedule",
            tab_id: 0,
        },
        {
            tab_heading: "Courses",
            tab_id: 1,
        },
        {
            tab_heading: "Bio",
            tab_id: 2,
        },
        {
            tab_heading: "Notes",
            tab_id: 7,
        },
        ],
    "student": [
        {
            tab_heading: "Current Sessions",
            tab_id: 3,
        },
        {
            tab_heading: "Past Sessions",
            tab_id: 4,
        },
        {
            tab_heading: "Payment History",
            tab_id: 5,
        },
        {
            tab_heading: "Parent Contact",
            tab_id: 6,
        },
        {
            tab_heading: "Notes",
            tab_id: 7,
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
                    {this.state.tabs.map((tab) => { return <Tab label={tab.tab_heading} /> })}
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
