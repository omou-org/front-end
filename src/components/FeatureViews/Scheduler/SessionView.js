import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as calenderActions from "../../../actions/calendarActions";
import PropTypes from "prop-types";
import React, { Component } from "react";
import BackButton from "../../BackButton.js";
import SessionActions from "./SessionActions";
import "../../../theme/theme.scss";
import "./scheduler.scss";
import { NavLink } from "react-router-dom";
// import TimeSelector from "../../Form/TimeSelector";

import * as calendarActions from "../../../actions/calendarActions";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";

// Material UI Imports
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import { parseTime } from "../../../actions/apiActions";
import { GET } from "../../../actions/actionTypes";
import ClassSessionView from "./ClassSessionView";
import TutoringSessionView from "./TutoringSessionView";
import Avatar from "@material-ui/core/Avatar";
import { stringToColor } from "../Accounts/accountUtils";

class SessionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "open": false,
            "current": "current",
            "all": "all",
            "students": {
                0: {
                    name: "Calvin Fronda",
                    id: 8,
                },
                1: {
                    name: "Alex McGuire",
                    id: 6,
                },
                2: {
                    name: "Joe Buddy",
                    id: 4,
                },
                3: {
                    name: "Able Strong Body",
                    id: 11,
                }
            }
        };
    }

    handleOpen = () => {
        this.setState({ "open": true });
    }

    handleClose = () => {
        this.setState({ "open": false });
    }

    componentDidMount() {
        this.props.calendarActions.fetchSessions({ id: this.props.match.params.session_id });
        this.props.apiActions.fetchCourses(this.props.match.params.course_id);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps &&
            this.props.courseSessions.length !== 0 &&
            Object.entries(this.props.courses).length !== 0) {
            this.setState(() => {
                const sessionData = this.props.courseSessions.find((session) => {
                    return Number(session.course) === Number(this.props.match.params.course_id) &&
                        Number(session.id) === Number(this.props.match.params.session_id);
                });
                sessionData["start"] = new Date(sessionData.start_datetime)
                    .getDay()
                // let sessionTime = sessionData.start.substring(sessionData.start.indexOf(" "));

                // sessionData["start"] = sessionData.start.replace(sessionTime, " | " + parseTime(new Date(sessionData.start_datetime).toUTCString()));

                const startTime = parseTime(new Date(sessionData.start_datetime).toUTCString());
                const endTime = parseTime(new Date(sessionData.end_datetime).toUTCString());
                sessionData["startTime"] = startTime;
                sessionData["endTime"] = endTime;


                let courseData = this.props.courses[this.props.match.params.course_id];
                if (courseData && !this.props.requestStatus["instructor"][GET][courseData.instructor_id]) {
                    this.props.userActions.fetchInstructors(courseData.instructor_id);
                }
                return {
                    sessionData,
                    courseData,
                };
            });

        }
    }

    render() {
        let instructor = this.state.courseData && this.props.instructors[this.state.courseData.instructor_id] ? this.props.instructors[this.state.courseData.instructor_id] : { name: "N/A" };
        let dayConverter = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        }
        const styles = (username) => ({
            "backgroundColor": stringToColor(username),
            "color": "white",
            "width": "3vw",
            "height": "3vw",
            "fontSize": 15,
            "margin-right": 10,
        });

        const studentKeys = Object.keys(this.state.students);


        return (
            <Grid
                className="main-session-view"
                container
            >
                <Paper
                    className="paper"
                    mt="2em"
                    style={{ width: "100%" }}>
                    <Grid
                        className="session-button"
                        item>
                        <BackButton />
                    </Grid>
                    <Divider />

                    <Grid
                        className="session-view"
                        container
                        spacing={2}
                        direction={"row"}>
                        <Grid
                            item
                            sm={12}
                        >
                            <Typography
                                align="left"
                                className="session-view-title"
                                variant="h3">
                                {this.state.courseData && this.state.courseData.title}
                            </Typography>
                        </Grid>
                        <Grid
                            align="left"
                            className="session-view-details"
                            container
                            spacing={16}
                            xs={6}
                        >
                            <Grid
                                item
                                xs={6}>
                                <Typography variant="h5"> Subject </Typography>
                                <Typography varient="body1">{this.state.courseData && this.state.courseData.subject} </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                <Typography variant="h5"> Room</Typography>
                                <Typography variant="body1">{this.state.courseData && (this.state.courseData.room_id || "TBA")}</Typography>
                            </Grid>

                            <Grid
                                item
                                xs={12}>
                                <Typography variant="h5"> Instructor </Typography>
                                <NavLink to={`/accounts/instructor/${instructor.user_id}`}
                                >
                                    <Typography variant="body1" color="primary">{this.state.courseData && instructor.name}</Typography>
                                </NavLink>
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                <Typography variant="h5"> Day(s)</Typography>
                                <Typography variant="body1">{this.state.courseData && dayConverter[this.state.sessionData.start]}</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                <Typography variant="h5"> Time </Typography>
                                <Typography variant="body1">{this.state.courseData && `${this.state.sessionData.startTime} - ${this.state.sessionData.endTime}`}</Typography>
                            </Grid>

                        </Grid>

                        <Grid
                            item
                            xs={6}>
                            <Typography variant="h5" align="left"> Students Enrolled  </Typography>
                            <Grid container direction='row'>
                                {studentKeys.map(key => <NavLink to={`/accounts/student/${this.state.students[key].id}`} style={{ textDecoration: "none" }}>
                                    <Avatar
                                        style={styles(this.state.students[key].name)}>{this.state.students[key].name.match(/\b(\w)/g).join("")}
                                    </Avatar>
                                </NavLink>)}
                            </Grid>
                        </Grid>

                    </Grid>

                    <Grid
                        className="session-detail-action-control"
                        container
                        direction="row"
                        justify="flex-end">
                        <Grid item>
                            <Button
                                className="button"
                                color="secondary"
                                to="/"
                                variant="outlined">
                                Edit Session
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                className="button"
                                color="secondary"
                                onClick={this.handleOpen}
                                variant="outlined">
                                Delete
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                className="button"
                                color="secondary"
                                component={NavLink}
                                to="/scheduler"
                                variant="outlined">
                                Return to scheduling
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                {/* {this.state.courseData && this.state.courseData.type === "C" ? <ClassSessionView courseData={this.state.courseData} /> : <TutoringSessionView />} */}
                <Dialog
                    aria-describedby="alert-dialog-description"
                    aria-labelledby="alert-dialog-title"
                    className="session-view-modal"
                    fullWidth
                    maxWidth="xs"
                    onClose={this.handleClose}
                    open={this.state.open}>
                    <DialogTitle id="form-dialog-title">Delete</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <RadioGroup
                            aria-label="delete"
                            name="delete"
                            onChange={this.handleChange}>
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="This Session"
                                labelPlacement="end"
                                value="current" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="All Sessions"
                                labelPlacement="end"
                                value="all" />
                        </RadioGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={this.handleClose}>
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid >
        );
    }
}

SessionView.propTypes = {
    "sessionView": PropTypes.string,
};

function mapStateToProps(state) {
    return {
        "courses": state.Course.NewCourseList,
        "courseCategories": state.Course.CourseCategories,
        "students": state.Users.StudentList,
        "instructors": state.Users.InstructorList,
        "courseSessions": state.Calendar.CourseSessions,
        "requestStatus": state.RequestStatus,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "calendarActions": bindActionCreators(calendarActions, dispatch),
        "apiActions": bindActionCreators(apiActions, dispatch),
        "userActions": bindActionCreators(userActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionView);
