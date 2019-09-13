import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as calenderActions from '../../../actions/calenderActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BackButton from "../../BackButton.js";
import SessionActions from "./SessionActions";
import '../../../theme/theme.scss';
import './scheduler.scss'
import { NavLink } from "react-router-dom";
// import TimeSelector from "../../Form/TimeSelector";

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Divider, LinearProgress, Typography, ListItem, RadioGroup } from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from "@material-ui/core/FormControl"




import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import NewCourse from "@material-ui/icons/CalendarToday";
import AssignmentIcon from "@material-ui/icons/Assignment";
import UpdateTeacher from "@material-ui/icons/PersonAdd";
import EditIcon from "@material-ui/icons/Edit";
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";

import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'


import Button from "@material-ui/core/Button";

class SessionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            current: "current",
            all: "all",

        }
    }



    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }



    componentWillMount() {

        this.setState(() => {

            let sessionData = this.props.courseSessions[this.props.computedMatch.params.course_id][this.props.computedMatch.params.session_id]
            let courseData = this.props.courses[this.props.computedMatch.params.course_id]
            let instructorData = this.props.instructors


            return {
                sessionData: sessionData,
                courseData: courseData,
                instructorData: instructorData
            }
        })
    }



    // Formatting the date in the view
    formatDate = (start, end) => {
        let DayConverter = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
        };
        let MonthConverter = {
            0: "January",
            1: "Febuary",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        }

        let date = new Date(start)
        let dateNumber = date.getDate()
        let dayOfWeek = date.getDay()
        let startMonth = date.getMonth()
        // Gets days
        let Days = [dayOfWeek]
        Days = Days.map((day) => {
            return DayConverter[day];
        });
        //Gets months
        let Month = [startMonth]
        Month = Month.map(month => {
            return MonthConverter[month]
        })
        //Start times and end times variable 
        let startTime = start.slice(11)
        let endTime = end.slice(11)

        this.timeConverter = (s) => {
            let timeString = s;
            let H = +s.substr(0, 2);
            let h = (H % 12) || 12;
            let ampm = H < 12 ? "a" : "p";
            timeString = h + s.substr(2, 3) + ampm;
            return timeString

        }

        let finalTime = `${Days}, ${Month} ${dateNumber} at ${this.timeConverter(startTime)} - ${this.timeConverter(endTime)}`

        return finalTime

    }




    render() {
        return (
            <Grid container className={'main-session-view'}>
                <Paper className={'paper'} mt={"2em"} >
                    <Grid item className={'session-button'}>
                        <BackButton />
                    </Grid>
                    <Divider />

                    <Grid container className={'session-view'} ml={10} spacing={2}>
                        <Grid item xs={12}>
                            <Typography className={'session-view-title'} align={'left'} variant={'h3'}>
                                {this.state.courseData.title}
                            </Typography>
                        </Grid>

                        <Grid container className={"session-view-details"} spacing={10} align={'left'} >
                            <Grid item xs={4} style={{ "padding-top": "1%" }}>
                                <Typography variant="h5"> Subject </Typography>
                                <Typography varient="body1">{this.state.courseData.subject} </Typography>
                            </Grid>

                            <Grid item xs={6} lg={3} style={{ "padding-top": "1%" }}>
                                <Typography variant="h5"> Date & Time </Typography>
                                <Typography variant="body1">{this.formatDate(this.state.sessionData.start, this.state.sessionData.end)}</Typography>
                            </Grid>
                            <Grid item xs={12} style={{ "padding-top": "1%" }}>
                                <Typography variant="h5"> Teacher </Typography>
                                <Typography variant="body1">{this.state.instructorData[10].name}</Typography>
                            </Grid>
                            <Grid item xs={10} style={{ "padding-top": "1%" }}>
                                <Typography variant="h5"> Description </Typography>
                                <Typography variant="body1" style={{ width: "75%" }} > {this.state.courseData.description}   </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

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
                                onClick={this.handleOpen}
                                variant="outlined"
                                color="secondary"
                                className="button">
                                Delete
                            </Button>
                        </Grid>
                        <Grid item >
                            <Button
                                component={NavLink} to="/scheduler"
                                variant="outlined"
                                color="secondary"
                                className="button">
                                Return to scheduling
                            </Button>
                        </Grid>
                    </Grid>

                </Paper>



                <Dialog
                    maxWidth={'xs'}
                    fullWidth={true}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="session-view-modal"
                >
                    <DialogTitle id="form-dialog-title">Delete</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <RadioGroup
                            aria-label="delete"
                            name="delete"
                            onChange={this.handleChange}
                        >
                            <FormControlLabel
                                value="current"
                                control={<Radio color="primary" />}
                                label="This Session"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="all"
                                control={<Radio color="primary" />}
                                label="All Sessions"
                                labelPlacement="end"
                            />
                        </RadioGroup>

                    </DialogContent>


                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
          </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Apply
          </Button>
                    </DialogActions>
                </Dialog>

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
        instructors: state.Users["InstructorList"],
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