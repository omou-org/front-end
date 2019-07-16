import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listViewPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import './scheduler.scss'

class Scheduler extends Component {
    constructor(props){
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarEvents: [ // initial event data
                {title: 'Event Now', start: new Date()}
            ]
        }
    }
    calendarComponentRef = React.createRef();

    handleDateClick = (arg) => {
        //confirm('Would you like to add an event to ' + arg.dateStr + ' ?')
        if (true) {
            this.setState({  // add new event data
                calendarEvents: this.state.calendarEvents.concat({ // creates a new array
                    title: 'New Event',
                    start: arg.date,
                    allDay: arg.allDay
                })
            })
        }
    };

    toggleWeekends = () => {
        this.setState({ // update a property
            calendarWeekends: !this.state.calendarWeekends
        })
    };

    gotoPast = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
    };

    render(){
        return (<div className="">
            <div className='demo-app-top'>
                <button onClick={ this.toggleWeekends }>toggle weekends</button>&nbsp;
                <button onClick={ this.gotoPast }>go to a date in the past</button>&nbsp;
                (also, click a date/time to add an event)
            </div>
            <div className='demo-app-calendar'>
                <FullCalendar
                    defaultView="dayGridMonth"
                    header={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, listViewPlugin ]}
                    ref={ this.calendarComponentRef }
                    weekends={ this.state.calendarWeekends }
                    events={ this.state.calendarEvents }
                    dateClick={ this.handleDateClick }
                />
            </div>
        </div>)
    }
}

Scheduler.propTypes = {};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Scheduler);
