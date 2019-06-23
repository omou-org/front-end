import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import BackButton from "../../BackButton.js";

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import ClassIcon from "@material-ui/icons/Class"
import {NavLink} from "react-router-dom";
import {Divider, LinearProgress, TableBody, Typography} from "@material-ui/core";
import BackArrow from "@material-ui/icons/ArrowBack";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CallIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import EditIcon from "@material-ui/icons/Edit";

const rowHeadings = [
    {id:'Student', numberic:false, disablePadding: false},
    {id:'Parent', numberic:false, disablePadding: false},
    {id:'Status', numberic:false, disablePadding: false},
    {id:'', numberic:false, disablePadding: false},
];

let TableToolbar = props =>{
    return (<TableHead>
        <TableRow>
            {rowHeadings.map(
                (row, i) => (
                    <TableCell
                        key={i}
                        align={row.numberic ? 'right':'left'}
                        padding={row.disablePadding ? 'none':'default'}
                    >
                        {row.id}
                    </TableCell>
                )
            )}
        </TableRow>
    </TableHead>);
};

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

        let rows = [];
        let student, row, parent, Actions;
        this.props.courseRoster[this.state.course_id].forEach((student_id)=>{
            student = this.props.students.find((studentCurr)=>{ return studentCurr.user_id === student_id});
            parent = this.props.parents.find((parentCurr)=>{return student.parent_id === parentCurr.user_id});
            Actions = ()=>{
              return <div className={student.name + ' actions'}>
                  <CallIcon/>
                  <a href={"mailto:"+parent.email}>
                    <EmailIcon/>
                  </a>
                  <EditIcon/>
              </div>
            };
            row = [student.name, parent.name, "Paid", <Actions/>];
            rows.push(row);
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
                                <Button component={NavLink} to={`/registration/form/tutoring/${encodeURIComponent(this.state.course_title)}`}
                                        variant="outlined"
                                        color="secondary"
                                        className={"button"}>
                                    <NewTutor className={"icon"}/>
                                    New Tutoring
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button component={NavLink} to={`/registration/form/tutoring/${encodeURIComponent(this.state.course_title)}`}
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
                    <BackButton />
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
                    <LinearProgress
                        color={'primary'}
                        value={(this.state.filled/this.state.capacity)*100}
                        valueBuffer={100}
                        variant={'buffer'}
                    />
                    <Table>
                        <TableToolbar/>
                        <TableBody>
                            {
                                rows.map((row, i)=>{
                                  return <TableRow key={i}>
                                          {row.map((data, j)=>{
                                              return <TableCell key={j} className={`${j%4===0 ? 'bold':''}`}>
                                                  {data}
                                              </TableCell>
                                          })}
                                  </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
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
        students: state.Registration["student_list"],
        teachers: state.Registration["teacher_list"],
        parents: state.Registration["parent_list"],
        courseRoster: state.Registration["course_roster"],
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