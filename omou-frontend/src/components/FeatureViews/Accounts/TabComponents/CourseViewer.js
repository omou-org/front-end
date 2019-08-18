import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";

class CourseViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCourseIDList: [],
        };
    }

    componentWillMount() {
        // console.log(this.props.enrollments[this.props.user_id]);
        this.setState({
            current: this.props.current,
            userRole: this.props.user_role,
            userID: this.props.user_id,
            userEnrollments: this.props.enrollments[this.props.user_id],
        });
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
            Days:Days,
            startTime: startTime,
            endTime: endTime,
            startDate: startDate,
            endDate: endDate,
        }
    }

    numPaidCourses(courseID){
        let courseEnrollment = this.state.userEnrollments[courseID],
            enrollmentPayments = Object.values(courseEnrollment.session_payment_status),
            numPaidEnrollments = 0;
        enrollmentPayments.forEach((paymentStatus)=>{
            if(paymentStatus === 1){
                numPaidEnrollments++;
            }
        });
        return numPaidEnrollments;
    }



    render() {
        this.setCourses();
        let paymentStatus = (numPaidCourses)=>{
            if(numPaidCourses>3) {
                return "good";
            } else if(numPaidCourses <= 3 && numPaidCourses >0) {
                return "warning";
            } else if(numPaidCourses <= 0){
                return "bad";
            }
        };
        return (<Grid container>
            <Grid item md={12}>
                <Grid container className={'accounts-table-heading'}>
                    <Grid item md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Session
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Dates
                        </Typography>
                    </Grid>
                    <Grid item md={2}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Class Day(s)
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Time
                        </Typography>
                    </Grid>
                    <Grid item md={1}>
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
                        return (<Grid item md={12} className={'accounts-table-row'} key={courseID}>
                            <Paper square={true}>
                                <Grid container>
                                    <Grid item md={3}>
                                        <Typography align={'left'}>
                                            {course.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Typography align={'left'}>
                                            {startDate} - {endDate}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2}>
                                        <Typography align={'left'}>
                                            {Days}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Typography align={'left'}>
                                            {startTime} - {endTime}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={1}>
                                        <div className={`sessions-left-chip ${paymentStatus(this.numPaidCourses(courseID))}`}>
                                            {this.numPaidCourses(courseID)}
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
        </Grid>)
    }

}

CourseViewer.propTypes = {};

function mapStateToProps(state) {
    return {
        usersList: state.Users,
        courses: state.Course.NewCourseList,
        enrollments: state.Enrollment,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseViewer);