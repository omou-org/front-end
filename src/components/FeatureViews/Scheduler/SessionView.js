import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as calendarActions from "../../../actions/calendarActions";
import PropTypes from "prop-types";
import React, {Component} from "react";
import BackButton from "../../BackButton.js";
import "../../../theme/theme.scss";
import "./scheduler.scss";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as adminActions from "../../../actions/adminActions";
// Material UI Imports
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {GET} from "../../../actions/actionTypes";
import DisplaySessionView from "./DisplaySessionView";
import EditSessionView from "./EditSessionView";

export const EDIT_ALL_SESSIONS = "all";
export const EDIT_CURRENT_SESSION = "current";

class SessionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "editSelection": "current",
            "editing": false,
        };
    }

    componentDidMount() {
        this.props.calendarActions.fetchSession({ id: this.props.match.params.session_id });
        this.props.apiActions.fetchCourses(this.props.match.params.course_id);
        this.props.userActions.fetchInstructors();
        this.props.adminActions.fetchCategories();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps &&
            Object.keys(this.props.courseSessions).length !== 0 &&
            Object.entries(this.props.courses).length !== 0) {
            this.setState(() => {
                const {session_id, instructor_id} = this.props.match.params;
                const sessionData = this.props.courseSessions[instructor_id][session_id];
                sessionData["start"] = new Date(sessionData.start_datetime).getDay();

                sessionData["startTime"] = new Date(sessionData.start_datetime)
                                                .toLocaleTimeString("en-US",{
                                                    hour12: true,
                                                    timeStyle: "short",
                                                });
                sessionData["endTime"] = new Date(sessionData.end_datetime)
                                                .toLocaleTimeString("en-US",{
                                                    hour12: true,
                                                    timeStyle: "short",
                                                });
                sessionData.start_datetime = new Date(sessionData.start_datetime);
                sessionData.end_datetime = new Date(sessionData.end_datetime);
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

    toggleEditing = (editSelection) =>{
        this.setState((oldState=>{
            return {
                ...oldState,
                editing: !oldState.editing,
                editSelection: editSelection,
            }
        }))
    };

    render() {
        return (
            <Grid className="main-session-view" container>
                <Paper
                    className="paper session"
                    mt="2em" style={{ width: "100%" }}>
                    <Grid className="session-button" item>
                        <BackButton />
                    </Grid>
                    <Divider/>
                    {
                        this.state.editing ?
                            <EditSessionView
                                course = {this.state.courseData}
                                session = {this.state.sessionData}
                                enrolledStudents = {this.state.students}
                                editSelection = {this.state.editSelection}
                                handleToggleEditing = {this.toggleEditing}
                            /> :
                            this.state.courseData && <DisplaySessionView
                                course = {this.state.courseData}
                                session = {this.state.sessionData}
                                handleToggleEditing = {this.toggleEditing}
                            />
                    }
                </Paper>
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
        "adminActions":bindActionCreators(adminActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionView);
