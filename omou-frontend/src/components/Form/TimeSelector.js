import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import {Card, MenuItem, Paper, Typography} from "@material-ui/core";
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

class TimeSelector extends Component {
    constructor(props){
        super(props);
        this.state = {
            availabilities:[],
            sessionsNum:-1,
            daysOfWeek: [
                {
                    dayTitle:'Monday',
                    value:false,
                },
                {
                    dayTitle:'Tuesday',
                    value:false,
                },
                {
                    dayTitle:'Wednesday',
                    value:false,
                },
                {
                    dayTitle:'Thursday',
                    value:false,
                },
                {
                    dayTitle:'Friday',
                    value:false,
                },
                {
                    dayTitle:'Saturday',
                    value:false,
                },
                {
                    dayTitle:'Sunday',
                    value:false,
                },
            ],
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        // this.props.recurring = true/false
        this.setState((prevState)=>{
            return {
                availabilities: this.props[this.props.type][this.props.id],
            }
        });

    }

    setTimeframe(){
        // start date is today
        // define number of days per week (int), find from this.state.daysOfWeek
        // if sessionNum === -1, sessionNum = 30
        // set endDate: end date will be sessionsNum/daysPerWeek * 7 days after today
        // define list of valid available dates (objects) based on daysOfWeek and endDate
        // ie { date: 2019-07-22, timeSlots: [{start: tbd, end: tbd}], }
        // get teacher's current courses within this time
        // sort current courses by date + time
        // Get teacher's workStart and workEnd times
        // for each valid available date
            //  if there are courses on this date
                //  if courseStartTime - workStartTime > 0 (if there's a gap between when work starts and the first course)
                    // add a time slot to the valid date from workStartTime to courseStartTime
                // if nextCourseStartTime - courseEndTime > 0 (if there's a gap between a course and the next course)
                    // add a time slot to the valid date from courseEndTime to nextCourseStartTime
                // if workEndTime - lastCourseEndTime > 0 (if there's a gap between the last course and the end of the work time)
                    // add a time slot to the valid date from lastCourseEndTime to workEndTime
        // for each date, append each timeSlots array
        // setState variable for availabilities to array of time slots
    }

    selectDayOfWeek(selectedDay){
        this.setState((prevState)=>{
            let newState = prevState;
            newState.daysOfWeek.map((day)=>{
                if(day.dayTitle === selectedDay.dayTitle){
                    return {
                        dayTitle: day.dayTitle,
                        value: !day.value,
                    }
                }
            });
            return newState;
        })
    }

    renderSelectTimeFrame(){
        let selectOptions = [];
        for(let i = 1; i < 51; i++){
            selectOptions.push(i);
        }
        return <div>
            <InputLabel htmlFor="num-sessions">Number of Sessions</InputLabel>
            <Select
                value={this.state.sessionNum}
                onChange={(e)=>{ e.preventDefault(); this.setState({sessionNum: e.target.value})}}
            >
                {
                    selectOptions.map((sessionNum)=>{
                        return <MenuItem value={sessionNum}>{sessionNum}</MenuItem>
                    })
                }
            </Select>
            <InputLabel htmlFor="days-of-week">Days of the Week</InputLabel>
            {
                this.state.daysOfWeek.map((day)=>{
                    return <Button
                        onClick={(e)=>{e.preventDefault(); this.selectDayOfWeek.bind(this)(day)}}
                        className={`${day.value ? "selected":""} button`}>
                        {day.dayTitle}
                    </Button>
                })
            }
        </div>
    }

    renderDurationSelection(){
        let courseDurationOptions = [1, 1.5, 2.0];
        return(
            <div>
                <InputLabel htmlFor="session-duration">Session Duration</InputLabel>
                <Select>
                    {courseDurationOptions.map((duration)=>{
                        return <MenuItem value={duration}>{duration + " hour(s)"}</MenuItem>
                    })}
                </Select>
            </div>
        )
    }

    // renderAvailableTimes

    render(){
        return (<Grid container className="TimeSelector">
            <form>
                { this.props.recurring ? this.renderSelectTimeFrame.bind(this)() : '' }
                { // if number of sessions is defined and if there's at least 1 selected day of the week
                    this.state.sessionNum !== -1 && this.state.daysOfWeek.find((day)=>{return day.value}) ?
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
        teachers: state.Users.TeacherList,
        teacherWorkHours: state.Calendar.teacher_work_hours,
        courses:state.Course.CourseList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeSelector);