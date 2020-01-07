import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listViewPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

import * as calendarActions from "../../../actions/calendarActions";
import * as courseActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
// Material-Ui dependencies
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import TodayIcon from "@material-ui/icons/Today";
import {stringToColor} from "../Accounts/accountUtils";
import {withStyles} from '@material-ui/core/styles';
// Tool tip dependencies
import tippy from "tippy.js";
import "tippy.js/themes/google.css";
import "./scheduler.scss";
import SessionFilters from "./SessionFilters";
import {BootstrapInput} from "./SchedulerUtils";
import {Tooltip} from "@material-ui/core";
import {arr_diff} from "../../Form/FormUtils";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    bootstrapFormLabel: {
        fontSize: 18,
    },
});

/*** @description: This is for transforming instructor organized redux to an array of sessions
 * @param sessions
 * @returns {unknown[]}
 */
const sessionArray = (sessions) => {
    return sessions.length > 0 && Object.values(sessions)
        .map(instructorSessions => Object.values(instructorSessions))
        .reduce((allSessions, instructorSessions) => {
            return allSessions.concat(instructorSessions);
        });
}

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "calendarResourcesViews": [],
            "calendarWeekends": true,
            "calendarResources": [],
            "calendarEvents": [],
            "currentDate": "",
            "viewValue": "timeGridDay",
            "filterValue": "class",
            "resourceFilterValue": "R",
            "calendarFilterValue": "tutoring",
            "calendarIcon": true,
            "resourceIcon": false,
            "filterTypeCalendar": "",
            "timeShift": 0,
            "instructorFilter": "",
            "instructorOptions": [],
            "courseFilter": "",
            "courseOptions": [],
            "sessionFilter": false,
            "sessionFilterAnchor": null,
        };
        this.calendarViewToFilterVal = {
            "timeGridDay": "day",
            "timeGridWeek": "week",
            "dayGridMonth": "month",
        };
    }

    calendarComponentRef = React.createRef();



    componentDidMount() {
        // this.props.courseActions.fetchCourses();
        // this.props.userActions.fetchInstructors();
        this.props.calendarActions.fetchAllSessions({
            config: {
                params: {
                    time_frame: "day",
                    view_option: "tutoring",
                    time_shift: 0,
                }
            },
            id: ""
        });
        this.setState({
            "currentDate": this.currentDate(),
        });
        // let prevState = JSON.parse(sessionStorage.getItem("schedulerState"));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(prevProps.sessions) !== JSON.stringify(this.props.sessions) ) {
            const initialSessions = this.formatSessions(this.props.sessions);
            const courseSessionsArray =  sessionArray(this.props.sessions);
            this.setState({
                calendarEvents: initialSessions,
                instructorOptions: Object.entries(this.props.instructors).map(
                    ([instructorID, instructor])=>
                        ({ value:Number(instructorID), label: instructor.name })),
                courseOptions: courseSessionsArray && [...new Set(courseSessionsArray.map(session => session.course))].map(
                    (courseID) =>
                        ({value: Number(courseID), label: this.props.courses[Number(courseID)].title})
                )
            });
        }
    }

    componentWillUnmount() {
        // sessionStorage.setItem("schedulerState", JSON.stringify(this.state));
        this.props.calendarActions.resetSchedulerStatus();
    }

    formatSessions = (sessionState) => {
        let allSessions = [];
        Object.values(sessionState).forEach((sessions) => {
            allSessions = allSessions.concat(Object.values(sessions).map(session =>{
                let instructorName = this.props.courses[session.course] && this.props.instructors[session.instructor].name;
                return {
                    id: session.id,
                    courseID: session.course,
                    title: this.props.courses[session.course].title,
                    description: session.description ? session.description : "",
                    type: this.props.courses[session.course].type,
                    resourceId: this.props.courses[session.course_id] ? this.props.courses[session.course_id].room_id : 1,
                    start: new Date(session.start_datetime),
                    end: new Date(session.end_datetime),
                    instructor: instructorName,
                    instructor_id: session.instructor,
                    isConfirmed: session.is_confirmed,
                    color: stringToColor(instructorName),
                };
            }));
        });
        return allSessions;
    };

    getInstructorSchedule = () => {
        let instructor = this.props.instructors;
        let instructorKey = Object.keys(this.props.instructors);

        let instructorsSchedule = instructorKey.map((iKey) => {
            return instructor[iKey].schedule.work_hours;
        });
        let allInstructorSchedules = [];
        instructorsSchedule.forEach((iList) => {
            allInstructorSchedules = allInstructorSchedules.concat(Object.values(iList));
        });
        return allInstructorSchedules;
    }

    // The eventRender function handles the tooltip
    handleToolTip(info) {
        function truncate(string) {
            let numberOfCharRemoved = 88;
            if (string.length > numberOfCharRemoved)
                return string.substring(0, numberOfCharRemoved) + "...";
            else
                return string;
        };

        function formatDate(start, end) {
            const DayConverter = {
                "1": "Monday",
                "2": "Tuesday",
                "3": "Wednesday",
                "4": "Thursday",
                "5": "Friday",
                "6": "Saturday",
            };
            const MonthConverter = {
                "0": "January",
                "1": "February",
                "2": "March",
                "3": "April",
                "4": "May",
                "5": "June",
                "6": "July",
                "7": "August",
                "8": "September",
                "9": "October",
                "10": "November",
                "11": "December",
            };

            const date = new Date(start);
            const dateNumber = date.getDate();
            const dayOfWeek = date.getDay();
            const startMonth = date.getMonth();
            // Gets days
            const Days = DayConverter[dayOfWeek];

            //Gets months
            const Month = MonthConverter[startMonth];

            //Start times and end times variable
            let startTime = new Date(start).toTimeString();
            let endTime = new Date(end).toTimeString();
            // Converts 24hr to 12 hr time
            function timeConverter(time) {
                let Hour = time.substr(0, 2);
                let to12HourTime = (Hour % 12) || 12;
                let ampm = Hour < 12 ? " am" : " pm";
                time = to12HourTime + time.substr(2, 3) + ampm;
                return time;

            }

            let finalTime = `${Days}, ${Month} ${dateNumber} <br> ${timeConverter(startTime)} - ${timeConverter(endTime)}`;

            return finalTime;

        }

        new tippy(info.el, {
            "content":
                `
                <div class="toolTip">
                    <div class='title'><h3> ${info.event.title} </h3></div>
                    <div class="container">
                        <div class='clock'>
                            <span class='clock_icon icn'>  
                                ${formatDate(info.event.start, info.event.end)}
                            </span>
                        </div>
                        <div class='pin_icon icn'>
                            <span class=''>
                                Session ${info.event.extendedProps.is_confirmed? "IS NOT" : "IS"} confirmed
                            </span>
                        </div>
                        <div class='teacher_icon icn'>
                            <span class=''>
                                    ${info.event.extendedProps.instructor ? 
                                        info.event.extendedProps.instructor : "No teacher Yet"}
                            </span>
                        </div>
                        <div class='discription_icon icn'>
                            <span class='description-text'>
                                ${info.el.fcSeg.description ? 
                                        truncate(info.el.fcSeg.description) : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            `
            ,
            "theme": "light",
            "placement": "right",
            "interactive": true,
        });
    }


    // Full Calendar API used to change calendar views
    currentDate = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        const date = calendarApi.view.title;
        return date;
    }

    toggleWeekends = () => {
        this.setState({ // update a property
            "calendarWeekends": !this.state.calendarWeekends,
        });
    };

    // Change from day,week, and month views
    changeView = (value) => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.changeView(value);
        let filter = this.calendarViewToFilterVal[value];

        let date = this.currentDate();
        calendarApi.today();
        this.setState(() => {
            this.props.calendarActions.fetchSession({
                config: {
                    params: {
                        time_frame: filter,
                        view_option: this.state.calendarFilterValue,
                        time_shift: 0,
                    }
                }
            });
            return {
                "viewValue": value,
                "currentDate": date,
                "timeShift":0
            }
        });
    }

    goToNext = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.next();
        let date = this.currentDate();
        this.props.calendarActions.fetchSession({
            config: {
                params: {
                    time_frame: this.calendarViewToFilterVal[this.state.viewValue],
                    view_option: this.state.calendarFilterValue,
                    time_shift: this.state.timeShift + 1,
                }
            }
        });
        this.setState((state) => {
            return {
                "currentDate": date,
                "timeShift": state.timeShift + 1,
            }
        });
    };

    goToPrev = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.prev();
        let date = this.currentDate();
        this.props.calendarActions.fetchSession({
            config: {
                params: {
                    time_frame: this.calendarViewToFilterVal[this.state.viewValue],
                    view_option: this.state.calendarFilterValue,
                    time_shift: this.state.timeShift - 1,
                }
            }
        });
        this.setState((state) => {
            return {
                "currentDate": date,
                "timeShift": state.timeShift - 1,
            }
        });
    };

    goToToday = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.today();
        const date = this.currentDate();
        this.props.calendarActions.fetchSession({
            config: {
                params: {
                    time_frame: this.calendarViewToFilterVal[this.state.viewValue],
                    view_option: this.state.calendarFilterValue,
                    time_shift: 0,
                }
            }
        });
        this.setState({
            "currentDate": date,
            "timeShift": 0,
        });
    }

    today = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.today();
        this.currentDate();
    }

    currentDate = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        const date = calendarApi.view.title;
        return date;
    }

    // This function changes the resouce view when click as well as change the color of the icon
    changeViewToResource = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.changeView("resourceTimeline");
        this.currentDate();
        this.setState({
            "resourceIcon": true,
            "calendarIcon": false,
            "calendarResourcesViews": this.getRoomResources(),
            "calendarEvents": JSON.parse(sessionStorage.getItem("calendarEvent")),
            "calendarResources": this.getRoomResources(),
        });

    }

    changeViewToCalendar = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.changeView("dayGridMonth");
        this.currentDate();
        this.setState({
            "calendarIcon": true,
            "resourceIcon": false,
            "calendarEvents": JSON.parse(sessionStorage.getItem("calendarEvent")),
        });
    }

    // Function to parse the inital state into data that full calendar could
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
                session["title"] = session.title;
                session["description"] = session.description ? session.description : "";
                session["type"] = this.props.courses[session.course_id].type;
                session["resourceId"] = this.props.courses[session.course_id].room_id ? this.props.courses[session.course_id].room_id : 1;


                return session;

            });
            return courseSessions;
        });

        let sessionsInView = [];
        sessionsInViewList.forEach((sessionsList) => {
            sessionsInView = sessionsInView.concat(sessionsList);
        });

        return sessionsInView.map((el) => ({
            ...el,
            "url": `/scheduler/view-session/${el.course_id}/${el.session_id}`,
        }));
    }

    // This function is used in material-ui for the eventhandler
    handleFilterChange = (name) => (event) => {
        const date = this.currentDate();
        if (event.target.value) {
            this.setState(()=>{
                // console.log(this.calendarViewToFilterVal[this.state.viewValue], this.viewOptions[event.target.value], this.state.timeShift);
                this.props.calendarActions.fetchSession({
                    config: {
                        params: {
                            time_frame: this.calendarViewToFilterVal[this.state.viewValue],
                            view_option: event.target.value,
                            time_shift: this.state.timeShift,
                        }
                    }
                });
                return {
                    // "calendarEvents": newEvents,
                    "currentDate": date,
                    [name]: event.target.value,
                }
            });
            // sessionStorage.setItem("calendarEvent", JSON.stringify(newEvents));
        }

    }

    handleResourceFilterChange = (name) => (event) => {
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
        if (event.target.value === "R") {
            let rooms = this.getRoomResources();
            let currentCalendarEvents = this.getEvents();
            this.setState({
                // over here I need to change it back if user click back to Room
                "calendarResourcesViews": rooms,
                "calendarEvents": currentCalendarEvents,
                "calendarResources": rooms,
            });
        } else {
            let instructors = this.getInstructorResources();
            let instructorsSchedule = this.getInstructorSchedule();
            this.setState({
                "calendarResourcesViews": instructors,
                //This is where I need to update state and change it to the instructors schedule
                "calendarEvents": instructorsSchedule,
            });
        }
    };

    // gets the values of course object
    getRoomResources = () =>
        Object.values(this.props.courses).map(({ room_id }) => ({
            "id": room_id,
            "title": `Room ${room_id}`,
        }));

    // gets values of instructors and places them in the resource col
    getInstructorResources = () =>
        Object.values(this.props.instructors).map((inst) => ({
            "id": inst.user_id,
            "title": inst.name,
        }));

    // go to session view
    goToSessionView = (e) => {
        const sessionID = e.event.id;
        const courseID = e.event.extendedProps.courseID;
        const instructorID = e.event.extendedProps.instructor_id;
        this.props.history.push(`/scheduler/view-session/${courseID}/${sessionID}/${instructorID}`);
    };

    onInstructorSelect = event => {
        this.setState(()=>{
            const selectedInstructorIDs = event && event.map(instructor => instructor.value);
            const calendarInstructorIDs = Object.keys(this.props.sessions);
            const nonSelectedInstructors = event ? arr_diff(selectedInstructorIDs,calendarInstructorIDs) : []

            let filteredEvents = JSON.parse(JSON.stringify(this.props.sessions));
            if(event && event.length > 0 && nonSelectedInstructors.length > 0){
                nonSelectedInstructors
                    .forEach( (instructorID) => delete filteredEvents[Number(instructorID)])
            } else {
                filteredEvents = this.props.sessions;
            }
            return {
                "instructorFilter": event,
                "calendarEvents": this.formatSessions(filteredEvents, this.state.timeShift),
            }
        });
    };

    onCourseSelect = event => {
        this.setState(()=>{
            const courseSessionsArray = sessionArray(this.props.sessions);
           const selectedCourseIDs = event && event.map(course => course.value);
           const calendarCourseIDs = [...new Set(courseSessionsArray.map(session => session.course))];
           const nonSelectedCourseIDs = event ? arr_diff(selectedCourseIDs, calendarCourseIDs): [];

           let filteredEvents = JSON.parse(JSON.stringify(this.props.sessions));
           if(event && event.length > 0 && nonSelectedCourseIDs.length > 0){
               nonSelectedCourseIDs
                   .forEach((courseID) => {
                      courseSessionsArray.forEach(session => {
                          if(session.course === courseID){
                              delete filteredEvents[session.instructor][session.id]
                          }
                      });
                   });
           } else {
               filteredEvents = this.props.sessions;
           }
           console.log(filteredEvents);
            return {
               "courseFilter": event,
                "calendarEvents": this.formatSessions(filteredEvents),
            }
        });
    };

    render() {
        return (
            <Paper className="paper scheduler">
                <Typography
                    className="scheduler-title"
                    variant="h3"
                    align="left">
                    Scheduler
                </Typography>
                <br />
                <Grid container
                      className="scheduler-wrapper"
                      spacing={16}>
                    <Grid item xs={12} className="scheduler-header">
                        <Grid container>
                            <Grid item xs={3}>
                                <Grid
                                    container
                                    direction={"row"}
                                    className="scheduler-header-firstSet">
                                    {/*<Grid item >*/}
                                    {/*    <IconButton*/}
                                    {/*        color={this.state.calendarIcon ? "primary" : "default"}*/}
                                    {/*        onClick={this.changeViewToCalendar}*/}
                                    {/*        className={"calendar-icon"} aria-label='next-month'>*/}
                                    {/*        <DateRangeOutlinedIcon />*/}
                                    {/*    </IconButton>*/}
                                    {/*</Grid>*/}
                                    {/*<Grid item >*/}
                                    {/*    <IconButton*/}
                                    {/*        color={this.state.resourceIcon ? "primary" : "default"}*/}
                                    {/*        onClick={this.changeViewToResource}*/}
                                    {/*        className={"resource-icon"}*/}
                                    {/*        aria-label='next-month'>*/}
                                    {/*        <ViewListIcon />*/}
                                    {/*    </IconButton>*/}
                                    {/*</Grid>*/}
                                    {/*<Grid item>*/}
                                    {/*    <IconButton*/}
                                    {/*        className={"next-month"}*/}
                                    {/*        aria-label='next-month'>*/}
                                    {/*        <SearchIcon />*/}
                                    {/*    </IconButton>*/}
                                    {/*</Grid>*/}

                                    <Grid item xs={8}>
                                        {(this.state.calendarIcon) ?
                                            <FormControl className={"filter-select"} >
                                                <Select
                                                    value={this.state.calendarFilterValue}
                                                    onChange={this.handleFilterChange("calendarFilterValue")}
                                                    input={
                                                        <BootstrapInput name={"courseFilter"} id={"filter-calendar-type"}/>
                                                    }
                                                >
                                                    <MenuItem value={"all"}>All</MenuItem>
                                                    <MenuItem value={"class"}>Class</MenuItem>
                                                    <MenuItem value={"tutoring"}>Tutoring</MenuItem>
                                                </Select>
                                            </FormControl>
                                            :
                                            <FormControl className={"filter-select"} >
                                                <InputLabel htmlFor="filter-resource-type"></InputLabel>

                                                <Select
                                                    input={
                                                        <BootstrapInput name={"courseFilter"} id={"filter-calendar-type"}/>
                                                    }
                                                    value={this.state.resourceFilterValue}
                                                    onChange={this.handleResourceFilterChange("resourceFilterValue")}
                                                >
                                                    <MenuItem value={"R"}>Room</MenuItem>
                                                    <MenuItem value={"I"}>Instructors</MenuItem>
                                                </Select>
                                            </FormControl>
                                        }
                                    </Grid>
                                    <Grid item xs={4}>
                                        {/*<IconButton*/}
                                        {/*    onClick={this.onFilterToggle(true)}*/}
                                        {/*    // aria-owns={sessionFilterAnchor ? 'sessionFilters' : undefined }*/}
                                        {/*    aria-haspopup={"true"}*/}
                                        {/*    aria-label={"filters"}*/}
                                        {/*    aria-controls={"sessionFilters"}*/}
                                        {/*>*/}
                                        {/*    <FilterIcon*/}

                                        {/*    />*/}
                                        {/*</IconButton>*/}
                                        {/*<Menu*/}
                                        {/*    id={"sessionFilters"}*/}
                                        {/*    anchorEl={sessionFilterAnchor}*/}
                                        {/*    open={Boolean(sessionFilterAnchor)}*/}
                                        {/*    onClose={this.onFilterToggle(false)}*/}
                                        {/*    keepMounted*/}
                                        {/*>*/}
                                        {/*    <ReactSelect*/}
                                        {/*        // style={{width:"100%"}}*/}
                                        {/*        value = { this.state.instructorFilter }*/}
                                        {/*        options={ this.state.instructorOptions }*/}
                                        {/*        onChange={ this.onInstructorSelect }*/}
                                        {/*        clearable*/}
                                        {/*        isMulti*/}
                                        {/*    />*/}
                                        {/*</Menu>*/}
                                        <SessionFilters
                                            InstructorValue = { this.state.instructorFilter }
                                            InstructorOptions={ this.state.instructorOptions }
                                            onInstructorSelect = {this.onInstructorSelect }
                                            CourseValue = {this.state.courseFilter}
                                            CourseOptions = {this.state.courseOptions}
                                            onCourseSelect = {this.onCourseSelect}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="scheduler-header-date">
                                    <Grid item >
                                        <IconButton onClick={this.goToPrev} className={"prev-month"} aria-label="prev-month">
                                            <ChevronLeftOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item >
                                        <Typography variant={"h6"} >{this.state.currentDate}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={this.goToNext} className={"next-month"} aria-label='next-month'>
                                            <ChevronRightOutlinedIcon />
                                        </IconButton>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={1}/>
                            <Grid item xs={2}>
                                <Grid container
                                      direction={"row"}
                                      justify={"flex-end"}
                                      className="scheduler-header-last">
                                    <Grid item xs={3}>
                                        <Tooltip title={"Go to Today"}>
                                            <IconButton onClick={this.goToToday} className={"current-date-button"} aria-label='current-date-button'>
                                                <TodayIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <FormControl className={"filter-select"} >
                                            <Select
                                                input={
                                                    <BootstrapInput name={"courseFilter"} id={"filter-calendar-type"}/>
                                                }
                                                value={this.state.viewValue}
                                                onChange={(event) =>
                                                    this.changeView(event.target.value)
                                                }
                                            >
                                                <MenuItem value={"timeGridDay"}>Day</MenuItem>
                                                <MenuItem value={"timeGridWeek"}>Week</MenuItem>
                                                <MenuItem value={"dayGridMonth"}>Month</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {/*<Grid item>*/}
                                    {/*    <Button*/}
                                    {/*        onClick={this.changeViewToCalendar}*/}
                                    {/*    >Course</Button>*/}
                                    {/*</Grid>*/}
                                    {/*<Grid item >*/}
                                    {/*    <Button*/}
                                    {/*        onClick={this.changeViewToResource}*/}
                                    {/*    >Resource</Button>*/}
                                    {/*</Grid>*/}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className='omou-calendar'>
                        <FullCalendar
                            contentHeight="400"
                            defaultView="timeGridDay"
                            header={false}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listViewPlugin, resourceTimelinePlugin]}
                            ref={this.calendarComponentRef}
                            displayEventTime={true}
                            eventColor={"none"}
                            events={this.state.calendarEvents}
                            titleFormat={{
                                "month": "long",
                                "day": "numeric",
                            }}
                            views={{
                                "dayGrid": {
                                    "titleFormat": {
                                        "month": "long",
                                    },
                                },
                            }}
                            minTime={"07:00:00"}
                            timeZone={"local"}
                            eventMouseEnter={!this.state.resourceIcon && this.handleToolTip}
                            eventClick={this.goToSessionView}
                            eventLimit={4}
                            nowIndicator={true}
                            resourceOrder={"title"}
                            resourceAreaWidth={"20%"}
                            resources={this.state.calendarResourcesViews}
                            schedulerLicenseKey={"GPL-My-Project-Is-Open-Source"}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

Scheduler.propTypes = {};

function mapStateToProps(state) {
    return {
        "courses": state.Course.NewCourseList,
        "sessions": state.Calendar.CourseSessions,
        "instructors": state.Users.InstructorList,
        "requestStatus": state.RequestStatus,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "calendarActions": bindActionCreators(calendarActions, dispatch),
        "courseActions": bindActionCreators(courseActions, dispatch),
        "userActions": bindActionCreators(userActions, dispatch),
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Scheduler)));
