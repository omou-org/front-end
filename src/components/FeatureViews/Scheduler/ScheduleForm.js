import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as calenderActions from '../../../actions/calenderActions';
import PropTypes from 'prop-types';
import React, { Component, useState } from 'react';
import BackButton from "../../BackButton.js";
import SessionActions from "./SessionActions";
import '../../../theme/theme.scss';
import './scheduler.scss'
import { NavLink } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Divider, LinearProgress, Typography, ListItem, RadioGroup } from "@material-ui/core";





import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from "@material-ui/core/Button";

function ResourceForm(props) {

    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = value => {
        onClose(value);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
            maxWidth={"md"}
        >
            <FullCalendar
                timeZone="UTC"

                resourceLabelText="Instructor"
                plugins={[resourceTimelinePlugin]}
                defaultView='resourceTimeline'
                schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                resources={[
                    {
                        id: 'a',
                        title: 'Instructor Name'
                    }]}
                events={[
                    {
                        id: '1',
                        resourceId: 'a', // matches resources id above
                        title: 'Some Event',
                        start: Date.now()
                    }
                ]}


            />
        </Dialog>
    );
}

function ScheduleForm() {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = value => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>
            <Typography variant="subtitle1"> {selectedValue}</Typography>
            <br />
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                + Add more times
        </Button>
            <ResourceForm selectedValue={selectedValue} open={open} onClose={handleClose} />
        </div>
    );
}



ScheduleForm.propTypes = {
    sessionView: PropTypes.string
};

function mapStateToProps(state) {
    return {
        courses: state.Course["NewCourseList"],
        courseCategories: state.Course["CourseCategories"],
        students: state.Users["StudentList"],
        instructors: state.Users["InstructorList"],
        courseSessions: state.Course["CourseSessions"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        calenderActions: bindActionCreators(calenderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduleForm);