import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, MenuItem, Paper, Typography } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ListView from "@material-ui/icons/ViewList";
import CardView from "@material-ui/icons/ViewModule";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import Select from "@material-ui/core/es/Select/Select";
import InputLabel from "@material-ui/core/InputLabel";

Date.daysBetween = function (date1, date2) {
    //Get 1 day in milliseconds
    let one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    let difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
}

var date_sort_asc = function (date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // ASCENDING order. As you can see, JavaScript's native comparison operators
    // can be used to compare dates. This was news to me.
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
};

var date_sort_desc = function (date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // DESCENDING order.
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
};

class TimeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availabilities: [],
            sessionsNum: -1,
            daysOfWeek: [
                {
                    dayTitle: 'Monday',
                    value: false,
                    dayIndex: 1,
                },
                {
                    dayTitle: 'Tuesday',
                    value: false,
                    dayIndex: 2,
                },
                {
                    dayTitle: 'Wednesday',
                    value: false,
                    dayIndex: 3,
                },
                {
                    dayTitle: 'Thursday',
                    value: false,
                    dayIndex: 4,
                },
                {
                    dayTitle: 'Friday',
                    value: false,
                    dayIndex: 5,
                },
                {
                    dayTitle: 'Saturday',
                    value: false,
                    dayIndex: 6,
                },
                {
                    dayTitle: 'Sunday',
                    value: false,
                    dayIndex: 0,
                },
            ],
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        // this.props.recurring = true/false
        this.setState((prevState) => {
            return {
                availabilities: this.props[this.props.type][this.props.id],
            }
        });

    }

    // Timeframe is all the available times given a instructor
    setTimeframe() {
        // start date is today
        let startDate = new Date();
        // define number of days per week (int), find from this.state.daysOfWeek
        let numDaysPerWeek = 0, daysPerWeek = [];
        this.state.daysOfWeek.forEach((day) => {
            if (day.value) {
                numDaysPerWeek++;
                daysPerWeek.push(day.dayIndex);
            }
        });
        // if sessionNum === -1, sessionNum = 30
        let sessionNum;
        if (this.state.sessionNum === -1) {
            sessionNum = 30;
        } else {
            sessionNum = this.state.sessionNum;
        }
        // set endDate: end date will be sessionsNum/daysPerWeek * 7 days after today
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + ((sessionNum / numDaysPerWeek) * 7));
        // define list of valid available dates (objects) based on daysOfWeek and endDate
        // ie { date: 2019-07-22, timeSlots: [{start: tbd, end: tbd}], }
        let availableDates = [], currentDate = new Date(), sessionDurationDays = Date.daysBetween(startDate, endDate);
        for (let day = 0; day < sessionDurationDays; day++) {
            currentDate.setDate(currentDate.getDate() + day);
            if (daysPerWeek.includes(currentDate.getDay())) {
                availableDates.push(
                    {
                        date: new Date(currentDate.getTime()),
                        timeSlots: [],
                    }
                )
            }
        }
        // get instructor's current courses within this time
        try {
            // this.props.instructorID
        } catch (error) {
            console.error(error)
        }
        let currentInstructorCourses = this.props.courses.filter((course) => {
            return course.instructor_id === this.props.instructorID;
        });
        // sort current courses by date + time in ascending order (oldest to newest)
        currentInstructorCourses.sort(date_sort_asc);
        // Get instructor's workStart and workEnd times
        let currentInstructorWorkHours = this.props.instructorWorkHours[this.props.instructorID];
        // for each valid available date
        //  if there are courses on this date
        //  if courseStartTime - workStartTime > 0 (if there's a gap between when work starts and the first course)
        // add a time slot to the valid date from workStartTime to courseStartTime
        // if nextCourseStartTime - courseEndTime > 0 (if there's a gap between a course and the next course)
        // add a time slot to the valid date from courseEndTime to nextCourseStartTime
        // if workEndTime - lastCourseEndTime > 0 (if there's a gap between the last course and the end of the work time)
        // add a time slot to the valid date from lastCourseEndTime to workEndTime
        let currentDateCourses;
        availableDates = availableDates.map((date) => {
            currentDateCourses = currentInstructorCourses.filter((course) => {

            });
        });
        // for each date, append each timeSlots array
        // setState variable for availabilities to array of time slots
    }

    selectDayOfWeek(selectedDay) {
        this.setState((prevState) => {
            let newState = prevState;
            newState.daysOfWeek.map((day) => {
                if (day.dayTitle === selectedDay.dayTitle) {
                    return {
                        dayTitle: day.dayTitle,
                        value: !day.value,
                    }
                }
            });
            return newState;
        })
    }

    renderSelectTimeFrame() {
        let selectOptions = [];
        for (let i = 1; i < 51; i++) {
            selectOptions.push(i);
        }
        return <div>
            <InputLabel htmlFor="num-sessions">Number of Sessions</InputLabel>
            <Select
                value={this.state.sessionNum}
                onChange={(e) => { e.preventDefault(); this.setState({ sessionNum: e.target.value }) }}
            >
                {
                    selectOptions.map((sessionNum) => {
                        return <MenuItem value={sessionNum}>{sessionNum}</MenuItem>
                    })
                }
            </Select>
            <InputLabel htmlFor="days-of-week">Days of the Week</InputLabel>
            {
                this.state.daysOfWeek.map((day) => {
                    return <Button
                        onClick={(e) => { e.preventDefault(); this.selectDayOfWeek.bind(this)(day) }}
                        className={`${day.value ? "selected" : ""} button`}>
                        {day.dayTitle}
                    </Button>
                })
            }
        </div>
    }

    renderDurationSelection() {
        let courseDurationOptions = [1, 1.5, 2.0];
        return (
            <div>
                <InputLabel htmlFor="session-duration">Session Duration</InputLabel>
                <Select>
                    {courseDurationOptions.map((duration, key) => {
                        return <MenuItem key={key} value={duration}>{duration + " hour(s)"}</MenuItem>
                    })}
                </Select>
            </div>
        )
    }

    // renderAvailableTimes

    render() {
        return (<Grid container className="TimeSelector">
            <form>
                {this.props.recurring ? this.renderSelectTimeFrame.bind(this)() : ''}
                { // if number of sessions is defined and if there's at least 1 selected day of the week
                    this.state.sessionNum !== -1 && this.state.daysOfWeek.find((day) => { return day.value }) ?
                        this.renderDurationSelection() : ''
                }
                {
                    // this.state.availabilities.length !== 0 ?
                }
            </form>
        </Grid>)
    }
}

TimeSelector.propTypes = {};

function mapStateToProps(state) {
    return {
        instructors: state.Users.InstructorList,
        instructorWorkHours: state.Calendar.instructor_work_hours,
        courses: state.Course.CourseList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeSelector);