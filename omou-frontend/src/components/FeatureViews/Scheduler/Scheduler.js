import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes, { bool } from 'prop-types';
import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listViewPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

import * as calenderActions from '../../../actions/calenderActions';


// Material-Ui dependencies

import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from "@material-ui/core/IconButton"
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import Paper from "@material-ui/core/Paper";
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import ViewListIcon from '@material-ui/icons/ViewList';
import SearchIcon from '@material-ui/icons/Search';

// Tool tip dependencies 
import tippy from 'tippy.js'
import 'tippy.js/themes/google.css'

import SessionActions from "./SessionActions"


import './scheduler.scss'

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarResources: [],
            calendarEvents: [],
            currentDate: "",
            viewValue: '',
            filterValue: "C",
            calendarIcon: true,
            resourceIcon: false,

        };

    }

    calendarComponentRef = React.createRef();

    componentWillMount() {
        this.setState({
            calendarEvents: this.getEvents(),
        })
        console.log(this.state.viewValue)
    }

    componentDidMount() {
        this.setState({
            calendarResources: this.getRoomResources(),
            currentDate: this.currentDate()
        })

    }



    // The eventRender function handles the tooltip
    handleToolTip(info) {
        function truncate(string) {
            let numberOfCharRemoved = 88
            if (string.length > numberOfCharRemoved)
                return string.substring(0, numberOfCharRemoved) + '...';
            else
                return string;
        };

        new tippy(info.el, {
            content: `
            <div class="toolTip">
            <div class='title'><h3> ${info.event.title} </h3></div>
            <div class="container">
            <div class='clock'><span class='clock_icon'>  ${ new Date(info.event.start).toDateString().slice(0, 10)}</span></div>   
            <span> 
            ${info.event.extendedProps.type}
            </span>
            <div class='pin_icon'><span class=''>Room # ${info.event.extendedProps.room_id}</span></div> 
            <div class='teacher_icon'><span class=''>${info.event.extendedProps.instructor ? info.event.extendedProps.instructor : "No teacher Yet"}</span></div> 
            <div class='discription_icon'><span class='description-text'>${truncate(info.event.extendedProps.description)}</span></div> 
            </div>
        </div>
            `,
            theme: "light",
            placement: 'right',
            interactive: true,
        })
    }


    // Full Calendar API used to change calendar views 
    toggleWeekends = () => {
        this.setState({ // update a property
            calendarWeekends: !this.state.calendarWeekends
        })
    };

    // Change from day,week, and month views
    changeView = (value) => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.changeView(value)
        let date = this.currentDate()
        this.setState({
            viewValue: value,
            currentDate: date
        })
    }

    goToNext = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()

        calendarApi.next()
        let date = this.currentDate();
        this.setState({
            currentDate: date
        })
    }

    goToPrev = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.prev()
        let date = this.currentDate();
        this.setState({
            currentDate: date
        })
    }

    today = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.today()
        this.currentDate()
    }

    currentDate = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        const date = calendarApi.view.title
        return date
    }

    // This function changes the resouce view when click as well as change the color of the icon 
    changeViewToResource = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.changeView('resourceTimeline');
        this.currentDate()
        this.setState({
            resourceIcon: true,
            calendarIcon: false
        })

    }

    changeViewToCalendar = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.changeView('dayGridMonth');
        this.currentDate()
        this.setState({
            calendarIcon: true,
            resourceIcon: false
        })
    }

    // Function to parse the inital state into data that full calendar could
    getEvents = () => {
        let courseKeys = Object.keys(this.props.sessions);
        let instructorKeys = Object.keys(this.props.instructors)


        // creates an array from courseKeys [0,1,2,3,...,10]
        let sessionsInViewList = courseKeys.map((courseKey) => {
            // course will get each session and map with courseKey
            let course = this.props.sessions[courseKey];
            // gets the keys to each session that was mapped 
            let courseSessionKeys = Object.keys(course);
            // creates an array that maps through courseSessionKey 
            let courseSessions = courseSessionKeys.map((sessionKey) => {
                // sessions = sessions from initial state
                // courseKey is the key value from inital state
                // sessionKey is the variable named inside the map, this is mapping over each coursekey
                // session is the matched pairs of course and session objects 
                let session = this.props.sessions[courseKey][sessionKey];

                session["title"] = this.props.courses[session.course_id].title;
                session["description"] = this.props.courses[session.course_id].description;
                session['type'] = this.props.courses[session.course_id].type;
                session['resourceId'] = this.props.courses[session.course_id].room_id;
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


        return sessionsInViewWithUrl

    }
    // This function is used in material-ui for the eventhandler
    handleFilterChange = (name) => event => {
        this.setState({
            ...this.state,
            [name]: event.target.value
        })
        this.filterEvent(event.target.value)
    }
    // This will filter out event based on type
    filterEvent = (type) => {
        // Grabs the array of objects to filter 
        const items = this.getEvents();
        const newEvents = items.filter(item => item.type == type);
        this.setState(prevState => (
            {
                calendarEvents: prevState.calendarEvents = newEvents
            }))
    }

    // gets the values of course object 
    getRoomResources = () => {
        let courses = Object.values(this.props.courses);
        let resourceList = courses.map((course) => {
            return {
                "id": course.course_id,
                "title": `Room ${course.room_id}`,
            }
        });
        console.log(resourceList)
        return resourceList
    }


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
                    themeSystem={''}
                    eventLimit={4}
                    dateClick={this.handleDateClick}
                    schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                />

            </div>


    render() {
        return (
            <Grid >
                <Paper className="paper">
                    <div className='demo-app-calendar'>
                        <Typography variant="h3" align="left">Scheduler</Typography>
                        <br />
                        <Grid container
                            direction="row"
                            alignItems="center"
                            className="scheduler-header"
                        >
                            <Grid item  >
                                <IconButton color={this.state.calendarIcon ? "primary" : ""} onClick={this.changeViewToCalendar} className={'calendar-icon'} aria-label='next-month'>
                                    <DateRangeOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item  >
                                <IconButton color={this.state.resourceIcon ? "primary" : ""} onClick={this.changeViewToResource} className={'resource-icon'} aria-label='next-month'>
                                    <ViewListIcon />
                                </IconButton>
                            </Grid>
                            <Grid item  >
                                <IconButton onClick={this.goToNext} className={'next-month'} aria-label='next-month'>
                                    <SearchIcon />
                                </IconButton>
                            </Grid>
                            <Grid item md={1} lg={1}>
                                <FormControl className={'filter-select'}>
                                    <InputLabel htmlFor="filter-class-type"></InputLabel>
                                    <Select
                                        native
                                        value={this.state.filterValue}
                                        onChange={this.handleFilterChange('filterValue')}
                                        inputProps={{
                                            name: 'filterValue',
                                            id: 'filter-class-type',
                                        }}
                                    >
                                        <option value={"C"}>Class</option>
                                        <option value={"T"}>Tutor</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={1} md={1}>
                                <IconButton onClick={this.goToPrev} className={'prev-month'} aria-label="prev-month">
                                    <ChevronLeftOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item lg={3} md={2}>
                                <Typography variant={'h6'}>  {this.state.currentDate} </Typography>
                            </Grid>
                            <Grid item lg={1} md={1} >
                                <IconButton onClick={this.goToNext} className={'next-month'} aria-label='next-month'>
                                    <ChevronRightOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item md={2} lg={1}>
                                <FormControl className={'change-view'}>
                                    <InputLabel htmlFor="change-view-select"></InputLabel>
                                    <Select
                                        native
                                        value={this.state.viewValue}
                                        onChange={(event) => this.changeView(event.target.value)}
                                        inputProps={{
                                            name: 'viewValue',
                                            id: 'change-view-select'
                                        }}
                                    >
                                        <option value={"timeGridDay"}>Day</option>
                                        <option value={"dayGridWeek"}>Week</option>
                                        <option value={"dayGridMonth"}>Month</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => { this.changeViewToCalendar() }}
                                >Calendar</Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => { this.changeViewToResource() }}
                                >Resource</Button>
                            </Grid>
                        </Grid>
                        <br />
                        <FullCalendar
                            defaultView="timeGridDay"
                            header={false}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listViewPlugin, resourceTimelinePlugin]}
                            ref={this.calendarComponentRef}
                            weekends={this.state.calendarWeekends}
                            displayEventTime={true}
                            events={this.state.calendarEvents}
                            timeZone={'local'}
                            eventMouseEnter={this.handleToolTip}
                            eventLimit={4}
                            nowIndicator={true}
                            resourceOrder={'title'}
                            resourceAreaWidth={'15%'}
                            resources={this.state.calendarResources}
                            schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                        />
                    </div>
                </Paper >
            </Grid >
        )
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
