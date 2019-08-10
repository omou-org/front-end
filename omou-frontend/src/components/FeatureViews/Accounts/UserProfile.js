import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './UserProfile.scss'

import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { Card, Paper, Typography } from "@material-ui/core";


import BackButton from "../../BackButton";
import ComponentViewer from "./ComponentViewer.js";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ProfileHeading from "./ProfileHeading.js";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

const userTabs = {
    "teacher": [
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
        }],
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
        // let ProfileInView = this.props.courses.find((course) => {
        //     return course.course_id.toString() === this.props.computedMatch.params.accountType;
        // });
        let user;
        let accountType = this.props.computedMatch.params.accountType;
        switch (accountType) {
            case "student":
                user = (this.props.student.find(({ user_id }) => user_id == this.props.computedMatch.params.accountID));
                break;
            case "parent":
                user = (this.props.parent.find(({ user_id }) => user_id == this.props.computedMatch.params.accountID));
                break;
            case "teacher":
                user = (this.props.teacher.find(({ user_id }) => user_id == this.props.computedMatch.params.accountID));
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
        }
        return (<div className="UserProfile">
            <Paper className={'paper'}>
                <BackButton
                    warn={false}
                />
                <Grid container>
                    <Avatar style={styles}>{this.state.user.name.match(/\b(\w)/g).join('')}</Avatar>
                    <ProfileHeading user={this.state.user} />
                </Grid>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {this.state.tabs.map((tab) => { return <Tab label={tab.tab_heading} /> })}
                </Tabs>
                <ComponentViewer user={this.state.user} inView={this.state.tabs[this.state.value].tab_id}/>
            </Paper>
        </div>
        )
    }

}

UserProfile.propTypes = {};

function mapStateToProps(state) {
    return {
        student: state.Users.StudentList,
        parent: state.Users.ParentList,
        teacher: state.Users.TeacherList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfile);
