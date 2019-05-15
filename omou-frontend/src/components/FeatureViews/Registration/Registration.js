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
import Categories from "@material-ui/icons/Category";
import CourseList from "@material-ui/icons/List";

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
    constructor(){
        super();
        this.state = {
            mobileViewToggle: true,
            mobileView: false,
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        let currentHideNav = (window.innerWidth <= 760);
        if (currentHideNav !== this.state.mobileView) {
            this.setState({mobileView: !this.state.mobileView});
        }
    }

    toggleMainView(){
        if(this.state.mobileView){
            return <MobileRegistration
                courses={this.props.courses}
                categories = {this.props.courseCategories}
                categoriesViewToggle = {this.state.mobileViewToggle}/>;
         }
        else {
            return <FullRegistration
                courses={this.props.courses}
                categories = {this.props.courseCategories}/>;
        }
    }

    toggleMobileView(){
        this.setState((oldState)=>{
            return{
                mobileViewToggle: !oldState.mobileViewToggle,
            }
        })
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
                                        New Tutoring
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="secondary" className={"button"}>
                                        <NewCourse className={"icon"}/>
                                        New Course
                                    </Button>
                                </Grid>
                                <Hidden smUp>
                                    <Grid item>
                                        {
                                            this.state.mobileViewToggle ?
                                                <Button onClick={(e)=>{e.preventDefault(); this.toggleMobileView();}}
                                                        variant="outlined"
                                                        color="secondary"
                                                        className={"button"}>
                                                    <CourseList className={"icon"}/>
                                                    Courses
                                                </Button>:
                                                <Button
                                                    onClick={(e)=>{e.preventDefault(); this.toggleMobileView();}}
                                                    variant="outlined"
                                                    color="secondary"
                                                    className={"button"}>
                                                    <Categories className={"icon"}/>
                                                    Categories
                                                </Button>

                                        }
                                    </Grid>
                                </Hidden>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {
                    this.toggleMainView.bind(this)()
                }
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
        courses: state.Registration["course_list"],
        courseCategories: state.Registration["categories"],
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