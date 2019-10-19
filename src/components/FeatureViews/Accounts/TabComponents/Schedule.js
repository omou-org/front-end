import { connect } from 'react-redux';
import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // get instructors schdeule and parses it into one array of objcts 
    getInstructorSchedule = () => {
        let schedule = this.props.work_hours
        let key = Object.keys(this.props.work_hours)

        let instructorsSchedule = key.map((iKey) => {
            return schedule[iKey]
        })
        let finalInstructorSchedule = []
        instructorsSchedule.forEach((iList) => {
            finalInstructorSchedule = finalInstructorSchedule.concat(Object.values(iList))
        })
        return instructorsSchedule
    }


    render() {

        return (
            <div>
                <FullCalendar
                    header={false}
                    columnHeaderFormat={{ weekday: "short" }}
                    allDaySlot={false}
                    height={337}
                    defaultView="timeGridWeek"
                    plugins={[timeGridPlugin]}
                    events={this.getInstructorSchedule()}
                />
            </div>
        )
    }

}

Schedule.propTypes = {};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Schedule);