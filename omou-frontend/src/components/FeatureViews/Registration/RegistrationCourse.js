import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import ClassIcon from "@material-ui/icons/Class"
import {NavLink} from "react-router-dom";
import {Divider, Typography} from "@material-ui/core";
import BackArrow from "@material-ui/icons/ArrowBack";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

class RegistrationCourse extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    componentWillMount(){
        let CourseInView = this.props.courses.find((course)=>{
            return course.course_id.toString() === this.props.match.params.courseID;
        });
        this.setState({...CourseInView});
    }

    render(){
        let DayConverter = {
            M: "Monday",
            T: "Tuesday",
            W: "Wednesday",
            Tr: "Thursday",
            F: "Friday",
            S: "Saturday",
        };
        let Days = this.state.days.split();
        Days = Days.map((day)=>{
            return DayConverter[day];
        });

        let Teacher = this.props.teachers.find((teacher)=>{
           return teacher.id === this.state.instructor_id;
        });

        return (
            <Grid item xs={12}>
                <Paper className={"paper"}>
                    <Grid item lg={12}>
                        <Grid container
                              direction={"row"}
                              justify={"flex-start"}
                              className={"registration-action-control"}>
                            <Grid item>
                                <Button component={NavLink} to={'/registration/form/student'}
                                        variant="outlined"
                                        color="secondary"
                                        className={"button"}>
                                    <NewUser className={"icon"}/>
                                    New Student
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button component={NavLink} to={'/registration/form/tutoring/'+ this.state.course_title.split(' ').join('-')}
                                        variant="outlined"
                                        color="secondary"
                                        className={"button"}>
                                    <NewTutor className={"icon"}/>
                                    New Tutoring
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button component={NavLink} to={'/registration/form/course/'+ this.state.course_title.split(' ').join('-')}
                                        variant="outlined"
                                        color="secondary"
                                        className={"button"}>
                                    <NewCourse className={"icon"}/>
                                    New Course
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={"paper content"}>
                    <NavLink to={"/registration"}
                             className={"control course"}>
                        <BackArrow className={"icon"}/> <div className={"label"}>Back</div>
                    </NavLink>
                    <div className={"course-heading"}>
                        <Typography align={'left'} variant={'h3'} style={{fontWeight:"500"}} >
                            {this.props.match.params.courseTitle}
                        </Typography>
                        <Typography align={'left'} style={{marginLeft:'5px', marginTop:'15px'}}>
                            {this.state.dates}
                        </Typography>
                        <div className={"info"}>
                            <div className={"first-line"}>
                                <ClassIcon style={{fontSize:"16"}}/>
                                <Typography align={'left'} className={'text'}>
                                    Course Information
                                </Typography>
                            </div>
                            <div className={'second-line'}>
                                <Chip
                                    avatar={<Avatar>{Teacher.name.match(/\b(\w)/g).join('')}</Avatar>}
                                    label={Teacher.name}
                                    className={"chip"}
                                />
                                <Typography align={'left'} className={'text'}>
                                    {this.state.time}
                                </Typography>
                                <Typography align={'left'} className={'text'}>
                                    {Days}
                                </Typography>
                                <Typography align={'left'} className={'text'}>
                                    {this.state.tuition} Tuition
                                </Typography>
                                <Typography align={'left'} className={'text'}>
                                    {this.state.grade} Grade
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <Divider/>
                    <Typography align={'left'} className={'description text'}>
                        {this.state.description}
                    </Typography>
                    <Divider/>

                </Paper>
            </Grid>
        )
    }
}

RegistrationCourse.propTypes = {
    stuffActions: PropTypes.object,
    RegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"],
        courseCategories: state.Registration["categories"],
        teachers: state.Registration["teacher_list"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationCourse);