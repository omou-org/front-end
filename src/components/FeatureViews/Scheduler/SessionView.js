import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as calenderActions from "../../../actions/calendarActions";
import PropTypes from "prop-types";
import React, {Component} from "react";
import BackButton from "../../BackButton.js";
import SessionActions from "./SessionActions";
import "../../../theme/theme.scss";
import "./scheduler.scss";
import {NavLink} from "react-router-dom";
// import TimeSelector from "../../Form/TimeSelector";

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

class SessionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "open": false,
            "current": "current",
            "all": "all",
        };
    }

    handleOpen = () => {
        this.setState({"open": true});
    }

    handleClose = () => {
        this.setState({"open": false});
    }

    componentWillMount() {
        this.setState(() => {
            const sessionData = this.props.courseSessions[this.props.computedMatch.params.course_id][this.props.computedMatch.params.session_id];
            const courseData = this.props.courses[this.props.computedMatch.params.course_id];
            return {
                sessionData,
                courseData,
            };
        });
    }

    render() {
        return (
            <Grid
                className="main-session-view"
                container>
                <Paper
                    className="paper"
                    mt="2em" >
                    <Grid
                        className="session-button"
                        item>
                        <BackButton />
                    </Grid>
                    <Divider />

                    <Grid
                        className="session-view"
                        container
                        ml={10}
                        spacing={2}>
                        <Grid
                            item
                            xs={12}>
                            <Typography
                                align="left"
                                className="session-view-title"
                                variant="h3">
                                {this.state.courseData.title}
                            </Typography>
                        </Grid>
                        <Grid
                            align="left"
                            className="session-view-details"
                            container
                            spacing={10}>
                            <Grid
                                item
                                lg={2}
                                md={7}
                                xs={6}>
                                <Typography variant="h5"> Subject </Typography>
                                <Typography varient="body1">{this.state.courseData.subject} </Typography>
                            </Grid>
                            <Grid
                                item
                                xs="auto">
                                <Typography variant="h5"> Date & Time </Typography>
                                <Typography variant="body1">{this.state.sessionData.start}</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}>
                                <Typography variant="h5"> Teacher </Typography>
                                <Typography variant="body1">{this.state.courseData.instructor_id}</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={10}>
                                <Typography variant="h5"> Description </Typography>
                                <Typography
                                    style={{"width": "75%"}}
                                    variant="body1" > {this.state.courseData.description}
                                </Typography>
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
            </Grid>
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
        "courseSessions": state.Course.CourseSessions,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        "calenderActions": bindActionCreators(calenderActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionView);
