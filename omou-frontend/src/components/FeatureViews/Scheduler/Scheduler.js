import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listViewPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import bootstrapPlugin from '@fullcalendar/bootstrap'
import * as calenderActions from '../../../actions/calenderActions';
import Popover from '@material-ui/core/Popover';
import Button from "@material-ui/core/Button";
import SessionView from "./SessionView"
import SessionActions from "./SessionActions"
import ToolTip from "@material-ui/core/Tooltip"
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'



import './scheduler.scss'
import Paper from "@material-ui/core/Paper";




class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarEvents: [],

        };
    }
    calendarComponentRef = React.createRef();


    toggleWeekends = () => {
        this.setState({ // update a property
            calendarWeekends: !this.state.calendarWeekends
        })
    };





    render() {

        let courseKeys = Object.keys(this.props.sessions);
        let instructorKeys = Object.keys(this.props.instructors)

        let sessionsInViewList = courseKeys.map((courseKey) => {
            let course = this.props.sessions[courseKey];

            let courseSessionKeys = Object.keys(course);

            let courseSessions = courseSessionKeys.map((sessionKey) => {
                let session = this.props.sessions[courseKey][sessionKey];
                session["title"] = this.props.courses[session.course_id].title;

                instructorKeys.map((instructorKey) => {
                    let instructor = this.props.instructors[instructorKey].name;
                    session['instructor'] = this.props.instructors[instructorKey].name

                    return instructor
                })

                return session;
            })


            return courseSessions;
        })

        let sessionsInView = [];
        sessionsInViewList.forEach((sessionsList) => {
            sessionsInView = sessionsInView.concat(sessionsList);
        })

        let sessionsInViewWithUrl = sessionsInView.map((el) => {
            const newSessions = Object.assign({}, el);
            newSessions.url = `http:/scheduler/view-session/${newSessions.course_id}/${newSessions.session_id}`
            return newSessions
        })




        console.log(sessionsInViewWithUrl)

        return (<Paper className="paper">
            <SessionActions />

            <div className='demo-app-calendar'>
                <FullCalendar
                    defaultView="timeGridDay"
                    header={{
                        left: 'today prev,next',
                        center: ' title, ',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listViewPlugin, resourceTimelinePlugin, bootstrapPlugin]}
                    ref={this.calendarComponentRef}
                    weekends={this.state.calendarWeekends}
                    events={sessionsInViewWithUrl}
                    displayEventTime={true}
                    timeZone={'local'}
                    eventMouseEnter={function (info) {
                        console.log(info)
                    }}
                    themeSystem={''}
                    eventLimit={4}
                    dateClick={this.handleDateClick}
                    schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                />

            </div>

        </Paper>)
    }
}

Scheduler.propTypes = {};

function mapStateToProps(state) {
    return {
        courses: state.Course.NewCourseList,
        sessions: state.Course.CourseSessions,
        instructors: state.Users.InstructorList

    };
}

function mapDispatchToProps(dispatch) {
    return {
        calenderActions: bindActionCreators(calenderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Scheduler);
