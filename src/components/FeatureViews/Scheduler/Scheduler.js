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

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from "@material-ui/core/IconButton"
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import Paper from "@material-ui/core/Paper";
import MenuItem from '@material-ui/core/MenuItem';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import ViewListIcon from '@material-ui/icons/ViewList';
import SearchIcon from '@material-ui/icons/Search';
import TodayIcon from '@material-ui/icons/Today';

// Tool tip dependencies 
import tippy from 'tippy.js'
import 'tippy.js/themes/google.css'
import './scheduler.scss'







class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarResourcesViews: [],
            calendarEvents: [],
            currentDate: "",
            viewValue: 'timeGridDay',
            filterValue: "class",
            resourceFilterValue: "R",
            calendarFilterValue: "C",
            calendarIcon: true,
            resourceIcon: false,
            filterTypeCalendar: "",


        };

    }

    calendarComponentRef = React.createRef();

    componentWillMount() {
        this.setState({
            calendarEvents: this.getEvents(),

        })

        this.getFirstFilteredList()
    }

    componentDidMount() {
        this.setState({
            currentDate: this.currentDate(),

        })
    }
    // helper function filtering by Class and setting the calendarEvents state, Which is read by Full calendar
    getFirstFilteredList = () => {
        const items = this.getEvents();
        const newEvents = items.filter(item => item.type === "C");
        this.setState(prevState => (
            {
                calendarEvents: prevState.calendarEvents = newEvents
            }))
        sessionStorage.setItem('calendarEvent', JSON.stringify(newEvents))
    }

    getInstructorSchedule = () => {
        let instructor = this.props.instructors
        let instructorKey = Object.keys(this.props.instructors)

        let instructorsSchedule = instructorKey.map((iKey) => {
            return instructor[iKey].schedule.work_hours
        })
        let allInstructorSchedules = []
        instructorsSchedule.forEach((iList) => {
            allInstructorSchedules = allInstructorSchedules.concat(Object.values(iList));
        })
        return allInstructorSchedules
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

        function formatDate(start, end) {
            const DayConverter = {
                1: "Monday",
                2: "Tuesday",
                3: "Wednesday",
                4: "Thursday",
                5: "Friday",
                6: "Saturday",
            };
            const MonthConverter = {
                0: "January",
                1: "February",
                2: "March",
                3: "April",
                4: "May",
                5: "June",
                6: "July",
                7: "August",
                8: "September",
                9: "October",
                10: "November",
                11: "December"
            }

            const date = new Date(start)
            const dateNumber = date.getDate()
            const dayOfWeek = date.getDay()
            const startMonth = date.getMonth()
            // Gets days
            const Days = DayConverter[dayOfWeek]

            //Gets months
            const Month = MonthConverter[startMonth]

            //Start times and end times variable 
            let startTime = start.slice(11)
            let endTime = end.slice(11)

            // Converts 24hr to 12 hr time 
            function timeConverter(time) {

                let Hour = time.substr(0, 2);
                let to12HourTime = (Hour % 12) || 12;
                let ampm = Hour < 12 ? "a" : "p";
                time = to12HourTime + time.substr(2, 3) + ampm;
                return time

            }

            let finalTime = `${Days}, ${Month} ${dateNumber} <br> ${timeConverter(startTime)} - ${timeConverter(endTime)}`

            return finalTime

        }
        new tippy(info.el, {
            content:
                `
                <div class="toolTip">
                    <div class='title'><h3> ${info.event.title} </h3></div>
                    <div class="container">
                        <div class='clock'><span class='clock_icon'>  ${formatDate(info.event.extendedProps.start_time, info.event.extendedProps.end_time)}</span></div>
                        <span>
                            ${info.event.extendedProps.type}
                        </span>
                        <div class='pin_icon'><span class=''>Room # ${info.event.extendedProps.room_id}</span></div>
                        <div class='teacher_icon'><span class=''>${info.event.extendedProps.instructor ? info.event.extendedProps.instructor : "No teacher Yet"}</span></div>
                        <div class='discription_icon'><span class='description-text'>${truncate(info.event.extendedProps.description)}</span></div>
                    </div>
                </div>
            `
            ,
            theme: "light",
            placement: 'right',
            interactive: true,
        })
    }


    // Full Calendar API used to change calendar views 


    currentDate = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        const date = calendarApi.view.title
        return date
    }

    // Change from day,week, and month views
    changeView = (value) => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.changeView(value)
        const date = this.currentDate()
        this.setState({
            viewValue: value,
            currentDate: date
        })
    }

    goToNext = () => {
        const calendarApi = this.calendarComponentRef.current.getApi();

        calendarApi.next()
        const date = this.currentDate();
        this.setState({
            currentDate: date
        })
    }

    goToPrev = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.prev()
        const date = this.currentDate();

        this.setState({
            currentDate: date
        })
    }

    goToToday = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.today();
        const date = this.currentDate();
        this.setState({
            currentDate: date
        })
    }




    // This function changes the resouce view when click as well as change the color of the icon 
    changeViewToResource = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.changeView('resourceTimeline');
        let date = this.currentDate()
        this.setState({
            resourceIcon: true,
            calendarIcon: false,
            calendarResourcesViews: this.getRoomResources(),
            currentDate: date,
            calendarEvents: JSON.parse(sessionStorage.getItem('calendarEvent'))


        })

    }

    changeViewToCalendar = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.changeView('dayGridMonth');
        let date = this.currentDate()
        this.setState({
            calendarIcon: true,
            resourceIcon: false,
            currentDate: date,
            calendarEvents: JSON.parse(sessionStorage.getItem('calendarEvent'))

        })

    }

    // Function to parse the inital state into data that full calendar could read
    getEvents = () => {
        let courseKeys = Object.keys(this.props.sessions);
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
                const allSessions = this.props.courses[session.course_id]

                session["title"] = allSessions.title;
                session["description"] = allSessions.description;
                session['type'] = allSessions.type;
                session['resourceId'] = allSessions.room_id;
                session['room_id'] = allSessions.room_id;
                session["start_time"] = this.props.sessions[courseKey][sessionKey].start
                session["end_time"] = this.props.sessions[courseKey][sessionKey].end
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
            newSessions.url = `/scheduler/view-session/${newSessions.course_id}/${newSessions.session_id}`
            return newSessions
        })

        return sessionsInViewWithUrl

    }
    // This function is used in material-ui for the eventhandler
    handleFilterChange = (name) => event => {

        this.setState({
            ...this.state,
            [name]: event.target.value
        }

        )
        if (event.target.value) {
            const items = this.getEvents();
            const newEvents = items.filter(item => item.type === event.target.value);
            this.setState(prevState => (
                {
                    calendarEvents: prevState.calendarEvents = newEvents
                }))
            sessionStorage.setItem('calendarEvent', JSON.stringify(newEvents))
        }

    }


    handleResourceFilterChange = (name) => event => {
        this.setState({
            ...this.state,
            [name]: event.target.value
        })
        if (event.target.value === "R") {
            let rooms = this.getRoomResources()
            let currentCalendarEvents = this.getEvents()
            this.setState(prevState => (
                {
                    // over here I need to change it back if user click back to Room 
                    calendarResourcesViews: rooms,
                    calendarEvents: prevState.calendarEvents = currentCalendarEvents
                }
            ))

        } else {
            let instructors = this.getInstructorResources()
            let instructorsSchedule = this.getInstructorSchedule()
            console.log(instructorsSchedule)
            this.setState(prevState => (
                {
                    calendarResourcesViews: instructors,
                    //This is where I need to update state and change it to the instructors schedule 
                    calendarEvents: prevState.calendarEvents = instructorsSchedule

                }

            ))

        }
    }


    // gets the values of course object 
    getRoomResources = () => {
        let courses = Object.values(this.props.courses);
        let resourceList = courses.map(({ room_id }) => ({
            "id": room_id,
            "title": `Room ${room_id}`,
        }));

        return resourceList
    }

    // gets values of instructors and places them in the resource col
    getInstructorResources = () => {
        let instructor = Object.values(this.props.instructors)
        let instructorList = instructor.map(({ user_id, name }) => {

            return {
                "id": user_id,
                'title': name
            }
        })
        return instructorList
    }



    render() {

        return (
            <div className="main-calendar-div">
                <Paper className="paper">
                    <Typography variant="h3" align="left">Scheduler</Typography>

                    <br />
                    <div className="scheduler-header">
                        <div className="scheduler-header-firstSet">
                            <Grid item >
                                <IconButton
                                    color={this.state.calendarIcon ? "primary" : "default"}
                                    onClick={this.changeViewToCalendar}
                                    className={'calendar-icon'} aria-label='next-month'>
                                    <DateRangeOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item >
                                <IconButton
                                    color={this.state.resourceIcon ? "primary" : "default"}
                                    onClick={this.changeViewToResource}
                                    className={'resource-icon'}
                                    aria-label='next-month'>
                                    <ViewListIcon />
                                </IconButton>
                            </Grid>
                            <Grid item  >
                                <IconButton
                                    className={'next-month'}
                                    aria-label='next-month'>
                                    <SearchIcon />
                                </IconButton>
                            </Grid>

                            <Grid item >
                                {(this.state.calendarIcon) ?
                                    <FormControl className={'filter-select'} >
                                        <InputLabel htmlFor="filter-calendar-type"></InputLabel>

                                        <Select
                                            value={this.state.calendarFilterValue}
                                            onChange={this.handleFilterChange('calendarFilterValue')}
                                            inputProps={{
                                                name: 'calendarFilterValue',
                                                id: 'filter-calendar-type',
                                            }}
                                        >
                                            <MenuItem value={"C"}>Class</MenuItem>
                                            <MenuItem value={"T"}>Tutor</MenuItem>
                                        </Select>
                                    </FormControl>
                                    :
                                    <FormControl className={'filter-select'} >
                                        <InputLabel htmlFor="filter-resource-type"></InputLabel>

                                        <Select

                                            value={this.state.resourceFilterValue}
                                            onChange={this.handleResourceFilterChange('resourceFilterValue')}
                                            inputProps={{
                                                name: 'resourceFilterValue',
                                                id: 'filter-resource-type',
                                            }}
                                        >
                                            <MenuItem value={"R"}>Room</MenuItem>
                                            <MenuItem value={"I"}>Instructors</MenuItem>
                                        </Select>
                                    </FormControl>
                                }

                            </Grid>
                        </div>

                        <div className="scheduler-header-date">
                            <Grid item >
                                <IconButton onClick={this.goToPrev} className={'prev-month'} aria-label="prev-month">
                                    <ChevronLeftOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item >
                                <Typography variant={'h6'} >{this.state.currentDate}</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={this.goToNext} className={'next-month'} aria-label='next-month'>
                                    <ChevronRightOutlinedIcon />
                                </IconButton>
                            </Grid>
                        </div>
                        <div className="scheduler-header-last">
                            <Grid item>
                                <IconButton onClick={this.goToToday} className={'current-date-button'} aria-label='current-date-button'>
                                    <TodayIcon />
                                </IconButton>

                            </Grid>
                            <Grid item  >
                                <FormControl className={'change-view'} >
                                    <InputLabel htmlFor="change-view-select"></InputLabel>
                                    <Select
                                        value={this.state.viewValue}
                                        onChange={(event) =>
                                            // event.target.value === the values below 
                                            this.changeView(event.target.value)
                                        }

                                    >
                                        <MenuItem value={"timeGridDay"}>Day</MenuItem>
                                        <MenuItem value={"timeGridWeek"}>Week</MenuItem>
                                        <MenuItem value={"dayGridMonth"}>Month</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => { this.changeViewToCalendar() }}
                                >Course</Button>
                            </Grid>
                            <Grid item >
                                <Button
                                    onClick={() => { this.changeViewToResource() }}
                                >Resource</Button>
                            </Grid>
                        </div>
                    </div>
                    <Grid item>
                        <Grid className='omou-calendar'>
                            <FullCalendar
                                defaultView="timeGridDay"
                                header={false}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listViewPlugin, resourceTimelinePlugin]}
                                ref={this.calendarComponentRef}
                                displayEventTime={true}
                                eventColor={"none"}
                                events={this.state.calendarEvents}
                                titleFormat={{
                                    month: "long",
                                    day: "numeric",
                                }}
                                views={{
                                    dayGrid: {
                                        titleFormat: {
                                            month: "long"
                                        }
                                    }
                                }}
                                timeZone={'local'}
                                eventMouseEnter={(this.state.resourceIcon) ? null : this.handleToolTip}
                                eventLimit={4}
                                nowIndicator={true}
                                resourceOrder={'title'}
                                resourceAreaWidth={'20%'}
                                resources={this.state.calendarResourcesViews}
                                schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                            />
                        </Grid>
                    </Grid>
                </Paper >

            </div >
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