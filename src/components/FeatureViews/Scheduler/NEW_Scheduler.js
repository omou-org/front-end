import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { SchedulerContext } from './SchedulerContext';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { BootstrapInput } from './SchedulerUtils';
import MenuItem from '@material-ui/core/MenuItem';

const CustomToolbar = (toolbar) => {
    const {
        schedulerState: { timeFrame },
        updateSchedulerState,
    } = useContext(SchedulerContext);

    const setView = (timeFrame, pastDate, delta) =>
        ({
            day: new Date(
                pastDate.getFullYear(),
                pastDate.getMonth(),
                pastDate.getDate() + delta
            ),
            week: new Date(
                pastDate.getFullYear(),
                pastDate.getMonth(),
                pastDate.getDate() + delta * 7
            ),
            month: new Date(
                pastDate.getFullYear(),
                pastDate.getMonth() + delta,
                pastDate.getDate()
            ),
        }[timeFrame]);

    const goToBack = () => {
        const newDate = setView(timeFrame, toolbar.date, -1);
        toolbar.onNavigate('prev', newDate);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeShift: prevState.timeShift - 1,
        }));
    };

    const goToNext = () => {
        const newDate = setView(timeFrame, toolbar.date, 1);
        toolbar.onNavigate('next', newDate);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeShift: prevState.timeShift + 1,
        }));
    };

    const goToCurrent = () => {
        const now = new Date();
        toolbar.date.setMonth(now.getMonth());
        toolbar.date.setYear(now.getFullYear());
        toolbar.onNavigate('current', now);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeShift: 0,
        }));
    };

    const handleViewChange = ({ target }) => {
        toolbar.onView(target.value);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeFrame: target.value,
        }));
    };

    const label = () => {
        const date = moment(toolbar.date);
        return (
            <span>
                <b>{date.format('MMMM')}</b>
                <span> {date.format('YYYY')}</span>
            </span>
        );
    };

    return (
        <div>
            <Typography variant='h3'>{label()}</Typography>
            <div>
                <IconButton onClick={goToBack}>
                    <NavigateBefore />
                </IconButton>
                <button onClick={goToCurrent}>today</button>
                <IconButton onClick={goToNext}>
                    <NavigateNext />
                </IconButton>
            </div>
            <FormControl>
                <Select
                    input={
                        <BootstrapInput
                            id='filter-calendar-type'
                            name='courseFilter'
                        />
                    }
                    value={timeFrame || 'month'}
                    onChange={handleViewChange}
                >
                    <MenuItem value='day'>Day</MenuItem>
                    <MenuItem value='week'>Week</MenuItem>
                    <MenuItem value='month'>Month</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

const localizer = momentLocalizer(moment);

const BigCalendar = (props) => {
    return (
        <Calendar
            localizer={localizer}
            events={props.eventList}
            timeslots={4}
            components={{
                toolbar: CustomToolbar,
            }}
            startAccessor='start'
            endAccessor='end'
            onSelectEvent={props.onSelectEvent}
            style={{ height: 800 }}
        />
    );
};

const GET_SESSIONS = gql`
    query GetSessionsQuery($timeFrame: String, $timeShift: Int) {
        sessions(timeFrame: $timeFrame, timeShift: $timeShift) {
            id
            endDatetime
            startDatetime
            title
        }
    }
`;

export default function NEWScheduler() {
    const [schedulerState, setSchedulerState] = useState({
        timeFrame: null,
        timeShift: null,
    });
    const [sessionsInView, setSessionsInView] = useState([]);

    useEffect(() => {
        setSchedulerState({
            timeFrame: 'month',
            timeShift: 0,
        });
    }, []);

    useEffect(() => {
        const { timeFrame, timeShift } = schedulerState;
        if (timeFrame && timeShift) {
            setSchedulerState({
                timeFrame,
                timeShift,
            });
        }
    }, [schedulerState.timeFrame, schedulerState.timeShift]);

    const { data, loading, error } = useQuery(GET_SESSIONS, {
        variables: {
            timeFrame: schedulerState.timeFrame,
            timeShift: schedulerState.timeShift,
        },
        onCompleted: (data) => {
            const { sessions } = data;
            const parsedBigCalendarSessions = sessions.map(
                ({ id, endDatetime, startDatetime, title }) => ({
                    id,
                    title,
                    start: new Date(startDatetime),
                    end: new Date(endDatetime),
                })
            );
            setSessionsInView(parsedBigCalendarSessions);
        },
    });

    const updateSchedulerState = (newState) => setSchedulerState(newState);

    return (
        <SchedulerContext.Provider
            value={{ schedulerState, updateSchedulerState }}
        >
            <BigCalendar eventList={sessionsInView} />
        </SchedulerContext.Provider>
    );
}
