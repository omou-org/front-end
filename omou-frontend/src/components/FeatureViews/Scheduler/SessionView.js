import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as calenderActions from '../../../actions/calenderActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BackButton from "../../BackButton.js";
import SessionActions from "./SessionActions";
import '../../../theme/theme.scss';
import './scheduler.scss'

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Divider, LinearProgress, Typography, ListItem } from "@material-ui/core";
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'



import NewCourse from "@material-ui/icons/CalendarToday";
import AssignmentIcon from "@material-ui/icons/Assignment";
import UpdateTeacher from "@material-ui/icons/PersonAdd";
import EditIcon from "@material-ui/icons/Edit";
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
import Button from "@material-ui/core/Button";



class SessionView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        this.setState(() => {

            let sessionData = this.props.courseSessions[this.props.computedMatch.params.course_id][this.props.computedMatch.params.session_id]
            let courseData = this.props.courses[this.props.computedMatch.params.course_id]
            console.log("Session data: ", sessionData)
            console.log("courseData: ", courseData)

            return {
                sessionData: sessionData,
                courseData: courseData
            }
        })


    }

    render() {
        console.log(this.state)

        const flexContainer = {
            display: "flex",
            justifyContent: "flex-start",
            width: "50%",
            padding: 0,
        };



        return (
            <Grid className="">
                <Paper className={"paper"}>
                    <SessionActions />
                </Paper>
                <Grid className={'main-session-container'}>
                    <Paper className={'paper'}>
                        <Grid className={'session-button'}>
                            <BackButton />
                        </Grid>
                        <Divider />

                        <Grid item xs={12}>
                            <Typography className={'session-view-title'} align={'left'} variant={'h3'}>
                                {this.state.courseData.title}
                            </Typography>
                        </Grid>
                        <List style={flexContainer}>
                            <ListItem>
                                <ListItemText
                                    primary="Subject"
                                    secondary={this.state.courseData.subject} />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Course"
                                    secondary='course here'
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Date and Time"
                                    secondary={(this.state.sessionData.start, this.state.sessionData.end)}
                                />

                            </ListItem>
                        </List>
                        <List style={flexContainer}>
                            <ListItem>
                                <ListItemText
                                    primary="Teacher"
                                    secondary={this.state.courseData.instructor_id}
                                />
                            </ListItem>
                        </List>

                        <List style={flexContainer}>
                            <ListItem>
                                <ListItemText
                                    primary="Session Notes"
                                    secondary={this.state.courseData.description}
                                />

                            </ListItem>
                        </List>

                        <Grid container
                            direction="row"
                            justify="flex-end"
                            className="session-detail-action-control"
                        >
                            <Grid item>
                                <Button
                                    to="/"
                                    variant="outlined"
                                    color="secondary"
                                    className="button">
                                    Edit Session
                            </Button>
                            </Grid>
                            <Grid item >
                                <Button
                                    to="/"
                                    variant="outlined"
                                    color="secondary"
                                    className="button">
                                    Delete
                            </Button>
                            </Grid>
                            <Grid item >
                                <Button
                                    to="/"
                                    variant="outlined"
                                    color="secondary"
                                    className="button">
                                    Return to Schduling
                            </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

            </Grid>
        )
    }
}

SessionView.propTypes = {
    sessionView: PropTypes.string
};

function mapStateToProps(state) {
    return {
        courses: state.Course["NewCourseList"],
        courseCategories: state.Course["CourseCategories"],
        students: state.Users["StudentList"],
        teachers: state.Users["TeacherList"],
        courseSessions: state.Course["CourseSessions"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        calenderActions: bindActionCreators(calenderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionView);