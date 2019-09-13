import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import * as rootActions from '../../../actions/rootActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RegistrationUserActions from "./RegistrationActions";
import '../../../theme/theme.scss';

//Material UI Imports
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import MobileRegistration from "./MobileRegistration";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Categories from "@material-ui/icons/Category";
import CourseList from "@material-ui/icons/List";
import Fab from '@material-ui/core/Fab';
import RegistrationLanding from "./RegistrationLanding";

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
                instructors={this.props.instructors}
                categories={this.props.courseCategories}
                categoriesViewToggle={this.state.mobileViewToggle} />;
        }
        else {
            return <RegistrationLanding
                    courses={this.props.courses}
                    categories={this.props.courseCategories}
                    instructors={this.props.instructors}
            />
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
                            <RegistrationUserActions
                                //admin = {false}
                            />
                        </Grid>
                    </Paper>
                </Grid>
                <RegistrationLanding
                    courses={this.props.courses}
                    categories={this.props.courseCategories}
                    instructors={this.props.instructors}
                />
                {/*<Hidden smUp>*/}
                {/*    <Grid item>*/}
                {/*        {*/}
                {/*            this.state.mobileViewToggle ?*/}
                {/*                <Fab onClick={(e) => { e.preventDefault(); this.toggleMobileView(); }}*/}
                {/*                        className={"button mobile-toggle"}*/}
                {/*                        color="primary" aria-label="Add"*/}
                {/*                >*/}
                {/*                    <CourseList className={"icon"} />*/}
                {/*                </Fab> :*/}
                {/*                <Fab*/}
                {/*                    onClick={(e) => { e.preventDefault(); this.toggleMobileView(); }}*/}
                {/*                    className={"button mobile-toggle"}*/}
                {/*                    color="primary" aria-label="Add">*/}
                {/*                    <Categories className={"icon"} />*/}
                {/*                </Fab>*/}
                {/*        }*/}
                {/*    </Grid>*/}
                {/*</Hidden>*/}
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
        instructors: state.Users["InstructorList"],
        courses: state.Course["NewCourseList"],
        courseCategories: state.Course["CourseCategories"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch),
        rootActions: bindActionCreators(rootActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Registration);
