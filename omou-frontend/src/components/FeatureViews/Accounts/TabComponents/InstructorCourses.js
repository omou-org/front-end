import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class InstructorCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseIDs: [],
        };
    }

    componentWillMount() {
        this.setState(()=>{
            let CoursesTaughtByInstructor = Object.keys(this.props.courseList).filter((courseID)=>{
               let courseInstructorID = this.props.courseList[courseID].instructor_id;
               return this.props.user_id === courseInstructorID;
            });
            return {
                courseIDs: CoursesTaughtByInstructor,
            }
        })
    }

    render() {
        return(<Grid container>
            <Grid item md={12}>
                <Grid container>
                    <Grid item md={3}>
                        <Typography align={'left'}>
                            Session
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography align={'left'}>
                            Dates
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography align={'left'}>
                            Class Day(s)
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Typography align={'left'}>
                            Time
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            {
                this.state.courseIDs.map((courseID)=>{
                    let course = this.props.courseList[courseID];
                    let DayConverter = {
                        1: "Monday",
                        2: "Tuesday",
                        3: "Wednesday",
                        4: "Thursday",
                        5: "Friday",
                        6: "Saturday",
                    };
                    console.log(course);
                    let Days = course.schedule.days.map((day) => {
                        return DayConverter[day];
                    });

                    let timeOptions = { hour: "2-digit", minute: "2-digit" };
                    let dateOptions = { year: "numeric", month: "short", day: "numeric"};
                    let startDate = new Date(course.schedule.start_date + course.schedule.start_time),
                        endDate = new Date(course.schedule.end_date + course.schedule.end_time),
                        startTime = startDate.toLocaleTimeString("en-US",timeOptions),
                        endTime = endDate.toLocaleTimeString("en-US",timeOptions);
                    startDate = startDate.toLocaleDateString("en-US",dateOptions);
                    endDate = endDate.toLocaleDateString("en-US", dateOptions);
                    return (<Grid item md={12}>
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
                            <Grid item md={3}>
                                <Typography align={'left'}>
                                    {Days}
                                </Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography align={'left'}>
                                    {startTime} - {endTime}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>);
                })
            }
        </Grid>)
    }

}

InstructorCourses.propTypes = {};

function mapStateToProps(state) {
    return {
        courseList: state.Course.NewCourseList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InstructorCourses);