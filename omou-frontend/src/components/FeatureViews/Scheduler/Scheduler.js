import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listViewPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import * as calenderActions from '../../../actions/calenderActions';

import './scheduler.scss'

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarEvents: []
        }
    }
    calendarComponentRef = React.createRef();

    handleDateClick = (arg) => {
        if (window.confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
            this.setState({  // add new event data
                calendarEvents: this.state.calendarEvents.concat({ // creates a new array
                    title: 'New Event',
                    start: arg.date,
                    allDay: arg.allDay
                })
            })
        }
    }

    toggleWeekends = () => {
        this.setState({ // update a property
            calendarWeekends: !this.state.calendarWeekends
        })
    };

    gotoPast = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
    };

    render() {
        // deleteEvent function will take in an array. Each int in array will corrispond to the event's 'id'. To delete an event just input the events 'id'.
        // this.props.calenderActions.deleteEvent([4])
        // addEvent take an object and pushes into event_in_view
        // this.props.calenderActions.addEvent(
        //     {
        //     id: 3,
        //     title: "This other class",
        //     start: "2019-07-14",
        //     end: "2019-07-17",
        //     editable: true,
        //     })



        // this.props.calenderActions.filterEvent("daniel")

        return (<div className="">
            <div className='demo-app-top'>
                <button onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;
                <button onClick={this.gotoPast}>go to a date in the past</button>&nbsp;
                (also, click a date/time to add an event)
            </div>
            <div className='demo-app-calendar'>
                <FullCalendar
                    defaultView="dayGridMonth"
                    header={{
                        left: ' today prev,next ',
                        center: ' title, ',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listViewPlugin, resourceTimelinePlugin]}
                    ref={this.calendarComponentRef}
                    weekends={this.state.calendarWeekends}
                    events={this.props.events_in_view}
                    editable={true}
                    displayEventTime={true}
                    timeZone={'local'}
                    eventLimit={4}
                    dateClick={this.handleDateClick}
                    schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                />
            </div>
        </div>)
    }
}

Scheduler.propTypes = {};

function mapStateToProps(state) {
    console.log(state)
    return {
        events_in_view: state.Calender.events_in_view
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
)(Scheduler);
