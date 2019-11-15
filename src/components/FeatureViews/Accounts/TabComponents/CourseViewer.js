import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../../actions/registrationActions";
import * as apiActions from "../../../../actions/apiActions";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";

class CourseViewer extends Component {
    componentDidMount() {
        this.props.apiActions.fetchCourses();
    }

    goToRoute(route) {
        this.props.history.push(this.props.match.url + route);
    }

    setCourses = () => {
        let today = new Date();
        let filterCourseByDate = (endDate) => {
            let inputEndDate = new Date(endDate);
            // if we're rendering current courses then check if the end date for the course is later than today
            // else if we're rendering past courses, then check if the end date for the course is later than today
            return (this.props.current ? inputEndDate > today : inputEndDate < today)
        };
        let userCourseList;
        switch (this.props.user_role) {
            case "instructor":
                // only keep course if instructor is associated with the course
                userCourseList = Object.keys(this.props.courses).filter((courseID) => {
                    let course = this.props.courses[courseID];
                    return filterCourseByDate(course.schedule.end_date) && course.instructor_id === this.props.user_id;
                });
                break;
            case "student":
                // only keep course if the student is on the roster
                userCourseList = Object.keys(this.props.courses).filter((courseID) => {
                    let course = this.props.courses[courseID];
                    return filterCourseByDate(course.schedule.end_date) && course.roster.includes(this.props.user_id);
                });
                break;
            default:
                console.warn(`Unhandled user role ${this.props.user_role}`);
        }
        return userCourseList;
    };

    courseDataParser(course) {
        let DayConverter = {
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

        let timeOptions = {hour: "2-digit", minute: "2-digit"};
        let dateOptions = {year: "numeric", month: "short", day: "numeric"};
        let startDate = new Date(course.schedule.start_date + course.schedule.start_time),
            endDate = new Date(course.schedule.end_date + course.schedule.end_time),
            startTime = startDate.toLocaleTimeString("en-US", timeOptions),
            endTime = endDate.toLocaleTimeString("en-US", timeOptions);
        startDate = startDate.toLocaleDateString("en-US", dateOptions);
        endDate = endDate.toLocaleDateString("en-US", dateOptions);

        return {
            Days: Days,
            startTime: startTime,
            endTime: endTime,
            startDate: startDate,
            endDate: endDate,
        }
    }

    numPaidCourses(courseID) {
        if (!this.props.enrollments[this.props.user_id] || !this.props.enrollments[this.props.user_id][courseID]) {
            return 0;
        }
        let courseEnrollment = this.props.enrollments[this.props.user_id][courseID],
            enrollmentPayments = Object.values(courseEnrollment.session_payment_status),
            numPaidEnrollments = 0;
        enrollmentPayments.forEach((paymentStatus) => {
            if (paymentStatus === 1) {
                numPaidEnrollments++;
            }
        });
        return numPaidEnrollments;
    }

    render() {
        this.setCourses();
        let paymentStatus = (numPaidCourses) => {
            if (numPaidCourses > 3) {
                return "good";
            } else if (numPaidCourses <= 3 && numPaidCourses > 0) {
                return "warning";
            } else if (numPaidCourses <= 0) {
                return "bad";
            }
        };
        return (<Grid container>
            <Grid item xs={12} md={12}>
                <Grid container className={'accounts-table-heading'}>
                    <Grid item xs={3} md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Session
                        </Typography>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Dates
                        </Typography>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Class Day(s)
                        </Typography>
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Time
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Status
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={8}>
                {this.setCourses().length !== 0 ?
                    this.setCourses().map((courseID) => {
                        let course = this.props.courses[courseID];
                        let {Days, startDate, endDate, startTime, endTime} = this.courseDataParser(course);
                        return (<Grid item xs={12} md={12}
                            className={'accounts-table-row'}
                            onClick={(e) => {e.preventDefault(); this.goToRoute(`/${courseID}`)}}
                            key={courseID}>
                            <Paper square={true}>
                                <Grid container>
                                    <Grid item xs={3} md={3}>
                                        <Typography className='accounts-table-text' align={'left'}>
                                            {course.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} md={3}>
                                        <Typography className='accounts-table-text' align={'left'}>
                                            {startDate} - {endDate}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <Typography className='accounts-table-text' align={'left'}>
                                            {Days}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} md={3}>
                                        <Typography className='accounts-table-text' align={'left'}>
                                            {startTime} - {endTime}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1} md={1}>
                                        <div className={`sessions-left-chip ${paymentStatus(this.numPaidCourses(courseID))}`}>
                                            {this.numPaidCourses(courseID)}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>);
                    }) :
                    <Grid item xs={12} md={12}>
                        <Paper className={'info'}>
                            <Typography style={{fontWeight: 700}}>
                                No Courses Yet!
                            </Typography>
                        </Paper>
                    </Grid>
                }
            </Grid>
        </Grid>)
    }

}

CourseViewer.propTypes = {};

function mapStateToProps(state) {
    return {
        usersList: state.Users,
        courses: state.Course.NewCourseList,
        enrollments: state.Enrollments,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        "apiActions": bindActionCreators(apiActions, dispatch),
        "registrationActions": bindActionCreators(registrationActions, dispatch)
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseViewer));
