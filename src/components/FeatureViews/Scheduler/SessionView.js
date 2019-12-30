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
import Avatar from "@material-ui/core/Avatar";
import { stringToColor } from "../Accounts/accountUtils";
import DisplaySessionView from "./DisplaySessionView";
import EditSessionView from "./EditSessionView";

class SessionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "open": false,
            "current": "current",
            "all": "all",
            "editing": false,
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
        return (
            <Grid className="main-session-view" container>
                <Paper
                    className="paper"
                    mt="2em" style={{ width: "100%" }}>
                    <Grid className="session-button" item>
                        <BackButton />
                    </Grid>
                    <Divider/>
                    {
                        // this.state.editing ?
                        //     <DisplaySessionView
                        //         course = {this.state.courseData}
                        //         session = {this.state.sessionData}
                        //     /> :
                        //     <EditSessionView
                        //         course = {this.state.courseData}
                        //         session = {this.state.sessionData}
                        //     />
                    }
                </Paper>
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
