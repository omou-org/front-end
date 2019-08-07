import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RegistrationActions from "./RegistrationActions";
import '../../../theme/theme.scss';


//Material UI Imports
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import Categories from "@material-ui/icons/Category";
import CourseList from "@material-ui/icons/List";
import { NavLink } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import {Typography} from "@material-ui/core";
import BackButton from "../../BackButton";
import TableCell from "./FullRegistration";

class RegistrationLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses:[],
            instructors:[],
        }
    }

    componentDidMount() {
        this.setState({
            courses:this.props.courses,
            instructors: this.props.teachers,
        })
    }

    goToRoute(route){
        this.props.history.push(route);
    }



    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className="RegistrationLanding paper">
                        <BackButton/>
                        <hr/>
                        <Typography variant={'h3'} align={'left'} className={"heading"}>Registration Catalog</Typography>
                        <div className={'registration-table'}>
                            {
                                this.state.courses.map((course)=>{
                                    return (<Paper className={'row'}>
                                        <Grid container alignItems={'center'} layout={'row'}>
                                            <Grid item md={3}
                                                  onClick={(e) => {e.preventDefault(); this.goToRoute('/registration/course/' + course.course_id + "/" + course.course_title)}}
                                                  style={{textDecoration: 'none', cursor: 'pointer'}}>
                                                <Typography className={'course-heading'} align={'left'}>
                                                    {course.course_title}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={5}
                                                  onClick={(e) => {e.preventDefault(); this.goToRoute('/registration/course/' + course.course_id + "/" + course.course_title)}}
                                                  style={{textDecoration: 'none', cursor: 'pointer'}}>
                                                <Grid container className={'course-detail'}>
                                                    <Grid item md={4} className={'heading-det'} align={'left'}>
                                                        Date
                                                    </Grid>
                                                    <Grid item md={8} className={'value'} align={'left'}>
                                                        {course.dates} {course.days} {course.time}
                                                    </Grid>
                                                </Grid>
                                                <Grid container className={'course-detail'}>
                                                    <Grid item md={4} className={'heading-det'} align={'left'}>
                                                        Instructor
                                                    </Grid>
                                                    <Grid item md={8}
                                                          className={'value'}
                                                          align={'left'}>
                                                        {this.state.instructors.find((instructor)=>{
                                                            return instructor.id === course.instructor_id;
                                                        }).name}
                                                    </Grid>
                                                </Grid>
                                                <Grid container className={'course-detail'}>
                                                    <Grid item md={4} className={'heading-det'} align={'left'}>
                                                        Tuition
                                                    </Grid>
                                                    <Grid item md={8} className={'value'} align={'left'}>
                                                        ${course.tuition}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item md={4} className={'course-action'}>
                                                <Grid container alignItems={'center'} layout={'row'} style={{height:"100%"}}>
                                                    <Grid item md={6} className={'course-status'}>
                                                        <span className={'stats'}>
                                                            {course.filled} / {course.capacity}
                                                        </span>
                                                        <span className={'label'}>
                                                            Status
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={6}>
                                                        <Button component={NavLink}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if(course.capacity > course.filled){
                                                                        this.goToRoute(`/registration/form/course/${encodeURIComponent(course.course_title)}`);
                                                                    } else {
                                                                        alert("The course is filled!");
                                                                    }
                                                                }}
                                                                variant="contained"
                                                                disabled={course.capacity <= course.filled}
                                                                className="button primary">+ REGISTER</Button>
                                                    </Grid>
                                                </Grid>

                                            </Grid>
                                        </Grid>
                                    </Paper>);
                                })
                            }
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

RegistrationLanding.propTypes = {
    stuffActions: PropTypes.object,
    RegistrationForms: PropTypes.array
};


export default withRouter(RegistrationLanding);