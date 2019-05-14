import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

//Local Component Imports
import './registration.scss'
import Hidden from "@material-ui/core/es/Hidden/Hidden";

const rowHeadings = [
    {id:'Grade', number:false, disablePadding: false,},
    {id:'Course', numberic:false, disablePadding: false},
    {id:'Dates', numberic:false, disablePadding: false},
    {id:'Day(s)', numberic:false, disablePadding: false},
    {id:'Time', numberic:false, disablePadding: false},
    {id:'Tuition', numberic:false, disablePadding: false},
    {id:'Space Left', numberic:false, disablePadding: false},
    {id:'Register', numberic:false, disablePadding: false}
];

let TableToolbar = props =>{
    return (<TableHead>
        <TableRow>
            {rowHeadings.map(
                row => (
                    <Hidden mdDown={row.id === 'Grade' || row.id === "Tuition" || row.id === "Space Left"}>
                        <TableCell
                            key={row.id}
                            align={row.numberic ? 'right':'left'}
                            padding={row.disablePadding ? 'none':'default'}
                        >
                            {row.id}
                        </TableCell>
                    </Hidden>
                )
            )}
        </TableRow>
    </TableHead>);
};

class FullRegistration extends Component {
    componentDidMount(){

    }

    render(){
        console.log(this.props);
        return (
            <div className="">
                <Grid container>
                    {/*{RegistrationActionsBar.bind(this)()}*/}
                    <Grid item xs={12}>
                        <Paper className={"paper"}>
                            <Table>
                                <TableToolbar/>
                                <TableBody className={"table"}>
                                    {
                                        this.props.courses.map((course)=>{
                                            return <TableRow key={course.id} hover>
                                                <Hidden mdDown>
                                                    <TableCell align="right">{course.grade}</TableCell>
                                                </Hidden>
                                                <TableCell align="right">{course.course_title}</TableCell>
                                                <TableCell align="right">{course.dates}</TableCell>
                                                <TableCell align="right">{course.days}</TableCell>
                                                <TableCell align="right">{course.time}</TableCell>
                                                <Hidden mdDown>
                                                    <TableCell align="right">{course.tuition}</TableCell>
                                                </Hidden>
                                                <Hidden mdDown>
                                                    <TableCell align="right">{course.capacity - course.filled}</TableCell>
                                                </Hidden>
                                                <TableCell align="right">
                                                    <Button variant="contained" color="secondary" className={"button"}>REGISTER</Button>
                                                </TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

FullRegistration.propTypes = {
    stuffActions: PropTypes.object,
    FullRegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        // courses: state.FullRegistration["course_list"]
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
)(FullRegistration);