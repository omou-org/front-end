/* eslint-disable func-style */
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

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
import { stringToColor } from "../Accounts/accountUtils";
import { withStyles } from "@material-ui/core/styles";
import "./scheduler.scss";
import SessionFilters from "./SessionFilters";
import { BootstrapInput, handleToolTip, sessionArray } from "./SchedulerUtils";
import { Tooltip } from "@material-ui/core";
import { arr_diff } from "../../Form/FormUtils";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing.unit,
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
});

class Scheduler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarResourcesViews: [],
      calendarWeekends: true,
      calendarResources: [],
      calendarEvents: [],
      oooEvents: [],
      currentDate: "",
      viewValue: "timeGridDay",
      filterValue: "class",
      resourceFilterValue: "R",
      calendarFilterValue: "tutoring",
      calendarIcon: true,
      resourceIcon: false,
      filterTypeCalendar: "",
      timeShift: 0,
      instructorFilter: "",
      instructorOptions: [],
      courseFilter: "",
      courseOptions: [],
      sessionFilter: false,
      sessionFilterAnchor: null,
    };
    this.calendarViewToFilterVal = {
      timeGridDay: "day",
      timeGridWeek: "week",
      dayGridMonth: "month",
    };
  }

  calendarComponentRef = React.createRef();

  componentDidMount() {
    // this.props.courseActions.fetchCourses();
    // this.props.userActions.fetchInstructors();

    this.props.userActions.fetchOutOfOffice();
    this.props.calendarActions.fetchAllSessions({
      config: {
        params: {
          time_frame: "day",
          view_option: "tutoring",
          time_shift: 0,
        },
      },
      id: "",
    });
    this.setState({
      currentDate: this.currentDate(),
    });
    this.setOOOEvents();
  }

  componentDidUpdate(prevProps) {
    // this is why we need useEffect lol
    if (
      JSON.stringify(prevProps.sessions) !== JSON.stringify(this.props.sessions)
    ) {
      const initialSessions = this.formatSessions(this.props.sessions);
      const courseSessionsArray = sessionArray(this.props.sessions);

      this.setState({
        calendarEvents: initialSessions,
        instructorOptions: Object.entries(this.props.instructors).map(
          ([instructorID, instructor]) => ({
            value: Number(instructorID),
            label: instructor.name,
          })
        ),
        courseOptions:
          courseSessionsArray &&
          [
            ...new Set(courseSessionsArray.map((session) => session.course)),
          ].map((courseID) => ({
            value: Number(courseID),
            label: this.props.courses[Number(courseID)].title,
          })),
      });
    }
    if (
      JSON.stringify(prevProps.instructors) !==
      JSON.stringify(this.props.instructors)
    ) {
      this.setOOOEvents();
    }
  }

  componentWillUnmount() {
    console.log("test");
    this.props.calendarActions.resetSchedulerStatus();
  }

  formatSessions = (sessionState) => {
    let allSessions = [];

    Object.values(sessionState).forEach((sessions) => {
      allSessions = allSessions.concat(
        Object.values(sessions).map((session) => {
          const instructorName =
            this.props.courses[session.course] &&
            this.props.instructors[session.instructor].name;
          return {
            id: session.id,
            courseID: session.course,
            title: session.title,
            description: session.description ? session.description : "",
            type: this.props.courses[session.course].type,
            resourceId: this.props.courses[session.course_id]
              ? this.props.courses[session.course_id].room_id
              : 1,
            start: new Date(session.start_datetime),
            end: new Date(session.end_datetime),
            instructor: instructorName,
            instructor_id: session.instructor,
            isConfirmed: session.is_confirmed,
            color: stringToColor(instructorName),
          };
        })
      );
    });
    return allSessions;
  };

  getInstructorSchedule = () => {
    const instructor = this.props.instructors;
    const instructorKey = Object.keys(this.props.instructors);

    const instructorsSchedule = instructorKey.map(
      (iKey) => instructor[iKey].schedule.work_hours
    );
    let allInstructorSchedules = [];
    instructorsSchedule.forEach((iList) => {
      allInstructorSchedules = allInstructorSchedules.concat(
        Object.values(iList)
      );
    });
    return allInstructorSchedules;
  };

  setOOOEvents = () => {
    let allInstructorSchedules = [];
    if (!this.state.courseFilter) {
      const { instructors } = this.props;

      let OOOlist = Object.values(instructors);
      if (this.state.instructorFilter) {
        const IDList = this.state.instructorFilter.map(({ value }) => value);
        OOOlist = OOOlist.filter(({ user_id }) => IDList.includes(user_id));
      }
      OOOlist = OOOlist.map(({ schedule }) => schedule.time_off);
      OOOlist.forEach((iList) => {
        allInstructorSchedules = allInstructorSchedules.concat(
          Object.values(iList).map(
            ({ start, end, description, instructor_id, all_day, ooo_id }) => {
              const instructor = instructors[instructor_id];
              const title =
                description ||
                (instructor
                  ? `${instructor.name} Out of Office`
                  : "Out of Office");
              const endDate = new Date(end);
              // since the end date for allDay events is EXCLUSIVE
              // must add one day to include the end specified by user
              if (all_day) {
                endDate.setDate(endDate.getDate() + 1);
              }
              return {
                allDay: all_day,
                color: stringToColor(instructor.name || ""),
                end: endDate,
                start,
                title,
                ooo_id,
              };
            }
          )
        );
      });
    }
    this.setState({
      oooEvents: allInstructorSchedules,
    });
  };

  // Full Calendar API used to change calendar views
  currentDate = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    const date = calendarApi.view.title;
    return date;
  };

  toggleWeekends = () => {
    this.setState({
      // update a property
      calendarWeekends: !this.state.calendarWeekends,
    });
  };

  // Change from day,week, and month views
  changeView = (value) => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.changeView(value);
    const filter = this.calendarViewToFilterVal[value];

    const date = this.currentDate();
    calendarApi.today();

    this.props.calendarActions.fetchSession({
      config: {
        params: {
          time_frame: filter,
          view_option: this.state.calendarFilterValue,
          time_shift: 0,
        },
      },
    });
    this.setState(() => ({
      viewValue: value,
      currentDate: date,
      timeShift: 0,
    }));
  };

  goToNext = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.next();
    const date = this.currentDate();
    this.props.calendarActions.fetchSession({
      config: {
        params: {
          time_frame: this.calendarViewToFilterVal[this.state.viewValue],
          view_option: this.state.calendarFilterValue,
          time_shift: this.state.timeShift + 1,
        },
      },
    });
    this.setState((state) => ({
      currentDate: date,
      timeShift: state.timeShift + 1,
    }));
  };

  goToPrev = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.prev();
    const date = this.currentDate();
    this.props.calendarActions.fetchSession({
      config: {
        params: {
          time_frame: this.calendarViewToFilterVal[this.state.viewValue],
          view_option: this.state.calendarFilterValue,
          time_shift: this.state.timeShift - 1,
        },
      },
    });
    this.setState((state) => ({
      currentDate: date,
      timeShift: state.timeShift - 1,
    }));
  };

  goToToday = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.today();
    const date = this.currentDate();
    this.props.calendarActions.fetchSession({
      config: {
        params: {
          time_frame: this.calendarViewToFilterVal[this.state.viewValue],
          view_option: this.state.calendarFilterValue,
          time_shift: 0,
        },
      },
    });
    this.setState({
      currentDate: date,
      timeShift: 0,
    });
  };

  today = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.today();
    this.currentDate();
  };

  currentDate = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    const date = calendarApi.view.title;
    return date;
  };

  // This function changes the resouce view when click as well as change the color of the icon
  changeViewToResource = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.changeView("resourceTimeline");
    this.currentDate();
    this.setState({
      resourceIcon: true,
      calendarIcon: false,
      calendarResourcesViews: this.getRoomResources(),
      calendarEvents: JSON.parse(sessionStorage.getItem("calendarEvent")),
      calendarResources: this.getRoomResources(),
    });
  };

  changeViewToCalendar = () => {
    const calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.changeView("dayGridMonth");
    this.currentDate();
    this.setState({
      calendarIcon: true,
      resourceIcon: false,
      calendarEvents: JSON.parse(sessionStorage.getItem("calendarEvent")),
    });
  };

  // Function to parse the inital state into data that full calendar could
  getEvents = () => {
    const courseKeys = Object.keys(this.props.sessions);

    // creates an array from courseKeys [0,1,2,3,...,10]
    const sessionsInViewList = courseKeys.map((courseKey) => {
      // course will get each session and map with courseKey
      const course = this.props.sessions[courseKey];
      // gets the keys to each session that was mapped
      const courseSessionKeys = Object.keys(course);
      // creates an array that maps through courseSessionKey
      const courseSessions = courseSessionKeys.map((sessionKey) => {
        // sessions = sessions from initial state
        // courseKey is the key value from inital state
        // sessionKey is the variable named inside the map, this is mapping over each coursekey
        // session is the matched pairs of course and session objects
        const session = this.props.sessions[courseKey][sessionKey];
        session.description = session.description ? session.description : "";
        session.type = this.props.courses[session.course_id].type;
        session.resourceId = this.props.courses[session.course_id].room_id
          ? this.props.courses[session.course_id].room_id
          : 1;

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
      url: `/scheduler/view-session/${el.course_id}/${el.session_id}`,
    }));
  };

  // This function is used in material-ui for the eventhandler
  handleFilterChange = (name) => (event) => {
    const date = this.currentDate();
    if (event.target.value) {
      this.setState(() => {
        this.props.calendarActions.fetchSession({
          config: {
            params: {
              time_frame: this.calendarViewToFilterVal[this.state.viewValue],
              view_option: event.target.value,
              time_shift: this.state.timeShift,
            },
          },
        });
        return {
          // "calendarEvents": newEvents,
          currentDate: date,
          [name]: event.target.value,
        };
      });
      // sessionStorage.setItem("calendarEvent", JSON.stringify(newEvents));
    }
  };

  handleResourceFilterChange = (name) => (event) => {
    this.setState({
      ...this.state,
      [name]: event.target.value,
    });
    if (event.target.value === "R") {
      const rooms = this.getRoomResources();
      const currentCalendarEvents = this.getEvents();
      this.setState({
        // over here I need to change it back if user click back to Room
        calendarResourcesViews: rooms,
        calendarEvents: currentCalendarEvents,
        calendarResources: rooms,
      });
    } else {
      const instructors = this.getInstructorResources();
      const instructorsSchedule = this.getInstructorSchedule();
      this.setState({
        calendarResourcesViews: instructors,
        // This is where I need to update state and change it to the instructors schedule
        calendarEvents: instructorsSchedule,
      });
    }
  };

  // gets the values of course object
  getRoomResources = () =>
    Object.values(this.props.courses).map(({ room_id }) => ({
      id: room_id,
      title: `Room ${room_id}`,
    }));

  // gets values of instructors and places them in the resource col
  getInstructorResources = () =>
    Object.values(this.props.instructors).map((inst) => ({
      id: inst.user_id,
      title: inst.name,
    }));

  // go to session view
  goToSessionView = ({ event }) => {
    const sessionID = event.id;
    const { courseID, instructor_id } = event.extendedProps;
    // dont redirect for OOO clicks
    if (sessionID && courseID && instructor_id) {
      this.props.history.push(
        `/scheduler/view-session/${courseID}/${sessionID}/${instructor_id}`
      );
    }
  };

  onInstructorSelect = (event) => {
    this.setState(() => {
      const selectedInstructorIDs =
        event && event.map((instructor) => instructor.value);
      const calendarInstructorIDs = Object.keys(this.props.sessions);
      const nonSelectedInstructors = event
        ? arr_diff(selectedInstructorIDs, calendarInstructorIDs)
        : [];

      let filteredEvents = JSON.parse(JSON.stringify(this.props.sessions));
      if (event && event.length > 0 && nonSelectedInstructors.length > 0) {
        nonSelectedInstructors.forEach(
          (instructorID) => delete filteredEvents[Number(instructorID)]
        );
      } else {
        filteredEvents = this.props.sessions;
      }
      return {
        instructorFilter: event,
        calendarEvents: this.formatSessions(
          filteredEvents,
          this.state.timeShift
        ),
      };
    }, this.setOOOEvents);
  };

  onCourseSelect = (event) => {
    this.setState(() => {
      const courseSessionsArray = sessionArray(this.props.sessions);
      const selectedCourseIDs = event && event.map((course) => course.value);
      const calendarCourseIDs = [
        ...new Set(courseSessionsArray.map((session) => session.course)),
      ];
      const nonSelectedCourseIDs = event
        ? arr_diff(selectedCourseIDs, calendarCourseIDs)
        : [];

      let filteredEvents = JSON.parse(JSON.stringify(this.props.sessions));
      if (event && event.length > 0 && nonSelectedCourseIDs.length > 0) {
        nonSelectedCourseIDs.forEach((courseID) => {
          courseSessionsArray.forEach((session) => {
            if (session.course === Number(courseID)) {
              delete filteredEvents[session.instructor][session.id];
            }
          });
        });
      } else {
        filteredEvents = this.props.sessions;
      }
      return {
        courseFilter: event,
        calendarEvents: this.formatSessions(filteredEvents),
      };
    }, this.setOOOEvents);
  };

  render() {
    return (
      <Paper className="paper scheduler">
        <Typography align="left" className="scheduler-title" variant="h3">
          Scheduler
        </Typography>
        <br />
        <Grid className="scheduler-wrapper" container spacing={16}>
          <Grid className="scheduler-header" item xs={12}>
            <Grid container>
              <Grid item xs={3}>
                <Grid
                  className="scheduler-header-firstSet"
                  container
                  direction="row"
                >
                  {/* <Grid item >*/}
                  {/*    <IconButton*/}
                  {/*        color={this.state.calendarIcon ? "primary" : "default"}*/}
                  {/*        onClick={this.changeViewToCalendar}*/}
                  {/*        className={"calendar-icon"} aria-label='next-month'>*/}
                  {/*        <DateRangeOutlinedIcon />*/}
                  {/*    </IconButton>*/}
                  {/* </Grid>*/}
                  {/* <Grid item >*/}
                  {/*    <IconButton*/}
                  {/*        color={this.state.resourceIcon ? "primary" : "default"}*/}
                  {/*        onClick={this.changeViewToResource}*/}
                  {/*        className={"resource-icon"}*/}
                  {/*        aria-label='next-month'>*/}
                  {/*        <ViewListIcon />*/}
                  {/*    </IconButton>*/}
                  {/* </Grid>*/}
                  {/* <Grid item>*/}
                  {/*    <IconButton*/}
                  {/*        className={"next-month"}*/}
                  {/*        aria-label='next-month'>*/}
                  {/*        <SearchIcon />*/}
                  {/*    </IconButton>*/}
                  {/* </Grid>*/}

                  <Grid item xs={8}>
                    {this.state.calendarIcon ? (
                      <FormControl className="filter-select">
                        <Select
                          input={
                            <BootstrapInput
                              id="filter-calendar-type"
                              name="courseFilter"
                            />
                          }
                          onChange={this.handleFilterChange(
                            "calendarFilterValue"
                          )}
                          value={this.state.calendarFilterValue}
                        >
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="class">Class</MenuItem>
                          <MenuItem value="tutoring">Tutoring</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <FormControl className="filter-select">
                        <InputLabel htmlFor="filter-resource-type" />

                        <Select
                          input={
                            <BootstrapInput
                              id="filter-calendar-type"
                              name="courseFilter"
                            />
                          }
                          onChange={this.handleResourceFilterChange(
                            "resourceFilterValue"
                          )}
                          value={this.state.resourceFilterValue}
                        >
                          <MenuItem value="R">Room</MenuItem>
                          <MenuItem value="I">Instructors</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {/* <IconButton*/}
                    {/*    onClick={this.onFilterToggle(true)}*/}
                    {/*    // aria-owns={sessionFilterAnchor ? 'sessionFilters' : undefined }*/}
                    {/*    aria-haspopup={"true"}*/}
                    {/*    aria-label={"filters"}*/}
                    {/*    aria-controls={"sessionFilters"}*/}
                    {/* >*/}
                    {/*    <FilterIcon*/}

                    {/*    />*/}
                    {/* </IconButton>*/}
                    {/* <Menu*/}
                    {/*    id={"sessionFilters"}*/}
                    {/*    anchorEl={sessionFilterAnchor}*/}
                    {/*    open={Boolean(sessionFilterAnchor)}*/}
                    {/*    onClose={this.onFilterToggle(false)}*/}
                    {/*    keepMounted*/}
                    {/* >*/}
                    {/*    <ReactSelect*/}
                    {/*        // style={{width:"100%"}}*/}
                    {/*        value = { this.state.instructorFilter }*/}
                    {/*        options={ this.state.instructorOptions }*/}
                    {/*        onChange={ this.onInstructorSelect }*/}
                    {/*        clearable*/}
                    {/*        isMulti*/}
                    {/*    />*/}
                    {/* </Menu>*/}
                    <SessionFilters
                      CourseOptions={this.state.courseOptions}
                      CourseValue={this.state.courseFilter}
                      InstructorOptions={this.state.instructorOptions}
                      InstructorValue={this.state.instructorFilter}
                      onCourseSelect={this.onCourseSelect}
                      onInstructorSelect={this.onInstructorSelect}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <div className="scheduler-header-date">
                  <Grid item>
                    <IconButton
                      aria-label="prev-month"
                      className="prev-month"
                      onClick={this.goToPrev}
                    >
                      <ChevronLeftOutlinedIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      {this.state.currentDate}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label="next-month"
                      className="next-month"
                      onClick={this.goToNext}
                    >
                      <ChevronRightOutlinedIcon />
                    </IconButton>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={2}>
                <Grid
                  className="scheduler-header-last"
                  container
                  direction="row"
                  justify="flex-end"
                >
                  <Grid item xs={3}>
                    <Tooltip title="Go to Today">
                      <IconButton
                        aria-label="current-date-button"
                        className="current-date-button"
                        onClick={this.goToToday}
                      >
                        <TodayIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl className="filter-select">
                      <Select
                        input={
                          <BootstrapInput
                            id="filter-calendar-type"
                            name="courseFilter"
                          />
                        }
                        onChange={(event) =>
                          this.changeView(event.target.value)
                        }
                        value={this.state.viewValue}
                      >
                        <MenuItem value="timeGridDay">Day</MenuItem>
                        <MenuItem value="timeGridWeek">Week</MenuItem>
                        <MenuItem value="dayGridMonth">Month</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item>*/}
                  {/*    <Button*/}
                  {/*        onClick={this.changeViewToCalendar}*/}
                  {/*    >Course</Button>*/}
                  {/* </Grid>*/}
                  {/* <Grid item >*/}
                  {/*    <Button*/}
                  {/*        onClick={this.changeViewToResource}*/}
                  {/*    >Resource</Button>*/}
                  {/* </Grid>*/}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid className="omou-calendar" item xs={12}>
            <FullCalendar
              contentHeight="400"
              defaultView="timeGridDay"
              displayEventTime
              eventClick={this.goToSessionView}
              eventColor="none"
              eventLimit={4}
              eventMouseEnter={!this.state.resourceIcon && handleToolTip}
              events={[...this.state.calendarEvents, ...this.state.oooEvents]}
              header={false}
              minTime="07:00:00"
              nowIndicator
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listViewPlugin,
                resourceTimelinePlugin,
              ]}
              ref={this.calendarComponentRef}
              resourceAreaWidth="20%"
              resourceOrder="title"
              resources={this.state.calendarResourcesViews}
              schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
              timeZone="local"
              titleFormat={{
                month: "long",
                day: "numeric",
              }}
              views={{
                dayGrid: {
                  titleFormat: {
                    month: "long",
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    courses: state.Course.NewCourseList,
    sessions: state.Calendar.CourseSessions,
    instructors: state.Users.InstructorList,
    requestStatus: state.RequestStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    calendarActions: bindActionCreators(calendarActions, dispatch),
    courseActions: bindActionCreators(courseActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Scheduler))
);
