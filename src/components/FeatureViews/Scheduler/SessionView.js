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
            all: "all"
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

            let sessionData = this.props.courseSessions[this.props.match.params.course_id][this.props.match.params.session_id]
            let courseData = this.props.courses[this.props.match.params.course_id]

            let instructorData = this.props.instructors



            return {
                sessionData: sessionData,
                courseData: courseData
            }
        })


    }

    render() {

        const flexContainer = {
            display: "flex",
            justifyContent: "flex-start",
            width: "50%",
            padding: 0,
        };




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
                            <Grid item xs={6} md={7} lg={2}>
                                <Typography variant="h5"> Subject </Typography>
                                <Typography varient="body1">{this.state.courseData.subject} </Typography>
                            </Grid>

                            <Grid item xs={'auto'}>
                                <Typography variant="h5"> Date & Time </Typography>
                                <Typography variant="body1">{this.state.sessionData.start}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5"> Teacher </Typography>
                                <Typography variant="body1">{this.state.courseData.instructor_id}</Typography>
                            </Grid>
                            <Grid item xs={10}>
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