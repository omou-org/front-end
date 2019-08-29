import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BackButton from "../../BackButton.js";
import RegistrationActions from "./RegistrationActions";
import '../../../theme/theme.scss';

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ClassIcon from "@material-ui/icons/Class"
import { Divider, LinearProgress, TableBody, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CallIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import EditIcon from "@material-ui/icons/Edit";
import CalendarIcon from "@material-ui/icons/CalendarTodayRounded";
import Button from "@material-ui/core/Button";
import {NavLink} from "react-router-dom";

const rowHeadings = [
    { id: 'Student', numberic: false, disablePadding: false },
    { id: 'Parent', numberic: false, disablePadding: false },
    { id: 'Status', numberic: false, disablePadding: false },
    { id: '', numberic: false, disablePadding: false },
];

let TableToolbar = props => {
    return (<TableHead>
        <TableRow>
            {rowHeadings.map(
                (row, i) => (
                    <TableCell
                        key={i}
                        align={row.numberic ? 'right' : 'left'}
                        padding={row.disablePadding ? 'none' : 'default'}
                    >
                        {row.id}
                    </TableCell>
                )
            )}
        </TableRow>
    </TableHead>);
};

class RegistrationCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        let CourseInView = this.props.courses[this.props.computedMatch.params.courseID] ;
        console.log(CourseInView);
        this.setState({ ...CourseInView });
    }

    stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let colour = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            colour += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return colour;
    }

    render() {
        let DayConverter = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
        };
        let Days = this.state.schedule.days;
        Days = Days.map((day) => {
            return DayConverter[day];
        });

        let timeOptions = { hour: "2-digit", minute: "2-digit" };
        let dateOptions = { year: "numeric", month: "short", day: "numeric"};
        let startDate = new Date(this.state.schedule.start_date + this.state.schedule.start_time),
            endDate = new Date(this.state.schedule.end_date + this.state.schedule.end_time),
            startTime = startDate.toLocaleTimeString("en-US",timeOptions),
            endTime = endDate.toLocaleTimeString("en-US",timeOptions);
        startDate = startDate.toLocaleDateString("en-US",dateOptions);
        endDate = endDate.toLocaleDateString("en-US", dateOptions);

        let instructor = this.props.instructors[this.state.instructor_id];

        let rows = [];
        let student, row, parent, Actions;

        this.state.roster.forEach((student_id) => {
            student = this.props.students[student_id];
            parent = this.props.parents[student.parent_id];
            Actions = () => {
                return <div className={student.name + ' actions'}>
                    <CallIcon />
                    <a href={"mailto:" + parent.email}>
                        <EmailIcon />
                    </a>
                    <EditIcon />
                </div>
            };
            row = [student.name, parent.name, "Paid", <Actions />];
            rows.push(row);
        });

        let styles = (username) => {
            return {
                backgroundColor: this.stringToColor(username),
                color: "white",
                width: 38,
                height: 38,
                fontSize: 14,
                border:'1px solid white'
            }
        };

        return (
            <Grid item xs={12}>
                <Paper className={"paper"}>
                    <Grid item lg={12}>
                        <RegistrationActions
                            courseTitle={this.state.course_title}
                        //admin = false;
                        />
                    </Grid>
                </Paper>
                <Paper className={"paper content"}>
                    <Grid container justify={"space-between"}>
                        <Grid item sm={3}>
                            <BackButton />
                        </Grid>
                        <Grid item sm={2}>
                            <Button className={"button"} style={{padding:"6px 10px 6px 10px", backgroundColor:"white"}}>
                                <EditIcon style={{fontSize:"16px"}}/>
                                Edit Course
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider className={"top-divider"}/>
                    <div className={"course-heading"}>
                        <Typography align={'left'} variant={'h3'} style={{ fontWeight: "500" }} >
                            {this.state.title}
                        </Typography>
                        <div className={"date"}>
                            <CalendarIcon style={{ fontSize: "16" }} align={'left'} className={"icon"}/>
                            <Typography align={'left'} style={{ marginLeft: '5px', marginTop: '10px' }}>
                                {startDate} - {endDate}
                            </Typography>
                        </div>
                        <div className={"info-section"}>
                            <div className={"first-line"}>
                                <ClassIcon style={{ fontSize: "16" }} className={'icon'} />
                                <Typography align={'left'} className={'text'}>
                                    Course Information
                                </Typography>
                            </div>
                            <div className={'second-line'}>
                                <Chip
                                    avatar={<Avatar style={styles(instructor.name)}>{instructor.name.match(/\b(\w)/g).join('')}</Avatar>}
                                    label={instructor.name}
                                    className={"chip"}
                                    component={NavLink}
                                    to={`/accounts/${instructor.role}/${instructor.user_id}`}
                                />
                                <Typography align={'left'} className={'text'}>
                                    {startTime} - {endTime}
                                </Typography>
                                <Typography align={'left'} className={'text'}>
                                    {Days}
                                </Typography>
                                <Typography align={'left'} className={'text'}>
                                    {this.state.grade} Grade
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <Typography align={'left'} className={'description text'}>
                        {this.state.description}
                    </Typography>
                    <div className={"course-status"}>
                        <div className={"status"}>
                            <div className={"text"}>
                                {this.state.filled} / {this.state.capacity} Spaces Taken
                            </div>
                        </div>
                        <LinearProgress
                            color={'primary'}
                            value={(this.state.filled / this.state.capacity) * 100}
                            valueBuffer={100}
                            variant={'buffer'}
                        />
                    </div>
                    <Table>
                        <TableToolbar />
                        <TableBody>
                            {
                                rows.map((row, i) => {
                                    return <TableRow key={i}>
                                        {row.map((data, j) => {
                                            return <TableCell key={j} className={`${j % 4 === 0 ? 'bold' : ''}`}>
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
        courses: state.Course["NewCourseList"],
        courseCategories: state.Course["CourseCategories"],
        students: state.Users["StudentList"],
        instructors: state.Users["InstructorList"],
        parents: state.Users["ParentList"],
        courseRoster: state.Course["CourseRoster"],
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