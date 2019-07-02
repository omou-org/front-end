import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RegistrationActions from "./RegistrationActions";

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
import { NavLink } from "react-router-dom";
import Fab from '@material-ui/core/Fab';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileViewToggle: false,
            mobileView: false,
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        // this.props.registrationActions.fetchRandomColor();
    }

    resize() {
        let currentHideNav = (window.innerWidth <= 760);
        if (currentHideNav !== this.state.mobileView) {
            this.setState({ mobileView: !this.state.mobileView });
        }
    }

    toggleMainView() {
        if (this.state.mobileView) {
            return <MobileRegistration
                courses={this.props.courses}
                teachers={this.props.teachers}
                categories={this.props.courseCategories}
                categoriesViewToggle={this.state.mobileViewToggle} />;
        }
        else {
            return <FullRegistration
                courses={this.props.courses}
                categories={this.props.courseCategories}
                teachers={this.props.teachers}
            />;

        }
    }

    toggleMobileView() {
        this.setState((oldState) => {
            return {
                mobileViewToggle: !oldState.mobileViewToggle,
            }
        })
    }

    render() {
        return (
            <div className="">
                <Grid item xs={12}>
                    <Paper className={"paper"}>
                        <Grid item lg={12}>
                            <RegistrationActions
                            //admin = {false}
                            />
                        </Grid>
                    </Paper>
                </Grid>
                {
                    this.toggleMainView.bind(this)()
                }
                <Hidden smUp>
                    <Grid item>
                        {
                            this.state.mobileViewToggle ?
                                <Fab onClick={(e) => { e.preventDefault(); this.toggleMobileView(); }}
                                        className={"button mobile-toggle"}
                                        color="primary" aria-label="Add"
                                >
                                    <CourseList className={"icon"} />
                                </Fab> :
                                <Fab
                                    onClick={(e) => { e.preventDefault(); this.toggleMobileView(); }}
                                    className={"button mobile-toggle"}
                                    color="primary" aria-label="Add">
                                    <Categories className={"icon"} />
                                </Fab>
                        }
                    </Grid>
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
        teachers: state.Users["TeacherList"],
        courses: state.Course["CourseList"],
        courseCategories: state.Course["CourseCategories"],
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