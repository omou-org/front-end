import {connect} from 'react-redux';
import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import BackButton from "../../../BackButton";
import {Link} from "react-router-dom";

class CourseSessionStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.setState(() => {
            let {accountID, courseID} = this.props.match.params;
            let calendarSessions = this.props.courseSessions[courseID];
            // console.log(this.props.enrollments, accountID, courseID);
            let paymentSessionStatus = this.props.enrollments[accountID][courseID].session_payment_status;
            let statusKey = (status) => {
                    if (status === 1) {
                        return "Paid";
                    } else if (status === 0) {
                        return "Unpaid";
                    } else {
                        return "Waived";
                    }
                };
            let course = this.props.courses[courseID];
            if(course.type==="T"){
                calendarSessions = Object.values(calendarSessions).map((session) => {
                    return {
                        ...session,
                        status: statusKey(paymentSessionStatus[session.session_id]),

                    }
                });
                return {
                    sessions: calendarSessions,
                    type:"T",
                    studentID: accountID,
                    course: course,
                };
            } else {
                let status = "Paid";
                Object.values(paymentSessionStatus).forEach((session)=>{
                    if(session === 0){
                        status = "Unpaid";
                    }
                });
                return {
                    sessions: [
                        {
                            ...course,
                            status: status,
                            type: "C",
                        }
                    ],
                    type:"C",
                    course: course,
                    studentID: accountID,
                }
            }

        })
    }

    courseDataParser(course) {
        let DayConverter = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
        };
        let Days = course.schedule.days.map((day) => {
            return DayConverter[day];
        });
        let DaysString = "";
        if(Days.length > 1){
            Days.forEach((day)=>{
                DaysString += day + ", "
            });
        } else {
            DaysString = Days[0];
        }

        let timeOptions = {hour: "2-digit", minute: "2-digit"};
        let dateOptions = {year: "numeric", month: "numeric", day: "numeric"};
        let startDate = new Date(course.schedule.start_date + course.schedule.start_time),
            endDate = new Date(course.schedule.end_date + course.schedule.end_time),
            startTime = startDate.toLocaleTimeString("en-US", timeOptions),
            endTime = endDate.toLocaleTimeString("en-US", timeOptions);
        startDate = startDate.toLocaleDateString("en-US", dateOptions);
        endDate = endDate.toLocaleDateString("en-US", dateOptions);

        let date = startDate + " - " + endDate;

        return {
            day: DaysString,
            startTime: startTime,
            endTime: endTime,
            date: date,
            tuition: course.tuition,
            status: course.status,
        }
    }

    sessionDataParse(session) {
        let {start, end, course_id, status} = session;
        let startDate = new Date(start);
        let endDate = new Date(end);

        let timeOptions = {hour: "2-digit", minute: "2-digit"};
        let dateOptions = {year: "numeric", month: "numeric", day: "numeric"};

        let DayConverter = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
        };

        let day = DayConverter[startDate.getDay()];

        let startTime = startDate.toLocaleTimeString("en-US", timeOptions),
            endTime = endDate.toLocaleTimeString("en-US", timeOptions),
            date = startDate.toLocaleDateString("en-US", dateOptions);

        let courseTuition = this.props.courses[course_id].tuition;

        return {
            day:day,
            startTime: startTime,
            endTime: endTime,
            date: date,
            tuition: courseTuition,
            status: status,
        }
    }

    render() {
        return (<Paper className={'paper'}>
            <Grid container className={'course-session-status'}>
                <Grid item md={12}>
                    <BackButton/>
                    <hr/>
                </Grid>

                <Grid item md={12}>
                    <Typography variant={'h4'} align={'left'}>
                        {this.state.course.title}
                    </Typography>

                    <Typography align={'left'}>
                        Student:
                        <Link to={'/accounts/student/'+this.state.studentID}>
                              {this.props.usersList.StudentList[this.state.studentID].name}
                        </Link>
                    </Typography>

                    <Typography align={'left'}>
                        Instructor:
                        <Link to={'/accounts/instructor/'+this.state.course.instructor_id}>
                              {this.props.usersList.InstructorList[this.state.course.instructor_id].name}
                        </Link>
                    </Typography>

                </Grid>

                <Grid item md={12}>
                    <Grid container className={'accounts-table-heading'}>
                        <Grid item md={1}>

                        </Grid>
                        <Grid item md={3}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Session Date
                            </Typography>
                        </Grid>
                        <Grid item md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Day
                            </Typography>
                        </Grid>
                        <Grid item md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Time
                            </Typography>
                        </Grid>
                        <Grid item md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Tuition
                            </Typography>
                        </Grid>
                        <Grid item md={2}>
                            <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                                Status
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    {this.state.sessions.length !== 0 ?
                        this.state.sessions.map((session,i) => {
                            let {day, date, startTime, endTime, status, tuition} = this.state.type === "T" ?
                                this.sessionDataParse(session): this.courseDataParser(session);
                            return (<Grid item md={12}
                                          className={'accounts-table-row'}
                                          key={i}>
                                <Paper square={true}>
                                    <Grid container>
                                        <Grid item md={1}></Grid>
                                        <Grid item md={3}>
                                            <Typography align={'left'}>
                                                {date}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography align={'left'}>
                                                {day}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography align={'left'}>
                                                {startTime} - {endTime}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography align={'left'}>
                                                ${tuition}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <div className={`sessions-left-chip ${status}`}>
                                                {status}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>);
                        }) :
                        <Grid item md={12}>
                            <Paper className={'info'}>
                                <Typography style={{fontWeight: 700}}>
                                    No Courses Yet!
                                </Typography>
                            </Paper>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Paper>)
    }

}

CourseSessionStatus.propTypes = {};

function mapStateToProps(state) {
    return {
        usersList: state.Users,
        courseSessions: state.Course.CourseSessions,
        courses: state.Course.NewCourseList,
        enrollments: state.Enrollments,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseSessionStatus);
