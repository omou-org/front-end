import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RegistrationActions from "./RegistrationActions";
import '../../../theme/theme.scss';


//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { NavLink } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import {Typography} from "@material-ui/core";
import BackButton from "../../BackButton";
import FilterIcon from '@material-ui/icons/FilterList';
import Popover from '@material-ui/core/Popover';
import SearchSelect from 'react-select';


class RegistrationLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses:[],
            instructors:[],
            anchorEl:'',
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

    handleFilterClick(event) {
        event.preventDefault();
        this.setState({anchorEl:event.currentTarget});
    }

    handleClose(event) {
        event.preventDefault();
        this.setState({anchorEl:null});
    }

    renderFilter(filter){
        let options = [];
        switch(filter){
            case 'instructor':
                options = this.state.instructors.map((instructor)=>{
                    return {label: instructor.name, value: instructor.name};
                });
                break;
            case 'subject':
                options = [{label:"math", value:"math"},{label:"science", value:"science"}, {label:"sat", value:"sat"}];
                break;
            case 'grade':
                options = [1,2,3,4,5,6,7,8,9,10,11,12];
                break;
            default:
                return '';
        }
        options.push('All');
        const CustomClearText = () => 'clear all';
        const ClearIndicator = props => {
            const {
                children = <CustomClearText />,
                getStyles,
                innerProps: { ref, ...restInnerProps },
            } = props;
            return (
                <div
                    {...restInnerProps}
                    ref={ref}
                    style={getStyles('clearIndicator', props)}
                >
                    <div style={{ padding: '0px 5px' }}>{children}</div>
                </div>
            );
        };

        const ClearIndicatorStyles = (base, state) => ({
            ...base,
            cursor: 'pointer',
            color: state.isFocused ? 'blue' : 'black',
        });
        return <SearchSelect
            closeMenuOnSelect={false}
            components={{ ClearIndicator }}
            placeholder={`All ${filter}s`}
            styles={{ clearIndicator: ClearIndicatorStyles }}
            isMulti
            options={options}
        />
    }

    render() {
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'simple-popover' : undefined;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className="RegistrationLanding paper">
                        <BackButton/>
                        <hr/>
                        <Grid container alignItems={'center'} layout={'row'}>
                            <Grid item md={10}>
                                <Typography variant={'h3'} align={'left'} className={"heading"}>Registration Catalog</Typography>
                            </Grid>
                            <Grid item md={2}>
                                <FilterIcon
                                    onClick={(e)=>{ this.handleFilterClick.bind(this)(e) }}
                                    />
                            </Grid>
                        </Grid>
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
                <Popover
                    id={id}
                    open={open}
                    anchorEl={this.state.anchorEl}
                    onClose={(e)=>{this.handleClose.bind(this)(e)}}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    {this.renderFilter('instructor')}
                    <Typography>The content of the Popover.</Typography>
                    {this.renderFilter('subject')}
                </Popover>
            </Grid>
        )
    }
}

RegistrationLanding.propTypes = {
    stuffActions: PropTypes.object,
    RegistrationForms: PropTypes.array
};


export default withRouter(RegistrationLanding);