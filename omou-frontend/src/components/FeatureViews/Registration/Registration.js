import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import FullRegistration from "./FullRegistration";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import MobileRegistration from "./MobileRegistration";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";

const rowHeadings = [
    {id:'Grade', number:false, disablePadding: true,},
    {id:'Course', numberic:false, disablePadding: true},
    {id:'Dates', numberic:false, disablePadding: true},
    {id:'Day(s)', numberic:false, disablePadding: true},
    {id:'Time', numberic:false, disablePadding: true},
    {id:'Tuition', numberic:false, disablePadding: true},
    {id:'Space Left', numberic:false, disablePadding: true},
    {id:'Register', numberic:false, disablePadding: true}
];

class Registration extends Component {
    componentDidMount(){

    }

    render(){
        return (
            <div className="">
                <Grid item xs={12}>
                    <Paper className={"paper"}>
                        <Grid item lg={12}>
                            <Grid container
                                  direction={"row"}
                                  justify={"flex-start"}
                                  className={"registration-action-control"}>
                                <Grid item>
                                    <Button variant="outlined" color="secondary" className={"button"}>
                                        <NewUser className={"icon"}/>
                                        New Student
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="secondary" className={"button"}>
                                        <NewTutor className={"icon"}/>
                                        New Tutoring Registration
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="secondary" className={"button"}>
                                        <NewCourse className={"icon"}/>
                                        New Course Registration
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Hidden smDown>
                    <FullRegistration courses={this.props.courses}/>
                </Hidden>
                <Hidden mdUp>
                    <MobileRegistration courses={this.props.courses}/>
                </Hidden>
            </div>
        )
    }
}

Registration.propTypes = {
    stuffActions: PropTypes.object,
    RegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"]
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
)(Registration);