import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import BackArrow from "@material-ui/icons/ArrowBack";
import { makeStyles } from "@material-ui/styles";
// import "./registration.scss";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as userActions from "../../../actions/userActions.js"
import {connect, useDispatch, useSelector} from "react-redux";
import {FormControl, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {NavLink, withRouter} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as apiActions from "../../../actions/apiActions";
import * as searchActions from "../../../actions/searchActions";
import {GET} from "../../../actions/actionTypes";
import Button from "@material-ui/core/Button";
import Loading from "../../Loading";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import TextField from "@material-ui/core/TextField";
import Prompt from "react-router-dom/es/Prompt";
import PriceQuoteForm from "../../Form/PriceQuoteForm";
import {durationParser} from "../../../actions/apiActions";
import Avatar from "@material-ui/core/Avatar";
import {stringToColor} from "../Accounts/accountUtils";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

function DisplaySessionView({course, session}) {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    const [selectedCourses, selectCourse] = useState({});
    const [usersLoaded, setLoadingUsers] = useState(false);
    const [updatedCourses, addUpdatedCourse] = useState([]);
    const [selectionPendingStatus, setSelectionPending] = useState(false);

    useEffect(()=>{
        api.initializeRegistration();
        api.fetchCourses();
    },[api]);

    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const classes = useStyles();

    const goToCourse = (courseID) => () => {
        // props.history.push(`/registration/course/${courseID}`);
    };

    let instructor = this.state.courseData && this.props.instructors[this.state.courseData.instructor_id] ? this.props.instructors[this.state.courseData.instructor_id] : { name: "N/A" };
    let dayConverter = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    };

    const styles = (username) => ({
        "backgroundColor": stringToColor(username),
        "color": "white",
        "width": "3vw",
        "height": "3vw",
        "fontSize": 15,
        "margin-right": 10,
    });

    const studentKeys = Object.keys(this.state.students);

    return (<>
        <Grid
            className="session-view"
            container spacing={2} direction={"row"}>
            <Grid item sm={12}>
                <Typography align="left" variant="h3"
                            className="session-view-title"
                >
                    {this.state.courseData && this.state.courseData.title}
                </Typography>
            </Grid>
            <Grid
                align="left"
                className="session-view-details"
                container spacing={16} xs={6}
            >
                <Grid item xs={6}>
                    <Typography variant="h5"> Subject </Typography>
                    <Typography varient="body1">
                        {
                            this.state.courseData && this.state.courseData.subject
                        }
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5"> Room</Typography>
                    <Typography variant="body1">
                        {
                            this.state.courseData && (this.state.courseData.room_id || "TBA")
                        }
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5"> Instructor </Typography>
                    <NavLink to={`/accounts/instructor/${instructor.user_id}`}
                    >
                        <Typography variant="body1" color="primary">
                            {
                                this.state.courseData && instructor.name
                            }
                        </Typography>
                    </NavLink>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5"> Day(s)</Typography>
                    <Typography variant="body1">
                        {
                            this.state.courseData && dayConverter[this.state.sessionData.start]
                        }
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={6}>
                    <Typography variant="h5"> Time </Typography>
                    <Typography variant="body1">
                        {
                            this.state.courseData &&
                            `${this.state.sessionData.startTime} - ${this.state.sessionData.endTime}`
                        }
                    </Typography>
                </Grid>

            </Grid>

            <Grid item xs={6}>
                <Typography variant="h5" align="left"> Students Enrolled  </Typography>
                <Grid container direction='row'>
                    {studentKeys.map(key =>
                        <NavLink to={`/accounts/student/${this.state.students[key].id}`}
                                 style={{ textDecoration: "none" }}>
                            <Avatar
                                style={styles(this.state.students[key].name)}>
                                {
                                    this.state.students[key].name.match(/\b(\w)/g).join("")
                                }
                            </Avatar>
                        </NavLink>)}
                </Grid>
            </Grid>

        </Grid>

        <Grid className="session-detail-action-control"
              container direction="row" justify="flex-end">
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
    </>);
}

DisplaySessionView.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "instructorAccounts": state.Users.InstructorList,
    "courseList": state.Course.NewCourseList,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
    "userActions": bindActionCreators(userActions, dispatch),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DisplaySessionView));
